const env = require("../config/env");

const weatherProfiles = {
  SAFE: { condition: "clear", rainForecast: false, premiumAdjustment: 0, trigger: false, temperature: 34 },
  FLOOD_PRONE: {
    condition: "heavy-rain",
    rainForecast: true,
    premiumAdjustment: 2,
    trigger: true,
    temperature: 33,
  },
  HIGH_RISK: { condition: "storm", rainForecast: true, premiumAdjustment: 3, trigger: true, temperature: 41 },
};

const trafficProfiles = {
  SAFE: { congestionLevel: "low", trigger: false },
  FLOOD_PRONE: { congestionLevel: "high", trigger: true },
  HIGH_RISK: { congestionLevel: "very-high", trigger: true },
};

const floodProfiles = {
  SAFE: { alert: false, severity: "none" },
  FLOOD_PRONE: { alert: true, severity: "high" },
  HIGH_RISK: { alert: true, severity: "critical" },
};

async function fetchJson(url, headers = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers,
      signal: controller.signal,
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch (error) {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

async function getCoordinates(location) {
  const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`;
  const geocodeData = await fetchJson(geocodeUrl);

  if (!geocodeData?.results?.length) {
    return null;
  }

  const topResult = geocodeData.results[0];
  return {
    latitude: topResult.latitude,
    longitude: topResult.longitude,
  };
}

async function getWeatherSignalLive(location, riskZone) {
  const fallback = weatherProfiles[riskZone] || weatherProfiles.SAFE;
  const coords = await getCoordinates(location);

  if (!coords) {
    return fallback;
  }

  if (env.weatherApiUrl) {
    const separator = env.weatherApiUrl.includes("?") ? "&" : "?";
    const keyParam = env.weatherApiKey ? `&appid=${encodeURIComponent(env.weatherApiKey)}` : "";
    const providerUrl =
      `${env.weatherApiUrl}${separator}lat=${coords.latitude}&lon=${coords.longitude}&units=metric${keyParam}`;

    const providerData = await fetchJson(providerUrl);
    if (providerData?.list?.length) {
      const entries = providerData.list.slice(0, 8);
      const maxPop = Math.max(...entries.map((entry) => Number(entry.pop || 0)));
      const rainMm = entries.reduce((sum, entry) => {
        const rain = Number(entry.rain?.["3h"] || 0);
        return sum + rain;
      }, 0);
      const maxTemp = Math.max(
        ...entries.map((entry) => Number(entry.main?.temp_max ?? entry.main?.temp ?? fallback.temperature))
      );

      const trigger = maxPop >= 0.7 || rainMm >= 20;
      return {
        condition: trigger ? "heavy-rain" : "clear",
        rainForecast: trigger,
        premiumAdjustment: trigger ? 2 : 0,
        trigger,
        temperature: maxTemp,
      };
    }
  }

  const forecastUrl =
    `https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}` +
    "&daily=precipitation_sum,precipitation_probability_max,temperature_2m_max&forecast_days=1&timezone=auto";

  const forecast = await fetchJson(forecastUrl);
  if (!forecast?.daily) {
    return fallback;
  }

  const rainProbability = Number(forecast.daily.precipitation_probability_max?.[0] || 0);
  const rainMm = Number(forecast.daily.precipitation_sum?.[0] || 0);
  const maxTemp = Number(forecast.daily.temperature_2m_max?.[0] || fallback.temperature);

  const trigger = rainProbability >= 70 || rainMm >= 20;
  const condition = trigger ? "heavy-rain" : "clear";

  return {
    condition,
    rainForecast: trigger,
    premiumAdjustment: trigger ? 2 : 0,
    trigger,
    temperature: maxTemp,
  };
}

async function getTrafficSignalLive(location, riskZone) {
  const fallback = trafficProfiles[riskZone] || trafficProfiles.SAFE;

  if (!env.trafficApiUrl) {
    return fallback;
  }

  const separator = env.trafficApiUrl.includes("?") ? "&" : "?";
  const url = `${env.trafficApiUrl}${separator}location=${encodeURIComponent(location)}`;
  const headers = env.trafficApiKey ? { Authorization: `Bearer ${env.trafficApiKey}` } : {};
  const payload = await fetchJson(url, headers);

  if (!payload) {
    return fallback;
  }

  const congestion = payload.congestionLevel || payload.severity || fallback.congestionLevel;
  const trigger = Boolean(payload.trigger ?? ["high", "very-high", "severe"].includes(String(congestion).toLowerCase()));

  return {
    congestionLevel: String(congestion).toLowerCase(),
    trigger,
  };
}

async function getFloodSignalLive(location, riskZone) {
  const fallback = floodProfiles[riskZone] || floodProfiles.SAFE;

  if (!env.floodApiUrl) {
    return fallback;
  }

  const separator = env.floodApiUrl.includes("?") ? "&" : "?";
  const url = `${env.floodApiUrl}${separator}location=${encodeURIComponent(location)}`;
  const headers = env.floodApiKey ? { Authorization: `Bearer ${env.floodApiKey}` } : {};
  const payload = await fetchJson(url, headers);

  if (!payload) {
    return fallback;
  }

  const alert = Boolean(payload.alert ?? payload.isFloodAlert ?? false);
  const severity = String(payload.severity || (alert ? "high" : "none")).toLowerCase();

  return {
    alert,
    severity,
  };
}

async function getLocalEventSignalLive(location) {
  const normalized = location.toLowerCase();

  if (env.eventsApiUrl) {
    const separator = env.eventsApiUrl.includes("?") ? "&" : "?";
    const url = `${env.eventsApiUrl}${separator}location=${encodeURIComponent(location)}`;
    const headers = env.eventsApiKey ? { Authorization: `Bearer ${env.eventsApiKey}` } : {};
    const payload = await fetchJson(url, headers);

    if (payload) {
      return {
        hasDisruption: Boolean(payload.hasDisruption ?? payload.trigger ?? false),
        eventName: payload.eventName || payload.name || "local-event",
        severity: String(payload.severity || "medium").toLowerCase(),
      };
    }
  }

  const eventLocations = ["mumbai", "kolkata", "delhi"];
  if (eventLocations.includes(normalized)) {
    return {
      hasDisruption: true,
      eventName: "City mobility restriction",
      severity: "medium",
    };
  }

  return {
    hasDisruption: false,
    eventName: "none",
    severity: "none",
  };
}

function getHeatwaveSignalFromWeather(weather, riskZone) {
  const temperature = Number(weather.temperature || (riskZone === "HIGH_RISK" ? 41 : 36));
  const alert = temperature >= 42;

  return {
    alert,
    temperature,
  };
}

function getWeatherSignal(riskZone) {
  return weatherProfiles[riskZone] || weatherProfiles.SAFE;
}

async function getDisruptionSignals({ location, riskZone }) {
  const weather = await getWeatherSignalLive(location, riskZone);
  const [traffic, flood, localEvent] = await Promise.all([
    getTrafficSignalLive(location, riskZone),
    getFloodSignalLive(location, riskZone),
    getLocalEventSignalLive(location),
  ]);
  const heatwave = getHeatwaveSignalFromWeather(weather, riskZone);

  return {
    weather,
    traffic,
    flood,
    localEvent,
    heatwave,
  };
}

module.exports = {
  getWeatherSignal,
  getDisruptionSignals,
};

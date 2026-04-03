# GigShield Backend (Express + PostgreSQL + Prisma)

This backend is designed for your existing GigShield frontend and follows clean architecture:

- Controller -> Service -> Repository
- REST APIs
- PostgreSQL schema via Prisma
- JWT authentication
- Dynamic pricing + zero-touch claims + automated triggers

Also included:

- Admin seed script (`npm run seed:admin`)
- Cron-based automated trigger checks
- Real API-capable disruption adapters with fallback behavior

## 1. Project Structure

```txt
backend/
  prisma/
    schema.prisma
  postman/
    GigShield-Backend.postman_collection.json
  src/
    app.js
    server.js
    config/
      env.js
      prisma.js
      swagger.js
    controllers/
      authController.js
      userController.js
      policyController.js
      claimController.js
      premiumController.js
      triggerController.js
    services/
      authService.js
      userService.js
      policyService.js
      claimService.js
      dynamicPricingService.js
      triggerService.js
      externalDataService.js
    repositories/
      userRepository.js
      policyRepository.js
      claimRepository.js
      disruptionRepository.js
    middlewares/
      authMiddleware.js
      errorHandler.js
    utils/
      apiError.js
      apiResponse.js
      validators.js
    data/
      historicalRiskData.js
  package.json
  .env.example
```

## 2. Full Backend Modules

Implemented modules:

- Auth module: register/login with JWT and bcrypt
- User module: fetch user details
- Policy module: create/view/update policy
- Pricing module: DynamicPricingService with risk adjustments
- Claims module: zero-touch adjudication (AUTO_APPROVED/REJECTED/PENDING)
- Trigger module: weather/traffic/flood/local-event/heatwave checks
- Swagger docs at `/api/docs`

## 3. Database Schema

### Entities

- User
  - id, name, phone, location, occupationType, riskZone, role, passwordHash
- Policy
  - id, policyCode (policyId), userId, coverageAmount, weeklyPremium, coverageHours, riskCategory, claimEligible, eligibilityReason
- Claim
  - id, claimCode (claimId), userId, policyId, reason, status, createdAt
- DisruptionEvent
  - id, type, severity, location, riskZone, isActive, detectedAt, expiresAt

### Relationships

- One User has many Policies
- One User has many Claims
- One Policy has many Claims

## 4. API Documentation

Base URL: `http://localhost:8080`

Response format for all APIs:

```json
{
  "success": true,
  "data": {},
  "message": "..."
}
```

### Auth

- POST `/api/auth/register`
- POST `/api/auth/login`

Register body:

```json
{
  "name": "Rahul Das",
  "phone": "9876543210",
  "location": "mumbai",
  "occupationType": "Delivery Partner",
  "riskZone": "FLOOD_PRONE",
  "password": "secret123"
}
```

Login body:

```json
{
  "phone": "9876543210",
  "password": "secret123"
}
```

### User

- GET `/api/users/{id}` (Bearer token)

### Policy

- POST `/api/policies` (Bearer token, ADMIN role)
- GET `/api/policies/{userId}` (Bearer token)
- PUT `/api/policies/{policyId}` (Bearer token, ADMIN role)

Create policy body:

```json
{
  "userId": "<USER_ID>",
  "coverageAmount": 1000,
  "coverageHours": 40,
  "riskCategory": "HIGH"
}
```

### Claims

- POST `/api/claims` (Bearer token)
- GET `/api/claims/{userId}` (Bearer token)

Create claim body:

```json
{
  "userId": "<USER_ID>",
  "policyId": "POL-1712123456789-112",
  "reason": "rain disruption"
}
```

### Pricing

- GET `/api/premium/calculate/{userId}` (Bearer token)

Dynamic premium logic:

- Base premium starts at 30/week
- SAFE zone: -2 adjustment
- FLOOD_PRONE/HIGH_RISK: +5/+6 adjustment
- Rain forecast: +2 or +3
- Historical risk adds a weighted increment

### Triggers

- GET `/api/triggers/check`

Implemented triggers (5 total):

- Weather heavy rain/storm
- Traffic congestion
- Flood alert
- Local event disruption
- Heatwave alert

Trigger outcomes:

- Auto-adjusts active policy premium
- Auto-enables claim eligibility
- Creates disruption events and notification messages

## 5. Frontend Integration Guide

Use your frontend API client (fetch/axios) with:

- `Authorization: Bearer <token>` for protected routes
- `Content-Type: application/json`

Recommended frontend flow:

1. Call register -> login and store token
2. Fetch user profile via user ID
3. Create policy for user
4. Call premium calculate endpoint to refresh weekly premium and trigger checks
5. File claims with policyId (policy code)
6. Poll trigger check endpoint for dashboard alerts

Example fetch:

```js
const res = await fetch("http://localhost:8080/api/premium/calculate/USER_ID", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
const json = await res.json();
```

## 6. Setup Instructions (Step-by-Step)

1. Install PostgreSQL and create DB `gigshield_db`
2. In backend folder, create env file:

```bash
cp .env.example .env
```

3. Update `.env` with your PostgreSQL credentials and JWT secret
4. Install dependencies:

```bash
npm install
```

5. Generate Prisma client and run migration:

```bash
npm run prisma:generate
npm run prisma:migrate -- --name init
```

6. Start backend:

```bash
npm run dev
```

7. Access docs:

- Swagger UI: `http://localhost:8080/api/docs`
- Health check: `http://localhost:8080/health`

8. Seed an admin account:

```bash
npm run seed:admin
```

The seed script uses these env values:

- `ADMIN_SEED_NAME`
- `ADMIN_SEED_PHONE`
- `ADMIN_SEED_PASSWORD`
- `ADMIN_SEED_LOCATION`
- `ADMIN_SEED_OCCUPATION`
- `ADMIN_SEED_RISK_ZONE`

## 7. Automated Triggers (Cron)

- Cron is enabled by default and runs `triggerService.checkTriggers()` every 15 minutes.
- Configure with:
  - `ENABLE_TRIGGER_CRON=true|false`
  - `TRIGGER_CRON_SCHEDULE="*/15 * * * *"`

## 8. External API Integration

`externalDataService.js` now supports real API calls for trigger signals:

- Weather: Open-Meteo geocoding + forecast (no key required)
- Traffic/Flood/Events: configurable API URLs and keys via env

Optional env vars:

- `TRAFFIC_API_URL`
- `TRAFFIC_API_KEY`
- `FLOOD_API_URL`
- `FLOOD_API_KEY`
- `EVENTS_API_URL`
- `EVENTS_API_KEY`

If these are not configured or fail, the service safely falls back to deterministic profile-based logic.

## Notes

- Traffic/flood/events API contracts are intentionally generic so you can plug your preferred providers.

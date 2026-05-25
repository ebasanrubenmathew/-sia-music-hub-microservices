# Music Hub Microservices

A microservice-based backend extension for the Music Hub application, built for the System Integration and Architecture (SIA) final project.

## Architecture

Two independent Node.js/Express microservices that integrate with the existing Music Hub Supabase backend:

| Service | Base URL | Purpose |
|---------|----------|---------|
| Analytics | `/api/analytics` | Track play events, compute popular tracks, user stats, dashboard overview |
| Recommendations | `/api/recommendations` | Suggest tracks based on user favorites, genre, and artists |

## Services

### Analytics Service

**Endpoints:**

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/analytics/play` | Log a play event |
| GET | `/api/analytics/tracks/popular` | Top N most played tracks |
| GET | `/api/analytics/tracks/:id/stats` | Play count and unique listeners for a track |
| GET | `/api/analytics/users/:id/stats` | User listening stats and recent tracks |
| GET | `/api/analytics/overview` | Dashboard overview (total plays, unique listeners, etc.) |

### Recommendation Service

**Endpoints:**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/recommendations/:userId` | Personalized track recommendations for a user |
| GET | `/api/recommendations/track/:trackId` | Similar tracks based on genre/artist |

## Authentication

All endpoints require a JWT Bearer token in the `Authorization` header:
```
Authorization: Bearer <jwt_token>
```

## Setup

### Prerequisites
- Node.js 18+
- A Supabase project (same one used by Music Hub)

### Installation

```bash
# Install analytics service
cd analytics-service
npm install

# Install recommendation service
cd ../recommendation-service
npm install
```

### Environment Variables

Create a `.env` file in each service folder:

```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
JWT_SECRET=your_jwt_secret
PORT=3000
```

### Supabase Setup

Run the `setup.sql` script in your Supabase SQL Editor to create the `plays` table.

### Running Locally

```bash
cd analytics-service
node index.js

cd recommendation-service
node index.js
```

## Deployment

Both services are deployed on Render:
- Analytics: `https://music-hub-analytics.onrender.com`
- Recommendations: `https://music-hub-recommendations.onrender.com`

## Tech Stack

- Node.js
- Express.js
- Supabase (PostgreSQL)
- JWT Authentication
- Render (Deployment)

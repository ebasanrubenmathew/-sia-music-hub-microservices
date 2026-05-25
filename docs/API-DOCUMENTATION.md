# 🎵 MUSIC HUB MICROSERVICES API
## OFFICIAL API DOCUMENTATION (LIVE SYSTEM)

---

## 1. BASE URLS (LIVE DEPLOYMENT)

### Analytics Service
```
https://sia-music-hub-analytics.onrender.com
```

### Recommendation Service
```
https://music-hub-recommendations.onrender.com
```

---

## 2. API STATUS

### Check Analytics Service
```
GET /
```
**Response:**
```json
{
  "service": "Music Hub Analytics Service",
  "status": "running"
}
```

### Check Recommendation Service
```
GET /
```
**Response:**
```json
{
  "service": "Music Hub Recommendation Service",
  "status": "running"
}
```

---

## 3. GENERAL RULES

| Rule | Description |
|------|-------------|
| Architecture | REST API |
| Format | JSON Requests / Responses only |
| CORS | Enabled |
| Authentication | None required (public endpoints) |
| Storage | Supabase PostgreSQL (persistent) |
| Accessibility | Publicly accessible endpoints |

---

## 4. ANALYTICS SERVICE ENDPOINTS

### ➤ LOG A PLAY EVENT
Records when a user plays a track.

```
POST /api/analytics/play
```

**Request Body:**
```json
{
  "track_id": 1,
  "user_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Response (201):**
```json
{
  "success": true
}
```

---

### ➤ GET POPULAR TRACKS
Returns the most played tracks.

```
GET /api/analytics/tracks/popular?limit=10
```

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| limit | integer | 10 | Number of tracks to return |

**Response (200):**
```json
[
  {
    "id": 1,
    "play_count": 25,
    "tracks": {
      "id": 1,
      "title": "Leaves",
      "genre": "Pop",
      "audio_url": "https://example.com/audio.mp3",
      "cover_url": "https://example.com/cover.jpg",
      "status": "published"
    }
  }
]
```

---

### ➤ GET TRACK STATS
Returns play count and unique listeners for a specific track.

```
GET /api/analytics/tracks/:id/stats
```

**Response (200):**
```json
{
  "track_id": 1,
  "plays": 25,
  "unique_listeners": 10
}
```

---

### ➤ GET USER STATS
Returns listening statistics for a specific user.

```
GET /api/analytics/users/:id/stats
```

**Response (200):**
```json
{
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "total_plays": 42,
  "recent_tracks": [
    {
      "track_id": 1,
      "tracks": {
        "title": "Leaves",
        "artists": { "name": "Ben&Ben" }
      }
    }
  ]
}
```

---

### ➤ GET DASHBOARD OVERVIEW
Returns overall platform analytics.

```
GET /api/analytics/overview
```

**Response (200):**
```json
{
  "total_plays": 1250,
  "unique_tracks_played": 45,
  "unique_listeners": 30,
  "most_played_track": {
    "track_id": 1,
    "count": 25,
    "tracks": { "title": "Leaves" }
  }
}
```

---

## 5. RECOMMENDATION SERVICE ENDPOINTS

### ➤ GET USER RECOMMENDATIONS
Returns personalized track recommendations based on user's favorites.

```
GET /api/recommendations/:userId?limit=6
```

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| limit | integer | 6 | Number of recommendations |

**Response (200):**
```json
{
  "recommendations": [
    {
      "id": 3,
      "title": "711",
      "cover_url": "https://example.com/cover.jpg",
      "genre": "OPM",
      "artist_id": 2,
      "artists": { "name": "TONEEJAY" }
    }
  ],
  "based_on": "genre"
}
```

**Possible `based_on` values:**
| Value | Description |
|-------|-------------|
| `genre` | Recommendations based on favorite genre |
| `artist` | Recommendations based on favorite artist |
| `recent` | Fallback to recent tracks (no favorites yet) |

---

### ➤ GET SIMILAR TRACKS
Returns tracks similar to a given track by genre or artist.

```
GET /api/recommendations/track/:trackId?limit=5
```

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| limit | integer | 5 | Number of similar tracks |

**Response (200):**
```json
{
  "track_id": 1,
  "similar": [
    {
      "id": 5,
      "title": "Take All The Love",
      "cover_url": "https://example.com/cover.jpg",
      "artists": { "name": "Arthur Nery" }
    }
  ]
}
```

---

## 6. SAMPLE DATA STRUCTURES

### Play Event
```json
{
  "id": 1,
  "track_id": 1,
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "played_at": "2026-05-25T12:00:00Z"
}
```

### Recommendation Response
```json
{
  "recommendations": [],
  "based_on": "genre"
}
```

### Similar Tracks Response
```json
{
  "track_id": 1,
  "similar": []
}
```

---

## 7. ERROR RESPONSES

```json
{
  "error": "Error description here"
}
```

### Common Errors

| Error Message | HTTP Status | Cause |
|---------------|-------------|-------|
| `track_id is required` | 400 | Missing track_id in play request |
| `Track not found` | 404 | Invalid track ID for similar tracks |
| `Internal server error` | 500 | Server-side issue |

---

## 8. HTTP STATUS CODES

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 404 | Not Found |
| 500 | Server Error |

---

## 9. FRONTEND USAGE EXAMPLES

### Log a Play Event
```javascript
fetch("https://sia-music-hub-analytics.onrender.com/api/analytics/play", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    track_id: 1,
    user_id: "550e8400-e29b-41d4-a716-446655440000"
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

### Get Popular Tracks
```javascript
fetch("https://sia-music-hub-analytics.onrender.com/api/analytics/tracks/popular?limit=5")
  .then(res => res.json())
  .then(data => console.log(data));
```

### Get Dashboard Overview
```javascript
fetch("https://sia-music-hub-analytics.onrender.com/api/analytics/overview")
  .then(res => res.json())
  .then(data => console.log(data));
```

### Get User Recommendations
```javascript
const userId = "550e8400-e29b-41d4-a716-446655440000";
fetch(`https://music-hub-recommendations.onrender.com/api/recommendations/${userId}?limit=6`)
  .then(res => res.json())
  .then(data => console.log(data));
```

### Get Similar Tracks
```javascript
fetch("https://music-hub-recommendations.onrender.com/api/recommendations/track/1?limit=5")
  .then(res => res.json())
  .then(data => console.log(data));
```

---

## 10. ARCHITECTURE DIAGRAM

```
┌─────────────────────────────────────────────────────────────┐
│                    USER'S BROWSER (HTML/JS)                 │
│                                                             │
│  ┌─────────────────────────────┐  ┌───────────────────────┐ │
│  │    Home.html / Library      │  │   Admin Dashboard     │ │
│  │    Musicplay.html           │  │   Manage Music        │ │
│  └──────────┬──────────────────┘  └──────────┬────────────┘ │
│             │                                 │              │
└─────────────┼─────────────────────────────────┼──────────────┘
              │                                 │
              ▼                                 ▼
┌─────────────────────────┐    ┌──────────────────────────────┐
│  ANALYTICS SERVICE      │    │  RECOMMENDATION SERVICE      │
│  (Render)               │    │  (Render)                    │
│                         │    │                              │
│  POST /api/analytics/   │    │  GET /api/recommendations/   │
│  play                   │    │  :userId                     │
│  GET  /tracks/popular   │    │  GET /track/:trackId         │
│  GET  /tracks/:id/stats │    └──────────┬───────────────────┘
│  GET  /users/:id/stats  │               │
│  GET  /overview         │               │
└──────────┬──────────────┘               │
           │                              │
           └──────────────┬───────────────┘
                          │
                          ▼
              ┌─────────────────────┐
              │     SUPABASE DB     │
              │  (PostgreSQL)       │
              │                     │
              │  plays table        │
              │  tracks table       │
              │  favorites table    │
              │  profiles table     │
              └─────────────────────┘
```

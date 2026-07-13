# Voucher Seat Assignment Application

An airline promotional campaign application that randomly assigns 3 unique seat numbers to voucher winners based on aircraft type.

## Features

- **Frontend (React + Vite)**: User interface for crew members to input flight details and generate vouchers
- **Backend (NestJS + TypeScript)**: REST API for voucher generation and validation
- **Database (SQLite)**: Persistent storage for voucher assignments
- **Dockerized**: Complete Docker setup for easy deployment

## Aircraft Seat Layouts

| Aircraft Type | Row Range | Seats per Row | Example Seats |
|--------------|-----------|---------------|---------------|
| ATR | 1–18 | A, C, D, F | 1A, 18F |
| Airbus 320 | 1–32 | A, B, C, D, E, F | 1A, 32F |
| Boeing 737 Max | 1–32 | A, B, C, D, E, F | 1A, 32F |

## Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)

## Quick Start with Docker

1. Build and start all services:
   ```bash
   docker-compose up --build
   ```

2. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

3. Stop the application:
   ```bash
   docker-compose down
   ```

The SQLite database is persisted in a Docker volume, so your data will be preserved between restarts.

## Local Development

### Backend Setup

```bash
cd backend
npm install
npm run start:dev
```

The backend will run on http://localhost:3001

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on http://localhost:3000

## API Endpoints

### POST /api/check
Check if vouchers already exist for a flight and date.

**Request:**
```json
{
  "flightNumber": "GA102",
  "date": "2025-07-12"
}
```

**Response:**
```json
{
  "exists": true
}
```

### POST /api/generate
Generate 3 random unique seats and save to database.

**Request:**
```json
{
  "name": "Sarah",
  "id": "98123",
  "flightNumber": "ID102",
  "date": "2025-07-12",
  "aircraft": "Airbus 320"
}
```

**Response:**
```json
{
  "success": true,
  "seats": ["3B", "7C", "14D"]
}
```

## Database Schema

Table: `vouchers`

| Field | Type | Constraint |
|-------|------|------------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT |
| crew_name | TEXT | NOT NULL |
| crew_id | TEXT | NOT NULL |
| flight_number | TEXT | NOT NULL |
| flight_date | TEXT | NOT NULL |
| aircraft_type | TEXT | NOT NULL |
| seat1 | TEXT | NOT NULL |
| seat2 | TEXT | NOT NULL |
| seat3 | TEXT | NOT NULL |
| created_at | TEXT | NOT NULL (ISO 8601) |

## Project Structure

```
/workspace
├── backend/                 # NestJS backend
│   ├── src/
│   │   ├── main.ts
│   │   ├── app.module.ts
│   │   ├── app.controller.ts
│   │   └── voucher.service.ts
│   ├── package.json
│   └── tsconfig.json
├── frontend/                # React frontend
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   ├── api.ts
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.ts
│   └── index.html
├── Dockerfile.backend
├── Dockerfile.frontend
├── docker-compose.yml
└── README.md
```

## Environment Variables

### Backend
- `DB_PATH`: Path to SQLite database file (default: `./vouchers.db`)
- `NODE_ENV`: Environment mode (development/production)

### Frontend
- `VITE_API_URL`: Backend API URL (default: `http://localhost:3001`)

## License

MIT

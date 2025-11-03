# Eventrix Java Backend

This is a minimal Spring Boot backend for the Eventrix frontend. It exposes REST endpoints to manage users, events, equipment, bookings and checkins.

Quick facts:
- Java 17
- Spring Boot (web + JPA)
- H2 in-memory database with a small seeded dataset (`src/main/resources/data.sql`)
- Server default port: 8080

Available endpoints (examples):
- GET  /api/users
- GET  /api/events
- GET  /api/equipment
- GET  /api/bookings
- GET  /api/checkins
- POST /api/bookings (create booking)
- POST /api/events (create event)
- etc. Standard CRUD via REST is implemented.

How to run (Windows PowerShell):

1. Build & run using Maven (requires Maven and JDK 17 installed):

```powershell
cd \path\to\Eventrix\backend
mvn spring-boot:run
```

2. Open the API at http://localhost:8080/api/events etc.
3. H2 console: http://localhost:8080/h2-console (JDBC URL: `jdbc:h2:mem:eventrix`, user `sa`, blank password)

Notes and next steps:
- The controllers and entities use simple types matching the front-end `types.ts` structure. You can expand fields or validation as needed.
- If you want the backend to use the full `mockData.ts` dataset, I can add a pre-seed script or convert the CSV into `data.sql` inserts.
- I can also wire the frontend to call these endpoints and replace the in-memory mock usage.


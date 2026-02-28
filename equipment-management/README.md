# Equipment Management System

## Quick Start

### 1. Database Setup
```bash
psql -U postgres -d equipment_db -f db/schema.sql
```

### 2. Run Backend
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### 3. Run Frontend
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

# Math Solver

A web application for matrix calculations — determinant, inverse, transpose, eigenvalues, Jordan form, and more.

**Stack:** React (Vite) + FastAPI + PostgreSQL

---

## Project Structure

```
math-solver/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── models/
│   │   ├── database.py
│   │   └── main.py
│   ├── requirements.txt
│   └── venv/
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
└── docker-compose.yml
```

---

## Prerequisites

| Tool | Version | Download |
|------|---------|----------|
| Python | 3.10+ | https://python.org |
| Node.js | 18+ | https://nodejs.org |
| PostgreSQL | 14+ | https://postgresql.org |

The `docker-compose.yml` starts only the **PostgreSQL** database.  
The backend and frontend are started manually (see steps below).

---

## Step 1 — Start the database

Requires [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/).

```bash
cd math-solver
docker compose up -d
```

This starts PostgreSQL 16 on port `5432` with:
- user: `postgres`
- password: `postgres`
- database: `mathsolver`

To stop the database:
```bash
docker compose down
```

### Alternative — use a local PostgreSQL installation (without Docker)

#### Linux / macOS
```bash
# Ubuntu/Debian:
sudo apt install postgresql
sudo service postgresql start

# macOS (Homebrew):
brew install postgresql@14
brew services start postgresql@14

# Create the database
psql -U postgres -c "CREATE DATABASE mathsolver;"
```

#### Windows
1. Download and install PostgreSQL from https://postgresql.org/download/windows/
2. During installation set password `postgres` for the `postgres` user
3. Open **pgAdmin** or **SQL Shell (psql)** and run:
```sql
CREATE DATABASE mathsolver;
```

---

## Step 2 — Start the backend

#### Linux / macOS
```bash
cd math-solver/backend

# Create virtual environment
python3 -m venv venv

# Activate it
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### Windows
```cmd
cd math-solver\backend

# Create virtual environment
python -m venv venv

# Activate it
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`  
Interactive API docs: `http://localhost:8000/docs`

---

## Step 3 — Start the frontend

Open a **new terminal window**.

#### Linux / macOS
```bash
cd math-solver/frontend

npm install
npm run dev
```

#### Windows
```cmd
cd math-solver\frontend

npm install
npm run dev
```

The app will be available at `http://localhost:5173`

---

## Summary — terminals needed

You need **two terminal windows** running simultaneously (database runs in background via Docker):

| Terminal | Directory | Command |
|----------|-----------|---------| 
| 1 — Backend | `math-solver/backend` | `uvicorn app.main:app --reload` |
| 2 — Frontend | `math-solver/frontend` | `npm run dev` |

---

## Database connection

The database URL is configured in `backend/app/database.py`:

```
postgresql://postgres:postgres@localhost:5432/mathsolver
```

If you are using a different PostgreSQL setup, update the credentials in that file accordingly.

---

## Troubleshooting

**`psycopg2` install fails on Linux:**
```bash
sudo apt install libpq-dev python3-dev
pip install psycopg2-binary
```

**`psycopg2` install fails on macOS:**
```bash
brew install libpq
pip install psycopg2-binary
```

**`psycopg2` install fails on Windows:**

Make sure PostgreSQL is installed and its `bin` folder is added to PATH, then:
```cmd
pip install psycopg2-binary
```

**Port 8000 already in use:**
```bash
# Linux/macOS
lsof -i :8000
kill -9 <PID>

# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

**Port 5432 already in use (local PostgreSQL running alongside Docker):**
```bash
# Linux/macOS — stop local postgres first
sudo service postgresql stop

# then start Docker
docker compose up -d
```

**`npm run dev` fails — Node version too old:**
```bash
# Check version
node --version

# Install Node 18+ via nvm (Linux/macOS):
nvm install 18
nvm use 18
```

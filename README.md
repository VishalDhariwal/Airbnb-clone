# Airbnb Fullstack Clone

Fullstack Airbnb clone built for SDE evaluation.

- **Frontend:** Next.js (App Router, TypeScript, Tailwind CSS v3.4, Inter font)
- **Backend:** Python (FastAPI, SQLAlchemy 2.0, Pydantic v2)
- **Database:** SQLite with strict schema and foreign key constraints
- **Design System:** Pixel-accurate Airbnb replica based on reference screenshots in `/references/` and `DESIGN_SYSTEM.md`

## Architecture & Layout

- `backend/`: FastAPI application (`app/models/`, `app/schemas/`, `app/routers/`, `app/services/`, `app/core/`, `app/seed/`)
- `frontend/`: Next.js application (`app/`, `components/`, `lib/`)
- `references/`: Full-page and component screenshots of live Airbnb site

## Development Setup

### Backend
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

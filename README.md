# Job Scraper

A full-stack job scraping application that allows users to search for job listings from various sources.

## Project Structure

```
Job-Scraper/
├── backend/
│   ├── api/
│   │   ├── routes/
│   │   └── schemas.py
│   ├── config/
│   │   └── database.py
│   ├── database/
│   │   └── models.py
│   ├── parsers/
│   ├── scrapers/
│   ├── services/
│   ├── tests/
│   ├── utils/
│   ├── main.py
│   └── seed_db.py
├── frontend/
│   ├── node_modules/
│   ├── src/
│   │   ├── hooks/
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   └── ResultsPage.jsx
│   │   ├── styles/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   ├── index.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
├── venv/
├── .env
├── .gitignore
├── backend.log
├── frontend.log
├── job_scraper.db
├── requirements.txt
├── setup.bat
└── start.bat
```

## Architecture

The project follows a client-server architecture:

- **Backend**: Built with FastAPI (Python) and SQLAlchemy for ORM. It exposes RESTful APIs for job data and scraping operations.
- **Frontend**: Built with React (using Vite) and JavaScript (JSX). It consumes the backend APIs to display job listings.
- **Database**: SQLite (job_scraper.db) for storing job data.

### Backend Components

1. **API Layer** (`backend/api/`):
    - Defines routes for job search and scraping triggers.
    - Uses Pydantic models for request/response validation.

2. **Database Layer** (`backend/database/`):
    - SQLAlchemy models for Job entities.
    - Database initialization and session management.

3. **Scrapers** (`backend/scrapers/`):
    - Modules for scraping job listings from various sources (e.g., LinkedIn, Indeed).

4. **Parsers** (`backend/parsers/`):
    - Utilities to parse raw scraped data into structured format.

5. **Services** (`backend/services/`):
    - Business logic for job processing, filtering, and storage.

6. **Configuration** (`backend/config/`):
    - Database connection setup.

7. **Main Entry Point** (`backend/main.py`):
    - FastAPI application setup, middleware, and event handlers.

### Frontend Components

1. **Pages** (`frontend/src/pages/`):
    - `HomePage.jsx`: Landing page with search form.
    - `ResultsPage.jsx`: Displays search results and job details.

2. **Hooks** (`frontend/src/hooks/`):
    - Custom React hooks for data fetching and state management.

3. **Styles** (`frontend/src/styles/`):
    - CSS modules or styled components for styling.

4. **Utilities** (`frontend/src/utils/`):
    - Helper functions for API calls, data formatting, etc.

5. **Entry Points**:
    - `main.jsx`: ReactDOM.render entry point.
    - `App.jsx`: Root component with routing.

## Pipeline

1. **Setup**:
    - Run `setup.bat` to:
        - Check for Python and Node.js.
        - Create a Python virtual environment and install dependencies.
        - Install Node.js dependencies.
        - Initialize the database schema (no seed data - uses real-time scraping).
        - Initialize the database with seed data.

2. **Starting the Application**:
    - Run `start.bat` to:
        - Start the backend FastAPI server (via Uvicorn) on `http://localhost:8000`.
        - Start the frontend Vite development server on `http://localhost:5173`.

3. **Data Flow (Real-Time)**:
    - User enters search criteria on the HomePage and submits.
    - Frontend sends a GET request to `/api/jobs?keyword=X&location=Y` on the backend.
    - Backend **immediately runs all scrapers in parallel** to fetch live job data from configured sources.
    - Scrapers run concurrently (timeout: 12 seconds per scraper) for optimal performance.
    - Scraped data is parsed, validated, and stored in the database.
    - Results are returned to the frontend in real-time (within ~12 seconds).
    - User can filter results by platform, job type, experience level, and salary range.
3. **Data Flow**:
    - User enters search criteria on the HomePage and submits.
    - Frontend sends a GET request to `/api/jobs/search` on the backend.
    - Backend queries the database for matching jobs and returns them.
    - If the database is empty or stale, the user can trigger a scrape via the `/api/scrape` endpoint.
    - Scraping jobs run in the background (or asynchronously) to fetch new job listings from configured sources.
    - Scraped data is parsed, validated, and stored in the database.
    - The frontend periodically polls or receives updates to display the latest jobs.

4. **API Endpoints**:
    - `GET /`: API health check.
    - `GET /health`: Backend health check.
    - `GET /api/jobs`: Search and scrape jobs with query parameters (real-time).
    - `GET /api/jobs/{job_id}`: Get a specific job by ID.
    - `GET /api/jobs/platforms/list`: Get available job platforms.
    - `POST /api/jobs`: Create a new job listing.
    - `PUT /api/jobs/{job_id}`: Update a job listing.
    - `DELETE /api/jobs/{job_id}`: Soft delete a job listing.

## Key Features

- **Real-Time Scraping**: Jobs are scraped on-demand when users search, ensuring always fresh data.
- **Parallel Scraping**: All scrapers run concurrently with asyncio for maximum performance.
- **Multi-Platform**: Search across LinkedIn, Indeed, RemoteOK, Remotive, and Glassdoor simultaneously.
- **Smart Filtering**: Filter by job type, experience level, salary range, and specific platforms.
- **Optimized Performance**: Minimal retry delays, efficient async operations, reduced HTTP timeouts.

## Implementation Details

### Backend

- **FastAPI**: Chosen for its asynchronous capabilities, automatic API documentation, and ease of use.
- **SQLAlchemy**: ORM for database interactions, supporting SQLite for development.
- **Pydantic**: For data validation and settings management.
- **CORS Middleware**: Configured to allow frontend requests during development.
- **Async Scrapers**: All scrapers use async/await for concurrent execution via asyncio.gather().
- **Optimized Timeouts**: 
  - Per-scraper timeout: 12 seconds
  - Frontend timeout: 30 seconds
  - Minimal retry delays (10-50ms instead of 500-1500ms)

### Frontend

- **React**: For building interactive user interfaces.
- **Vite**: As the build tool for fast development server and optimized production builds.
- **JavaScript (JSX)**: For component-based UI development.
- **CSS Modules**: For scoped styling (if used) or global CSS.
- **Real-Time Loading States**: Proper loading indicators and error handling during scraping.

### Database

- **SQLite**: Used for simplicity in development. Can be switched to PostgreSQL or MySQL by changing the database URL in `backend/config/database.py`.
- **Schema-Only Initialization**: No seed data is loaded - all jobs are real-time scraped.

### Scraping

- **Parallel Execution**: All scrapers run concurrently using asyncio.gather().
- **Error Recovery**: Individual scraper failures don't block other scrapers.
- **Optimized HTTP Requests**: Async HTTP client with reduced delays and efficient connection handling.
- **Modular Design**: Each scraper is independent and can be extended to support new sources.
- **Data Normalization**: Raw scraped data is normalized into a consistent Job schema.

### Scraping

- The scrapers are modular and can be extended to support new job sources.
- Each scraper is responsible for fetching raw HTML/XML from a source and extracting job data.
- Parsers clean and structure the extracted data into a consistent format.




# JobSphere

## AI-Powered Resume Analysis & Personalized Job Discovery Platform

JobSphere is a full-stack career assistance platform that analyzes a user's resume using AI and helps discover relevant job opportunities based on their skills, experience, target roles, and preferences.

Instead of relying only on keyword matching, JobSphere combines AI-powered resume analysis with semantic similarity using Sentence Transformers to identify and rank jobs that are relevant to the user's profile.

---

## Features

### Resume Analysis
- Upload resumes in PDF or DOCX format
- Automatic resume text extraction
- OCR fallback for scanned/image-based PDF resumes
- AI-powered resume analysis using Google Gemini
- Extraction of skills, education, experience, projects, certifications, target roles, and resume insights

### AI-Powered Job Matching
- Semantic matching between resumes and job descriptions
- Sentence Transformer embeddings
- Cosine similarity
- Target-role relevance analysis
- Personalized job ranking

### Personalized Job Search
Users can control their search using:
- Location
- Job type
- Experience level
- Work mode
- Number of recommendations

Available recommendation counts:
- Top 5
- Top 10
- Top 15
- Top 20

### Trusted Job Sources
JobSphere currently integrates with:
- Greenhouse
- Lever
- Adzuna

Greenhouse and Lever provide trusted job listings, while Adzuna is used as a fallback source for additional opportunities.

### Authentication & Security
- User registration and login
- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- User-specific resume authorization
- Change password functionality
- Request rate limiting
- Helmet security middleware
- Restricted CORS
- Input validation
- Resume file validation
- Prompt-injection protection
- Environment variables for API keys

---

## System Architecture

```text
                         User
                           |
                           v
                  React + Vite Frontend
                           |
                       REST API
                           |
                           v
                  Node.js + Express
                    /           \
                   /             \
                  v               v
             MongoDB          Google Gemini
          Users & Resumes     Resume Analysis
                  |
                  |
                  v
              Python ML Service
                  |
                  v
        Sentence Transformers
          all-MiniLM-L6-v2
                  |
                  v
       Semantic Similarity + Role
          Relevance + Ranking
```

---

## AI/ML Implementation

### Resume Analysis

Google Gemini is used to analyze uploaded resume content and extract structured career information.

The resume is treated as untrusted user-provided data. The analysis pipeline instructs the model to analyze only the resume content and ignore instructions that may appear inside the uploaded document.

### Semantic Job Matching

JobSphere uses the pretrained:

```text
all-MiniLM-L6-v2
```

Sentence Transformer model.

Resume and job descriptions are converted into embeddings and compared using cosine similarity.

```text
Resume
   |
   v
Resume Embedding
   |
   |       Cosine Similarity
   |              ^
   v              |
Job Description -> Job Embedding
```

The ranking system combines semantic similarity with role relevance to determine the final job ranking.

---

## Job Recommendation Pipeline

```text
User uploads Resume
        |
        v
Resume Text Extraction
        |
        v
Gemini Resume Analysis
        |
        v
Target Roles Identified
        |
        v
Fetch Jobs from Trusted Sources
        |
        +----> Greenhouse
        |
        +----> Lever
        |
        +----> Adzuna Fallback
        |
        v
Remove Duplicate Jobs
        |
        v
Apply User Filters
        |
        v
Python ML Service
        |
        v
Role Relevance Analysis
        |
        v
Resume <-> Job Semantic Similarity
        |
        v
Job Ranking
        |
        v
Top N Recommendations
```

---

## Technology Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- Axios
- React Router
- React Dropzone
- Recharts
- React Icons

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- Multer
- pdf-parse
- Mammoth
- Tesseract.js
- Axios
- Helmet
- express-rate-limit

### AI / Machine Learning
- Python
- FastAPI
- Sentence Transformers
- scikit-learn
- all-MiniLM-L6-v2
- Cosine Similarity
- Google Gemini

### Job APIs
- Greenhouse
- Lever
- Adzuna

---

## Project Structure

```text
Job-Sphere/
|
├── backend/
|   ├── controllers/
|   |   └── authController.js
|   |
|   ├── middleware/
|   |   ├── authMiddleware.js
|   |   └── resumeAuthorization.js
|   |
|   ├── models/
|   |   ├── Resume.js
|   |   └── User.js
|   |
|   ├── routes/
|   |   ├── authRoutes.js
|   |   ├── jobRoutes.js
|   |   └── resumeRoutes.js
|   |
|   ├── services/
|   |   ├── jobRecommendationService.js
|   |   ├── jobService.js
|   |   ├── mlService.js
|   |   ├── resumeAnalyzer.js
|   |   ├── trustedJobSourceService.js
|   |   └── jobSources/
|   |       ├── greenhouseSource.js
|   |       └── leverSource.js
|   |
|   ├── package.json
|   └── server.js
|
├── frontend/
|   ├── src/
|   |   ├── components/
|   |   |   ├── auth/
|   |   |   ├── dashboard/
|   |   |   ├── landing/
|   |   |   ├── layout/
|   |   |   └── results/
|   |   |
|   |   ├── pages/
|   |   |   ├── ApplyJobs.jsx
|   |   |   ├── Dashboard.jsx
|   |   |   ├── Home.jsx
|   |   |   ├── Login.jsx
|   |   |   ├── Profile.jsx
|   |   |   ├── Register.jsx
|   |   |   └── Results.jsx
|   |   |
|   |   ├── services/
|   |   |   └── api.js
|   |   ├── App.jsx
|   |   └── main.jsx
|   |
|   ├── package.json
|   └── vite.config.js
|
├── ml-service/
|   ├── app.py
|   ├── matcher.py
|   ├── requirements.txt
|   ├── test_job_analysis.py
|   └── test_matcher.py
|
├── .gitignore
└── README.md
```

---

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/TanviThumu/Job-Sphere.git
cd Job-Sphere
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
PORT=5000
```

Start the backend:

```bash
node server.js
```

Backend:

```text
http://localhost:5000
```

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

### 4. ML Service Setup

Open another terminal:

```bash
cd ml-service
python -m venv venv
```

Activate the virtual environment on Windows:

```powershell
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the ML service:

```bash
uvicorn app:app --reload
```

ML service:

```text
http://127.0.0.1:8000
```

---

## Running the Complete Application

JobSphere requires three services:

### Terminal 1 — Backend

```bash
cd backend
node server.js
```

### Terminal 2 — Frontend

```bash
cd frontend
npm run dev
```

### Terminal 3 — ML Service

```bash
cd ml-service
venv\Scripts\activate
uvicorn app:app --reload
```

Then open:

```text
http://localhost:5173
```

---

## Environment Variables

The backend requires:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
PORT=5000
```

Do not commit `.env` files, API keys, passwords, or other secrets to GitHub.

The project `.gitignore` excludes sensitive and generated files such as:

```text
.env
venv/
node_modules/
__pycache__/
```

---

## Security

JobSphere includes:

- JWT authentication
- Password hashing using bcrypt
- Protected routes
- User-specific resource authorization
- Request rate limiting
- Helmet security headers
- Restricted CORS
- Input validation
- Resume file type validation
- Resume file size limits
- Environment variable protection
- Prompt-injection protection
- Graceful API failure handling

---

## Job Ranking

Job ranking considers two main components:

### Role Relevance

Determines how closely the job title and description relate to the user's identified target roles.

### Semantic Similarity

Measures the semantic relationship between the resume and job description using Sentence Transformer embeddings and cosine similarity.

The two components are combined to produce the final ranking score.

---

## Location-Based Search

JobSphere is designed to support multiple locations rather than assuming a single city.

The general flow is:

```text
Broad Job Pool
      |
      v
User Location Preference
      |
      v
Location Filtering
      |
      v
Relevant Recommendations
```

This architecture allows the system to support different cities, remote opportunities, and additional locations in the future.

---

## Testing

Backend test scripts include:

```text
testJobSources.js
testMLService.js
testResumeAnalyzer.js
testgemini.js
```

ML service tests include:

```text
test_matcher.py
test_job_analysis.py
```

These tests help verify job-source integration, AI analysis, semantic matching, and job-ranking functionality.

---

## Future Scope

Planned improvements include:

- Job-specific missing skill detection
- Matched skills and missing skills for every recommendation
- Improved skill normalization
- More advanced resume-to-job matching
- Additional trusted job sources
- Improved international job coverage
- Salary estimation
- Improved ATS analysis
- Personalized career recommendations
- Saved jobs
- Application tracking
- Job alerts
- Improved ranking and filtering
- Production deployment
- Cloud-based ML service

---

## Objective

The primary goal of JobSphere is to create a personalized job discovery platform that goes beyond traditional keyword-based job searching.

By combining:

```text
Resume Analysis
       +
Generative AI
       +
Semantic Embeddings
       +
Role Relevance
       +
Trusted Job Sources
       +
Personalized Filtering
```

JobSphere aims to help users discover opportunities that are more closely aligned with their actual skills and career goals.

---

## Author

**Tanvi Thumu**

B.Tech — Data Science

GitHub: https://github.com/TanviThumu/Job-Sphere

from fastapi import FastAPI
from pydantic import BaseModel

from matcher import (
    analyze_job,
    calculate_match_percentage,
    rank_job,
)


# =========================================================
# CREATE APP
# =========================================================

app = FastAPI(
    title="JobSphere ML Service",
    version="1.0"
)


# =========================================================
# REQUEST MODELS
# =========================================================

class JobAnalysisRequest(BaseModel):

    title: str = ""

    description: str = ""


class MatchRequest(BaseModel):

    resumeText: str = ""

    jobText: str = ""


class RankJobRequest(BaseModel):

    resumeText: str = ""

    jobTitle: str = ""

    jobDescription: str = ""

    targetRoles: list = []


# =========================================================
# HEALTH CHECK
# =========================================================

@app.get("/")
def root():

    return {
        "message":
            "JobSphere ML Service is running"
    }


# =========================================================
# ANALYZE JOB
# =========================================================

@app.post("/analyze-job")
def analyze_job_endpoint(
    request: JobAnalysisRequest
):

    result = analyze_job(

        request.title,

        request.description

    )


    return result


# =========================================================
# BASIC MATCH
# =========================================================

@app.post("/match")
def match_endpoint(
    request: MatchRequest
):

    score = calculate_match_percentage(
        request.resumeText,
        request.jobText
    )

    return {
        "matchPercentage": score
    }


# =========================================================
# RANK JOB
# =========================================================

@app.post("/rank-job")
def rank_job_endpoint(
    request: RankJobRequest
):

    result = rank_job(
        resume_text=request.resumeText,
        job_title=request.jobTitle,
        job_description=request.jobDescription,
        target_roles=request.targetRoles,
    )

    return result
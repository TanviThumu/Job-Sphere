from matcher import analyze_job


# =========================================================
# TEST JOBS
# =========================================================

jobs = [
    {
        "title": "Data Science Intern",
        "description": """
        Join our data science team as an intern.
        No prior professional experience required.
        Work with Python, SQL and machine learning.
        Hybrid position.
        """,
    },

    {
        "title": "Software Engineer",
        "description": """
        We are looking for a software engineer with
        2+ years of professional experience.
        This is a full-time position.
        """,
    },

    {
        "title": "Senior Data Scientist",
        "description": """
        Full-time position requiring 5+ years of
        relevant experience.
        """,
    },

    {
        "title": "Financial Analyst",
        "description": """
        This is a full-time role.
        Candidates should have minimum 2 years
        of experience in financial analysis.
        On-site position.
        """,
    },

    {
        "title": "Marketing Intern",
        "description": """
        Internship opportunity for students interested
        in digital marketing.
        No professional experience required.
        Remote.
        """,
    },

    {
        "title": "Business Analyst",
        "description": """
        Business analyst role requiring 1-3 years
        of experience.
        Hybrid working arrangement.
        """,
    },
]


# =========================================================
# RUN TESTS
# =========================================================

print("\n==============================")
print("Job Analysis Tests")
print("==============================")


for index, job in enumerate(
    jobs,
    start=1
):

    result = analyze_job(
        job["title"],
        job["description"]
    )

    print(f"\n{index}. {job['title']}")

    print(
        f"Opportunity Type: "
        f"{result['opportunityType']}"
    )

    print(
        f"Minimum Experience: "
        f"{result['minimumExperience']}"
    )

    print(
        f"Work Mode: "
        f"{result['workMode']}"
    )
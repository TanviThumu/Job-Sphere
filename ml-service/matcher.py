import re
from functools import lru_cache

from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity


# =========================================================
# MODEL
# =========================================================

model = SentenceTransformer(
    "all-MiniLM-L6-v2"
)


# =========================================================
# TEXT CLEANING
# =========================================================

def clean_text(text):
    if not text:
        return ""

    text = str(text)

    # Remove HTML if any accidentally remains
    text = re.sub(
        r"<[^>]+>",
        " ",
        text
    )

    # Remove excessive whitespace
    text = re.sub(
        r"\s+",
        " ",
        text
    )

    return text.strip()


# =========================================================
# EMBEDDINGS
# =========================================================

@lru_cache(maxsize=2000)
def create_embedding(text):

    text = clean_text(text)

    if not text:
        return None

    return model.encode(
        text,
        normalize_embeddings=True
    )


def calculate_similarity(
    text1,
    text2
):

    embedding1 = create_embedding(
        text1
    )

    embedding2 = create_embedding(
        text2
    )

    if (
        embedding1 is None
        or embedding2 is None
    ):
        return 0.0

    score = cosine_similarity(
        [embedding1],
        [embedding2]
    )[0][0]

    return float(score)


def calculate_match_percentage(
    resume_text,
    job_text
):

    similarity = calculate_similarity(
        resume_text,
        job_text
    )

    # Convert cosine similarity
    # into a user-friendly percentage
    percentage = max(
        0,
        min(
            100,
            similarity * 100
        )
    )

    return round(
        percentage,
        2
    )


# =========================================================
# OPPORTUNITY TYPE
# =========================================================

def detect_opportunity_type(
    title,
    description
):

    text = (
        f"{title} {description}"
    ).lower()

    title_text = (
        clean_text(title)
        .lower()
    )

    # Internship should primarily
    # be determined from title.
    internship_title_words = [
        "intern",
        "internship",
        "trainee",
        "graduate intern",
        "graduate program",
        "graduate programme"
    ]

    if any(
        word in title_text
        for word in internship_title_words
    ):
        return "Internship"

    # Part-time
    if (
        "part-time" in title_text
        or "part time" in title_text
    ):
        return "Part-time"

    # Full-time
    if (
        "full-time" in title_text
        or "full time" in title_text
    ):
        return "Full-time"

    # Fall back to description
    if "internship" in text or "intern " in text:
        return "Internship"

    if "part-time" in text:
        return "Part-time"

    if "full-time" in text:
        return "Full-time"

    return "Unknown"


# =========================================================
# EXPERIENCE
# =========================================================

def extract_experience_requirement(
    title,
    description
):

    text = clean_text(
        f"{title} {description}"
    ).lower()

    # Explicit fresher / entry-level
    fresher_patterns = [
        r"\bfresher\b",
        r"\bentry[- ]level\b",
        r"\bno experience\b",
        r"\b0 years?\b",
        r"\b0[-– ]?1 years?\b",
        r"\b0[-– ]?1 year\b"
    ]

    for pattern in fresher_patterns:
        if re.search(pattern, text):
            return 0

    # "1-3 years"
    range_match = re.search(
        r"(\d+)\s*[-–]\s*(\d+)\s*years?",
        text
    )

    if range_match:
        return int(
            range_match.group(1)
        )

    # "2+ years"
    plus_match = re.search(
        r"(\d+)\s*\+\s*years?",
        text
    )

    if plus_match:
        return int(
            plus_match.group(1)
        )

    # "minimum of 2 years"
    minimum_match = re.search(
        r"(?:minimum|at least)\s*(?:of\s*)?(\d+)\s*years?",
        text
    )

    if minimum_match:
        return int(
            minimum_match.group(1)
        )

    return None


# =========================================================
# WORK MODE
# =========================================================

def detect_work_mode(
    title,
    description
):

    text = clean_text(
        f"{title} {description}"
    ).lower()

    if "remote" in text:
        return "Remote"

    if "hybrid" in text:
        return "Hybrid"

    if (
        "on-site" in text
        or "onsite" in text
        or "on site" in text
    ):
        return "On-site"

    return "Unknown"


# =========================================================
# BASIC JOB ANALYSIS
# =========================================================

def analyze_job(
    title,
    description
):

    title = clean_text(title)
    description = clean_text(
        description
    )

    return {
        "opportunityType":
            detect_opportunity_type(
                title,
                description
            ),

        "minimumExperience":
            extract_experience_requirement(
                title,
                description
            ),

        "workMode":
            detect_work_mode(
                title,
                description
            )
    }


# =========================================================
# TARGET ROLE NORMALIZATION
# =========================================================

def normalize_target_role(role):

    if isinstance(
        role,
        str
    ):
        return clean_text(role)

    if isinstance(
        role,
        dict
    ):
        return clean_text(
            role.get("role")
            or role.get("title")
            or ""
        )

    return ""


# =========================================================
# ROLE RELEVANCE
# =========================================================

def calculate_role_relevance(
    job_title,
    job_description,
    target_roles
):

    job_title = clean_text(
        job_title
    )

    job_description = clean_text(
        job_description
    )

    if not target_roles:
        return 0.0

    # -----------------------------------------------------
    # TITLE IS THE MOST IMPORTANT SIGNAL
    # -----------------------------------------------------

    best_score = 0.0

    for role in target_roles:

        role_text = normalize_target_role(
            role
        )

        if not role_text:
            continue

        # Semantic similarity between
        # job title and target role
        title_similarity = calculate_similarity(
            job_title,
            role_text
        )

        # Exact/near-exact word overlap
        title_words = set(
            re.findall(
                r"[a-zA-Z0-9]+",
                job_title.lower()
            )
        )

        role_words = set(
            re.findall(
                r"[a-zA-Z0-9]+",
                role_text.lower()
            )
        )

        meaningful_role_words = {
            word
            for word in role_words
            if len(word) > 2
        }

        if meaningful_role_words:

            overlap = (
                title_words
                & meaningful_role_words
            )

            lexical_score = (
                len(overlap)
                / len(meaningful_role_words)
            )

        else:
            lexical_score = 0.0

        # Combine semantic + lexical
        title_score = (
            0.65 * title_similarity
            +
            0.35 * lexical_score
        )

        # -------------------------------------------------
        # DESCRIPTION SUPPORT
        # -------------------------------------------------

        description_sample = (
            job_description[:2000]
        )

        description_similarity = (
            calculate_similarity(
                description_sample,
                role_text
            )
            if description_sample
            else 0.0
        )

        role_score = (
            0.80 * title_score
            +
            0.20 * description_similarity
        )

        best_score = max(
            best_score,
            role_score
        )

    return round(
        max(
            0.0,
            min(
                1.0,
                best_score
            )
        ),
        4
    )


# =========================================================
# UNRELATED ROLE DETECTION
# =========================================================

def detect_unrelated_role(
    job_title,
    target_roles
):

    title = clean_text(
        job_title
    ).lower()

    if not target_roles:
        return False

    target_text = " ".join(
        normalize_target_role(role)
        for role in target_roles
    ).lower()

    # Strongly unrelated career categories
    unrelated_categories = [
        "business development",
        "sales",
        "talent acquisition",
        "human resources",
        "hr intern",
        "recruiter",
        "recruiting",
        "marketing",
        "operations management",
        "customer support",
        "trainer",
        "training",
        "finance manager",
        "account manager"
    ]

    # Only penalize when the title
    # clearly belongs to one of these
    for category in unrelated_categories:

        if category in title:

            # If target roles themselves
            # contain the same category,
            # don't penalize.
            if category in target_text:
                return False

            return True

    return False


# =========================================================
# FINAL JOB RANKING
# =========================================================

def rank_job(
    resume_text,
    job_title,
    job_description,
    target_roles
):

    resume_text = clean_text(
        resume_text
    )

    job_title = clean_text(
        job_title
    )

    job_description = clean_text(
        job_description
    )

    # -----------------------------------------------------
    # ROLE RELEVANCE
    # -----------------------------------------------------

    role_relevance = (
        calculate_role_relevance(
            job_title,
            job_description,
            target_roles
        )
    )

    # -----------------------------------------------------
    # RESUME SIMILARITY
    # -----------------------------------------------------

    # Don't let generic company
    # boilerplate dominate the model.
    #
    # Focus on title + first part of
    # the actual job description.

    relevant_job_text = (
        f"{job_title}. "
        f"{job_description[:2500]}"
    )

    resume_similarity = calculate_similarity(
        resume_text,
        relevant_job_text
    )

    # -----------------------------------------------------
    # FINAL SCORE
    # -----------------------------------------------------

    final_score = (
        0.65 * role_relevance
        +
        0.35 * resume_similarity
    )

    # -----------------------------------------------------
    # UNRELATED JOB PENALTY
    # -----------------------------------------------------

    if detect_unrelated_role(
        job_title,
        target_roles
    ):

        final_score *= 0.45

    final_score = max(
        0.0,
        min(
            1.0,
            final_score
        )
    )

    return {
        "semanticSimilarity":
            round(
                max(
                    0.0,
                    min(
                        1.0,
                        resume_similarity
                    )
                ),
                4
            ),

        "roleRelevance":
            round(
                role_relevance,
                4
            ),

        "finalScore":
            round(
                final_score,
                4
            ),

        "matchPercentage":
            round(
                final_score * 100,
                2
            )
    }
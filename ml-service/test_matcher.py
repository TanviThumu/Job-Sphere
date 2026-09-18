from matcher import calculate_match_percentage


resume = """
BTech Data Science student with experience in Python,
SQL, machine learning, data analysis, pandas,
scikit-learn and statistics. Built machine learning
projects and data analytics applications.
"""


job1 = """
Data Analyst Intern.

Work with Python and SQL to analyze datasets,
create reports and dashboards, and support
data-driven business decisions.
"""


job2 = """
Senior Financial Manager.

Lead financial planning, budgeting, accounting,
and strategic financial operations. Requires
extensive management experience.
"""


score1 = calculate_match_percentage(
    resume,
    job1
)

score2 = calculate_match_percentage(
    resume,
    job2
)


print("\n==============================")
print("Semantic Matching Test")
print("==============================")

print(f"\nData Analyst Internship: {score1}%")
print(f"Senior Financial Manager: {score2}%")
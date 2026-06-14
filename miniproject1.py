
from flask import Flask, render_template, request, jsonify
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# Paste your Gemini API key
genai.configure(
    api_key= os.getenv("GEMINI_API_KEY")
)

# Gemini model
model = genai.GenerativeModel(
    "gemini-2.5-flash"
)


# ================= LOGIN PAGE =================

@app.route("/")
def login():
    return render_template(
        "miniproject1login.html"
    )


# ================= HOME PAGE =================

@app.route("/home")
def home():
    return render_template(
        "miniproject1.html"
    )


# ================= DASHBOARD =================

@app.route("/dashboard")
def dashboard():
    return render_template(
        "miniproject1dashboard.html"
    )


# ================= STUDY PLANNER =================

@app.route(
    "/studyplan",
    methods=["POST"]
)

def studyplan():

    data = request.json

    subject = data["subject"]
    hours = data["hours"]

    prompt = f"""
Create a {hours}-hour study plan for {subject}

Rules:
- Give only short points
- No paragraphs
- Split by time

Format:

Unit 1 → 45 mins
Unit 2 → 30 mins
Unit 3 → 45 mins
Break → 15 mins
Unit 4 → 30 mins
Revision → 30 mins
"""

    try:

        response = model.generate_content(
            prompt
        )

        if response and hasattr(
            response,
            "text"
        ):

            result = response.text

        else:

            result = (
                "Study plan unavailable"
            )

    except Exception as e:

        result = (
            "Error : " + str(e)
        )

    return jsonify({
        "result": result
    })


# ================= SUMMARY =================

@app.route(
    "/summary",
    methods=["POST"]
)

def summary():

    data = request.json

    topic = data["topic"]

    prompt = f"""
Summarize:

{topic}

Rules:
- Maximum 5 points
- No paragraphs
- Student friendly
"""

    try:

        response = model.generate_content(
            prompt
        )

        if response and hasattr(
            response,
            "text"
        ):

            result = response.text

        else:

            result = (
                "Summary unavailable"
            )

    except Exception as e:

        result = (
            "Error : " + str(e)
        )

    return jsonify({
        "result": result
    })


# ================= CAREER MENTOR =================

@app.route(
    "/career",
    methods=["POST"]
)

def career():

    data = request.json

    career = data["career"]

    prompt = f"""
Give roadmap for:

{career}

Rules:
- Bullet points only
- Maximum 6 steps
- Student friendly
"""

    try:

        response = model.generate_content(
            prompt
        )

        if response and hasattr(
            response,
            "text"
        ):

            result = response.text

        else:

            result = (
                "Roadmap unavailable"
            )

    except Exception as e:

        result = (
            "Error : " + str(e)
        )

    return jsonify({
        "result": result
    })


# ================= ASK AI =================

@app.route(
    "/askai",
    methods=["POST"]
)

def askai():

    data = request.json

    question = data["question"]

    prompt = f"""
Answer shortly:

{question}

Rules:
- Student friendly
- Easy language
- Short answer
"""

    try:

        response = model.generate_content(
            prompt
        )

        if response and hasattr(
            response,
            "text"
        ):

            result = response.text

        else:

            result = (
                "No response"
            )

    except Exception as e:

        result = (
            "Error : " + str(e)
        )

    return jsonify({
        "result": result
    })

    # ================= QUIZ GENERATOR =================

@app.route(
    "/quiz",
    methods=["POST"]
)

def quiz():

    data = request.json

    subject = data["subject"]

    prompt = f"""
Generate 5 quiz questions from:

{subject}

Rules:
- Numbered questions
- Student friendly
- No answers
"""

    try:

        response = model.generate_content(
            prompt
        )

        if response and hasattr(
            response,
            "text"
        ):

            result = response.text

        else:

            result = (
                "Quiz unavailable"
            )

    except Exception as e:

        result = (
            "Error : " + str(e)
        )

    return jsonify({
        "result": result
    })

 #===========interview question===============  
   
@app.route(
    "/interview",
    methods=["POST"]
)
def interview():

    data = request.json

    role = data["role"]

    prompt = f"""
Generate 10 interview questions for:

{role}

Rules:
- Questions only
- Numbered list
- Student friendly
"""

    try:

        response = model.generate_content(prompt)

        result = response.text

    except Exception as e:

        result = "Error : " + str(e)

    return jsonify({
        "result": result
    })

    # ================= FLASHCARDS =================

@app.route(
    "/flashcards",
    methods=["POST"]
)
def flashcards():

    data = request.json

    topic = data["topic"]

    prompt = f"""
Create 5 flashcards for:

{topic}

Format:

Q:
A:

Student friendly
"""

    try:

        response = model.generate_content(
            prompt
        )

        if response and hasattr(
            response,
            "text"
        ):

            result = response.text

        else:

            result = "Flashcards unavailable"

    except Exception as e:

        result = "Error : " + str(e)

    return jsonify({
        "result": result
    })

    # ================= RESUME BUILDER =================

@app.route(
    "/resume",
    methods=["POST"]
)

def resume():

    data = request.json

    name = data["name"]
    skills = data["skills"]
    education = data["education"]
    projects = data["projects"]

    prompt = f"""
Create a professional student resume.

Name:
{name}

Skills:
{skills}

Education:
{education}

Projects:
{projects}

Format:
- Profile Summary
- Skills
- Education
- Projects

Student friendly.
"""

    try:

        response = model.generate_content(
          prompt
       )

        result = response.text

    except Exception as e:

       if "429" in str(e):

        result = "API limit reached. Please wait a minute and try again."

       else:

        result = "Error : " + str(e)

    return jsonify({
       "result": result
})

# ================= RUN =================

if __name__ == "__main__":

    app.run(
        debug=True
    )
    
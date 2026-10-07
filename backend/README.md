# MedExplain – AI Healthcare Information Assistant
## Backend (FastAPI + SQLite + Google Gemini)

### Overview
MedExplain translates complex medical reports, lab results, prescriptions, and healthcare terminology into plain, user-friendly language with strict safety guardrails.

### Architecture
- **Framework**: FastAPI (Python 3.10+)
- **Database**: SQLite (SQLAlchemy ORM)
- **AI Engine**: Google Gemini API (`gemini-3.8-flash`) via `@google/genai`
- **Frontend**: React + Vite + Tailwind CSS

### Core REST Endpoints
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check & database connection status |
| `POST` | `/api/analyze` | Analyzes medical text, simplifies terms, and generates doctor questions |
| `GET` | `/api/history` | Fetches all previous analyses from SQLite |
| `GET` | `/api/history/{id}` | Fetches a single analysis record by ID |
| `DELETE` | `/api/history/{id}` | Deletes an analysis record from SQLite |
| `GET` | `/api/admin/stats` | Aggregated analytics (total analyses, top categories & terms) |

### Setup & Running FastAPI (Local Python Environment)
1. **Install dependencies**:
   ```bash
   pip install -r backend/requirements.txt
   ```

2. **Configure Environment**:
   ```bash
   export GEMINI_API_KEY="your-gemini-api-key"
   ```

3. **Start the FastAPI server**:
   ```bash
   uvicorn backend.main:app --reload --port 8000
   ```

4. **Interactive API Documentation**:
   Visit `http://localhost:8000/docs` for Swagger UI.

### Safety & Guardrails
- **Non-Diagnostic**: Never diagnoses diseases or conditions.
- **No Prescriptions**: Never prescribes drugs or suggests self-medication.
- **Dosage Protection**: Never advises modifying prescribed doses.
- **Doctor-Empowering**: Generates a tailored checklist of questions for the patient's next clinical visit.
- **Disclaimer**: *"This information is for educational purposes only and is not a substitute for professional medical advice."*

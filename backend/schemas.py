from pydantic import BaseModel
from typing import List, Optional

class MedicalTerm(BaseModel):
    term: string = ""
    meaning: string = ""
    clinicalContext: Optional[str] = None
    analogy: Optional[str] = None

class AnalyzeRequest(BaseModel):
    text: str
    explanationLevel: Optional[str] = "simple"
    language: Optional[str] = "English"
    saveToHistory: Optional[bool] = True

class AnalysisResponse(BaseModel):
    id: str
    title: str
    original_text: str
    explanation_level: str
    language: str
    category: str
    simple_explanation: str
    key_information: List[str]
    medical_terms: List[dict]
    doctor_questions: List[str]
    created_at: str

    class Config:
        from_attributes = True

class HealthResponse(BaseModel):
    status: str
    service: str
    database: str
    timestamp: str

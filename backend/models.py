from sqlalchemy import Column, String, Text, DateTime
from datetime import datetime
from backend.database import Base

class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    original_text = Column(Text, nullable=False)
    explanation_level = Column(String, nullable=False, default="simple")
    language = Column(String, nullable=False, default="English")
    category = Column(String, nullable=False, default="General Health")
    simple_explanation = Column(Text, nullable=False)
    key_information = Column(Text, nullable=False)  # JSON-encoded array of strings
    medical_terms = Column(Text, nullable=False)    # JSON-encoded array of term objects
    doctor_questions = Column(Text, nullable=False) # JSON-encoded array of strings
    created_at = Column(String, default=lambda: datetime.utcnow().isoformat())

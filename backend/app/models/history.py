from sqlalchemy import Column, Float, Integer, DateTime, String

from sqlalchemy.dialects.postgresql import JSON
from sqlalchemy.orm import declarative_base
from datetime import datetime

Base = declarative_base()

class ProblemHistory(Base):
    __tablename__ = "history"
    id = Column(Integer, primary_key=True, index=True)
    matrix_json = Column(JSON)
    determinant = Column(Float)
    rank = Column(Integer)
    result_json = Column(JSON)   
    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

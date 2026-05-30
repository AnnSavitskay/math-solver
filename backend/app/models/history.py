from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import DateTime
from sqlalchemy.orm import declarative_base

from datetime import datetime

Base = declarative_base()


class ProblemHistory(Base):

    __tablename__ = "history"

    id = Column(Integer, primary_key=True)

    type = Column(String)

    input_data = Column(String)

    result_data = Column(String)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

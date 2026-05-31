from fastapi import APIRouter	
import numpy as np
from app.database import SessionLocal
from app.models.history import ProblemHistory

router = APIRouter()


@router.post("/matrix")
def matrix(data: dict):

    matrix = np.array(data["matrix"])

    determinant = float(np.linalg.det(matrix))

    rank = int(np.linalg.matrix_rank(matrix))

    inverse = None

    try:
        inverse = (np.linalg.inv(matrix).tolist())

    except np.linalg.LinAlgError:
        inverse = None

    eigenvalues, eigenvectors = np.linalg.eig(matrix)
    
    db = SessionLocal()

    entry = ProblemHistory(
        matrix_json=data["matrix"],
        determinant=determinant,
        rank=rank,
    )

    db.add(entry)

    db.commit()

    db.close()

    return {
        "determinant": determinant,
        "rank": rank,
        "inverse": inverse,
        
	"eigenvalues": eigenvalues.tolist(),

	"eigenvectors": eigenvectors.tolist(),
    }
    
@router.get("/history")
def history():

    db = SessionLocal()

    rows = (
        db.query(ProblemHistory)
        .order_by(
            ProblemHistory.created_at.desc()
        )
        .limit(10)
        .all()
    )

    result = []

    for row in rows:

        result.append(
            {
                "id": row.id,
                "matrix": row.matrix_json,
                "determinant": row.determinant,
                "rank": row.rank,
            }
        )

    db.close()

    return result

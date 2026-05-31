from fastapi import APIRouter
from app.database import SessionLocal
from app.models.history import ProblemHistory
import numpy as np

router = APIRouter()

@router.post("/matrix")
def matrix(data: dict):
    result_matrix = None
    A = np.array(data["matrixA"])
    B = np.array(data.get("matrixB", []))
    operation =data.get("operation","det")
    result = {}
    if operation == "det":
        determinant = float(np.linalg.det(A))
        rank = int(np.linalg.matrix_rank(A))
        result = {"determinant": determinant, "rank": rank}

    elif operation == "inverse":
        result_matrix = (np.linalg.inv(A).tolist())
        determinant = float(np.linalg.det(A))
        rank = int(np.linalg.matrix_rank(A))
        result = {"determinant": determinant, "rank": rank, "inverse": result_matrix}

    elif operation == "transpose":
        result_matrix = (A.T.tolist())
        determinant = float(np.linalg.det(A))
        rank = int(np.linalg.matrix_rank(A))
        result = {"determinant": determinant, "rank": rank, "transpose": result_matrix}

    elif operation == "add":
        result_matrix = (A + B).tolist()
        determinant = float(np.linalg.det(A))
        rank = int(np.linalg.matrix_rank(A))
        result = {"determinant": determinant, "rank": rank, "add": result_matrix}

    elif operation == "multiply":
        result_matrix = (A @ B).tolist()
        determinant = float(np.linalg.det(A))
        rank = int(np.linalg.matrix_rank(A))
        result = {"determinant": determinant, "rank": rank, "multiply": result_matrix}

    elif operation == "eigen":
        eigenvalues, eigenvectors = (np.linalg.eig(A))
        result["eigenvalues"] = (eigenvalues.tolist())
        result_matrix = (eigenvectors.tolist())
        determinant = float(np.linalg.det(A))
        rank = int(np.linalg.matrix_rank(A))
        result = {"determinant": determinant, "rank": rank, "eigenvalues": result["eigenvalues"], "eigenvectors": result_matrix}

    db =SessionLocal()
    entry = ProblemHistory(matrix_json=A.tolist(),determinant=result.get("determinant"),rank=result.get("rank"), result_json = result_matrix)
    db.add(entry)
    db.commit()
    db.close()
    return result
    

@router.get("/history")
def history():
    db = SessionLocal()
    rows = (db.query(ProblemHistory).order_by(ProblemHistory.created_at.desc()).limit(10).all())
    result = []
    for row in rows:
        result.append(
            {
                "id": row.id,
                "matrix": row.matrix_json,
                "result": row.result_json, 
                "determinant": row.determinant,
                "rank": row.rank,
            }
        )
    db.close()
    return result

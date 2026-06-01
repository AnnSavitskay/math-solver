from fastapi import APIRouter
from app.database import SessionLocal
from app.models.history import ProblemHistory
import numpy as np

router = APIRouter()

@router.post("/matrix")
def matrix(data: dict):
    result_matrix = None
    matrix_code = 0
    A = np.array(data["matrixA"])
    B = np.array(data.get("matrixB", []))
    operation =data.get("operation","det")
    result = {}
    if operation == "det":
    	try:
    		determinant = float(np.linalg.det(A))
    	except np.linalg.LinAlgError:
    		determinant = None
    		matrix_code = -4
    	rank = int(np.linalg.matrix_rank(A))
    	result_matrix = A.tolist()
    	result = {"determinant": determinant, "rank": rank, "code": matrix_code}

    elif operation == "inverse":
    	try:
    		result_matrix = (np.linalg.inv(A).tolist())
    	except np.linalg.LinAlgError:
    		matrix_code = -1
    		result_matrix = A.tolist()
    	rank = int(np.linalg.matrix_rank(A))
    	result = {"rank": rank, "inverse": result_matrix, "code": matrix_code}

    elif operation == "transpose":
        result_matrix = (A.T.tolist())
        rank = int(np.linalg.matrix_rank(A))
        result = {"rank": rank, "transpose": result_matrix, "code": matrix_code}

    elif operation == "add":
    	if A.shape[0] != B.shape[0] or A.shape[1] != B.shape[1]:
    		matrix_code = -2
    		result_matrix = A.tolist()
    	else:
    		result_matrix = (A + B).tolist()
    	rank = int(np.linalg.matrix_rank(result_matrix))
    	result = {"rank": rank, "sum": result_matrix, "code": matrix_code}

    elif operation == "multiply":
    	if A.shape[1] != B.shape[0]:
    		matrix_code = -3
    		result_matrix = A.tolist()
    	else:
    		result_matrix = (A @ B).tolist()
    	rank = int(np.linalg.matrix_rank(result_matrix))
    	result = {"rank": rank, "product": result_matrix, "code": matrix_code}

    elif operation == "eigen":
        eigenvalues, eigenvectors = (np.linalg.eig(A))
        result["eigenvalues"] = (eigenvalues.tolist())
        result_matrix = (eigenvectors.tolist())
        rank = int(np.linalg.matrix_rank(result_matrix))
        result = {"rank": rank, "eigenvalues": result["eigenvalues"], "eigenvectors": result_matrix, "code": matrix_code}

    db =SessionLocal()
    entry = ProblemHistory(matrixA_json=A.tolist(), matrixB_json=B.tolist(), code = matrix_code, rank=result.get("rank"), result_json = result_matrix)
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
                "matrixA": row.matrixA_json,
                "matrixB": row.matrixB_json,
                "code": row.code,
                "result": row.result_json, 
                "rank": row.rank,
            }
        )
    db.close()
    return result

#Добавить Жордановы формы
#Пофиксить UI
#пофиксить ошибки

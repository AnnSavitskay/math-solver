from fastapi import APIRouter	
import numpy as np

router = APIRouter()


@router.post("/matrix")
def matrix(data: dict):

    matrix = np.array(data["matrix"])

    determinant = float(
        np.linalg.det(matrix)
    )

    rank = int(
        np.linalg.matrix_rank(matrix)
    )

    return {
        "determinant": determinant,
        "rank": rank,
    }

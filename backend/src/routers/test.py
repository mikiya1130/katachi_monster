"""エンドポイント `/test`"""
from fastapi import APIRouter

from src.schemas import OutReadTest

router = APIRouter()


@router.get("/test")
def read_test() -> any:
    """エンドポイント `/test`

    Returns:
        _type_: _description_
    """
    return OutReadTest(data="Hello World")

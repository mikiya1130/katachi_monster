"""エンドポイント `/test`"""
from fastapi import APIRouter

from src.schemas import InPostTest, OutGetTest

router = APIRouter()


@router.get("/test")
def get_test() -> OutGetTest:
    """エンドポイント `/test`

    Returns:
        OutGetTest: "Hello World"
    """
    return OutGetTest(data="Hello World")


@router.post("/test")
def post_test(data: InPostTest) -> None:
    """エンドポイント `/test`

    Returns:
        _type_: _description_
    """
    print(data)  # noqa: T201

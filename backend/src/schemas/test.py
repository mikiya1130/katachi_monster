"""エンドポイント `/test` の型定義"""
from pydantic import BaseModel


class OutGetTest(BaseModel):
    """get_test 関数の戻り値の型"""

    data: str


class InPostTest(BaseModel):
    """post_test 関数の引数の型"""

    data: str

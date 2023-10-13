"""エンドポイント `/test` の型定義"""
from pydantic import BaseModel


class OutReadTest(BaseModel):
    """read_test 関数の戻り値の型"""

    data: str

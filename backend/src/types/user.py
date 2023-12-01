"""エンドポイント `/user` の型定義"""
from pydantic import BaseModel


class OutPostUser(BaseModel):
    """post_user 関数の戻り値の型"""

    user_token: str

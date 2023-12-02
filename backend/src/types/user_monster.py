"""エンドポイント `/user_monster` の型定義"""
from pydantic import BaseModel, Field


class InPostUserMonster(BaseModel):
    """post_user_monster 関数の引数の型"""

    monster_id: int = Field(ge=1)
    name: str = Field(max_length=10)


class OutPostUserMonster(BaseModel):
    """post_user_monster 関数の戻り値の型"""

    user_monster_id: int = Field(ge=1)  # id >= 1

"""エンドポイント `/monster` の型定義"""
from pydantic import BaseModel, Field


class Monster(BaseModel):
    """base64 モンスター画像"""

    id: int
    base64image: str = Field(pattern=r"^data:image/png;base64,")
    segment: str | None = None


# get_monster 関数の戻り値の型
OutGetMonster = tuple[list[Monster], list[Monster], list[Monster]]

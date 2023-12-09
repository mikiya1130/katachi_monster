"""エンドポイント `/monster` の型定義"""
from pydantic import BaseModel, Field, validator

TypeMonsterIds = tuple[list[int], list[int], list[int]]


class OutGetMonsters(BaseModel):
    """get_monsters 関数の戻り値の型"""

    monster_ids: TypeMonsterIds


class OutGetMonster(BaseModel):
    """get_monster 関数の戻り値の型"""

    id: int = Field(ge=1)  # id >= 1
    base64image: bytes
    segment: str | None = Field(default=None)
    name: str | None = Field(max_length=10)
    gu: int | None = Field(ge=0)  # gu >= 0
    choki: int | None = Field(ge=0)  # choki >= 0
    pa: int | None = Field(ge=0)  # pa >= 0

    @validator("base64image")
    def check_base64image(cls, v: bytes) -> bytes:  # noqa: N805
        """`base64image` が png 画像を base64 エンコードしたものであることを確認"""
        if not v.decode().startswith("data:image/png;base64,"):
            raise TypeError
        return v

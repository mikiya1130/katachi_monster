"""エンドポイント `/monster` の型定義"""
from pydantic import BaseModel, Field, validator


class OutGetMonster(BaseModel):
    """get_monster 関数の戻り値の型"""

    id: int = Field(ge=1)  # id >= 1
    base64image: bytes
    segment: str | None = Field(default=None)

    @validator("base64image")
    def check_base64image(cls, v: bytes) -> bytes:  # noqa: N805
        """`base64image` が png 画像を base64 エンコードしたものであることを確認"""
        if not v.decode().startswith("data:image/png;base64,"):
            raise TypeError
        return v


class OutGetAllMonster(BaseModel):
    """get_all_monster 関数の戻り値の型"""

    monsters: tuple[list[OutGetMonster], list[OutGetMonster], list[OutGetMonster]]
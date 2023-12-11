"""エンドポイント `/silhouette` の型定義"""
from pydantic import BaseModel, Field, validator


class OutGetSilhouette(BaseModel):
    """get_silhouette 関数の戻り値の型"""

    id: int = Field(ge=1)  # id >= 1
    base64image: bytes

    @validator("base64image")
    def check_base64image(cls, v: bytes) -> bytes:  # noqa: N805
        """`base64image` が png 画像を base64 エンコードしたものであることを確認"""
        if not v.decode().startswith("data:image/png;base64,"):
            raise TypeError
        return v


class InPostSilhouette(BaseModel):
    """post_silhouette 関数の引数の型"""

    base64image: bytes

    @validator("base64image")
    def check_base64image(cls, v: bytes) -> bytes:  # noqa: N805
        """`base64image` が png 画像を base64 エンコードしたものであることを確認"""
        if not v.decode().startswith("data:image/png;base64,"):
            raise TypeError
        return v


class OutPostSilhouette(BaseModel):
    """post_silhouette 関数の戻り値の型"""

    picture_id: int = Field(ge=1)  # id >= 1

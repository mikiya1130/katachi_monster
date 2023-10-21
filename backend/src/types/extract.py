"""エンドポイント `/extract` の型定義"""
from pydantic import BaseModel, FilePath, validator


class InPostExtract(BaseModel):
    """post_extract 関数の引数の型"""

    base64image: bytes

    @validator("base64image")
    def check_base64image(cls, v: bytes) -> bytes:  # noqa: N805
        """`base64image` が png 画像を base64 エンコードしたものであることを確認"""
        if not v.decode().startswith("data:image/png;base64,"):
            raise TypeError
        return v


class OutPostExtract(BaseModel):
    """post_extract 関数の戻り値の型"""

    upload_path: FilePath

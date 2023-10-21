"""エンドポイント `/extract` の型定義"""
from pathlib import Path

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

    @validator("upload_path")
    def check_base64image(cls, v: Path) -> Path:  # noqa: N805
        """`upload_path` が `images` ディレクトリ以下を指していることを確認"""
        if not v.is_relative_to("images/pictures/"):
            raise TypeError
        return v

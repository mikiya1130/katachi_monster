"""エンドポイント `/extract` の型定義"""
from pydantic import BaseModel, Field, FilePath


class InPostExtract(BaseModel):
    """post_extract 関数の引数の型"""

    base64image: str = Field(pattern=r"^data:image/png;base64,")


class OutPostExtract(BaseModel):
    """post_extract 関数の戻り値の型"""

    upload_path: FilePath

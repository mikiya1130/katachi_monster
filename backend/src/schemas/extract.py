"""エンドポイント `/extract` の型定義"""
from pydantic import BaseModel, FilePath


class InPostExtract(BaseModel):
    """post_extract 関数の引数の型"""

    file: bytes


class OutPostExtract(BaseModel):
    """post_extract 関数の戻り値の型"""

    upload_path: FilePath

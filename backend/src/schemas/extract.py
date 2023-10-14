"""エンドポイント `/extract` の型定義"""
from pydantic import BaseModel, FilePath


class OutPutExtract(BaseModel):
    """put_extract 関数の戻り値の型"""

    upload_path: FilePath

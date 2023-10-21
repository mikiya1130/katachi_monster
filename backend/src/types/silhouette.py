"""エンドポイント `/silhouette` の型定義"""
from pydantic import BaseModel, Field


class Silhouette(BaseModel):
    """base64 シルエット画像"""

    id: int
    base64image: str = Field(pattern=r"^data:image/png;base64,")

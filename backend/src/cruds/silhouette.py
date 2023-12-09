"""silhouettes テーブルの CRUD 関数"""
from fastapi import HTTPException
from sqlalchemy.orm import Session

from src.models import Silhouette


def read_silhouette(db: Session, silhouette_id: int) -> Silhouette:
    """silhouettes テーブルの指定された id のレコードを取得する"""
    db_silhouette = db.query(Silhouette).filter(Silhouette.id == silhouette_id).first()
    if db_silhouette is None:
        raise HTTPException(status_code=500, detail="Silhouette not found")
    return db_silhouette

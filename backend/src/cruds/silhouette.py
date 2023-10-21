"""silhouettes テーブルの CRUD 関数"""
from sqlalchemy.orm import Session

from src import models, schemas


def read_silhouette(db: Session, silhouette_id: int) -> schemas.Silhouette:
    """silhouettes テーブルの指定された id のレコードを取得する"""
    return (
        db.query(models.Silhouette)  # type: ignore
        .filter(models.Silhouette.id == silhouette_id)
        .first()
    )

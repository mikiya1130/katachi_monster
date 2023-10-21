"""silhouettes テーブルの CRUD 関数"""
from sqlalchemy.orm import Session

from src.models import Silhouette


def read_silhouette(db: Session, silhouette_id: int) -> Silhouette:
    """silhouettes テーブルの指定された id のレコードを取得する"""
    return (
        db.query(Silhouette)  # type: ignore
        .filter(Silhouette.id == silhouette_id)
        .first()
    )

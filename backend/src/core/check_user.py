"""ユーザーの存在を確認する"""
from fastapi import HTTPException
from sqlalchemy.orm import Session

from src.cruds import read_user


def check_user(db: Session, user_token: str | None) -> int:
    """ユーザーの存在を確認する

    Args:
        db (Session): DB.
        user_token (str|None): user token.

    Returns:
        int: user id
    """
    if user_token is None:
        raise HTTPException(status_code=500, detail="User not found")

    db_user = read_user(db=db, user_token=user_token)

    return db_user.id

"""Rembg による物体抽出"""
from collections.abc import AsyncGenerator, Callable

from fastapi import FastAPI
from rembg import new_session, remove


class Rembg:
    """Rembg による物体抽出"""

    session = None

    @classmethod
    def lifespan(
        cls,
        model_name: str,
    ) -> Callable[[FastAPI], AsyncGenerator[None, None]]:
        """session の初期化(FastAPI 用の lifespan 関数)

        Args:
            model_name (str): 使用モデル名

        Returns:
            Callable[[FastAPI], AsyncGenerator[None, None]]: lifespan 関数
        """

        async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:  # noqa: ARG001
            cls.session = new_session(model_name)
            yield
            del cls.session

        return lifespan

    @classmethod
    def extract(cls, file: bytes) -> bytes:
        """物体抽出の実行

        Args:
            file (bytes): 対象画像の bytes データ

        Returns:
            bytes: 抽出画像の bytes データ
        """
        result: bytes = remove(file, session=cls.session)
        return result

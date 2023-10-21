"""メインファイル"""
from pathlib import Path

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from src.core import Rembg
from src.routers import extract, monster, silhouette

app = FastAPI(lifespan=Rembg.lifespan("isnet-general-use"))  # type: ignore
app.include_router(extract.router)
app.include_router(monster.router)
app.include_router(silhouette.router)
Path("images/pictures").mkdir(parents=True, exist_ok=True)
app.mount("/images", StaticFiles(directory="images"), name="images")

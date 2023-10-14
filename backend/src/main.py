"""メインファイル"""
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from src.core import Rembg
from src.routers import extract, test

app = FastAPI(lifespan=Rembg.lifespan("isnet-general-use"))  # type: ignore
app.include_router(extract.router)
app.include_router(test.router)
app.mount("/images", StaticFiles(directory="images"), name="images")

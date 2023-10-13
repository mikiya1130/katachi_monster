from fastapi import FastAPI
from fastapi.responses import PlainTextResponse

app = FastAPI()


@app.get("/test")
def main():
    return {"data": "Hello World"}

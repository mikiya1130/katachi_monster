from fastapi import FastAPI
from fastapi.responses import PlainTextResponse

app = FastAPI()

@app.get("/test")
def read_root():
    return {"data": "Hello World"}

from fastapi import FastAPI, File, UploadFile, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

from .config import ALLOWED_ORIGINS
from .openai_vision import predict_locations
from .exif_utils import write_gps
import tempfile

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/ping")
async def ping():
    return {"status": "ok"}


@app.post("/geotag")
async def geotag(file: UploadFile = File(...)):
    if file.content_type != "image/jpeg":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only JPEG images are supported",
        )

    data = await file.read()
    if len(data) > 10 * 1024 * 1024:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File too large (max 10MB)",
        )

    with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp:
        tmp.write(data)
        tmp_path = tmp.name

    candidates = predict_locations(tmp_path)
    if not candidates:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail="OpenAI vision failure")

    best = candidates[0]
    write_gps(tmp_path, best["latitude"], best["longitude"])

    headers = {"X-OpenAI-Confidence": str(best.get("confidence_pct"))}
    return StreamingResponse(open(tmp_path, "rb"), media_type="image/jpeg", headers=headers)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("backend.main:app", reload=True)

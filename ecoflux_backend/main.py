from fastapi import FastAPI
from fastapi.responses import Response
from app.api.routes.simulation import router

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="EcoFlux API",
    version="1.0"
)

# Add CORS middleware to allow requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins (update in production)
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, OPTIONS, etc.)
    allow_headers=["*"],  # Allows all headers
)

app.include_router(router)

@app.get("/health")
def health():
    return {"status": "running"}

@app.get("/favicon.ico", include_in_schema=False)
def favicon():
    return Response(status_code=204)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

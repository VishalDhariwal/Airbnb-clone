from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers.auth import router as auth_router
from app.routers.bookings import router as bookings_router
from app.routers.host import router as host_router
from app.routers.listings import router as listings_router
from app.routers.metadata import router as metadata_router
from app.routers.reviews import router as reviews_router
from app.routers.wishlist import router as wishlist_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Ensures database tables exist and seeds data on startup if empty.
    Crucial for ephemeral instances like Render free tier.
    """
    from app.database import Base, engine, SessionLocal
    from app.models import Listing
    from app.seed.seed import run_seed

    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if db.query(Listing).count() == 0:
            print("Database empty on startup. Running seed...")
            run_seed(reset=False)
    finally:
        db.close()
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    docs_url="/docs",
    openapi_url="/openapi.json",
    lifespan=lifespan,
)

# CORS configuration supporting localhost, Vercel deployments, and custom origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API routers under /api
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(bookings_router, prefix=settings.API_V1_STR)
app.include_router(host_router, prefix=settings.API_V1_STR)
app.include_router(listings_router, prefix=settings.API_V1_STR)
app.include_router(reviews_router, prefix=settings.API_V1_STR)
app.include_router(wishlist_router, prefix=settings.API_V1_STR)
app.include_router(metadata_router, prefix=settings.API_V1_STR)


@app.get("/api/health", tags=["Health"])
async def health_check():
    """Health check endpoint to verify backend service status."""
    return {
        "status": "ok",
        "app": settings.PROJECT_NAME,
        "api_version": "v1",
    }

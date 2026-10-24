from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.endpoints.projects import router as projects_router
from app.api.endpoints.matching import router as matching_router
from app.api.v1.api import api_router


def create_application() -> FastAPI:
    application = FastAPI(
        title=settings.PROJECT_NAME,
        version=settings.VERSION,
        openapi_url="/api/openapi.json",
        docs_url="/docs",
        redoc_url="/redoc",
    )

    # Configure CORS middleware explicitly allowing frontend at http://localhost:3000
    origins = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ]
    if settings.BACKEND_CORS_ORIGINS:
        for orig in settings.BACKEND_CORS_ORIGINS:
            if orig not in origins:
                origins.append(orig)

    application.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Core Endpoints required:
    # 1. GET /api/projects (with course_code filter)
    application.include_router(projects_router, prefix="/api/projects", tags=["Projects"])

    # 2. POST /api/match (AI matching with Gemini)
    application.include_router(matching_router, prefix="/api/match", tags=["AI Matching"])

    # Backwards compatibility & modular endpoints
    application.include_router(api_router, prefix="/api/v1")

    @application.get("/health", tags=["Health"])
    async def health_check():
        return {
            "status": "healthy",
            "service": settings.PROJECT_NAME,
            "version": settings.VERSION,
            "cors_origins": origins,
        }

    return application


app = create_application()

from fastapi_users.authentication import AuthenticationBackend, BearerTransport, JWTStrategy
from app.core.config import settings

bearer_transport = BearerTransport(tokenUrl="/api/v1/auth/jwt/login")
SECRET = settings.SECRET_KEY

def get_jwt_strategy() -> JWTStrategy:
    return JWTStrategy(secret=SECRET, lifetime_seconds=3600)

auth_backend = AuthenticationBackend(
    name="jwt",
    transport=bearer_transport,
    get_strategy=get_jwt_strategy,
)
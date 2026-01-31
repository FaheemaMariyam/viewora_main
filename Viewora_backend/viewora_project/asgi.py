import os
import django
from django.core.asgi import get_asgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "viewora_project.settings")

# Initialise Django ASGI application first to load apps/models
django_asgi_app = get_asgi_application()

# Import routing/middleware AFTER django_asgi_app
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import OriginValidator

import chat.routing
from authentication.middleware import JWTAuthMiddleware

# Explicit list of allowed origins for the WebSocket handshake
# This is more reliable than AllowedHostsOriginValidator for cross-domain Vercel connections
ALLOWED_WEBSOCKET_ORIGINS = [
    "https://viewora-pi.vercel.app",
    "http://localhost:5173",
    "https://viewora.duckdns.org",
    "http://viewora.duckdns.org",
]

application = ProtocolTypeRouter(
    {
        "http": django_asgi_app,
        "websocket": OriginValidator(
            JWTAuthMiddleware(
                URLRouter(chat.routing.websocket_urlpatterns)
            ),
            ALLOWED_WEBSOCKET_ORIGINS
        ),
    }
)

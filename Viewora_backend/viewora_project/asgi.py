import os
import django
from django.core.asgi import get_asgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "viewora_project.settings")

# Initialise Django ASGI application first to load apps/models
django_asgi_app = get_asgi_application()

# Import routing/middleware AFTER django_asgi_app
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator

import chat.routing
from authentication.middleware import JWTAuthMiddleware

application = ProtocolTypeRouter(
    {
        "http": django_asgi_app,
        "websocket": AllowedHostsOriginValidator(
            JWTAuthMiddleware(
                URLRouter(chat.routing.websocket_urlpatterns)
            )
        ),
    }
)

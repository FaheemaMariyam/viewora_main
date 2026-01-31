from asgiref.sync import sync_to_async
from channels.middleware import BaseMiddleware
from django.contrib.auth.models import AnonymousUser, User
from django.db import close_old_connections
import jwt
from django.conf import settings

class JWTAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        # Close old connections to prevent 'InterfaceError: connection already closed'
        close_old_connections()
        
        # Manually parse cookies for maximal reliability in ASGI
        headers = dict(scope.get("headers", []))
        cookie_header = headers.get(b"cookie", b"").decode()
        
        token = None
        if cookie_header:
            cookies = {
                c.split("=")[0].strip(): c.split("=")[1].strip()
                for c in cookie_header.split(";")
                if "=" in c
            }
            token = cookies.get("access")

        if token:
            scope["user"] = await self.get_user_from_token(token)
        else:
            scope["user"] = AnonymousUser()

        return await super().__call__(scope, receive, send)

    @sync_to_async
    def get_user_from_token(self, token):
        try:
            # Manually decode to avoid any SimpleJWT request context issues
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            user_id = payload.get("user_id")
            if user_id:
                return User.objects.get(id=user_id)
        except Exception as e:
            print(f"WS AUTH DECODE ERROR: {e}")
            pass
        return AnonymousUser()

from django.contrib.auth.models import AnonymousUser
from rest_framework.exceptions import AuthenticationFailed  # exception raise
from rest_framework_simplejwt.authentication import (  # Token validation,Token decoding,User fetching
    JWTAuthentication,
)


class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        # 1. Try to get token from cookies
        raw_token = request.COOKIES.get("access")

        # 2. If cookie exists, validate it
        if raw_token:
            try:
                validated_token = self.get_validated_token(raw_token)
                user = self.get_user(validated_token)
                return (user, validated_token)
            except AuthenticationFailed:
                return (AnonymousUser(), None)

        # 3. FALLBACK for iPhone/Safari: Check Authorization header
        # Standard JWTAuthentication looks for "Authorization: Bearer <token>"
        return super().authenticate(request)

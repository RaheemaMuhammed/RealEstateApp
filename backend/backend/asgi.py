"""
ASGI config for backend project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

application = get_asgi_application()

from django.core.asgi import get_asgi_application
django_asgi_app = get_asgi_application()
import os
from channels.routing import ProtocolTypeRouter, URLRouter
from property.routing import websocket_urlpatterns
from channels.security.websocket import AllowedHostsOriginValidator
from property.token_auth import JwtAuthMiddlewareStack
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')


application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket":AllowedHostsOriginValidator(
        JwtAuthMiddlewareStack(
        URLRouter(
            websocket_urlpatterns
        )
    )
    ) ,
})
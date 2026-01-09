"""
ASGI config for heal_io_ai project.
"""

import os

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'heal_io_ai.settings')

application = get_asgi_application()

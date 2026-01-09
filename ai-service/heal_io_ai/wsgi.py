"""
WSGI config for heal_io_ai project.
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'heal_io_ai.settings')

application = get_wsgi_application()

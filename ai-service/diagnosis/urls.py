"""
URL configuration for diagnosis app
"""

from django.urls import path
from . import views

urlpatterns = [
    path('health', views.health_check, name='health_check'),
    path('analyze/image', views.analyze_image, name='analyze_image'),
    path('analyze/symptoms', views.analyze_symptoms, name='analyze_symptoms'),
    path('analyze/combined', views.analyze_combined, name='analyze_combined'),
]

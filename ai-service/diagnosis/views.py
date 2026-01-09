"""
API views for diagnosis endpoints
"""

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
import os
import traceback
import logging

from .ml_service import MockMLService
from .utils import (
    validate_image,
    save_uploaded_image,
    generate_gradcam_heatmap,
    preprocess_image
)

# Configure logger
logger = logging.getLogger(__name__)

# Initialize ML service
ml_service = MockMLService()


@api_view(['GET'])
def health_check(request):
    """
    Health check endpoint for service monitoring
    """
    return Response({
        'status': 'healthy',
        'service': 'Heal-Io AI Service',
        'version': '1.0.0'
    })


@api_view(['POST'])
def analyze_image(request):
    """
    Analyze skin lesion from uploaded image
    
    Expected input:
    - image: Image file (JPEG or PNG, max 10MB)
    
    Returns:
    - Diagnosis results with confidence scores
    - Heatmap path for visualization
    """
    try:
        # Check if image was uploaded
        if 'image' not in request.FILES:
            return Response({
                'error': 'No image file provided'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        image_file = request.FILES['image']
        
        # Validate image
        try:
            validate_image(image_file)
        except ValueError as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Save uploaded image
        image_path = save_uploaded_image(image_file)
        
        # Preprocess image (validate it can be processed)
        try:
            preprocess_image(image_path)
        except ValueError as e:
            return Response({
                'error': f'Image preprocessing failed: {str(e)}'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Generate Grad-CAM heatmap
        try:
            heatmap_path = generate_gradcam_heatmap(image_path)
        except Exception as e:
            # Heatmap generation failure shouldn't stop diagnosis
            heatmap_path = None
            logger.error(f'Heatmap generation failed: {str(e)}', exc_info=True)
        
        # Perform ML analysis
        results = ml_service.analyze_image(image_path)
        
        # Add image paths to results
        results['image_path'] = os.path.join('uploads', os.path.basename(image_path))
        results['heatmap_path'] = heatmap_path
        
        return Response({
            'success': True,
            'diagnosis': results
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f'Error in analyze_image: {str(e)}', exc_info=True)
        return Response({
            'error': 'Internal server error during image analysis',
            'details': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def analyze_symptoms(request):
    """
    Analyze based on symptom questionnaire responses
    
    Expected input (JSON):
    - symptoms: Dictionary of symptom data
    
    Example:
    {
        "symptoms": {
            "lesion_color": "dark brown",
            "lesion_shape": "irregular",
            "size_change": "growing",
            "bleeding": "yes",
            "itching": "no"
        }
    }
    
    Returns:
    - Diagnosis results based on symptoms
    """
    try:
        # Get symptoms data
        symptoms_data = request.data.get('symptoms', {})
        
        if not symptoms_data:
            return Response({
                'error': 'No symptom data provided'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Perform symptom-based analysis
        results = ml_service.analyze_symptoms(symptoms_data)
        
        return Response({
            'success': True,
            'diagnosis': results
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f'Error in analyze_symptoms: {str(e)}', exc_info=True)
        return Response({
            'error': 'Internal server error during symptom analysis',
            'details': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def analyze_combined(request):
    """
    Perform combined analysis using both image and symptoms
    This provides the highest accuracy
    
    Expected input:
    - image: Image file
    - symptoms: JSON string or form data with symptom information
    
    Returns:
    - Comprehensive diagnosis with highest confidence
    """
    try:
        # Check if image was uploaded
        if 'image' not in request.FILES:
            return Response({
                'error': 'No image file provided'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        image_file = request.FILES['image']
        
        # Get symptoms data
        # Handle both JSON and form data
        symptoms_data = {}
        if 'symptoms' in request.data:
            import json
            symptoms_raw = request.data['symptoms']
            if isinstance(symptoms_raw, str):
                symptoms_data = json.loads(symptoms_raw)
            else:
                symptoms_data = symptoms_raw
        
        if not symptoms_data:
            return Response({
                'error': 'No symptom data provided'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Validate image
        try:
            validate_image(image_file)
        except ValueError as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Save uploaded image
        image_path = save_uploaded_image(image_file)
        
        # Preprocess image
        try:
            preprocess_image(image_path)
        except ValueError as e:
            return Response({
                'error': f'Image preprocessing failed: {str(e)}'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Generate Grad-CAM heatmap
        try:
            heatmap_path = generate_gradcam_heatmap(image_path)
        except Exception as e:
            heatmap_path = None
            logger.error(f'Heatmap generation failed: {str(e)}', exc_info=True)
        
        # Perform combined analysis
        results = ml_service.analyze_combined(image_path, symptoms_data)
        
        # Add image paths to results
        results['image_path'] = os.path.join('uploads', os.path.basename(image_path))
        results['heatmap_path'] = heatmap_path
        
        return Response({
            'success': True,
            'diagnosis': results
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f'Error in analyze_combined: {str(e)}', exc_info=True)
        return Response({
            'error': 'Internal server error during combined analysis',
            'details': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

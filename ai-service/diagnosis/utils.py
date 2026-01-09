"""
Utility functions for image processing and heatmap generation
"""

import os
import cv2
import numpy as np
from PIL import Image
from django.conf import settings


def preprocess_image(image_path: str, target_size: tuple = (224, 224)) -> np.ndarray:
    """
    Preprocess image for model input
    
    Args:
        image_path: Path to the image file
        target_size: Target size for resizing
        
    Returns:
        Preprocessed image as numpy array
    """
    try:
        # Load image
        img = Image.open(image_path)
        
        # Convert to RGB if needed
        if img.mode != 'RGB':
            img = img.convert('RGB')
        
        # Resize
        img = img.resize(target_size, Image.LANCZOS)
        
        # Convert to numpy array and normalize
        img_array = np.array(img, dtype=np.float32) / 255.0
        
        return img_array
    except Exception as e:
        raise ValueError(f"Error preprocessing image: {str(e)}")


def generate_gradcam_heatmap(image_path: str) -> str:
    """
    Generate a mock Grad-CAM heatmap for explainable AI
    In production, this would use actual gradient computation from the CNN
    
    Args:
        image_path: Path to the original image
        
    Returns:
        Path to the generated heatmap image
    """
    try:
        # Load original image
        img = cv2.imread(image_path)
        if img is None:
            raise ValueError("Could not read image")
        
        # Get image dimensions
        height, width = img.shape[:2]
        
        # Create a mock heatmap (in production, this would be actual Grad-CAM)
        # Generate a random focal point
        center_x = int(width * np.random.uniform(0.3, 0.7))
        center_y = int(height * np.random.uniform(0.3, 0.7))
        
        # Create gaussian-like heatmap
        y, x = np.ogrid[:height, :width]
        sigma_x = width * 0.15
        sigma_y = height * 0.15
        
        heatmap = np.exp(-((x - center_x)**2 / (2 * sigma_x**2) + 
                          (y - center_y)**2 / (2 * sigma_y**2)))
        
        # Normalize to 0-255
        heatmap = (heatmap * 255).astype(np.uint8)
        
        # Apply colormap (JET for medical visualization)
        heatmap_colored = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)
        
        # Overlay on original image
        overlay = cv2.addWeighted(img, 0.6, heatmap_colored, 0.4, 0)
        
        # Save heatmap
        filename = os.path.basename(image_path)
        name, ext = os.path.splitext(filename)
        heatmap_filename = f"{name}_heatmap{ext}"
        heatmap_path = os.path.join(settings.HEATMAP_PATH, heatmap_filename)
        
        cv2.imwrite(heatmap_path, overlay)
        
        # Return relative path for URL generation
        return os.path.join('heatmaps', heatmap_filename)
        
    except Exception as e:
        raise ValueError(f"Error generating heatmap: {str(e)}")


def generate_attention_map(image_path: str) -> str:
    """
    Generate an attention map showing areas of interest
    Similar to Grad-CAM but focuses on feature attention
    
    Args:
        image_path: Path to the original image
        
    Returns:
        Path to the generated attention map
    """
    try:
        # Load image
        img = cv2.imread(image_path)
        if img is None:
            raise ValueError("Could not read image")
        
        # Convert to grayscale for edge detection
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        # Apply edge detection to simulate attention to boundaries
        edges = cv2.Canny(gray, 50, 150)
        
        # Dilate edges to make them more visible
        kernel = np.ones((5, 5), np.uint8)
        edges_dilated = cv2.dilate(edges, kernel, iterations=2)
        
        # Create attention map
        attention = cv2.applyColorMap(edges_dilated, cv2.COLORMAP_HOT)
        
        # Overlay on original
        result = cv2.addWeighted(img, 0.7, attention, 0.3, 0)
        
        # Save attention map
        filename = os.path.basename(image_path)
        name, ext = os.path.splitext(filename)
        attention_filename = f"{name}_attention{ext}"
        attention_path = os.path.join(settings.HEATMAP_PATH, attention_filename)
        
        cv2.imwrite(attention_path, result)
        
        return os.path.join('heatmaps', attention_filename)
        
    except Exception as e:
        raise ValueError(f"Error generating attention map: {str(e)}")


def validate_image(image_file) -> bool:
    """
    Validate uploaded image file
    
    Args:
        image_file: Uploaded file object
        
    Returns:
        True if valid, raises ValueError otherwise
    """
    # Check file size (max 10MB)
    if image_file.size > 10 * 1024 * 1024:
        raise ValueError("Image file too large. Maximum size is 10MB.")
    
    # Check file type
    allowed_types = ['image/jpeg', 'image/jpg', 'image/png']
    if image_file.content_type not in allowed_types:
        raise ValueError("Invalid file type. Only JPEG and PNG are allowed.")
    
    # Try to open as image
    try:
        img = Image.open(image_file)
        img.verify()
        return True
    except Exception:
        raise ValueError("Invalid image file. File may be corrupted.")


def save_uploaded_image(image_file) -> str:
    """
    Save uploaded image to disk
    
    Args:
        image_file: Uploaded file object
        
    Returns:
        Path to saved image
    """
    import uuid
    from django.core.files.storage import default_storage
    
    # Generate unique filename
    ext = os.path.splitext(image_file.name)[1]
    filename = f"{uuid.uuid4()}{ext}"
    filepath = os.path.join('uploads', filename)
    
    # Save file
    full_path = default_storage.save(filepath, image_file)
    
    return os.path.join(settings.MEDIA_ROOT, full_path)

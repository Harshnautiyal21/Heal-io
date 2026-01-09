"""
Mock ML Service for Heal-Io AI
This simulates CNN ensemble, U-Net segmentation, and decision trees
In production, this would use real trained models
"""

import random
import numpy as np
from typing import Dict, List, Tuple


class MockMLService:
    """
    Mock machine learning service that simulates:
    - CNN ensemble for image classification
    - U-Net for lesion segmentation
    - Decision tree for symptom-based diagnosis
    """
    
    DISEASES = [
        {
            'name': 'Melanoma',
            'description': 'A serious form of skin cancer that develops in melanocytes. Early detection is critical.',
            'severity': 'high',
            'keywords': ['dark', 'irregular', 'asymmetric', 'growing', 'bleeding']
        },
        {
            'name': 'Basal Cell Carcinoma',
            'description': 'The most common type of skin cancer. Usually slow-growing and highly treatable.',
            'severity': 'medium',
            'keywords': ['pearly', 'bump', 'bleeding', 'scaly', 'non-healing']
        },
        {
            'name': 'Nevus',
            'description': 'A benign mole. Usually harmless but should be monitored for changes.',
            'severity': 'low',
            'keywords': ['brown', 'round', 'symmetrical', 'stable', 'uniform']
        },
        {
            'name': 'Seborrheic Keratosis',
            'description': 'A common benign skin growth that appears with age. Not cancerous.',
            'severity': 'low',
            'keywords': ['waxy', 'stuck-on', 'brown', 'raised', 'rough']
        },
        {
            'name': 'Actinic Keratosis',
            'description': 'A precancerous skin lesion caused by sun damage. Should be treated to prevent cancer.',
            'severity': 'medium',
            'keywords': ['scaly', 'rough', 'red', 'sun-exposed', 'crusty']
        },
        {
            'name': 'Dermatofibroma',
            'description': 'A common benign skin nodule. Usually harmless and requires no treatment.',
            'severity': 'low',
            'keywords': ['firm', 'nodule', 'dimple', 'brown', 'leg']
        }
    ]
    
    def __init__(self):
        """Initialize the mock ML service"""
        random.seed()
    
    def analyze_image(self, image_path: str) -> Dict:
        """
        Simulate CNN ensemble analysis of skin lesion image
        
        Args:
            image_path: Path to the uploaded image
            
        Returns:
            Dictionary containing diagnosis results
        """
        # Simulate processing time and select a disease
        primary_disease = random.choice(self.DISEASES)
        confidence = random.uniform(0.70, 0.98)
        
        # Generate alternative diagnoses
        alternatives = self._generate_alternatives(primary_disease, confidence)
        
        # Generate clinical explanation
        explanation = self._generate_explanation(primary_disease, confidence, 'image')
        
        # Generate recommendations
        recommendations = self._generate_recommendations(primary_disease)
        
        return {
            'disease': primary_disease['name'],
            'confidence': round(confidence, 3),
            'severity': primary_disease['severity'],
            'description': primary_disease['description'],
            'explanation': explanation,
            'alternative_diagnoses': alternatives,
            'recommendations': recommendations,
            'analysis_method': 'CNN Ensemble (ResNet50 + DenseNet121 + EfficientNet-B0)'
        }
    
    def analyze_symptoms(self, symptoms_data: Dict) -> Dict:
        """
        Simulate decision tree analysis based on symptoms
        
        Args:
            symptoms_data: Dictionary containing symptom information
            
        Returns:
            Dictionary containing diagnosis results
        """
        # Extract symptom keywords
        symptoms_text = ' '.join(str(v).lower() for v in symptoms_data.values())
        
        # Find best matching disease based on keywords
        best_match = None
        best_score = 0
        
        for disease in self.DISEASES:
            score = sum(1 for keyword in disease['keywords'] if keyword in symptoms_text)
            if score > best_score:
                best_score = score
                best_match = disease
        
        if not best_match:
            best_match = random.choice(self.DISEASES)
        
        # Lower confidence for symptom-only diagnosis
        confidence = random.uniform(0.60, 0.85)
        
        # Generate alternative diagnoses
        alternatives = self._generate_alternatives(best_match, confidence)
        
        # Generate clinical explanation
        explanation = self._generate_explanation(best_match, confidence, 'symptoms')
        
        # Generate recommendations
        recommendations = self._generate_recommendations(best_match)
        
        return {
            'disease': best_match['name'],
            'confidence': round(confidence, 3),
            'severity': best_match['severity'],
            'description': best_match['description'],
            'explanation': explanation,
            'alternative_diagnoses': alternatives,
            'recommendations': recommendations,
            'analysis_method': 'Symptom Decision Tree with Clinical Rules',
            'matched_symptoms': symptoms_data
        }
    
    def analyze_combined(self, image_path: str, symptoms_data: Dict) -> Dict:
        """
        Simulate combined analysis using both image and symptoms
        Highest accuracy method
        
        Args:
            image_path: Path to the uploaded image
            symptoms_data: Dictionary containing symptom information
            
        Returns:
            Dictionary containing diagnosis results
        """
        # Get both analyses
        image_result = self.analyze_image(image_path)
        symptom_result = self.analyze_symptoms(symptoms_data)
        
        # Combine results with weighted confidence (image has more weight)
        if image_result['disease'] == symptom_result['disease']:
            # Both agree - higher confidence
            confidence = min(0.98, (image_result['confidence'] * 0.7 + symptom_result['confidence'] * 0.3) * 1.1)
            final_disease = self.DISEASES[[d['name'] for d in self.DISEASES].index(image_result['disease'])]
        else:
            # Disagree - use image result but lower confidence
            confidence = image_result['confidence'] * 0.9
            final_disease = self.DISEASES[[d['name'] for d in self.DISEASES].index(image_result['disease'])]
        
        # Generate alternative diagnoses
        alternatives = self._generate_alternatives(final_disease, confidence)
        
        # Generate enhanced explanation for combined analysis
        explanation = self._generate_explanation(final_disease, confidence, 'combined', 
                                                 image_result['disease'], symptom_result['disease'])
        
        # Generate recommendations
        recommendations = self._generate_recommendations(final_disease)
        
        return {
            'disease': final_disease['name'],
            'confidence': round(confidence, 3),
            'severity': final_disease['severity'],
            'description': final_disease['description'],
            'explanation': explanation,
            'alternative_diagnoses': alternatives,
            'recommendations': recommendations,
            'analysis_method': 'Combined CNN Ensemble + Symptom Analysis',
            'image_analysis': image_result['disease'],
            'symptom_analysis': symptom_result['disease'],
            'matched_symptoms': symptoms_data
        }
    
    def _generate_alternatives(self, primary_disease: Dict, primary_confidence: float) -> List[Dict]:
        """Generate alternative diagnoses with confidence scores"""
        alternatives = []
        remaining_diseases = [d for d in self.DISEASES if d['name'] != primary_disease['name']]
        
        # Select 2-3 alternatives
        num_alternatives = random.randint(2, 3)
        selected = random.sample(remaining_diseases, min(num_alternatives, len(remaining_diseases)))
        
        remaining_confidence = 1.0 - primary_confidence
        for i, disease in enumerate(selected):
            # Distribute remaining confidence among alternatives
            conf = remaining_confidence * random.uniform(0.2, 0.5)
            remaining_confidence -= conf
            
            alternatives.append({
                'disease': disease['name'],
                'confidence': round(conf, 3),
                'description': disease['description']
            })
        
        return sorted(alternatives, key=lambda x: x['confidence'], reverse=True)
    
    def _generate_explanation(self, disease: Dict, confidence: float, method: str, 
                             image_diagnosis: str = None, symptom_diagnosis: str = None) -> str:
        """Generate clinical explanation based on the analysis"""
        
        severity_text = {
            'high': 'This is a serious condition requiring immediate medical attention.',
            'medium': 'This condition should be evaluated by a dermatologist.',
            'low': 'This appears to be a benign condition, but monitoring is recommended.'
        }
        
        confidence_text = ""
        if confidence >= 0.90:
            confidence_text = "The analysis shows high confidence in this diagnosis."
        elif confidence >= 0.75:
            confidence_text = "The analysis shows good confidence in this diagnosis."
        else:
            confidence_text = "The analysis shows moderate confidence. Further examination is recommended."
        
        method_text = {
            'image': 'Based on visual analysis of the skin lesion using deep learning models.',
            'symptoms': 'Based on the reported symptoms and clinical decision trees.',
            'combined': 'Based on comprehensive analysis combining visual features and reported symptoms.'
        }
        
        explanation = f"{confidence_text} {severity_text[disease['severity']]} {method_text[method]}"
        
        if method == 'combined' and image_diagnosis and symptom_diagnosis:
            if image_diagnosis == symptom_diagnosis:
                explanation += f" Both image and symptom analysis agree on {disease['name']}, increasing diagnostic confidence."
            else:
                explanation += f" Image analysis suggested {image_diagnosis} while symptoms indicated {symptom_diagnosis}. The final diagnosis weighs visual features more heavily."
        
        return explanation
    
    def _generate_recommendations(self, disease: Dict) -> List[str]:
        """Generate clinical recommendations based on diagnosis"""
        
        common_recommendations = [
            "Document the lesion with photographs for comparison over time",
            "Avoid excessive sun exposure and use broad-spectrum SPF 30+ sunscreen",
            "Perform regular skin self-examinations",
        ]
        
        severity_specific = {
            'high': [
                "⚠️ Seek immediate consultation with a dermatologist",
                "Consider a biopsy for definitive diagnosis",
                "Do not delay treatment - early intervention is critical",
                "Bring all relevant medical history to your appointment"
            ],
            'medium': [
                "Schedule an appointment with a dermatologist within 2-4 weeks",
                "Monitor for changes in size, color, or symptoms",
                "Consider a professional skin examination",
                "Follow up regularly as advised by your healthcare provider"
            ],
            'low': [
                "Schedule a routine dermatology check-up",
                "Monitor for any changes in appearance",
                "Continue regular skin cancer screening",
                "No immediate treatment typically required, but maintain observation"
            ]
        }
        
        return severity_specific[disease['severity']] + common_recommendations

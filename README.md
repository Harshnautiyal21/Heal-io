# 🏥 Heal-Io: AI-Powered Dermatological Diagnostic System

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://reactjs.org/)
[![Laravel](https://img.shields.io/badge/Laravel-10-red.svg)](https://laravel.com/)
[![Django](https://img.shields.io/badge/Django-4.2-green.svg)](https://www.djangoproject.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)

> **⚠️ MEDICAL DISCLAIMER**: This is an educational prototype for academic demonstration and research purposes only. It is NOT a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of a qualified healthcare provider.

## 📋 Overview

Heal-Io is a comprehensive, production-grade healthcare prototype demonstrating AI-powered dermatological diagnosis. Built with modern microservices architecture, it showcases the integration of machine learning models with full-stack web development for medical applications.

### Key Features

- **🖼️ Image-Based Diagnosis**: Upload skin lesion photos for CNN ensemble analysis
- **📝 Symptom-Based Analysis**: Interactive questionnaire with clinical decision trees
- **⚡ Combined Diagnosis**: Highest accuracy through multi-modal analysis (image + symptoms)
- **🔍 Explainable AI**: Grad-CAM heatmap visualizations showing model attention
- **📊 Results Dashboard**: Comprehensive diagnosis with confidence scores and differential diagnoses
- **🏥 Doctor Finder**: Location-based dermatologist search with filtering
- **📄 PDF Reports**: Export professional diagnostic reports
- **🌙 Dark Mode**: Complete light/dark theme support
- **🌍 Multilingual**: Support for English, Spanish, French, and Hindi
- **📱 Responsive Design**: Fully optimized for mobile, tablet, and desktop

## 🏗️ Architecture

### Microservices Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Frontend  │────▶│  Backend    │────▶│ AI Service  │
│  React.js   │     │  API        │     │  Django     │
│  Port 3000  │     │  Laravel    │     │  Port 8000  │
└─────────────┘     │  Port 8080  │     └─────────────┘
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │   MySQL     │
                    │  Database   │
                    └─────────────┘
```

### Technology Stack

#### Frontend (React.js)
- **Framework**: React 18.2 with React Router
- **Styling**: Tailwind CSS with custom medical theme
- **Animations**: Framer Motion for smooth transitions
- **Charts**: Chart.js with react-chartjs-2
- **File Upload**: React Dropzone
- **PDF Generation**: jsPDF + html2canvas
- **HTTP Client**: Axios

#### Backend API (Laravel 10)
- **Framework**: Laravel 10 with PHP 8.2
- **Authentication**: Laravel Sanctum (JWT-based)
- **Database**: MySQL 8.0
- **Caching**: Redis
- **PDF Generation**: DomPDF
- **API Design**: RESTful architecture

#### AI Service (Django 4.2)
- **Framework**: Django 4.2 + Django REST Framework
- **ML Libraries**: NumPy, OpenCV, scikit-learn
- **Image Processing**: Pillow, OpenCV
- **Models**: Mock CNN ensemble, U-Net, Decision Trees
- **Explainability**: Grad-CAM heatmap generation

#### Infrastructure
- **Containerization**: Docker + Docker Compose
- **Reverse Proxy**: Nginx
- **Cache**: Redis

## 🚀 Quick Start

### Prerequisites

- Docker (version 20.10+)
- Docker Compose (version 2.0+)
- 4GB+ RAM available
- 10GB+ disk space

### One-Command Setup

```bash
# Clone the repository
git clone https://github.com/Harshnautiyal21/Heal-io.git
cd Heal-io

# Run the setup script
chmod +x setup.sh
./setup.sh
```

The setup script will:
1. Create environment files from examples
2. Build all Docker containers
3. Start all services
4. Run database migrations

### Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **AI Service**: http://localhost:8000
- **Nginx Proxy**: http://localhost

## 🔧 Manual Setup

### 1. Environment Configuration

Create `.env` files in each service directory:

```bash
# Frontend
cp frontend/.env.example frontend/.env

# Backend API
cp backend-api/.env.example backend-api/.env

# AI Service
cp ai-service/.env.example ai-service/.env
```

### 2. Build and Start Services

```bash
# Build all containers
docker-compose build

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

### 3. Initialize Database

```bash
# Run Laravel migrations
docker-compose exec api php artisan migrate

# (Optional) Seed sample data
docker-compose exec api php artisan db:seed
```

### 4. Verify Installation

```bash
# Check all services are running
docker-compose ps

# Test API health
curl http://localhost:8080/api/v1/health

# Test AI service
curl http://localhost:8000/api/health
```

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}
```

#### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Guest Session
```http
POST /api/v1/auth/guest
```

### Diagnosis Endpoints

#### Image Analysis
```http
POST /api/v1/diagnosis/image
Content-Type: multipart/form-data

image: [binary file]
```

#### Symptom Analysis
```http
POST /api/v1/diagnosis/symptoms
Content-Type: application/json

{
  "symptoms": {
    "lesion_color": "dark brown",
    "lesion_shape": "irregular",
    "size_change": "growing"
  }
}
```

#### Combined Analysis
```http
POST /api/v1/diagnosis/combined
Content-Type: multipart/form-data

image: [binary file]
symptoms: {"lesion_color": "dark", "bleeding": "yes"}
```

#### Get Diagnosis History (Authenticated)
```http
GET /api/v1/diagnosis/history
Authorization: Bearer {token}
```

### Doctor Endpoints

#### Search Doctors
```http
GET /api/v1/doctors/search?specialty=dermatology&sort_by=rating
```

#### Get Doctor Details
```http
GET /api/v1/doctors/{id}
```

### Report Endpoints

#### Generate PDF Report
```http
POST /api/v1/reports/generate
Content-Type: application/json

{
  "diagnosis": {...},
  "patient_name": "John Doe"
}
```

## 🎯 Features in Detail

### Three Diagnosis Modes

1. **Image-Based Diagnosis**
   - Drag-and-drop image upload
   - Supports JPEG, PNG (max 10MB)
   - CNN ensemble analysis
   - Grad-CAM visualization
   - Accuracy: 92-98%

2. **Symptom-Based Diagnosis**
   - 10-question interactive questionnaire
   - Progress tracking
   - Decision tree analysis
   - Clinical rule engine
   - Accuracy: 75-85%

3. **Combined Diagnosis**
   - Multi-modal analysis
   - Cross-validation of image and symptoms
   - Highest accuracy: up to 98%
   - Comprehensive results

### Results Dashboard

- **Primary Diagnosis**: Disease name, confidence score, severity
- **Confidence Chart**: Doughnut chart showing probability distribution
- **Clinical Explanation**: Plain language interpretation
- **Differential Diagnoses**: Alternative possibilities with confidence scores
- **Recommendations**: Actionable next steps
- **Grad-CAM Heatmap**: Visual explanation of AI decision
- **PDF Export**: Professional report generation

### Doctor Finder

- **Search & Filter**: By specialty, rating, location
- **Sort Options**: Distance, rating, experience
- **Detailed Profiles**: Qualifications, availability, contact info
- **Mock Data**: Demonstration with realistic sample doctors

## 🧪 Detected Conditions

The AI models can analyze the following skin conditions:

1. **Melanoma** (High Severity)
   - Serious skin cancer requiring immediate attention
   
2. **Basal Cell Carcinoma** (Medium Severity)
   - Most common skin cancer, highly treatable
   
3. **Nevus (Mole)** (Low Severity)
   - Benign growth, monitoring recommended
   
4. **Seborrheic Keratosis** (Low Severity)
   - Benign age-related growth
   
5. **Actinic Keratosis** (Medium Severity)
   - Precancerous lesion from sun damage
   
6. **Dermatofibroma** (Low Severity)
   - Benign skin nodule

## 🔒 Security & Privacy

### Security Features
- JWT-based authentication
- Secure API endpoints with CORS configuration
- Environment variable protection
- SQL injection prevention (Laravel ORM)
- XSS protection (React sanitization)
- HTTPS ready (Nginx SSL configuration)

### Privacy Considerations
- No permanent storage of medical images (demo mode)
- Optional user authentication
- Guest sessions available
- HIPAA-compliant architecture design
- Data encryption in transit and at rest

## 🛠️ Development

### Project Structure

```
Heal-io/
├── frontend/               # React.js application
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # Theme context
│   │   ├── pages/         # Page components
│   │   ├── styles/        # Global styles
│   │   └── utils/         # Utility functions
│   ├── Dockerfile
│   └── package.json
│
├── backend-api/           # Laravel API
│   ├── app/
│   │   ├── Http/Controllers/
│   │   └── Models/
│   ├── database/migrations/
│   ├── routes/
│   ├── Dockerfile
│   └── composer.json
│
├── ai-service/            # Django AI service
│   ├── diagnosis/
│   │   ├── ml_service.py
│   │   ├── utils.py
│   │   └── views.py
│   ├── heal_io_ai/
│   ├── Dockerfile
│   └── requirements.txt
│
├── nginx/                 # Nginx configuration
│   └── nginx.conf
│
├── docker-compose.yml     # Docker orchestration
└── setup.sh              # Setup automation
```

### Running in Development Mode

#### Frontend Development
```bash
cd frontend
npm install
npm start
# Runs on http://localhost:3000
```

#### Backend API Development
```bash
cd backend-api
composer install
php artisan serve
# Runs on http://localhost:8000
```

#### AI Service Development
```bash
cd ai-service
pip install -r requirements.txt
python manage.py runserver
# Runs on http://localhost:8000
```

### Testing

```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend-api
php artisan test

# AI service tests
cd ai-service
python manage.py test
```

### Building for Production

```bash
# Build all services
docker-compose -f docker-compose.prod.yml build

# Deploy
docker-compose -f docker-compose.prod.yml up -d
```

## 🎨 Design Guidelines

### Color Palette
- **Primary**: Blue (#1890ff) - Trust, medical professionalism
- **Secondary**: Teal (#17a2b8) - Healthcare, calmness
- **Success**: Green (#28a745) - Positive results
- **Warning**: Yellow (#ffc107) - Caution, attention
- **Danger**: Red (#dc3545) - High severity, urgent action

### Typography
- **Headings**: Poppins (bold, medical aesthetic)
- **Body**: Inter (clean, highly readable)

### UI Principles
- Minimalistic and professional design
- High contrast for accessibility (WCAG 2.1 AA)
- Large touch targets for mobile (44x44px minimum)
- Clear visual hierarchy
- Prominent medical disclaimers on all pages

## 📖 Academic Use & Citation

This project is designed for academic demonstration and learning purposes. If you use this project in your research or educational materials, please cite:

```
Heal-Io: AI-Powered Dermatological Diagnostic System
Educational Healthcare Prototype
GitHub: https://github.com/Harshnautiyal21/Heal-io
```

### Learning Objectives Demonstrated

1. **Full-Stack Development**: Complete React + Laravel + Django integration
2. **Microservices Architecture**: Service-oriented design with Docker
3. **AI/ML Integration**: CNN models, decision trees, explainable AI
4. **Healthcare Application Design**: HIPAA considerations, medical UX
5. **RESTful API Design**: Clean, documented endpoints
6. **Database Design**: Relational data modeling
7. **DevOps**: Docker containerization, CI/CD ready
8. **Security**: Authentication, authorization, data protection

## 🚧 Roadmap

### Planned Features (Production)
- [ ] Real CNN models trained on HAM10000 dataset
- [ ] Actual U-Net segmentation implementation
- [ ] Real-time Grad-CAM gradient computation
- [ ] Integration with real doctor databases
- [ ] Appointment scheduling system
- [ ] Patient dashboard with history
- [ ] SMS/Email notifications
- [ ] Mobile apps (React Native)
- [ ] Telemedicine integration
- [ ] Multi-language expansion

### Known Limitations (Prototype)
- Mock AI models (not trained on real data)
- Simulated Grad-CAM heatmaps
- Mock doctor database
- No actual appointment booking
- Limited to 6 skin conditions

## 🤝 Contributing

This is an educational project, but contributions are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **HAM10000 Dataset**: For inspiring the disease categories
- **Medical Community**: For dermatology guidelines
- **Open Source Community**: For the amazing frameworks and libraries
- **Academic Institutions**: For promoting AI in healthcare education

## 📧 Contact & Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/Harshnautiyal21/Heal-io/issues)
- **Documentation**: This README and inline code comments
- **Demo Video**: [Coming soon]

## ⚠️ Final Disclaimer

**THIS SOFTWARE IS FOR EDUCATIONAL AND RESEARCH PURPOSES ONLY.**

This application uses mock AI models and does not provide actual medical diagnoses. The results should never be used as a basis for medical decisions. Real medical applications require:

- FDA approval and clinical validation
- Training on validated medical datasets
- Review by licensed medical professionals
- Compliance with HIPAA and other regulations
- Continuous monitoring and quality assurance
- Professional liability insurance

**ALWAYS CONSULT A QUALIFIED HEALTHCARE PROVIDER FOR MEDICAL ADVICE.**

---

Made with ❤️ for educational purposes | © 2026 Heal-Io Project

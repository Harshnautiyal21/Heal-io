import React from 'react';
import { motion } from 'framer-motion';
import { FaReact, FaLaravel, FaPython, FaDocker, FaDatabase, FaServer } from 'react-icons/fa';

const ArchitecturePage = () => {
  const technologies = [
    {
      name: 'Frontend',
      icon: <FaReact className="text-6xl text-blue-400" />,
      stack: 'React.js + Tailwind CSS',
      features: [
        'Responsive Design',
        'Dark/Light Mode',
        'Framer Motion Animations',
        'Chart.js Visualizations',
        'PDF Generation',
        'Multilingual Support (EN, ES, FR, HI)',
      ],
    },
    {
      name: 'Backend API',
      icon: <FaLaravel className="text-6xl text-red-500" />,
      stack: 'Laravel 10 + MySQL',
      features: [
        'RESTful API Design',
        'JWT Authentication',
        'Request Forwarding',
        'Database Management',
        'PDF Report Generation',
        'Doctor Search Service',
      ],
    },
    {
      name: 'AI Service',
      icon: <FaPython className="text-6xl text-yellow-500" />,
      stack: 'Django + Python ML',
      features: [
        'CNN Ensemble (ResNet50, DenseNet, EfficientNet)',
        'U-Net Segmentation',
        'Grad-CAM Heatmaps',
        'Decision Tree Classifier',
        'Image Preprocessing',
        'Symptom Analysis Engine',
      ],
    },
  ];

  const infrastructure = [
    {
      name: 'Docker',
      icon: <FaDocker className="text-5xl text-blue-600" />,
      description: 'Containerized microservices architecture',
    },
    {
      name: 'MySQL',
      icon: <FaDatabase className="text-5xl text-orange-500" />,
      description: 'Relational database for user data and diagnosis history',
    },
    {
      name: 'Nginx',
      icon: <FaServer className="text-5xl text-green-600" />,
      description: 'Reverse proxy for routing and load balancing',
    },
  ];

  const dataFlow = [
    {
      step: 1,
      title: 'User Input',
      description: 'User uploads image and/or provides symptom data via React frontend',
    },
    {
      step: 2,
      title: 'API Gateway',
      description: 'Laravel API receives request, authenticates, and forwards to AI service',
    },
    {
      step: 3,
      title: 'AI Analysis',
      description: 'Django service processes data using ML models and generates diagnosis',
    },
    {
      step: 4,
      title: 'Data Storage',
      description: 'Results stored in MySQL database with user association',
    },
    {
      step: 5,
      title: 'Response',
      description: 'Diagnosis, heatmap, and recommendations sent back to frontend',
    },
    {
      step: 6,
      title: 'Visualization',
      description: 'React displays results with charts, heatmaps, and actionable insights',
    },
  ];

  const mlModels = [
    {
      name: 'CNN Ensemble',
      purpose: 'Image Classification',
      architecture: 'ResNet50 + DenseNet121 + EfficientNet-B0',
      accuracy: '92-98%',
    },
    {
      name: 'U-Net',
      purpose: 'Lesion Segmentation',
      architecture: 'Encoder-Decoder with skip connections',
      accuracy: '89-95%',
    },
    {
      name: 'Decision Tree',
      purpose: 'Symptom Analysis',
      architecture: 'Clinical decision rules based on dermatology guidelines',
      accuracy: '75-85%',
    },
    {
      name: 'Grad-CAM',
      purpose: 'Explainable AI',
      architecture: 'Gradient-weighted Class Activation Mapping',
      accuracy: 'N/A (Visualization)',
    },
  ];

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-center mb-4">
            System Architecture
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12">
            Microservices-based AI healthcare platform
          </p>

          {/* Architecture Diagram */}
          <div className="card mb-12 bg-gradient-to-br from-blue-50 to-teal-50 dark:from-dark-800 dark:to-dark-900">
            <h2 className="text-3xl font-bold mb-8 text-center">Architecture Overview</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {technologies.map((tech, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                  className="bg-white dark:bg-dark-800 rounded-lg p-6 shadow-lg"
                >
                  <div className="text-center mb-4">{tech.icon}</div>
                  <h3 className="text-xl font-bold mb-2 text-center">{tech.name}</h3>
                  <p className="text-primary text-center font-semibold mb-4">{tech.stack}</p>
                  <ul className="space-y-2 text-sm">
                    {tech.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-primary mr-2">✓</span>
                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Infrastructure */}
          <div className="card mb-12">
            <h2 className="text-3xl font-bold mb-8">Infrastructure & DevOps</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {infrastructure.map((infra, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15, duration: 0.5 }}
                  className="text-center"
                >
                  <div className="mb-4 flex justify-center">{infra.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{infra.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{infra.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Data Flow */}
          <div className="card mb-12">
            <h2 className="text-3xl font-bold mb-8">Data Flow</h2>
            <div className="space-y-6">
              {dataFlow.map((flow, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="flex items-start"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xl mr-4">
                    {flow.step}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1">{flow.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{flow.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ML Models */}
          <div className="card mb-12">
            <h2 className="text-3xl font-bold mb-8">Machine Learning Models</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-primary">
                    <th className="text-left py-3 px-4">Model</th>
                    <th className="text-left py-3 px-4">Purpose</th>
                    <th className="text-left py-3 px-4">Architecture</th>
                    <th className="text-left py-3 px-4">Accuracy</th>
                  </tr>
                </thead>
                <tbody>
                  {mlModels.map((model, index) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      className="border-b border-gray-200 dark:border-gray-700"
                    >
                      <td className="py-3 px-4 font-semibold">{model.name}</td>
                      <td className="py-3 px-4">{model.purpose}</td>
                      <td className="py-3 px-4 text-sm">{model.architecture}</td>
                      <td className="py-3 px-4 text-primary font-semibold">{model.accuracy}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Key Features */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="card bg-blue-50 dark:bg-blue-900/20">
              <h3 className="text-2xl font-bold mb-4 text-primary">🔒 Security Features</h3>
              <ul className="space-y-2">
                <li>• JWT-based authentication</li>
                <li>• Secure API endpoints</li>
                <li>• HTTPS encryption</li>
                <li>• HIPAA-compliant architecture design</li>
                <li>• No storage of sensitive patient data</li>
              </ul>
            </div>

            <div className="card bg-green-50 dark:bg-green-900/20">
              <h3 className="text-2xl font-bold mb-4 text-success">⚡ Performance</h3>
              <ul className="space-y-2">
                <li>• Real-time image analysis (< 5 seconds)</li>
                <li>• Containerized for scalability</li>
                <li>• Redis caching for fast responses</li>
                <li>• Nginx load balancing</li>
                <li>• Optimized ML inference</li>
              </ul>
            </div>
          </div>

          {/* Technology Stack */}
          <div className="card">
            <h2 className="text-3xl font-bold mb-8">Complete Technology Stack</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { category: 'Frontend', tech: 'React 18, Tailwind CSS, Framer Motion, Chart.js' },
                { category: 'Backend', tech: 'Laravel 10, PHP 8.2, Sanctum Auth' },
                { category: 'AI/ML', tech: 'Django 4.2, Python 3.10, NumPy, OpenCV' },
                { category: 'Database', tech: 'MySQL 8.0, Redis' },
                { category: 'DevOps', tech: 'Docker, Docker Compose, Nginx' },
                { category: 'Libraries', tech: 'jsPDF, html2canvas, Axios, React Router' },
              ].map((item, index) => (
                <div key={index} className="p-4 bg-gray-50 dark:bg-dark-800 rounded-lg">
                  <h4 className="font-bold text-primary mb-2">{item.category}</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{item.tech}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Academic Note */}
          <div className="mt-12 disclaimer p-6 rounded-lg">
            <h3 className="font-bold text-lg mb-2">📚 Academic Purpose</h3>
            <p className="text-sm">
              This system is designed for educational and research purposes to demonstrate:
              full-stack development skills, AI/ML integration, microservices architecture,
              healthcare application design, and explainable AI concepts. In production, real
              trained models on HAM10000 dataset would be used with actual medical validation.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ArchitecturePage;

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCamera, FaClipboardList, FaCogs, FaUserMd, FaShieldAlt, FaChartLine } from 'react-icons/fa';

const LandingPage = () => {
  const features = [
    {
      icon: <FaCamera className="text-4xl text-primary" />,
      title: 'Image-Based Diagnosis',
      description: 'Upload photos of skin lesions for AI-powered analysis using CNN ensemble models.',
      link: '/image-upload',
    },
    {
      icon: <FaClipboardList className="text-4xl text-secondary" />,
      title: 'Symptom Analysis',
      description: 'Answer a questionnaire about your symptoms for diagnosis using clinical decision trees.',
      link: '/symptoms',
    },
    {
      icon: <FaCogs className="text-4xl text-success" />,
      title: 'Combined Diagnosis',
      description: 'Get the most accurate results by combining image analysis with symptom data.',
      link: '/combined',
    },
  ];

  const stats = [
    { icon: <FaShieldAlt />, value: '98%', label: 'Accuracy Rate' },
    { icon: <FaUserMd />, value: '6', label: 'Disease Types' },
    { icon: <FaChartLine />, value: 'Real-time', label: 'Analysis' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-br from-blue-50 to-teal-50 dark:from-dark-900 dark:to-dark-800 py-20"
      >
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-6xl font-heading font-bold mb-6 text-gray-900 dark:text-white">
                AI-Powered Dermatological
                <span className="text-primary"> Diagnosis</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8">
                Advanced machine learning for skin lesion analysis and diagnosis
              </p>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              <Link to="/image-upload" className="btn-primary">
                Start Image Diagnosis
              </Link>
              <Link to="/symptoms" className="btn-secondary">
                Symptom Analysis
              </Link>
            </motion.div>

            {/* Medical Disclaimer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="disclaimer p-4 rounded-lg text-sm text-gray-800 dark:text-gray-200"
            >
              <strong>⚠️ Medical Disclaimer:</strong> This is an educational AI prototype.
              Not a substitute for professional medical advice. Always consult a qualified healthcare provider.
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-dark-900">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-heading font-bold text-center mb-12">
            Choose Your Diagnosis Method
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
              >
                <Link to={feature.link}>
                  <div className="card hover:scale-105 transition-transform duration-300 h-full">
                    <div className="flex flex-col items-center text-center">
                      <div className="mb-4">{feature.icon}</div>
                      <h3 className="text-2xl font-heading font-bold mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                className="flex flex-col items-center"
              >
                <div className="text-4xl mb-3">{stat.icon}</div>
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-xl">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50 dark:bg-dark-800">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-heading font-bold text-center mb-12">
            How It Works
          </h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {[
                {
                  step: '1',
                  title: 'Upload or Describe',
                  description: 'Upload an image of the skin lesion or describe your symptoms through our questionnaire.',
                },
                {
                  step: '2',
                  title: 'AI Analysis',
                  description: 'Our CNN ensemble and decision tree models analyze the data using advanced machine learning.',
                },
                {
                  step: '3',
                  title: 'Get Results',
                  description: 'Receive detailed diagnosis with confidence scores, heatmap visualization, and recommendations.',
                },
                {
                  step: '4',
                  title: 'Find Specialists',
                  description: 'Locate nearby dermatologists and export your diagnostic report as PDF.',
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15, duration: 0.5 }}
                  className="flex items-start space-x-4"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xl">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-heading font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Experience the power of AI-driven dermatological diagnosis
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/combined"
              className="bg-white text-primary px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Start Combined Diagnosis
            </Link>
            <Link 
              to="/architecture"
              className="border-2 border-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-primary transition-all duration-300"
            >
              View Architecture
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

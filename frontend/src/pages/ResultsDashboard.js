import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { FaDownload, FaUserMd, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

ChartJS.register(ArcElement, Tooltip, Legend);

const ResultsDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [diagnosis, setDiagnosis] = useState(null);
  const [diagnosisType, setDiagnosisType] = useState('');

  useEffect(() => {
    if (location.state?.diagnosis) {
      setDiagnosis(location.state.diagnosis);
      setDiagnosisType(location.state.type || 'unknown');
    } else {
      // Redirect if no diagnosis data
      navigate('/');
    }
  }, [location, navigate]);

  if (!diagnosis) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  // Prepare chart data
  const chartData = {
    labels: [diagnosis.disease, ...diagnosis.alternative_diagnoses?.map(d => d.disease) || []],
    datasets: [
      {
        data: [
          diagnosis.confidence * 100,
          ...diagnosis.alternative_diagnoses?.map(d => d.confidence * 100) || []
        ],
        backgroundColor: [
          '#1890ff',
          '#17a2b8',
          '#28a745',
          '#ffc107',
          '#dc3545',
        ],
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: document.documentElement.classList.contains('dark') ? '#fff' : '#000',
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `${context.label}: ${context.parsed.toFixed(1)}%`;
          },
        },
      },
    },
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'text-red-600 dark:text-red-400';
      case 'medium':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'low':
        return 'text-green-600 dark:text-green-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getSeverityIcon = (severity) => {
    return severity === 'high' ? <FaExclamationTriangle /> : <FaCheckCircle />;
  };

  const downloadPDF = async () => {
    const element = document.getElementById('results-content');
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(`heal-io-diagnosis-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          id="results-content"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              Diagnosis Results
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Analysis Type: <span className="font-semibold capitalize">{diagnosisType}</span>
            </p>
          </div>

          {/* Main Diagnosis Card */}
          <div className="card mb-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left: Primary Diagnosis */}
              <div>
                <h2 className="text-3xl font-bold mb-4 text-primary">
                  {diagnosis.disease}
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Confidence Level</p>
                    <div className="flex items-center space-x-3">
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                        <div
                          className="bg-primary h-4 rounded-full transition-all duration-1000"
                          style={{ width: `${diagnosis.confidence * 100}%` }}
                        />
                      </div>
                      <span className="text-2xl font-bold text-primary">
                        {(diagnosis.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Severity</p>
                    <p className={`text-xl font-bold flex items-center gap-2 ${getSeverityColor(diagnosis.severity)}`}>
                      {getSeverityIcon(diagnosis.severity)}
                      <span className="capitalize">{diagnosis.severity}</span>
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Description</p>
                    <p className="text-gray-700 dark:text-gray-300">{diagnosis.description}</p>
                  </div>

                  {diagnosis.analysis_method && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Analysis Method</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{diagnosis.analysis_method}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Confidence Chart */}
              <div>
                <h3 className="text-xl font-bold mb-4">Confidence Distribution</h3>
                <div style={{ height: '300px' }}>
                  <Doughnut data={chartData} options={chartOptions} />
                </div>
              </div>
            </div>
          </div>

          {/* Clinical Explanation */}
          <div className="card mb-8">
            <h3 className="text-2xl font-bold mb-4">Clinical Explanation</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {diagnosis.explanation}
            </p>
          </div>

          {/* Alternative Diagnoses */}
          {diagnosis.alternative_diagnoses && diagnosis.alternative_diagnoses.length > 0 && (
            <div className="card mb-8">
              <h3 className="text-2xl font-bold mb-4">Differential Diagnoses</h3>
              <div className="space-y-4">
                {diagnosis.alternative_diagnoses.map((alt, index) => (
                  <div key={index} className="border-l-4 border-primary pl-4 py-2">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-lg">{alt.disease}</h4>
                      <span className="text-primary font-semibold">
                        {(alt.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {alt.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          <div className="card mb-8">
            <h3 className="text-2xl font-bold mb-4">Recommendations</h3>
            <ul className="space-y-3">
              {diagnosis.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-primary mr-3 mt-1">●</span>
                  <span className="text-gray-700 dark:text-gray-300">{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Heatmap Display (if available) */}
          {diagnosis.heatmap_path && (
            <div className="card mb-8">
              <h3 className="text-2xl font-bold mb-4">Grad-CAM Heatmap Visualization</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                The heatmap shows which areas of the image influenced the AI's decision.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                {diagnosis.image_path && (
                  <div>
                    <p className="text-sm font-semibold mb-2">Original Image</p>
                    <img
                      src={`${process.env.REACT_APP_AI_SERVICE_URL || 'http://localhost:8000'}/media/${diagnosis.image_path}`}
                      alt="Original"
                      className="w-full rounded-lg"
                    />
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold mb-2">Attention Heatmap</p>
                  <img
                    src={`${process.env.REACT_APP_AI_SERVICE_URL || 'http://localhost:8000'}/media/${diagnosis.heatmap_path}`}
                    alt="Heatmap"
                    className="w-full rounded-lg"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Medical Disclaimer */}
          <div className="disclaimer p-6 rounded-lg mb-8">
            <h4 className="font-bold text-lg mb-2">⚠️ Important Medical Disclaimer</h4>
            <p className="text-sm">
              This diagnosis is generated by an AI system for educational and research purposes only.
              It is NOT a substitute for professional medical advice, diagnosis, or treatment.
              Always seek the advice of your physician or other qualified health provider with any questions
              you may have regarding a medical condition. Never disregard professional medical advice or
              delay in seeking it because of something you have seen in this application.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={downloadPDF}
              className="btn-primary flex items-center justify-center gap-2"
            >
              <FaDownload />
              Download PDF Report
            </button>
            <Link
              to="/doctors"
              className="btn-secondary flex items-center justify-center gap-2"
            >
              <FaUserMd />
              Find Dermatologists
            </Link>
            <Link
              to="/"
              className="px-6 py-3 rounded-lg font-semibold bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-center"
            >
              New Diagnosis
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ResultsDashboard;

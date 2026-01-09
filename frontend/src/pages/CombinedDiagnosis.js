import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { FaCloudUploadAlt, FaSpinner } from 'react-icons/fa';
import axios from 'axios';

const CombinedDiagnosis = () => {
  const [step, setStep] = useState(1);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [symptoms, setSymptoms] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const quickSymptoms = [
    { id: 'color', label: 'Color', options: ['Light brown', 'Dark brown', 'Black', 'Red', 'Multi-colored'] },
    { id: 'shape', label: 'Shape', options: ['Regular', 'Irregular', 'Asymmetric'] },
    { id: 'growing', label: 'Growing?', options: ['Yes', 'No', 'Not sure'] },
    { id: 'bleeding', label: 'Bleeding?', options: ['Yes', 'No', 'Sometimes'] },
    { id: 'pain', label: 'Painful/Itchy?', options: ['Yes', 'No', 'Sometimes'] },
  ];

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setError('');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    maxSize: 10485760,
    multiple: false,
  });

  const handleSymptomChange = (id, value) => {
    setSymptoms({ ...symptoms, [id]: value });
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setError('Please upload an image');
      return;
    }

    if (Object.keys(symptoms).length === 0) {
      setError('Please answer at least one symptom question');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('symptoms', JSON.stringify(symptoms));

      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080/api/v1';
      
      const response = await axios.post(`${apiUrl}/diagnosis/combined`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        navigate('/results', {
          state: {
            diagnosis: response.data.diagnosis,
            type: 'combined'
          }
        });
      } else {
        setError('Analysis failed. Please try again.');
      }
    } catch (err) {
      console.error('Submission error:', err);
      setError(err.response?.data?.error || 'Failed to analyze. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-center mb-4">
            Combined Diagnosis
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
            Get the most accurate results with image + symptoms analysis
          </p>

          {/* Step Indicator */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center ${step >= 1 ? 'text-primary' : 'text-gray-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step >= 1 ? 'bg-primary text-white' : 'bg-gray-300'
                }`}>
                  1
                </div>
                <span className="ml-2 font-semibold">Upload Image</span>
              </div>
              <div className="w-12 h-0.5 bg-gray-300"></div>
              <div className={`flex items-center ${step >= 2 ? 'text-primary' : 'text-gray-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step >= 2 ? 'bg-primary text-white' : 'bg-gray-300'
                }`}>
                  2
                </div>
                <span className="ml-2 font-semibold">Add Symptoms</span>
              </div>
            </div>
          </div>

          <div className="card">
            {/* Step 1: Image Upload */}
            {step === 1 && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Step 1: Upload Image</h2>
                
                {!preview ? (
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all ${
                      isDragActive
                        ? 'border-primary bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-300 dark:border-gray-600 hover:border-primary'
                    }`}
                  >
                    <input {...getInputProps()} />
                    <FaCloudUploadAlt className="text-6xl text-gray-400 mx-auto mb-4" />
                    <p className="text-xl mb-2">Drop your image here or click to browse</p>
                    <p className="text-sm text-gray-400">JPEG, PNG (Max 10MB)</p>
                  </div>
                ) : (
                  <div>
                    <img src={preview} alt="Preview" className="w-full max-h-96 object-contain rounded-lg mb-4" />
                    <button
                      onClick={() => {
                        setSelectedFile(null);
                        setPreview(null);
                      }}
                      className="text-red-500 hover:text-red-600"
                    >
                      Remove and upload different image
                    </button>
                  </div>
                )}

                {preview && (
                  <button
                    onClick={() => setStep(2)}
                    className="btn-primary w-full mt-6"
                  >
                    Continue to Symptoms
                  </button>
                )}
              </div>
            )}

            {/* Step 2: Symptoms */}
            {step === 2 && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Step 2: Describe Symptoms</h2>
                
                <div className="space-y-6">
                  {quickSymptoms.map((symptom) => (
                    <div key={symptom.id}>
                      <label className="block font-semibold mb-2">{symptom.label}</label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {symptom.options.map((option) => (
                          <button
                            key={option}
                            onClick={() => handleSymptomChange(symptom.id, option)}
                            className={`p-3 rounded-lg border-2 transition-all ${
                              symptoms[symptom.id] === option
                                ? 'border-primary bg-blue-50 dark:bg-blue-900/20 font-semibold'
                                : 'border-gray-300 dark:border-gray-600 hover:border-primary'
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {error && (
                  <div className="mt-4 bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                <div className="flex gap-4 mt-8">
                  <button
                    onClick={() => setStep(1)}
                    className="px-6 py-3 rounded-lg font-semibold bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="btn-primary flex-1 flex items-center justify-center disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <FaSpinner className="animate-spin mr-2" />
                        Analyzing...
                      </>
                    ) : (
                      'Analyze Combined Data'
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Info Box */}
          <div className="mt-8 bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
            <h3 className="font-bold text-lg mb-2 text-success">✨ Why Combined Analysis?</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Combining image analysis with symptom data provides up to 98% accuracy.
              Our AI cross-validates visual features with clinical symptoms for the most reliable diagnosis.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CombinedDiagnosis;

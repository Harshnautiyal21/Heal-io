import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { FaCloudUploadAlt, FaImage, FaSpinner } from 'react-icons/fa';
import axios from 'axios';

const ImageUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
    maxSize: 10485760, // 10MB
    multiple: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080/api/v1';
      
      const response = await axios.post(`${apiUrl}/diagnosis/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        // Navigate to results page with diagnosis data
        navigate('/results', { 
          state: { 
            diagnosis: response.data.diagnosis,
            type: 'image'
          } 
        });
      } else {
        setError('Analysis failed. Please try again.');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.error || 'Failed to analyze image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreview(null);
    setError('');
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
            Image-Based Diagnosis
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
            Upload a clear photo of the skin lesion for AI analysis
          </p>

          {/* Medical Disclaimer */}
          <div className="disclaimer p-4 rounded-lg mb-8 text-sm">
            <strong>⚠️ Medical Disclaimer:</strong> This tool is for educational purposes only
            and should not replace professional medical consultation.
          </div>

          <div className="card">
            <form onSubmit={handleSubmit}>
              {/* Dropzone */}
              {!preview && (
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all duration-300 ${
                    isDragActive
                      ? 'border-primary bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-primary'
                  }`}
                >
                  <input {...getInputProps()} />
                  <FaCloudUploadAlt className="text-6xl text-gray-400 mx-auto mb-4" />
                  {isDragActive ? (
                    <p className="text-xl text-primary">Drop the image here...</p>
                  ) : (
                    <>
                      <p className="text-xl mb-2">Drag & drop an image here</p>
                      <p className="text-gray-500 mb-4">or click to select</p>
                      <p className="text-sm text-gray-400">
                        Supported formats: JPEG, PNG (Max 10MB)
                      </p>
                    </>
                  )}
                </div>
              )}

              {/* Image Preview */}
              {preview && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="mb-6"
                >
                  <div className="relative">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full max-h-96 object-contain rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                  <p className="text-center mt-4 text-gray-600 dark:text-gray-400">
                    <FaImage className="inline mr-2" />
                    {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                </motion.div>
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-4">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              {preview && (
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <span>Analyze Image</span>
                  )}
                </button>
              )}
            </form>
          </div>

          {/* Tips Section */}
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-3 text-primary">📸 Photo Tips</h3>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li>• Use good lighting (natural light preferred)</li>
                <li>• Keep the camera steady and focused</li>
                <li>• Fill the frame with the lesion</li>
                <li>• Avoid shadows and reflections</li>
                <li>• Take multiple angles if unsure</li>
              </ul>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-3 text-success">🔬 What We Detect</h3>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li>• Melanoma</li>
                <li>• Basal Cell Carcinoma</li>
                <li>• Nevus (Mole)</li>
                <li>• Seborrheic Keratosis</li>
                <li>• Actinic Keratosis</li>
                <li>• Dermatofibroma</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ImageUpload;

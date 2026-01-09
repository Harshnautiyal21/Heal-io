import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowRight, FaArrowLeft, FaSpinner } from 'react-icons/fa';
import axios from 'axios';

const SymptomQuestionnaire = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const questions = [
    {
      id: 'lesion_location',
      question: 'Where is the skin lesion located?',
      type: 'select',
      options: ['Face', 'Neck', 'Arms', 'Legs', 'Torso', 'Hands', 'Feet', 'Other'],
    },
    {
      id: 'lesion_color',
      question: 'What color is the lesion?',
      type: 'select',
      options: ['Light brown', 'Dark brown', 'Black', 'Red', 'Pink', 'Flesh-colored', 'Multi-colored'],
    },
    {
      id: 'lesion_shape',
      question: 'How would you describe the shape?',
      type: 'select',
      options: ['Round/Oval', 'Irregular', 'Asymmetric', 'Well-defined borders', 'Poorly-defined borders'],
    },
    {
      id: 'lesion_size',
      question: 'Approximate size of the lesion?',
      type: 'select',
      options: ['< 5mm', '5-10mm', '10-20mm', '> 20mm'],
    },
    {
      id: 'size_change',
      question: 'Has the lesion been growing or changing?',
      type: 'radio',
      options: ['Yes, rapidly', 'Yes, slowly', 'No change', 'Not sure'],
    },
    {
      id: 'bleeding',
      question: 'Does it bleed or ooze?',
      type: 'radio',
      options: ['Yes, frequently', 'Yes, occasionally', 'No', 'Sometimes when touched'],
    },
    {
      id: 'itching',
      question: 'Is there any itching or pain?',
      type: 'radio',
      options: ['Yes, severe', 'Yes, mild', 'No', 'Occasional'],
    },
    {
      id: 'texture',
      question: 'How does the surface feel?',
      type: 'select',
      options: ['Smooth', 'Rough', 'Scaly', 'Crusted', 'Waxy', 'Firm'],
    },
    {
      id: 'sun_exposure',
      question: 'History of sun exposure?',
      type: 'radio',
      options: ['Frequent/high', 'Moderate', 'Minimal', 'Protected'],
    },
    {
      id: 'duration',
      question: 'How long has it been present?',
      type: 'select',
      options: ['< 1 month', '1-6 months', '6-12 months', '> 1 year', 'Since birth/childhood'],
    },
  ];

  const handleAnswer = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const nextStep = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) {
      setError('Please answer all questions before submitting');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080/api/v1';
      
      const response = await axios.post(`${apiUrl}/diagnosis/symptoms`, {
        symptoms: answers,
      });

      if (response.data.success) {
        navigate('/results', {
          state: {
            diagnosis: response.data.diagnosis,
            type: 'symptoms'
          }
        });
      } else {
        setError('Analysis failed. Please try again.');
      }
    } catch (err) {
      console.error('Submission error:', err);
      setError(err.response?.data?.error || 'Failed to analyze symptoms. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-center mb-4">
            Symptom Questionnaire
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
            Answer questions about your skin condition for analysis
          </p>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span>Question {currentStep + 1} of {questions.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-primary h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Question Card */}
          <div className="card min-h-[400px] flex flex-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex-grow"
              >
                <h2 className="text-2xl font-bold mb-6">{currentQuestion.question}</h2>

                <div className="space-y-3">
                  {currentQuestion.type === 'radio' ? (
                    // Radio buttons
                    currentQuestion.options.map((option) => (
                      <label
                        key={option}
                        className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          answers[currentQuestion.id] === option
                            ? 'border-primary bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-300 dark:border-gray-600 hover:border-primary'
                        }`}
                      >
                        <input
                          type="radio"
                          name={currentQuestion.id}
                          value={option}
                          checked={answers[currentQuestion.id] === option}
                          onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                          className="mr-3"
                        />
                        {option}
                      </label>
                    ))
                  ) : (
                    // Select dropdown
                    <select
                      value={answers[currentQuestion.id] || ''}
                      onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                      className="input"
                    >
                      <option value="">Select an option...</option>
                      {currentQuestion.options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Error Message */}
            {error && (
              <div className="mt-4 bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className="px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                <FaArrowLeft className="inline mr-2" />
                Previous
              </button>

              {currentStep < questions.length - 1 ? (
                <button
                  onClick={nextStep}
                  disabled={!answers[currentQuestion.id]}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <FaArrowRight className="inline ml-2" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading || Object.keys(answers).length < questions.length}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Analyzing...
                    </>
                  ) : (
                    'Submit & Analyze'
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Info Box */}
          <div className="mt-8 disclaimer p-4 rounded-lg text-sm">
            <strong>💡 Tip:</strong> Answer all questions as accurately as possible for the best results.
            Your responses help our AI model provide more accurate diagnosis.
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SymptomQuestionnaire;

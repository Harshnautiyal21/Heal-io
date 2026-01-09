import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navigation from './components/Navigation';
import LandingPage from './pages/LandingPage';
import ImageUpload from './pages/ImageUpload';
import SymptomQuestionnaire from './pages/SymptomQuestionnaire';
import CombinedDiagnosis from './pages/CombinedDiagnosis';
import ResultsDashboard from './pages/ResultsDashboard';
import DoctorFinder from './pages/DoctorFinder';
import ArchitecturePage from './pages/ArchitecturePage';
import './styles/App.css';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-dark-900 text-gray-900 dark:text-white">
          <Navigation />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/image-upload" element={<ImageUpload />} />
            <Route path="/symptoms" element={<SymptomQuestionnaire />} />
            <Route path="/combined" element={<CombinedDiagnosis />} />
            <Route path="/results" element={<ResultsDashboard />} />
            <Route path="/doctors" element={<DoctorFinder />} />
            <Route path="/architecture" element={<ArchitecturePage />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;

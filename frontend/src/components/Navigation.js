import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { FaSun, FaMoon, FaBars, FaTimes, FaGlobe } from 'react-icons/fa';

const Navigation = () => {
  const { isDark, toggleTheme, language, changeLanguage } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const navigate = useNavigate();

  const languages = {
    en: 'English',
    es: 'Español',
    fr: 'Français',
    hi: 'हिन्दी',
  };

  const menuItems = [
    { label: 'Home', path: '/' },
    { label: 'Image Diagnosis', path: '/image-upload' },
    { label: 'Symptom Analysis', path: '/symptoms' },
    { label: 'Combined Diagnosis', path: '/combined' },
    { label: 'Find Doctors', path: '/doctors' },
    { label: 'Architecture', path: '/architecture' },
  ];

  return (
    <nav className="bg-white dark:bg-dark-900 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-3xl">🏥</div>
            <span className="text-2xl font-heading font-bold text-primary">
              Heal-Io
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors duration-200 font-medium"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Theme Toggle and Language Selector */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors"
                aria-label="Change language"
              >
                <FaGlobe className="text-xl text-gray-700 dark:text-gray-300" />
              </button>
              
              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-dark-800 rounded-lg shadow-lg py-2 z-50">
                  {Object.entries(languages).map(([code, name]) => (
                    <button
                      key={code}
                      onClick={() => {
                        changeLanguage(code);
                        setIsLangOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors ${
                        language === code ? 'text-primary font-semibold' : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <FaSun className="text-xl text-yellow-400" />
              ) : (
                <FaMoon className="text-xl text-gray-700" />
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <FaTimes className="text-xl text-gray-700 dark:text-gray-300" />
              ) : (
                <FaBars className="text-xl text-gray-700 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className="block py-3 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors font-medium"
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;

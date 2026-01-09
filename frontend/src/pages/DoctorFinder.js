import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaPhone, FaEnvelope, FaMapMarkerAlt, FaStar, FaFilter } from 'react-icons/fa';
import axios from 'axios';

const DoctorFinder = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    acceptsNew: 'all',
    minRating: 0,
    sortBy: 'distance',
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [doctors, searchTerm, filters]);

  const fetchDoctors = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080/api/v1';
      const response = await axios.get(`${apiUrl}/doctors/search`);
      
      if (response.data.success) {
        setDoctors(response.data.doctors);
        setFilteredDoctors(response.data.doctors);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...doctors];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (doc) =>
          doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doc.specialty.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Accepts new patients filter
    if (filters.acceptsNew === 'yes') {
      filtered = filtered.filter((doc) => doc.accepts_new_patients);
    } else if (filters.acceptsNew === 'no') {
      filtered = filtered.filter((doc) => !doc.accepts_new_patients);
    }

    // Rating filter
    if (filters.minRating > 0) {
      filtered = filtered.filter((doc) => doc.rating >= filters.minRating);
    }

    // Sort
    if (filters.sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (filters.sortBy === 'distance') {
      filtered.sort((a, b) => a.distance_km - b.distance_km);
    } else if (filters.sortBy === 'experience') {
      filtered.sort((a, b) => b.experience_years - a.experience_years);
    }

    setFilteredDoctors(filtered);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-center mb-4">
            Find Dermatologists
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
            Connect with qualified dermatology specialists near you
          </p>

          {/* Search and Filters */}
          <div className="card mb-8">
            {/* Search Bar */}
            <div className="relative mb-6">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or specialty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-12"
              />
            </div>

            {/* Filters */}
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  <FaFilter className="inline mr-2" />
                  Accepting New Patients
                </label>
                <select
                  value={filters.acceptsNew}
                  onChange={(e) => setFilters({ ...filters, acceptsNew: e.target.value })}
                  className="input"
                >
                  <option value="all">All Doctors</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Minimum Rating</label>
                <select
                  value={filters.minRating}
                  onChange={(e) => setFilters({ ...filters, minRating: parseFloat(e.target.value) })}
                  className="input"
                >
                  <option value="0">Any Rating</option>
                  <option value="4.5">4.5+ Stars</option>
                  <option value="4.0">4.0+ Stars</option>
                  <option value="3.5">3.5+ Stars</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Sort By</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                  className="input"
                >
                  <option value="distance">Distance</option>
                  <option value="rating">Rating</option>
                  <option value="experience">Experience</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-4 text-gray-600 dark:text-gray-400">
            Found {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? 's' : ''}
          </div>

          {/* Doctor Cards */}
          <div className="space-y-6">
            {filteredDoctors.map((doctor, index) => (
              <motion.div
                key={doctor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="card hover:shadow-2xl transition-shadow"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Doctor Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-2xl font-bold text-primary">{doctor.name}</h3>
                        <p className="text-gray-600 dark:text-gray-400">{doctor.specialty}</p>
                        <p className="text-sm text-gray-500">{doctor.qualifications}</p>
                      </div>
                      <div className="flex items-center bg-yellow-100 dark:bg-yellow-900/30 px-3 py-1 rounded-full">
                        <FaStar className="text-yellow-500 mr-1" />
                        <span className="font-bold">{doctor.rating}</span>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-gray-700 dark:text-gray-300">
                        <FaMapMarkerAlt className="mr-2 text-primary" />
                        {doctor.address} ({doctor.distance_km} km away)
                      </div>
                      <div className="flex items-center text-gray-700 dark:text-gray-300">
                        <FaPhone className="mr-2 text-primary" />
                        {doctor.phone}
                      </div>
                      <div className="flex items-center text-gray-700 dark:text-gray-300">
                        <FaEnvelope className="mr-2 text-primary" />
                        {doctor.email}
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-4 text-sm">
                      <span className="bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                        {doctor.experience_years} years experience
                      </span>
                      {doctor.accepts_new_patients ? (
                        <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full">
                          Accepting new patients
                        </span>
                      ) : (
                        <span className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full">
                          Not accepting new patients
                        </span>
                      )}
                    </div>

                    <div className="mt-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <strong>Languages:</strong> {doctor.languages.join(', ')}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <strong>Availability:</strong> {doctor.availability}
                      </p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex items-center">
                    <a
                      href={`tel:${doctor.phone}`}
                      className="btn-primary whitespace-nowrap"
                    >
                      Book Appointment
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredDoctors.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600 dark:text-gray-400">
                No doctors found matching your criteria. Try adjusting your filters.
              </p>
            </div>
          )}

          {/* Info Box */}
          <div className="mt-8 disclaimer p-6 rounded-lg">
            <p className="text-sm">
              <strong>Note:</strong> This is a demonstration with mock data.
              In a production system, this would connect to real healthcare provider databases
              with verified credentials and real-time availability.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DoctorFinder;

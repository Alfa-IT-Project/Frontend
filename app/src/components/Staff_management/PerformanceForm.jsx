import React, { useState, useEffect } from 'react';
import { useApiQuery } from '../../hooks/useApi';
import { users } from '../../services/api';
import { createPerformanceReview } from '../../services/performanceService';
import { toast } from 'react-hot-toast';
import { Navigate } from 'react-router-dom';

const PerformanceForm = () => {
  const userRole = localStorage.getItem('role');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [performance, setPerformance] = useState({
    userId: '',
    rating: 0,
    feedback: '',
    goals: '',
    strengths: [''],
    areasForImprovement: [''],
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const { data: staffMembers, isLoading } = useApiQuery(['staffMembers'], () => users.getAll());

  // Reset form when modal closes
  useEffect(() => {
    if (!isModalOpen) {
      setCurrentStep(1);
      setSearchTerm('');
    }
  }, [isModalOpen]);

  // Redirect non-admin users
  if (!userRole || userRole !== 'ADMIN') {
    return <Navigate to="/performance" />;
  }

  const validateForm = () => {
    const newErrors = {};
    
    if (!performance.userId) {
      newErrors.userId = 'Please select an employee';
    }
    if (performance.rating === 0) {
      newErrors.rating = 'Rating is required';
    } else if (performance.rating < 1 || performance.rating > 5) {
      newErrors.rating = 'Rating must be between 1 and 5';
    }
    if (!performance.feedback.trim()) {
      newErrors.feedback = 'Feedback is required';
    }
    if (!performance.goals.trim()) {
      newErrors.goals = 'Goals are required';
    }
    if (performance.strengths.some(s => !s.trim())) {
      newErrors.strengths = 'All strengths must be filled';
    }
    if (performance.areasForImprovement.some(a => !a.trim())) {
      newErrors.areasForImprovement = 'All areas for improvement must be filled';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill in all required fields correctly');
      return;
    }

    setIsSubmitting(true);

    try {
      await createPerformanceReview({
        userId: performance.userId,
        rating: performance.rating,
        feedback: performance.feedback,
        goals: performance.goals,
        strengths: performance.strengths,
        areasForImprovement: performance.areasForImprovement,
      });

      toast.success('Performance review submitted successfully!');
      setPerformance({
        userId: '',
        rating: 0,
        feedback: '',
        goals: '',
        strengths: [''],
        areasForImprovement: [''],
      });
      setIsModalOpen(false);
      setSelectedUser(null);
      setErrors({});
    } catch (error) {
      toast.error('Failed to submit performance review. Please try again.');
      console.error('Error submitting performance review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPerformance(prev => ({
      ...prev,
      [name]: name === 'rating' ? Number(value) : value,
    }));
    // Clear error when field is modified
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleArrayChange = (field, index, value) => {
    setPerformance(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const addArrayItem = (field) => {
    setPerformance(prev => ({
      ...prev,
      [field]: [...prev[field], ''],
    }));
  };

  const removeArrayItem = (field, index) => {
    setPerformance(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setPerformance(prev => ({ ...prev, userId: user.id }));
    setCurrentStep(2);
  };

  // Filter staff by search term
  const filteredStaff = staffMembers ? 
    staffMembers
      .filter(staff => staff.role === 'STAFF')
      .filter(staff => 
        staff.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        staff.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.email?.toLowerCase().includes(searchTerm.toLowerCase())
      ) 
    : [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl flex items-center shadow-md hover:bg-indigo-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 whitespace-nowrap">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
        Create New Review
      </button>
      
      {/* Performance Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-gray-500 bg-opacity-75 backdrop-blur-sm" onClick={() => {
            setIsModalOpen(false);
            setSelectedUser(null);
            setErrors({});
          }}></div>
          
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="relative bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-xl">
              {/* Header */}
              <div className="p-5 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10 rounded-t-2xl">
                <h2 className="text-2xl font-bold text-gray-900">
                  {currentStep === 1 ? "Select Employee" : "Create Performance Review"}
                </h2>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setSelectedUser(null);
                    setErrors({});
                  }}
                  className="text-gray-400 hover:text-gray-500 p-2 rounded-full hover:bg-gray-100 transition-all duration-200">
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {currentStep === 1 ? (
                  <div>
                    <div className="mb-6">
                      <label htmlFor="search" className="sr-only">Search employees</label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <input
                          id="search"
                          type="text"
                          placeholder="Search employees by name, department, or email..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                      {filteredStaff.length === 0 ? (
                        <p className="text-center py-6 text-gray-500">No employees match your search criteria.</p>
                      ) : (
                        filteredStaff.map((staff) => (
                          <button
                            key={staff.id}
                            onClick={() => handleUserSelect(staff)}
                            className="bg-white p-4 rounded-xl shadow hover:shadow-md border border-gray-100 text-left flex items-center gap-4 transition-all duration-200 hover:bg-indigo-50 hover:border-indigo-200">
                            <div className="bg-indigo-100 text-indigo-700 rounded-full w-12 h-12 flex items-center justify-center font-medium">
                              {staff.name ? staff.name.charAt(0) : '?'}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-900">{staff.name}</h3>
                              <p className="text-sm text-gray-500">{staff.department}</p>
                              <p className="text-sm text-gray-500">{staff.email}</p>
                            </div>
                            <div className="text-indigo-600">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                ) : (
                  <form id="performanceForm" onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Employee
                        </label>
                        <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                          <div className="flex items-center gap-4">
                            <div className="bg-indigo-100 text-indigo-700 rounded-full w-12 h-12 flex items-center justify-center font-medium">
                              {selectedUser?.name ? selectedUser.name.charAt(0) : '?'}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{selectedUser?.name}</div>
                              <p className="text-sm text-gray-500">{selectedUser?.department}</p>
                              <p className="text-sm text-gray-500">{selectedUser?.email}</p>
                            </div>
                          </div>
                        </div>
                        {errors.userId && (
                          <p className="mt-1 text-sm text-red-600">{errors.userId}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Performance Rating
                        </label>
                        <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                          <div className="flex flex-col sm:flex-row items-center justify-between mb-2">
                            <div className="flex items-center mb-3 sm:mb-0">
                              <div className="text-4xl font-bold text-indigo-600 mr-2">
                                {performance.rating || "-"}
                              </div>
                              <div className="text-gray-500">/5</div>
                            </div>
                            <div className="flex items-center">
                              {performance.rating > 0 && (
                                <div className={`rounded-full px-3 py-1.5 text-sm font-medium ${
                                  performance.rating >= 4 
                                  ? 'bg-green-100 text-green-800' 
                                  : performance.rating >= 3 
                                  ? 'bg-yellow-100 text-yellow-800' 
                                  : 'bg-red-100 text-red-800'
                                }`}>
                                  {performance.rating >= 4 
                                  ? 'Excellent' 
                                  : performance.rating >= 3 
                                  ? 'Good' 
                                  : 'Needs Improvement'}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <div className="grid grid-cols-5 gap-2 w-full">
                              {[1, 2, 3, 4, 5].map((value) => (
                                <button
                                  key={value}
                                  type="button"
                                  onClick={() => {
                                    setPerformance(prev => ({ ...prev, rating: value }));
                                    if (errors.rating) {
                                      setErrors(prev => ({ ...prev, rating: undefined }));
                                    }
                                  }}
                                  className={`h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                                    performance.rating === value
                                      ? 'bg-indigo-600 text-white ring-2 ring-indigo-600 ring-offset-2'
                                      : value <= performance.rating
                                      ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                  }`}>
                                  {value}
                                </button>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex justify-between text-xs text-gray-500 mt-2 px-1">
                            <span>Needs improvement</span>
                            <span>Excellent</span>
                          </div>
                        </div>
                        {errors.rating && (
                          <p className="mt-1 text-sm text-red-600">{errors.rating}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Feedback <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <textarea
                            name="feedback"
                            value={performance.feedback}
                            onChange={handleChange}
                            placeholder="Provide detailed feedback on the employee's performance..."
                            rows={5}
                            className={`block w-full rounded-xl shadow-sm resize-none transition-all duration-200 ease-in-out focus:ring-2 focus:ring-offset-0 ${
                              errors.feedback
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                                : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                            }`}
                          />
                          <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                            {performance.feedback.length} characters
                          </div>
                        </div>
                        {errors.feedback && (
                          <p className="mt-1 text-sm text-red-600">{errors.feedback}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Goals <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <textarea
                            name="goals"
                            value={performance.goals}
                            onChange={handleChange}
                            placeholder="Set goals for the upcoming period..."
                            rows={5}
                            className={`block w-full rounded-xl shadow-sm resize-none transition-all duration-200 ease-in-out focus:ring-2 focus:ring-offset-0 ${
                              errors.goals
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                                : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                            }`}
                          />
                          <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                            {performance.goals.length} characters
                          </div>
                        </div>
                        {errors.goals && (
                          <p className="mt-1 text-sm text-red-600">{errors.goals}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Strengths <span className="text-red-500">*</span>
                        </label>
                        <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                          <div className="space-y-3">
                            {performance.strengths.map((strength, index) => (
                              <div 
                                key={index} 
                                className="flex items-center gap-2">
                                <div className="bg-indigo-100 text-indigo-700 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
                                  {index + 1}
                                </div>
                                <input
                                  type="text"
                                  value={strength}
                                  onChange={(e) => handleArrayChange('strengths', index, e.target.value)}
                                  placeholder="Add a strength..."
                                  className={`flex-1 rounded-xl text-sm transition-all duration-200 ${
                                    errors.strengths
                                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                                      : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                                  }`}
                                />
                                <button
                                  type="button"
                                  onClick={() => removeArrayItem('strengths', index)}
                                  className="text-red-500 hover:text-red-700 transition-colors p-1 rounded-full hover:bg-red-50">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => addArrayItem('strengths')}
                            className="mt-3 flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors bg-indigo-100 hover:bg-indigo-200 px-3 py-2 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                            </svg>
                            Add Strength
                          </button>
                        </div>
                        {errors.strengths && (
                          <p className="mt-1 text-sm text-red-600">{errors.strengths}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Areas for Improvement <span className="text-red-500">*</span>
                        </label>
                        <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                          <div className="space-y-3">
                            {performance.areasForImprovement.map((area, index) => (
                              <div 
                                key={index} 
                                className="flex items-center gap-2">
                                <div className="bg-amber-100 text-amber-600 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
                                  {index + 1}
                                </div>
                                <input
                                  type="text"
                                  value={area}
                                  onChange={(e) => handleArrayChange('areasForImprovement', index, e.target.value)}
                                  placeholder="Add an area for improvement..."
                                  className={`flex-1 rounded-xl text-sm transition-all duration-200 ${
                                    errors.areasForImprovement
                                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                                      : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                                  }`}
                                />
                                <button
                                  type="button"
                                  onClick={() => removeArrayItem('areasForImprovement', index)}
                                  className="text-red-500 hover:text-red-700 transition-colors p-1 rounded-full hover:bg-red-50">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => addArrayItem('areasForImprovement')}
                            className="mt-3 flex items-center text-sm font-medium text-amber-600 hover:text-amber-800 transition-colors bg-amber-100 hover:bg-amber-200 px-3 py-2 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                            </svg>
                            Add Improvement Area
                          </button>
                        </div>
                        {errors.areasForImprovement && (
                          <p className="mt-1 text-sm text-red-600">{errors.areasForImprovement}</p>
                        )}
                      </div>
                    </div>
                  </form>
                )}
              </div>
              
              {/* Footer with Buttons - Fixed */}
              {currentStep === 2 && (
                <div className="p-5 border-t border-gray-200 bg-white rounded-b-2xl">
                  <div className="flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="flex items-center text-gray-600 hover:text-gray-900 transition-colors bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                      </svg>
                      Back to Employee Selection
                    </button>
                    
                    <div className="flex space-x-3">
                      <button
                        type="button"
                        onClick={() => {
                          setIsModalOpen(false);
                          setSelectedUser(null);
                          setErrors({});
                        }}
                        className="px-5 py-2.5 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-all duration-200 shadow-sm">
                        Cancel
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => {
                          document.getElementById('performanceForm').dispatchEvent(
                            new Event('submit', { cancelable: true, bubbles: true })
                          );
                        }}
                        disabled={isSubmitting}
                        className={`px-5 py-2.5 bg-indigo-600 text-white rounded-full shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300 ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}>
                        {isSubmitting ? (
                          <div className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Submitting...
                          </div>
                        ) : (
                          <>Submit Review</>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PerformanceForm; 
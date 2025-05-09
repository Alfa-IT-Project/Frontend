import React, { useState } from 'react';
import { useApiQuery } from '../../hooks/useApi';
import { users } from '../../services/api';
import { createPerformanceReview } from '../../services/performanceService';
import { toast } from 'react-hot-toast';
import { Navigate } from 'react-router-dom';

const PerformanceForm = () => {
  const userRole = localStorage.getItem('role');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const { data: staffMembers, isLoading } = useApiQuery(['staffMembers'], () => users.getAll());

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
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div
          className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const staffList = staffMembers?.filter((staff) => staff.role === 'STAFF') || [];

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
        Create New Review
      </button>
      {/* Performance Review Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div
            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Create Performance Review
                </h2>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setSelectedUser(null);
                    setErrors({});
                  }}
                  className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {!selectedUser ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {staffList.map((staff) => (
                    <div
                      key={staff.id}
                      className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleUserSelect(staff)}>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {staff.name}
                      </h3>
                      <p className="text-sm text-gray-500">{staff.department}</p>
                      <p className="text-sm text-gray-500">{staff.email}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Employee
                    </label>
                    <div className="mt-1 p-2 bg-gray-50 rounded-md">
                      <p className="text-gray-900">{selectedUser.name}</p>
                      <p className="text-sm text-gray-500">
                        {selectedUser.department}
                      </p>
                    </div>
                    {errors.userId && (
                      <p className="mt-1 text-sm text-red-600">{errors.userId}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Rating (1-5)
                    </label>
                    <div className="mt-1 flex items-center space-x-2">
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
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            performance.rating === value
                              ? 'bg-indigo-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}>
                          {value}
                        </button>
                      ))}
                    </div>
                    {errors.rating && (
                      <p className="mt-1 text-sm text-red-600">{errors.rating}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Feedback
                    </label>
                    <textarea
                      name="feedback"
                      value={performance.feedback}
                      onChange={handleChange}
                      rows={4}
                      className={`mt-1 block w-full rounded-md shadow-sm ${
                        errors.feedback
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                      }`} />
                    {errors.feedback && (
                      <p className="mt-1 text-sm text-red-600">{errors.feedback}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Goals
                    </label>
                    <textarea
                      name="goals"
                      value={performance.goals}
                      onChange={handleChange}
                      rows={3}
                      className={`mt-1 block w-full rounded-md shadow-sm ${
                        errors.goals
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                      }`} />
                    {errors.goals && (
                      <p className="mt-1 text-sm text-red-600">{errors.goals}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Strengths
                    </label>
                    <div className="mt-1 space-y-2">
                      {performance.strengths.map((strength, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={strength}
                            onChange={(e) =>
                              handleArrayChange('strengths', index, e.target.value)
                            }
                            className={`flex-1 rounded-md shadow-sm ${
                              errors.strengths
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                                : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                            }`} />
                          <button
                            type="button"
                            onClick={() => removeArrayItem('strengths', index)}
                            className="text-red-600 hover:text-red-800">
                            Remove
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addArrayItem('strengths')}
                        className="text-indigo-600 hover:text-indigo-800">
                        Add Strength
                      </button>
                    </div>
                    {errors.strengths && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.strengths}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Areas for Improvement
                    </label>
                    <div className="mt-1 space-y-2">
                      {performance.areasForImprovement.map((area, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={area}
                            onChange={(e) =>
                              handleArrayChange('areasForImprovement', index, e.target.value)
                            }
                            className={`flex-1 rounded-md shadow-sm ${
                              errors.areasForImprovement
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                                : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                            }`} />
                          <button
                            type="button"
                            onClick={() =>
                              removeArrayItem('areasForImprovement', index)
                            }
                            className="text-red-600 hover:text-red-800">
                            Remove
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addArrayItem('areasForImprovement')}
                        className="text-indigo-600 hover:text-indigo-800">
                        Add Area
                      </button>
                    </div>
                    {errors.areasForImprovement && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.areasForImprovement}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setIsModalOpen(false);
                        setSelectedUser(null);
                        setErrors({});
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50">
                      {isSubmitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PerformanceForm; 
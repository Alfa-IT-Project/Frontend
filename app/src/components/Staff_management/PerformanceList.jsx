import React, { useState } from 'react';
import { format } from 'date-fns';

const PerformanceList = ({ reviews }) => {
  const userRole = localStorage.getItem('role');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [expandedReviews, setExpandedReviews] = useState({});

  const toggleReviewExpand = (reviewId) => {
    setExpandedReviews(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  const getQuarterFromDate = (date) => {
    if (!date) return 'N/A';
    try {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) return 'N/A';
      const month = parsedDate.getMonth();
      return `Q${Math.floor(month / 3) + 1}`;
    } catch (error) {
      console.error('Error parsing date:', error);
      return 'N/A';
    }
  };

  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return sortOrder === 'desc'
          ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'rating':
        return sortOrder === 'desc' ? b.rating - a.rating : a.rating - b.rating;
      case 'name':
        const nameA = a.user?.name || '';
        const nameB = b.user?.name || '';
        return sortOrder === 'desc'
          ? nameB.localeCompare(nameA)
          : nameA.localeCompare(nameB);
      default:
        return 0;
    }
  });

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  // Function to truncate text
  const truncateText = (text, maxLength = 60) => {
    if (!text || text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold">Performance Reviews</h2>
        {userRole === 'ADMIN' && (
          <div className="flex flex-wrap gap-2 sm:gap-4">
            <button
              onClick={() => handleSort('date')}
              className={`px-3 sm:px-5 py-2 rounded-full transition-all duration-300 font-medium shadow-sm hover:shadow text-sm sm:text-base ${
                sortBy === 'date'
                  ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}>
              Date {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button
              onClick={() => handleSort('rating')}
              className={`px-3 sm:px-5 py-2 rounded-full transition-all duration-300 font-medium shadow-sm hover:shadow text-sm sm:text-base ${
                sortBy === 'rating'
                  ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}>
              Rating {sortBy === 'rating' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button
              onClick={() => handleSort('name')}
              className={`px-3 sm:px-5 py-2 rounded-full transition-all duration-300 font-medium shadow-sm hover:shadow text-sm sm:text-base ${
                sortBy === 'name'
                  ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}>
              Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
          </div>
        )}
      </div>
      {sortedReviews.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No performance reviews found for this quarter.</p>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {sortedReviews.map((review) => (
            <div
              key={review.id}
              className={`bg-white rounded-2xl shadow hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden ${
                expandedReviews[review.id] ? 'ring-2 ring-indigo-300' : ''
              }`}
            >
              {/* Compact Header - Always visible */}
              <div 
                className="p-4 flex justify-between items-center cursor-pointer"
                onClick={() => toggleReviewExpand(review.id)}
              >
                <div className="flex items-center space-x-3 truncate">
                  <span
                    className={`px-3 py-1.5 rounded-full text-white font-medium flex-shrink-0 ${
                      review.rating >= 4
                        ? 'bg-green-500'
                        : review.rating >= 3
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                  >
                    {review.rating}/5
                  </span>
                  
                  {userRole === 'ADMIN' && review.user && (
                    <span className="truncate font-medium text-gray-800">
                      {review.user.name}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center flex-shrink-0 ml-2">
                  <span className="text-xs text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full mr-2 whitespace-nowrap">
                    {getQuarterFromDate(review.createdAt)} {new Date(review.createdAt).getFullYear()}
                  </span>
                  <button 
                    className="text-indigo-600 focus:outline-none flex-shrink-0"
                    aria-label={expandedReviews[review.id] ? "Collapse details" : "Expand details"}
                  >
                    {expandedReviews[review.id] ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              
              {/* Preview - Only visible when collapsed */}
              {!expandedReviews[review.id] && (
                <div className="px-4 pb-4 pt-0">
                  <p className="text-sm text-gray-600 italic line-clamp-2">
                    "{truncateText(review.feedback)}"
                  </p>
                </div>
              )}
              
              {/* Expanded Details - Only visible when expanded */}
              {expandedReviews[review.id] && (
                <div className="p-4 border-t border-gray-100">
                  {userRole === 'ADMIN' && review.user && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-xl">
                      <h3 className="text-sm font-medium text-gray-700">
                        Employee Information
                      </h3>
                      <div className="mt-1.5 space-y-1">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Department:</span>{' '}
                          {review.user.department}
                        </p>
                        <p className="text-sm text-gray-600 break-words">
                          <span className="font-medium">Email:</span> {review.user.email}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Date:</span>{' '}
                          {review.createdAt ? format(new Date(review.createdAt), 'MMMM d, yyyy') : 'N/A'}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="p-3 bg-indigo-50 rounded-xl">
                      <h3 className="text-sm font-medium text-indigo-700">Feedback</h3>
                      <p className="mt-1 text-sm text-gray-600 break-words">{review.feedback}</p>
                    </div>

                    <div className="p-3 bg-green-50 rounded-xl">
                      <h3 className="text-sm font-medium text-green-700">Goals</h3>
                      <p className="mt-1 text-sm text-gray-600 break-words">{review.goals}</p>
                    </div>

                    <div className="p-3 bg-blue-50 rounded-xl">
                      <h3 className="text-sm font-medium text-blue-700">Strengths</h3>
                      <ul className="mt-1 list-disc list-inside text-sm text-gray-600">
                        {(review.strengths || []).map((strength, index) => (
                          <li key={index} className="break-words">{strength}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 bg-amber-50 rounded-xl">
                      <h3 className="text-sm font-medium text-amber-700">
                        Areas for Improvement
                      </h3>
                      <ul className="mt-1 list-disc list-inside text-sm text-gray-600">
                        {(review.areasForImprovement || []).map((area, index) => (
                          <li key={index} className="break-words">{area}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PerformanceList; 
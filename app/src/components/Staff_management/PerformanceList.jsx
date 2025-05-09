import React, { useState } from 'react';
import { format } from 'date-fns';

const PerformanceList = ({ reviews }) => {
  const userRole = localStorage.getItem('role');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

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

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Performance Reviews</h2>
        {userRole === 'ADMIN' && (
          <div className="flex gap-4">
            <button
              onClick={() => handleSort('date')}
              className={`px-4 py-2 rounded-md ${
                sortBy === 'date'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-gray-100 text-gray-700'
              }`}>
              Date {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button
              onClick={() => handleSort('rating')}
              className={`px-4 py-2 rounded-md ${
                sortBy === 'rating'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-gray-100 text-gray-700'
              }`}>
              Rating {sortBy === 'rating' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button
              onClick={() => handleSort('name')}
              className={`px-4 py-2 rounded-md ${
                sortBy === 'name'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-gray-100 text-gray-700'
              }`}>
              Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
          </div>
        )}
      </div>
      {sortedReviews.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No performance reviews found for this quarter.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {sortedReviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <span className="text-lg font-semibold">Rating:</span>
                  <span
                    className={`ml-2 px-3 py-1 rounded-full text-white ${
                      review.rating >= 4
                        ? 'bg-green-500'
                        : review.rating >= 3
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}>
                    {review.rating}/5
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-500">
                    {getQuarterFromDate(review.createdAt)} {new Date(review.createdAt).getFullYear()}
                  </span>
                  <br />
                  <span className="text-sm text-gray-500">
                    {review.createdAt ? format(new Date(review.createdAt), 'MMMM d, yyyy') : 'N/A'}
                  </span>
                </div>
              </div>

              {userRole === 'ADMIN' && review.user && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-700">
                    Employee Information
                  </h3>
                  <div className="mt-1 space-y-1">
                    <p className="text-gray-600">
                      <span className="font-medium">Name:</span> {review.user.name}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Department:</span>{' '}
                      {review.user.department}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Email:</span> {review.user.email}
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Feedback</h3>
                  <p className="mt-1 text-gray-600">{review.feedback}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700">Goals</h3>
                  <p className="mt-1 text-gray-600">{review.goals}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700">Strengths</h3>
                  <ul className="mt-1 list-disc list-inside text-gray-600">
                    {(review.strengths || []).map((strength, index) => (
                      <li key={index}>{strength}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700">
                    Areas for Improvement
                  </h3>
                  <ul className="mt-1 list-disc list-inside text-gray-600">
                    {(review.areasForImprovement || []).map((area, index) => (
                      <li key={index}>{area}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PerformanceList; 
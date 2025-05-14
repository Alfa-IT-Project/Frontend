import React from 'react';
import { leaves, attendance, payroll } from '../../services/api';
import { useApiQuery } from '../../hooks/useApi';
import { getPerformanceReviews } from '../../services/performanceService';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const ManagerDashboard = ({ user }) => {
  const { data: pendingLeaves } = useApiQuery(['pendingLeaves'], () => leaves.getAll());

  const { data: attendanceSummary } = useApiQuery(['attendanceSummary'], () => attendance.getSummary());

  const { data: payrollRecords } = useApiQuery(['payrollSummary'], () => payroll.getAll());

  const { data: performanceReviews } = useApiQuery(['performanceReviews'], () => getPerformanceReviews());

  const processedPayrolls = payrollRecords?.filter(record => record.status === 'PAID').length || 0;
  const pendingPayrolls = payrollRecords?.filter(record => record.status === 'PENDING').length || 0;
  const averageRating = performanceReviews?.length 
    ? (performanceReviews.reduce((sum, review) => sum + review.rating, 0) / performanceReviews.length).toFixed(1)
    : '0.0';
  
  // Get the most recent pending leave requests (top 3)
  const recentPendingLeaves = pendingLeaves
    ?.filter(leave => leave.status === 'PENDING')
    .slice(0, 3) || [];

  return (
    <div className="space-y-8 pl-8">
      {/* Welcome Section */}
      <div className="mb-8 mt-8">
        <h1 className="text-3xl font-bold text-gray-800">Welcome back, {user?.name}</h1>
        <p className="text-lg text-gray-600 mt-1">{format(new Date(), 'EEEE, MMMM do, yyyy')}</p>
      </div>
      {/* Metrics Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      </div>
      {/* Quick Actions */}
      <div
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <Link
              to="/user-management"
              className="flex flex-col items-center p-4 rounded-lg bg-gray-50 hover:bg-indigo-50 transition-colors">
              <div
                className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mb-2">
                <svg
                  className="h-6 w-6 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-900">Manage Staff</span>
            </Link>
            
            <Link
              to="/scheduler"
              className="flex flex-col items-center p-4 rounded-lg bg-gray-50 hover:bg-indigo-50 transition-colors">
              <div
                className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mb-2">
                <svg
                  className="h-6 w-6 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-900">Schedule Shifts</span>
            </Link>
            
            <Link
              to="/attendance-records"
              className="flex flex-col items-center p-4 rounded-lg bg-gray-50 hover:bg-indigo-50 transition-colors">
              <div
                className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mb-2">
                <svg
                  className="h-6 w-6 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-900">Attendance Records</span>
            </Link>
            
            <Link
              to="/performance"
              className="flex flex-col items-center p-4 rounded-lg bg-gray-50 hover:bg-indigo-50 transition-colors">
              <div
                className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mb-2">
                <svg
                  className="h-6 w-6 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-900">Performance Reviews</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard; 
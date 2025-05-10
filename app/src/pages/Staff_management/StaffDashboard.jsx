import React, { useEffect, useState } from 'react';
import { leaves, attendance, schedules } from '../../services/api';
import { useApiQuery } from '../../hooks/useApi';
import { getPerformanceReviews } from '../../services/performanceService';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const StaffDashboard = () => {
  const [userName, setUserName] = useState(localStorage.getItem('userName') || '');
  const { data: leaveBalance } = useApiQuery(['leaveBalance'], () => leaves.getBalance());

  const { data: todayAttendance, refetch: refetchAttendance } = useApiQuery(['todayAttendance'], () => attendance.getRecords({ 
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd')
  }));

  // Force refresh attendance data on component mount
  useEffect(() => {
    refetchAttendance();
  }, [refetchAttendance]);

  const { data: upcomingSchedules } = useApiQuery(['upcomingSchedules'], () => schedules.getAll());

  const { data: performanceReviews } = useApiQuery(['performanceReviews'], () => getPerformanceReviews());

  const latestReview = performanceReviews?.[0];
  const currentTime = new Date();
  const greeting = currentTime.getHours() < 12 ? 'Good morning' : 
                  currentTime.getHours() < 18 ? 'Good afternoon' : 'Good evening';

  // Helper function to get status display text
  const getStatusDisplay = (status) => {
    if (!status) return 'Not Marked';
    
    // Convert database status to display status
    switch(status.toUpperCase()) {
      case 'ON_TIME':
        return 'Present';
      case 'LATE':
        return 'Late';
      case 'ABSENT':
        return 'Absent';
      case 'HALF_DAY':
        return 'Half Day';
      default:
        return status;
    }
  };

  // Helper function to get status color class
  const getStatusColorClass = (status) => {
    if (!status) return 'text-yellow-600';
    
    switch(status.toUpperCase()) {
      case 'ON_TIME':
        return 'text-green-600';
      case 'LATE':
        return 'text-orange-600';
      case 'ABSENT':
        return 'text-red-600';
      case 'HALF_DAY':
        return 'text-blue-600';
      default:
        return 'text-yellow-600';
    }
  };

  return (
    <div className="p-6">
      {/* Enhanced Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          {greeting}, {userName}
        </h1>
        <p className="text-base md:text-lg text-gray-600 mt-1">
          {format(new Date(), 'EEEE, MMMM do, yyyy')}
        </p>
      </div>
      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        <Link
          to="/attendance"
          className="flex flex-col items-center p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-all">
          <div
            className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mb-2">
            <svg
              className="h-6 w-6 text-indigo-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-sm font-medium text-gray-900">Clock In/Out</span>
        </Link>
        
        <Link
          to="/leaves"
          className="flex flex-col items-center p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-all">
          <div
            className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mb-2">
            <svg
              className="h-6 w-6 text-indigo-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="text-sm font-medium text-gray-900">Apply Leave</span>
        </Link>
        
        <Link
          to="/calendar"
          className="flex flex-col items-center p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-all">
          <div
            className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mb-2">
            <svg
              className="h-6 w-6 text-indigo-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="text-sm font-medium text-gray-900">View Calendar</span>
        </Link>
        
        <Link
          to="/performance"
          className="flex flex-col items-center p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-all">
          <div
            className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mb-2">
            <svg
              className="h-6 w-6 text-indigo-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <span className="text-sm font-medium text-gray-900">Performance</span>
        </Link>
      </div>
      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Leave Balance Widget */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
            <div className="px-4 md:px-6 py-4 md:py-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Leave Balance</h3>
                <svg
                  className="h-8 w-8 text-indigo-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="mt-4 space-y-3">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">Total Leave Days</p>
                    <p className="text-lg font-semibold text-gray-900">{leaveBalance?.total || 0}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">Remaining Days</p>
                    <p className="text-lg font-semibold text-gray-900">{leaveBalance?.remaining || 0}</p>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Annual Leave</span>
                    <span className="text-sm font-medium">{leaveBalance?.ANNUAL || 0} days</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                    <div
                      className="bg-green-600 h-2.5 rounded-full"
                      style={{ width: `${((leaveBalance?.ANNUAL || 0) / 20) * 100}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Sick Leave</span>
                    <span className="text-sm font-medium">{leaveBalance?.SICK || 0} days</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${((leaveBalance?.SICK || 0) / 10) * 100}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Casual Leave</span>
                    <span className="text-sm font-medium">{leaveBalance?.CASUAL || 0} days</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                    <div
                      className="bg-yellow-500 h-2.5 rounded-full"
                      style={{ width: `${((leaveBalance?.CASUAL || 0) / 5) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Attendance Status Widget */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
            <div className="px-4 md:px-6 py-4 md:py-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Today's Attendance</h3>
                <svg
                  className="h-8 w-8 text-indigo-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <span
                    className={`text-sm font-medium ${getStatusColorClass(todayAttendance?.[0]?.status)}`}>
                    {getStatusDisplay(todayAttendance?.[0]?.status)}
                  </span>
                </div>
                {todayAttendance?.[0]?.clockInTime && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Clock In</span>
                      <span className="text-sm font-medium">
                        {format(new Date(todayAttendance[0].clockInTime), 'h:mm a')}
                      </span>
                    </div>
                  </div>
                )}
                {todayAttendance?.[0]?.clockOutTime && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Clock Out</span>
                      <span className="text-sm font-medium">
                        {format(new Date(todayAttendance[0].clockOutTime), 'h:mm a')}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Upcoming Schedule Widget */}
          <div
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
            <div className="px-6 py-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Today's Schedule</h3>
                <svg
                  className="h-8 w-8 text-indigo-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="mt-4">
                {upcomingSchedules?.[0] ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Shift Type</span>
                      <span className="text-sm font-medium">{upcomingSchedules[0].shiftType}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Start Time</span>
                      <span className="text-sm font-medium">
                        {format(new Date(upcomingSchedules[0].startTime), 'h:mm a')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">End Time</span>
                      <span className="text-sm font-medium">
                        {format(new Date(upcomingSchedules[0].endTime), 'h:mm a')}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No schedule found for today</p>
                )}
              </div>
            </div>
          </div>

          {/* Performance Review Widget */}
          <div
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
            <div className="px-6 py-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Latest Performance Review</h3>
                <svg
                  className="h-8 w-8 text-indigo-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="mt-4">
                {latestReview ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Rating</span>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, index) => (
                          <svg
                            key={index}
                            className={`h-5 w-5 ${index < latestReview.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20">
                            <path
                              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Feedback</span>
                      <p className="text-sm mt-1 text-gray-800 line-clamp-2">{latestReview.feedback}</p>
                    </div>
                    <Link
                      to="/performance"
                      className="inline-block text-sm text-indigo-600 hover:text-indigo-800 mt-2">
                      View Full Review
                    </Link>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No performance reviews found</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard; 
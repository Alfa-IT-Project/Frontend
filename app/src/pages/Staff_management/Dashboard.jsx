import React from 'react';
import { leaves, attendance, schedules } from '../../services/api';
import { useApiQuery } from '../../hooks/useApi';
import DashboardLayout from '../components/Staff_management/DashboardLayout';
import { format, parseISO } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  const { data: leaveBalance } = useApiQuery(['leaveBalance'], () => leaves.getBalance());

  const { data: todayAttendance } = useApiQuery(
    ['todayAttendance'],
    () => attendance.getRecords({ startDate: format(new Date(), 'yyyy-MM-dd') })
  );

  const { data: upcomingSchedules } = useApiQuery(['upcomingSchedules'], () => schedules.getByUserId(user?.id || ''));

  // Get the next 7 days of schedules
  const nextSevenDaysSchedules = upcomingSchedules
    ? upcomingSchedules
        .filter(schedule => {
          const scheduleDate = parseISO(schedule.startTime);
          return scheduleDate >= new Date();
        })
        .slice(0, 7)
    : [];

  const getStatusColor = (status) => {
    switch (status) {
      case 'PRESENT':
        return 'bg-green-500';
      case 'ABSENT':
        return 'bg-red-500';
      case 'LATE':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Welcome back, {user?.name}</h1>
          <p className="text-lg text-gray-600 mt-1">{format(new Date(), 'EEEE, MMMM do, yyyy')}</p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Leave Balance Widget */}
          <div
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
            <div className="px-6 py-5">
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
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Annual</span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-2.5 mr-2">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${Math.min(100, (leaveBalance?.ANNUAL || 0) * 10)}%` }}></div>
                    </div>
                    <span className="text-sm font-medium">{leaveBalance?.ANNUAL || 0} days</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Sick</span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-2.5 mr-2">
                      <div
                        className="bg-purple-600 h-2.5 rounded-full"
                        style={{ width: `${Math.min(100, (leaveBalance?.SICK || 0) * 10)}%` }}></div>
                    </div>
                    <span className="text-sm font-medium">{leaveBalance?.SICK || 0} days</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Casual</span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-2.5 mr-2">
                      <div
                        className="bg-teal-500 h-2.5 rounded-full"
                        style={{ width: `${Math.min(100, (leaveBalance?.CASUAL || 0) * 10)}%` }}></div>
                    </div>
                    <span className="text-sm font-medium">{leaveBalance?.CASUAL || 0} days</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-3">
              <a
                href="/leaves"
                className="text-sm text-indigo-600 font-medium hover:text-indigo-800">Apply for leave →</a>
            </div>
          </div>

          {/* Today's Attendance Widget */}
          <div
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-5">
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
                {todayAttendance && todayAttendance.length > 0 ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Status</span>
                      <span
                        className={`text-sm font-medium ${getStatusColor(todayAttendance[0].status)} text-white px-2 py-1 rounded-full`}>
                        {todayAttendance[0].status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Clock In</span>
                      <span className="text-sm font-medium">{todayAttendance[0].clockInTime ? format(new Date(todayAttendance[0].clockInTime), 'hh:mm a') : 'Not recorded'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Clock Out</span>
                      <span className="text-sm font-medium">{todayAttendance[0].clockOutTime ? format(new Date(todayAttendance[0].clockOutTime), 'hh:mm a') : 'Not recorded'}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No attendance record for today</p>
                )}
              </div>
            </div>
          </div>

          {/* Upcoming Schedule Widget */}
          <div
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Upcoming Schedule</h3>
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
                {nextSevenDaysSchedules.length > 0 ? (
                  <div className="space-y-3">
                    {nextSevenDaysSchedules.slice(0, 3).map((schedule, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{format(new Date(schedule.startTime), 'EEE, MMM d')}</span>
                        <span className="text-sm font-medium">{format(new Date(schedule.startTime), 'hh:mm a')} - {format(new Date(schedule.endTime), 'hh:mm a')}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No upcoming schedules</p>
                )}
              </div>
              
              <div className="mt-4">
                <a
                  href="/calendar"
                  className="text-sm text-indigo-600 font-medium hover:text-indigo-800">View full schedule →</a>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Schedule */}
        <div
          className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="px-6 py-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Schedule</h3>
            
            {nextSevenDaysSchedules.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shift</th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {nextSevenDaysSchedules.map((schedule) => (
                      <tr key={schedule.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{format(parseISO(schedule.startTime), 'EEEE')}</div>
                          <div className="text-sm text-gray-500">{format(parseISO(schedule.startTime), 'MMM do')}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {format(parseISO(schedule.startTime), 'h:mm a')} - {format(parseISO(schedule.endTime), 'h:mm a')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                            {schedule.shiftType}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {schedule.role}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">No upcoming shifts scheduled for the next 7 days.</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div
          className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              <a
                href="/attendance"
                className="flex flex-col items-center p-4 rounded-lg bg-gray-50 hover:bg-indigo-50 transition-colors">
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
              </a>
              
              <a
                href="/leaves"
                className="flex flex-col items-center p-4 rounded-lg bg-gray-50 hover:bg-indigo-50 transition-colors">
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
                <span className="text-sm font-medium text-gray-900">Apply for Leave</span>
              </a>
              
              <a
                href="/calendar"
                className="flex flex-col items-center p-4 rounded-lg bg-gray-50 hover:bg-indigo-50 transition-colors">
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
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-900">Schedule</span>
              </a>
              
              <a
                href="/payroll"
                className="flex flex-col items-center p-4 rounded-lg bg-gray-50 hover:bg-indigo-50 transition-colors">
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
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-900">Payroll</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard; 
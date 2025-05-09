import React, { useState, useEffect } from 'react';
import { useApiQuery } from '../../hooks/useApi';
import { format, parseISO } from 'date-fns';
import { attendance } from '../../services/api';

const ManagerAttendance = () => {
  const [selectedUser, setSelectedUser] = useState('');
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const { data: attendanceRecords, isLoading } = useApiQuery(
    ['attendance-records', selectedUser, startDate, endDate],
    () => attendance.getRecords({
      userId: selectedUser || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined
    })
  );

  const { data: pendingOTPs, isLoading: isLoadingOTPs, error: otpError } = useApiQuery(['pending-otps'], () => attendance.getPendingOTPs(), {
    refetchInterval: 30000, // Refetch every 30 seconds
    retry: 3,
    retryDelay: 1000
  });

  // Debug logs
  useEffect(() => {
    if (otpError) {
      console.error('Error fetching pending OTPs:', otpError);
    }
    console.log('Pending OTPs:', pendingOTPs);
  }, [pendingOTPs, otpError]);

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Attendance Management</h1>
        <p className="text-lg text-gray-600 mt-1">{format(new Date(), 'EEEE, MMMM do, yyyy')}</p>
      </div>
      {/* Pending OTPs Section */}
      <div
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="px-6 py-5">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Pending OTPs</h3>

          {isLoadingOTPs ? (
            <div className="p-4 text-center">Loading pending OTPs...</div>
          ) : otpError ? (
            <div className="p-4 text-center text-red-600">
              Error loading pending OTPs. Please try again later.
            </div>
          ) : pendingOTPs && pendingOTPs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      OTP
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Expires At
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pendingOTPs.map((otp) => (
                    <tr key={otp.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{otp.user.name}</div>
                        <div className="text-sm text-gray-500">{otp.user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {otp.user.department}
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                        {otp.otp}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {otp.type === 'CLOCK_IN' ? 'Clock In' : 'Clock Out'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {otp.expiresAt ? format(parseISO(otp.expiresAt), 'HH:mm:ss') : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">No pending OTPs</div>
          )}
        </div>
      </div>
      {/* Attendance Records Section */}
      <div
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5">
          <div
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Attendance Records</h3>
            <div
              className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center space-x-2">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" />
                <span className="text-gray-500">to</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" />
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="p-4 text-center">Loading...</div>
          ) : attendanceRecords?.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No attendance records found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Clock In
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Clock Out
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {attendanceRecords?.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{record.user?.name}</div>
                        <div className="text-sm text-gray-500">{record.user?.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.user?.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.date ? format(parseISO(record.date), 'MMM d, yyyy') : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.clockIn ? format(parseISO(record.clockIn), 'HH:mm') : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.clockOut ? format(parseISO(record.clockOut), 'HH:mm') : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${record.status === 'PRESENT'
                              ? 'bg-green-100 text-green-800'
                              : record.status === 'ABSENT' ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                            }`}>
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerAttendance; 
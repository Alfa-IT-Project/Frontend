import React, { useState } from 'react';
import { useApiQuery } from '../../hooks/useApi';
import { schedules } from '../../services/api';
import { format } from 'date-fns';
import ScheduleManager from '../../components/Staff_management/ScheduleManager';

const Scheduler = ({ isAdmin = false }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const { data: schedulesList } = useApiQuery(
    ['schedules', format(selectedDate, 'yyyy-MM-dd')],
    () => schedules.getAll({
      startDate: format(selectedDate, 'yyyy-MM-dd'),
      endDate: format(selectedDate, 'yyyy-MM-dd')
    })
  );

  // Staff view of their schedule
  const StaffScheduleView = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">My Schedule</h1>
        <input
          type="date"
          value={format(selectedDate, 'yyyy-MM-dd')}
          onChange={(e) => setSelectedDate(new Date(e.target.value))}
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {format(selectedDate, 'EEEE, MMMM do, yyyy')}
          </h3>
        </div>
        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            {schedulesList?.map((schedule) => (
              <li key={schedule.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-indigo-600 truncate">
                      {schedule.user?.name || 'Unknown'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {schedule.user?.department || 'Unknown'}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {format(new Date(schedule.startTime), 'h:mm a')} - {format(new Date(schedule.endTime), 'h:mm a')}
                      </p>
                      <p className="text-sm text-gray-500">
                        {schedule.role}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${schedule.shiftType === 'MORNING' ? 'bg-blue-100 text-blue-800' :
                          schedule.shiftType === 'AFTERNOON' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-purple-100 text-purple-800'}`}>
                      {schedule.shiftType}
                    </span>
                  </div>
                </div>
              </li>
            ))}
            {schedulesList?.length === 0 && (
              <li className="px-4 py-4 sm:px-6">
                <p className="text-sm text-gray-500">
                  No schedules found for this day.
                </p>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {isAdmin ? <ScheduleManager /> : <StaffScheduleView />}
    </>
  );
};

export default Scheduler; 
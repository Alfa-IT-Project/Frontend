import React, { useState, useMemo, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useApiQuery } from '../../hooks/useApi';
import { leaves } from '../../services/api';

const LeaveCalendar = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const calendarRef = useRef(null);
  const { data: leaveRequests } = useApiQuery(['leaves'], () => leaves.getAll());

  // Calculate conflicts
  const conflicts = useMemo(() => {
    if (!leaveRequests) return [];

    const conflicts = [];
    const departmentLeaves = new Map();

    // Group leaves by department
    leaveRequests.forEach(leave => {
      if (!departmentLeaves.has(leave.user.department)) {
        departmentLeaves.set(leave.user.department, []);
      }
      departmentLeaves.get(leave.user.department)?.push(leave);
    });

    // Check for conflicts within each department
    departmentLeaves.forEach((leaves, department) => {
      if (leaves.length < 2) return;

      const dateMap = new Map();

      leaves.forEach(leave => {
        const start = new Date(leave.startDate);
        const end = new Date(leave.endDate);
        
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          const dateStr = d.toISOString().split('T')[0];
          if (!dateMap.has(dateStr)) {
            dateMap.set(dateStr, []);
          }
          dateMap.get(dateStr)?.push(leave.user.name);
        }
      });

      dateMap.forEach((employees, date) => {
        if (employees.length > 1) {
          conflicts.push({
            department,
            date,
            employees
          });
        }
      });
    });

    return conflicts;
  }, [leaveRequests]);

  // Filter events based on selected department
  const events = useMemo(() => {
    if (!leaveRequests) return [];

    return leaveRequests
      .filter(
      leave => selectedDepartment === 'all' || leave.user.department === selectedDepartment
    )
      .map(leave => ({
        id: leave.id,
        title: `${leave.user.name} - ${leave.type}`,
        start: leave.startDate,
        end: leave.endDate,
        backgroundColor: leave.status === 'APPROVED' 
          ? '#10B981' // green
          : leave.status === 'REJECTED'
          ? '#EF4444' // red
          : '#F59E0B', // yellow
        borderColor: leave.status === 'APPROVED'
          ? '#059669' // dark green
          : leave.status === 'REJECTED'
          ? '#DC2626' // dark red
          : '#D97706', // dark yellow
        extendedProps: {
          department: leave.user.department,
          reason: leave.reason,
          status: leave.status,
          managerComment: leave.managerComment,
          userName: leave.user.name,
          leaveType: leave.type,
          hasConflict: conflicts.some(c => 
            c.department === leave.user.department && 
            new Date(c.date) >= new Date(leave.startDate) && 
            new Date(c.date) <= new Date(leave.endDate))
        }
      }));
  }, [leaveRequests, selectedDepartment, conflicts]);

  const departments = useMemo(() => {
    if (!leaveRequests) return [];
    return Array.from(new Set(leaveRequests.map(leave => leave.user.department)));
  }, [leaveRequests]);

  const eventContent = (eventInfo) => {
    const hasConflict = eventInfo.event.extendedProps.hasConflict;
    return (
      <div className={`px-2 py-1 rounded-md transition-all duration-200 ${hasConflict ? 'border-l-4 border-red-500' : ''}`}>
        <div className="font-medium text-sm truncate">{eventInfo.event.title}</div>
        <div className="text-xs opacity-80">{eventInfo.event.extendedProps.department}</div>
        {hasConflict && (
          <div className="text-xs font-semibold flex items-center mt-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Conflict
          </div>
        )}
      </div>
    );
  };

  const eventClick = (info) => {
    const event = info.event;
    setSelectedEvent({
      title: event.title,
      department: event.extendedProps.department,
      status: event.extendedProps.status,
      reason: event.extendedProps.reason,
      managerComment: event.extendedProps.managerComment,
      start: event.start,
      end: event.end,
      conflicts: conflicts.filter(c => 
        c.department === event.extendedProps.department && 
        new Date(c.date) >= new Date(event.start) && 
        new Date(c.date) <= new Date(event.end))
    });
    setShowEventModal(true);
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 rounded-t-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h2 className="text-lg font-medium text-gray-900">Team Leave Calendar</h2>
          <div className="mt-3 md:mt-0 relative">
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-xl transition-all duration-200">
              <option value="all">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        {/* Calendar Legend */}
        <div className="mb-6 flex flex-wrap items-center gap-4 bg-gray-50 p-3 rounded-xl">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded-md mr-2"></div>
            <span className="text-sm text-gray-700">Approved</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-500 rounded-md mr-2"></div>
            <span className="text-sm text-gray-700">Pending</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded-md mr-2"></div>
            <span className="text-sm text-gray-700">Rejected</span>
          </div>
          <div className="flex items-center">
            <div className="h-4 w-1 bg-red-500 mr-2"></div>
            <span className="text-sm text-gray-700">Conflict</span>
          </div>
        </div>
  
        {/* Calendar */}
        <div className="calendar-container">
          <style jsx="true">{`
            .calendar-container .fc-theme-standard .fc-scrollgrid {
              border-radius: 0.75rem;
              overflow: hidden;
              border: 1px solid #e5e7eb;
            }
            .calendar-container .fc-theme-standard th {
              background-color: #f9fafb;
              padding: 12px 0;
              font-weight: 500;
            }
            .calendar-container .fc-theme-standard td {
              border-color: #e5e7eb;
            }
            .calendar-container .fc-daygrid-day.fc-day-today {
              background-color: #f3f4f6;
            }
            .calendar-container .fc-header-toolbar {
              margin-bottom: 1.5rem !important;
            }
            .calendar-container .fc-button-primary {
              background-color: #6366f1;
              border-color: #6366f1;
              transition: all 0.2s;
            }
            .calendar-container .fc-button-primary:hover {
              background-color: #4f46e5;
              border-color: #4f46e5;
            }
            .calendar-container .fc-button-primary:not(:disabled):active,
            .calendar-container .fc-button-primary:not(:disabled).fc-button-active {
              background-color: #4338ca;
              border-color: #4338ca;
            }
            .calendar-container .fc-daygrid-event {
              border-radius: 0.375rem;
              padding: 2px 0;
              margin-top: 2px;
            }
          `}</style>
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek'
            }}
            events={events}
            eventContent={eventContent}
            eventClick={eventClick}
            height="auto"
            eventDisplay="block"
            eventTimeFormat={{
              hour: '2-digit',
              minute: '2-digit',
              meridiem: false
            }}
            dayMaxEvents={3}
          />
        </div>
      </div>

      {/* Event Details Modal */}
      {showEventModal && selectedEvent && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setShowEventModal(false)}></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Leave Details
                    </h3>
                    <div className="mt-4 space-y-3">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Employee</h4>
                        <p className="mt-1 text-sm text-gray-900">{selectedEvent.title}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Department</h4>
                        <p className="mt-1 text-sm text-gray-900">{selectedEvent.department}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Status</h4>
                        <p className="mt-1">
                          <span 
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              selectedEvent.status === 'APPROVED' 
                                ? 'bg-green-100 text-green-800' 
                                : selectedEvent.status === 'REJECTED'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {selectedEvent.status}
                          </span>
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Duration</h4>
                        <p className="mt-1 text-sm text-gray-900">
                          {formatDate(selectedEvent.start)} to {formatDate(selectedEvent.end)}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Reason</h4>
                        <p className="mt-1 text-sm text-gray-900">{selectedEvent.reason || 'Not specified'}</p>
                      </div>
                      
                      {selectedEvent.managerComment && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Manager Comment</h4>
                          <p className="mt-1 text-sm text-gray-900">{selectedEvent.managerComment}</p>
                        </div>
                      )}
                      
                      {selectedEvent.conflicts.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-red-500 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            Conflicts
                          </h4>
                          <div className="mt-1 text-sm text-gray-900 bg-red-50 p-3 rounded-lg space-y-1">
                            {selectedEvent.conflicts.map((conflict, idx) => (
                              <p key={idx} className="text-sm">
                                <span className="font-medium">{formatDate(conflict.date)}:</span> {conflict.employees.join(', ')}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-xl">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-xl border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm transition-all duration-200"
                  onClick={() => setShowEventModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveCalendar; 
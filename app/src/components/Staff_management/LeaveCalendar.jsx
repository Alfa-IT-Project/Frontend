import React, { useState, useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useApiQuery } from '../../hooks/useApi';
import { leaves } from '../../services/api';

const LeaveCalendar = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('all');
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
      <div className={`p-1 ${hasConflict ? 'border-l-4 border-red-500' : ''}`}>
        <div className="font-medium text-sm">{eventInfo.event.title}</div>
        <div className="text-xs">{eventInfo.event.extendedProps.department}</div>
        {hasConflict && (
          <div className="text-xs text-red-500">⚠️ Conflict</div>
        )}
      </div>
    );
  };

  const eventClick = (info) => {
    const event = info.event;
    const conflictsForEvent = conflicts.filter(c => 
      c.department === event.extendedProps.department && 
      new Date(c.date) >= new Date(event.start) && 
      new Date(c.date) <= new Date(event.end));

    const conflictMessage = conflictsForEvent.length > 0
      ? `\n\nConflicts:\n${conflictsForEvent.map(c => 
          `- ${c.date}: ${c.employees.join(', ')}`).join('\n')}`
      : '';

    alert(`
      Leave Details:
      Employee: ${event.title}
      Department: ${event.extendedProps.department}
      Status: ${event.extendedProps.status}
      Reason: ${event.extendedProps.reason}
      ${event.extendedProps.managerComment ? `Manager Comment: ${event.extendedProps.managerComment}` : ''}
      ${conflictMessage}
    `);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="mb-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Team Leave Calendar</h2>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="mt-1 block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
            <option value="all">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
        <div className="mt-2 flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm">Approved</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
            <span className="text-sm">Pending</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <span className="text-sm">Rejected</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 border-l-4 border-red-500 mr-2"></div>
            <span className="text-sm">Conflict</span>
          </div>
        </div>
      </div>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
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
        }} />
    </div>
  );
};

export default LeaveCalendar; 
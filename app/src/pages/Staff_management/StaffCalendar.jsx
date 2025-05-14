import React, { useState, useEffect } from 'react';
import { useApiQuery } from '../../hooks/useApi';
import { schedules } from '../../services/api';
import { format, parseISO, differenceInHours, differenceInMinutes } from 'date-fns';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ViewListIcon from '@mui/icons-material/ViewList';

const StaffCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const userId = localStorage.getItem('userId');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('calendar');

  const { data: schedulesList, isLoading } = useApiQuery(['schedules'], () => schedules.getByUserId(userId || ''));

  // Format events for the calendar
  const events = schedulesList?.map(schedule => ({
    id: schedule.id,
    title: `${schedule.role} - ${schedule.shiftType}`,
    start: schedule.startTime,
    end: schedule.endTime,
    backgroundColor: getShiftColor(schedule.shiftType),
    borderColor: getShiftBorderColor(schedule.shiftType),
    extendedProps: {
      role: schedule.role,
      shiftType: schedule.shiftType,
      duration: calculateDuration(schedule.startTime, schedule.endTime)
    }
  })) || [];

  function calculateDuration(start, end) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const hours = differenceInHours(endDate, startDate);
    const minutes = differenceInMinutes(endDate, startDate) % 60;
    return `${hours}h ${minutes}m`;
  }

  // Get color based on shift type
  function getShiftColor(shiftType) {
    switch (shiftType.toUpperCase()) {
      case 'MORNING':
        return '#93C5FD'; // blue-300
      case 'AFTERNOON':
        return '#FCD34D'; // yellow-300
      case 'NIGHT':
        return '#A78BFA'; // purple-400
      default:
        return '#60A5FA'; // blue-400
    }
  }

  function getShiftBorderColor(shiftType) {
    switch (shiftType.toUpperCase()) {
      case 'MORNING':
        return '#3B82F6'; // blue-500
      case 'AFTERNOON':
        return '#F59E0B'; // amber-500
      case 'NIGHT':
        return '#8B5CF6'; // purple-500
      default:
        return '#2563EB'; // blue-600
    }
  }

  // Custom event rendering
  const eventContent = (eventInfo) => {
    const startTime = format(new Date(eventInfo.event.start), 'h:mm a');
    const endTime = format(new Date(eventInfo.event.end), 'h:mm a');
    const duration = eventInfo.event.extendedProps.duration;

    return (
      <div className="p-1.5">
        <div className="flex flex-col space-y-0.5">
          <div className="font-semibold text-xs sm:text-sm leading-tight text-gray-800">
            {eventInfo.event.extendedProps.role}
          </div>
          <div className="text-xs leading-tight text-gray-700">
            {startTime} - {endTime}
          </div>
          <div className="text-[10px] leading-tight text-gray-500">
            {duration}
          </div>
        </div>
      </div>
    );
  };

  // Show event details on click
  const handleEventClick = (info) => {
    setSelectedEvent(info.event);
    setIsModalOpen(true);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Get today's schedule
  const todaySchedules = schedulesList?.filter(schedule => 
    format(new Date(schedule.startTime), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')) || [];

  // Update calendar configuration
  const calendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: isMobile ? "timeGridDay" : "dayGridMonth",
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: isMobile ? 'timeGridDay' : 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    events: events,
    eventContent: eventContent,
    eventClick: handleEventClick,
    height: "100%",
    contentHeight: "auto",
    aspectRatio: isMobile ? 1 : 1.5,
    windowResizeDelay: 100,
    eventTimeFormat: {
      hour: "2-digit",
      minute: "2-digit",
      meridiem: true
    },
    views: {
      timeGridDay: {
        titleFormat: { 
          year: "numeric",
          month: "long",
          day: "numeric"
        }
      }
    },
    dayMaxEvents: true,
    moreLinkText: "more",
    moreLinkClick: "popover",
    eventDisplay: "block",
    eventMinHeight: 50,
    eventTextColor: "#1F2937",
    eventBackgroundColor: "transparent",
    eventBorderColor: "transparent",
    eventClassNames: "hover:opacity-90 transition-opacity",
    dayCellClassNames: "hover:bg-gray-50",
    eventDidMount: (info) => {
      // Add custom styling to the event element
      info.el.style.backgroundColor = info.event.backgroundColor;
      info.el.style.borderColor = info.event.borderColor;
      info.el.style.borderWidth = '2px';
      info.el.style.borderRadius = '0.375rem';
      info.el.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
    }
  };

  return (
    <div className="p-4 sm:p-6">
      {/* Page Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">My Schedule</h1>
            <p className="text-base sm:text-lg text-gray-600 mt-1">{format(new Date(), 'EEEE, MMMM do, yyyy')}</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('calendar')}
              className={`p-2 rounded-lg ${
                viewMode === 'calendar'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title="Calendar View">
              <CalendarMonthIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${
                viewMode === 'list'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title="List View">
              <ViewListIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      {/* Today's Schedule Quick View */}
      {todaySchedules.length > 0 && (
        <div
          className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="px-4 sm:px-6 py-4 sm:py-5">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Today's Schedule</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {todaySchedules.map(schedule => (
                <div
                  key={schedule.id}
                  className="p-4 rounded-lg border"
                  style={{ 
                    backgroundColor: getShiftColor(schedule.shiftType),
                    borderColor: getShiftBorderColor(schedule.shiftType)
                  }}>
                  <div className="font-medium text-gray-800">{schedule.role}</div>
                  <div className="text-sm text-gray-700">{schedule.shiftType}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    {format(parseISO(schedule.startTime), 'h:mm a')} - {format(parseISO(schedule.endTime), 'h:mm a')}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Duration: {calculateDuration(schedule.startTime, schedule.endTime)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Calendar or List View */}
      {viewMode === 'calendar' ? (
        <div
          className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="px-4 sm:px-6 py-4 sm:py-5">
            <div
              className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800">Schedule Calendar</h3>

              <div className="flex items-center space-x-4 flex-wrap">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-300 mr-2"></div>
                  <span className="text-xs font-medium text-gray-600">Morning</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-yellow-300 mr-2"></div>
                  <span className="text-xs font-medium text-gray-600">Afternoon</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-purple-400 mr-2"></div>
                  <span className="text-xs font-medium text-gray-600">Night</span>
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="space-y-3 mt-4">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-[500px] sm:h-[600px] md:h-[700px]">
                <FullCalendar {...calendarOptions} />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div
          className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="px-4 sm:px-6 py-4 sm:py-5">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Schedule List</h3>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="space-y-3 mt-4">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : schedulesList && schedulesList.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th
                        scope="col"
                        className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                      <th
                        scope="col"
                        className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shift</th>
                      <th
                        scope="col"
                        className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th
                        scope="col"
                        className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {schedulesList
                      .sort(
                      (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
                    )
                      .map((schedule) => (
                        <tr
                          key={schedule.id}
                          className="hover:bg-gray-50 cursor-pointer"
                          onClick={() => {
                            setSelectedEvent({
                              id: schedule.id,
                              start: schedule.startTime,
                              end: schedule.endTime,
                              extendedProps: {
                                role: schedule.role,
                                shiftType: schedule.shiftType,
                                duration: calculateDuration(schedule.startTime, schedule.endTime)
                              }
                            });
                            setIsModalOpen(true);
                          }}>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{format(parseISO(schedule.startTime), 'EEEE')}</div>
                            <div className="text-sm text-gray-500">{format(parseISO(schedule.startTime), 'MMM do')}</div>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {format(parseISO(schedule.startTime), 'h:mm a')} - {format(parseISO(schedule.endTime), 'h:mm a')}
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <span
                              className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                              style={{
                                backgroundColor: getShiftColor(schedule.shiftType),
                                color: '#1F2937'
                              }}>
                              {schedule.shiftType}
                            </span>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {schedule.role}
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {calculateDuration(schedule.startTime, schedule.endTime)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg
                    className="mx-auto h-12 w-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">No scheduled shifts</h3>
                <p className="mt-1 text-sm text-gray-500">You don't have any scheduled shifts.</p>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Event Details Modal */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setIsModalOpen(false)}>
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0">
              <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-30" />
            </Transition.Child>

            <span className="inline-block h-screen align-middle" aria-hidden="true">
              &#8203;
            </span>

            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95">
              <div
                className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                {selectedEvent && (
                  <>
                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                      Schedule Details
                    </Dialog.Title>
                    <div className="mt-4 space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Role</h4>
                        <p className="mt-1 text-sm text-gray-900">{selectedEvent.extendedProps.role}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Shift Type</h4>
                        <p className="mt-1 text-sm text-gray-900">{selectedEvent.extendedProps.shiftType}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Date</h4>
                        <p className="mt-1 text-sm text-gray-900">
                          {format(selectedEvent.start, 'EEEE, MMMM do, yyyy')}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Time</h4>
                        <p className="mt-1 text-sm text-gray-900">
                          {format(selectedEvent.start, 'h:mm a')} - {format(selectedEvent.end, 'h:mm a')}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Duration</h4>
                        <p className="mt-1 text-sm text-gray-900">{selectedEvent.extendedProps.duration}</p>
                      </div>
                    </div>

                    <div className="mt-6">
                      <button
                        type="button"
                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500"
                        onClick={() => setIsModalOpen(false)}>
                        Close
                      </button>
                    </div>
                  </>
                )}
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default StaffCalendar; 
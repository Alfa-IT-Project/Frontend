import React, { useState, useEffect } from 'react';
import { useApiQuery, useApiMutation } from '../../hooks/useApi';
import { schedules, users } from '../../services/api';
import { format, addDays, startOfWeek, endOfWeek, addWeeks, isSameDay } from 'date-fns';
import { toast } from 'react-hot-toast';
import Select from 'react-select';

const SHIFT_TYPES = [
  { value: 'MORNING', label: 'Morning (6AM-2PM)', color: '#93c5fd', start: '06:00', end: '14:00' },
  { value: 'AFTERNOON', label: 'Afternoon (2PM-10PM)', color: '#fcd34d', start: '14:00', end: '22:00' },
  { value: 'NIGHT', label: 'Night (10PM-6AM)', color: '#a78bfa', start: '22:00', end: '06:00' }
];

const ROLES = [
  { value: 'CASHIER', label: 'Cashier' },
  { value: 'FLOOR_STAFF', label: 'Floor Staff' },
  { value: 'MANAGER', label: 'Manager' },
  { value: 'KITCHEN', label: 'Kitchen' },
  { value: 'DELIVERY', label: 'Delivery' }
];

const ScheduleManager = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [weekStart, setWeekStart] = useState(startOfWeek(currentDate, { weekStartsOn: 1 }));
  const [weekDays, setWeekDays] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [schedulesData, setSchedulesData] = useState([]);
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [departments, setDepartments] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    userId: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    startTime: '',
    endTime: '',
    role: '',
    shiftType: ''
  });
  const [selectedShift, setSelectedShift] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [bulkDays, setBulkDays] = useState([]);
  const [bulkStaff, setBulkStaff] = useState([]);

  const { data: usersData, isLoading: usersLoading } = useApiQuery(['users'], users.getAll);

  const { data: weekSchedules, isLoading: schedulesLoading, refetch: refetchSchedules } = useApiQuery(['schedules', format(weekStart, 'yyyy-MM-dd')], () => schedules.getAll({
    startDate: format(weekStart, 'yyyy-MM-dd'),
    endDate: format(endOfWeek(weekStart, { weekStartsOn: 1 }), 'yyyy-MM-dd'),
    departmentFilter
  }));

  const { data: staffAvailability, isLoading: availabilityLoading, refetch: refetchAvailability } = useApiQuery(
    ['availability', selectedDay ? format(selectedDay, 'yyyy-MM-dd') : ''],
    () => {
      if (selectedDay) {
        return schedules.getStaffAvailability({
          date: format(selectedDay, 'yyyy-MM-dd'),
          departmentFilter
        });
      }
      return Promise.resolve([]);
    }
  );

  const createScheduleMutation = useApiMutation((scheduleData) => schedules.create(scheduleData), {
    onSuccess: () => {
      refetchSchedules();
      refetchAvailability();
      toast.success('Schedule created successfully');
      setModalOpen(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create schedule');
    }
  });

  const createBulkSchedulesMutation = useApiMutation((bulkData) => schedules.createBulk(bulkData), {
    onSuccess: (data) => {
      refetchSchedules();
      refetchAvailability();
      const { successful, failed } = data;
      toast.success(`Created ${successful} schedules successfully. Failed: ${failed}`);
      setBulkModalOpen(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create bulk schedules');
    }
  });

  const deleteScheduleMutation = useApiMutation((id) => schedules.delete(id), {
    onSuccess: () => {
      refetchSchedules();
      refetchAvailability();
      toast.success('Schedule deleted successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete schedule');
    }
  });

  useEffect(() => {
    // Generate week days
    const days = [];
    const start = weekStart;
    for (let i = 0; i < 7; i++) {
      days.push(addDays(start, i));
    }
    setWeekDays(days);
  }, [weekStart]);

  useEffect(() => {
    if (weekSchedules) {
      setSchedulesData(weekSchedules);
    }
  }, [weekSchedules]);

  useEffect(() => {
    if (usersData) {
      // Extract unique departments
      const departmentsSet = new Set();
      
      // Make sure usersData is an array before filtering
      const userData = Array.isArray(usersData) ? usersData : [];
      
      userData
        .filter(user => user.department)
        .forEach(user => {
          if (user.department) {
            departmentsSet.add(user.department);
          }
        });
      
      const uniqueDepartments = Array.from(departmentsSet);
      
      setDepartments([
        { value: '', label: 'All Departments' },
        ...uniqueDepartments.map(dept => ({ 
          value: dept, 
          label: dept || 'No Department' 
        }))
      ]);
    }
  }, [usersData]);

  useEffect(() => {
    if (selectedShift) {
      setFormData(prev => ({
        ...prev,
        shiftType: selectedShift.value,
        startTime: `${format(selectedDay || new Date(), 'yyyy-MM-dd')}T${selectedShift.start}:00`,
        endTime: `${format(selectedShift.end === '06:00' 
          ? addDays(selectedDay || new Date(), 1) 
          : (selectedDay || new Date()), 'yyyy-MM-dd')}T${selectedShift.end}:00`
      }));
    }
  }, [selectedShift, selectedDay]);

  useEffect(() => {
    if (selectedRole) {
      setFormData(prev => ({
        ...prev,
        role: selectedRole.value
      }));
    }
  }, [selectedRole]);

  useEffect(() => {
    if (selectedStaff) {
      setFormData(prev => ({
        ...prev,
        userId: selectedStaff.value
      }));
    }
  }, [selectedStaff]);

  const handlePrevWeek = () => {
    setWeekStart(addWeeks(weekStart, -1));
  };

  const handleNextWeek = () => {
    setWeekStart(addWeeks(weekStart, 1));
  };

  const handleDayClick = (day) => {
    setSelectedDay(day);
    setFormData(prev => ({
      ...prev,
      date: format(day, 'yyyy-MM-dd')
    }));
  };

  const handleOpenModal = () => {
    if (!selectedDay) {
      toast.error('Please select a day first');
      return;
    }
    setModalOpen(true);
  };

  const handleCreateSchedule = (e) => {
    e.preventDefault();
    createScheduleMutation.mutate(formData);
  };

  const handleDeleteSchedule = (id) => {
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      deleteScheduleMutation.mutate(id);
    }
  };

  const handleBulkScheduleCreate = (e) => {
    e.preventDefault();
    
    // Create schedules for selected staff on selected days
    const bulkScheduleData = [];
    
    for (const userId of bulkStaff) {
      for (const day of bulkDays) {
        // Create a schedule for this staff on this day
        bulkScheduleData.push({
          userId,
          date: format(day, 'yyyy-MM-dd'),
          startTime: `${format(day, 'yyyy-MM-dd')}T${selectedShift.start}:00`,
          endTime: `${format(selectedShift.end === '06:00' ? addDays(day, 1) : day, 'yyyy-MM-dd')}T${selectedShift.end}:00`,
          role: selectedRole.value,
          shiftType: selectedShift.value
        });
      }
    }
    
    createBulkSchedulesMutation.mutate({ schedules: bulkScheduleData });
  };

  const toggleBulkDay = (day) => {
    if (bulkDays.some(d => isSameDay(d, day))) {
      setBulkDays(bulkDays.filter(d => !isSameDay(d, day)));
    } else {
      setBulkDays([...bulkDays, day]);
    }
  };

  const toggleBulkStaff = (staffId) => {
    if (bulkStaff.includes(staffId)) {
      setBulkStaff(bulkStaff.filter(id => id !== staffId));
    } else {
      setBulkStaff([...bulkStaff, staffId]);
    }
  };

  const getSchedulesForDay = (day) => {
    return schedulesData.filter((s) => {
      const scheduleDate = new Date(s.date);
      return isSameDay(scheduleDate, day);
    });
  };

  const renderDaySchedules = (day) => {
    const daySchedules = getSchedulesForDay(day);
    
    return (
      <div>
        {daySchedules.map((schedule) => (
          <div
            key={schedule.id}
            className="p-2 mb-1 rounded text-xs"
            style={{
              backgroundColor: 
                schedule.shiftType === 'MORNING' ? '#93c5fd' :
                schedule.shiftType === 'AFTERNOON' ? '#fcd34d' : '#a78bfa',
              color: '#1e293b'
            }}>
            <div className="flex justify-between items-center">
              <div>
                <div className="font-semibold">{schedule.user?.name}</div>
                <div>{schedule.role}</div>
                <div>
                  {format(new Date(schedule.startTime), 'h:mm a')} - {format(new Date(schedule.endTime), 'h:mm a')}
                </div>
              </div>
              <button
                onClick={() => handleDeleteSchedule(schedule.id)}
                className="text-red-600 hover:text-red-800">
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const mutationStatus = {
    createSchedule: {
      isPending: createScheduleMutation.isPending 
    },
    bulkSchedule: {
      isPending: createBulkSchedulesMutation.isPending
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Staff Schedule Manager</h1>
        <div className="flex space-x-2">
          <button
            onClick={handlePrevWeek}
            className="bg-gray-200 p-2 rounded hover:bg-gray-300">
            ← Previous Week
          </button>
          <button
            onClick={() => setWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }))}
            className="bg-indigo-500 text-white p-2 rounded hover:bg-indigo-600">
            Current Week
          </button>
          <button
            onClick={handleNextWeek}
            className="bg-gray-200 p-2 rounded hover:bg-gray-300">
            Next Week →
          </button>
        </div>
      </div>
      <div className="mb-4 flex items-center justify-between">
        <div className="font-semibold text-lg">
          Week of {format(weekStart, 'MMMM d, yyyy')}
        </div>
        <div className="flex space-x-2">
          <Select
            options={departments}
            value={departments.find(d => d.value === departmentFilter)}
            onChange={(selected) => setDepartmentFilter(selected?.value || '')}
            placeholder="Filter by department"
            className="w-64" />
          <button
            onClick={handleOpenModal}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Add Schedule
          </button>
          <button
            onClick={() => setBulkModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Bulk Schedule
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-4 mb-8">
        {weekDays.map((day) => (
          <div
            key={day.toString()}
            className={`border rounded-lg p-2 min-h-[200px] ${
              selectedDay && isSameDay(day, selectedDay)
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-200'
            } cursor-pointer`}
            onClick={() => handleDayClick(day)}>
            <div className="text-center mb-2 sticky top-0 bg-white">
              <div className="font-bold">{format(day, 'EEEE')}</div>
              <div>{format(day, 'MMM d')}</div>
            </div>
            {schedulesLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="spinner"></div>
              </div>
            ) : (
              renderDaySchedules(day)
            )}
          </div>
        ))}
      </div>
      {selectedDay && staffAvailability && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">
            Staff Availability for {format(selectedDay, 'EEEE, MMMM d, yyyy')}
          </h2>
          {availabilityLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="spinner"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {staffAvailability.map((staff) => (
                <div
                  key={staff.userId}
                  className={`p-4 rounded-lg border ${
                    staff.isAvailable 
                      ? 'border-green-200 bg-green-50' 
                      : staff.onLeave 
                        ? 'border-red-200 bg-red-50' 
                        : 'border-yellow-200 bg-yellow-50'
                  }`}>
                  <div className="font-semibold">{staff.name}</div>
                  <div className="text-sm text-gray-600">{staff.department || 'No Department'}</div>
                  <div className="mt-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${staff.isAvailable 
                          ? 'bg-green-100 text-green-800' 
                          : staff.onLeave 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                      {staff.isAvailable 
                        ? 'Available' 
                        : staff.onLeave 
                          ? 'On Leave' 
                          : 'Scheduled'}
                    </span>
                  </div>
                  {staff.isScheduled && staff.schedules && staff.schedules.length > 0 && (
                    <div className="mt-2 text-sm">
                      <div>
                        Time: {format(new Date(staff.schedules[0].startTime), 'h:mm a')} - 
                        {format(new Date(staff.schedules[0].endTime), 'h:mm a')}
                      </div>
                      <div>Shift: {staff.schedules[0].shiftType}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {/* Modal for creating a new schedule */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Create New Schedule</h2>
            <form onSubmit={handleCreateSchedule}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Staff Member</label>
                <Select
                  options={Array.isArray(usersData) 
                    ? usersData
                        ?.filter((user) => user.role === 'STAFF')
                        .map((user) => ({
                          value: user.id,
                          label: `${user.name} (${user.department || 'No Department'})`
                        }))
                    : []
                  }
                  onChange={setSelectedStaff}
                  placeholder="Select staff member"
                  className="mt-1"
                  isDisabled={usersLoading} />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Shift Type</label>
                <Select
                  options={SHIFT_TYPES}
                  onChange={setSelectedShift}
                  placeholder="Select shift type"
                  className="mt-1"
                  formatOptionLabel={(option) => (
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: option.color }}></div>
                      <div>{option.label}</div>
                    </div>
                  )} />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <Select
                  options={ROLES}
                  onChange={setSelectedRole}
                  placeholder="Select role"
                  className="mt-1" />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={mutationStatus.createSchedule.isPending}
                  className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 disabled:bg-indigo-300">
                  {mutationStatus.createSchedule.isPending ? 'Creating...' : 'Create Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Modal for bulk scheduling */}
      {bulkModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl">
            <h2 className="text-xl font-semibold mb-4">Bulk Schedule Creation</h2>
            <form onSubmit={handleBulkScheduleCreate}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">1. Select Days</h3>
                  <div className="grid grid-cols-7 gap-2 mb-4">
                    {weekDays.map((day) => (
                      <div
                        key={day.toString()}
                        onClick={() => toggleBulkDay(day)}
                        className={`p-2 text-center border rounded cursor-pointer ${
                          bulkDays.some(d => isSameDay(d, day))
                            ? 'bg-indigo-100 border-indigo-500'
                            : 'border-gray-200'
                        }`}>
                        <div className="text-xs">{format(day, 'EEE')}</div>
                        <div>{format(day, 'd')}</div>
                      </div>
                    ))}
                  </div>

                  <h3 className="font-medium mb-2">2. Select Shift</h3>
                  <Select
                    options={SHIFT_TYPES}
                    onChange={setSelectedShift}
                    placeholder="Select shift type"
                    className="mb-4"
                    formatOptionLabel={(option) => (
                      <div className="flex items-center">
                        <div
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: option.color }}></div>
                        <div>{option.label}</div>
                      </div>
                    )} />

                  <h3 className="font-medium mb-2">3. Select Role</h3>
                  <Select
                    options={ROLES}
                    onChange={setSelectedRole}
                    placeholder="Select role"
                    className="mb-4" />
                </div>

                <div>
                  <h3 className="font-medium mb-2">4. Select Staff Members</h3>
                  <div className="border rounded-md p-4 h-[400px] overflow-y-auto">
                    {usersLoading ? (
                      <div className="flex justify-center items-center h-full">
                        <div className="spinner"></div>
                      </div>
                    ) : (
                      Array.isArray(usersData)
                        ? usersData
                            ?.filter((user) => user.role === 'STAFF')
                            .map((user) => (
                              <div
                                key={user.id}
                                className={`p-2 mb-2 rounded border flex items-center cursor-pointer ${
                                  bulkStaff.includes(user.id)
                                    ? 'bg-indigo-100 border-indigo-500'
                                    : 'border-gray-200'
                                }`}
                                onClick={() => toggleBulkStaff(user.id)}>
                                <input
                                  type="checkbox"
                                  checked={bulkStaff.includes(user.id)}
                                  onChange={() => {}}
                                  className="mr-2" />
                                <div>
                                  <div className="font-medium">{user.name}</div>
                                  <div className="text-sm text-gray-600">{user.department || 'No Department'}</div>
                                </div>
                              </div>
                            ))
                        : <div>No users data available</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 border-t pt-4">
                <div className="mb-4">
                  <h3 className="font-medium mb-2">Summary</h3>
                  <p>Creating schedules for {bulkStaff.length} staff members across {bulkDays.length} days.</p>
                  <p>This will generate {bulkStaff.length * bulkDays.length} total schedule entries.</p>
                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setBulkModalOpen(false)}
                    className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={
                      mutationStatus.bulkSchedule.isPending || 
                      !selectedShift || 
                      !selectedRole || 
                      bulkStaff.length === 0 || 
                      bulkDays.length === 0
                    }
                    className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 disabled:bg-indigo-300">
                    {mutationStatus.bulkSchedule.isPending ? 'Creating...' : 'Create Schedules'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleManager; 
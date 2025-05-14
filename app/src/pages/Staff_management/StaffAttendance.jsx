import React, { useState, useEffect } from 'react';
import { useApiQuery, useApiMutation } from '../../hooks/useApi';
import { attendance } from '../../services/api';
import { format, parseISO, isToday } from 'date-fns';
import ClockButtons from '../../components/Staff_management/ClockButtons';
import { useQueryClient } from '@tanstack/react-query';

const StaffAttendance = () => {
  const userId = localStorage.getItem('userId');
  const queryClient = useQueryClient();
  
  // Helper functions for localStorage
  const getLocalStorageKey = (prefix) => {
    if (!userId) return null;
    const today = format(new Date(), 'yyyy-MM-dd');
    return `${prefix}_${userId}_${today}`;
  };
  
  const getLocalStorageValue = (prefix) => {
    const key = getLocalStorageKey(prefix);
    if (!key) return false;
    return localStorage.getItem(key) === 'true';
  };
  
  const setLocalStorageValue = (prefix, value) => {
    const key = getLocalStorageKey(prefix);
    if (!key) return;
    
    if (value === true) {
      localStorage.setItem(key, 'true');
    } else {
      localStorage.removeItem(key);
    }
  };
  
  // Component state
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');
  const [forceUpdate, setForceUpdate] = useState(0);
  
  // Initialize attendance state from localStorage
  const [verifiedClockIn, setVerifiedClockIn] = useState(() => getLocalStorageValue('clockIn'));
  const [verifiedClockOut, setVerifiedClockOut] = useState(() => getLocalStorageValue('clockOut'));
  
  // Update localStorage when state changes
  useEffect(() => {
    if (userId) {
      setLocalStorageValue('clockIn', verifiedClockIn);
    }
  }, [verifiedClockIn, userId]);
  
  useEffect(() => {
    if (userId) {
      setLocalStorageValue('clockOut', verifiedClockOut);
    }
  }, [verifiedClockOut, userId]);
  
  // Debug logs for state changes
  useEffect(() => {
    console.log('⚡ verifiedClockIn state changed:', verifiedClockIn);
  }, [verifiedClockIn]);
  
  useEffect(() => {
    console.log('⚡ verifiedClockOut state changed:', verifiedClockOut);
  }, [verifiedClockOut]);
  
  // Function to force update clock in state
  const forceClockInState = () => {
    console.log('Forcing clock in state update');
    setVerifiedClockIn(true);
    setLocalStorageValue('clockIn', true);
    
    // Force an update of the todayAttendance React Query cache if needed
    queryClient.setQueryData(['todayAttendance'], (oldData) => {
      // If we already have data, update it
      if (oldData && oldData.length > 0) {
        const updatedData = [...oldData];
        updatedData[0] = {
          ...updatedData[0],
          clockInTime: updatedData[0].clockInTime || new Date().toISOString(),
          status: updatedData[0].status || 'PRESENT'
        };
        return updatedData;
      }
      
      // Otherwise create a new record
      return [{
        id: `temp-${Date.now()}`,
        userId: userId,
        date: format(new Date(), 'yyyy-MM-dd'),
        clockInTime: new Date().toISOString(),
        status: 'PRESENT'
      }];
    });
  };
  
  // Function to force update clock out state
  const forceClockOutState = () => {
    console.log('Forcing clock out state update');
    
    // Make sure clock in state is also updated (you need to be clocked in to clock out)
    setVerifiedClockIn(true);
    setVerifiedClockOut(true);
    setLocalStorageValue('clockIn', true);
    setLocalStorageValue('clockOut', true);
    
    // Force an update of the todayAttendance React Query cache if needed
    queryClient.setQueryData(['todayAttendance'], (oldData) => {
      // If we already have data, update it
      if (oldData && oldData.length > 0) {
        const updatedData = [...oldData];
        updatedData[0] = {
          ...updatedData[0],
          clockInTime: updatedData[0].clockInTime || new Date().toISOString(),
          clockOutTime: updatedData[0].clockOutTime || new Date().toISOString(),
          status: updatedData[0].status || 'PRESENT'
        };
        return updatedData;
      }
      
      // Otherwise create a new record
      return [{
        id: `temp-${Date.now()}`,
        userId: userId,
        date: format(new Date(), 'yyyy-MM-dd'),
        clockInTime: new Date().toISOString(),
        clockOutTime: new Date().toISOString(),
        status: 'PRESENT'
      }];
    });
  };
  
  // Function to directly check and set clock in/out status based on actual conditions
  const checkAndUpdateClockStatus = () => {
    // Default state to false for both
    let shouldBeClockIn = false;
    let shouldBeClockOut = false;
    
    // First check localStorage values
    shouldBeClockIn = getLocalStorageValue('clockIn');
    shouldBeClockOut = getLocalStorageValue('clockOut');
    
    // Then check today's attendance record - this takes precedence over localStorage
    if (todayAttendance && todayAttendance.length > 0 && todayAttendance[0]) {
      const record = todayAttendance[0];
      
      // Check clock in
      if (record.clockInTime && record.clockInTime !== '') {
        shouldBeClockIn = true;
      }
      
      // Check clock out
      if (record.clockOutTime && record.clockOutTime !== '') {
        shouldBeClockOut = true;
        // If clocked out, must also be clocked in
        shouldBeClockIn = true;
      }
    }
    
    console.log('Direct clock status check result:', { 
      shouldBeClockIn, 
      currentClockIn: verifiedClockIn,
      shouldBeClockOut,
      currentClockOut: verifiedClockOut
    });
    
    // Update states if different from current values
    if (shouldBeClockIn !== verifiedClockIn || shouldBeClockOut !== verifiedClockOut) {
      console.log('⚠️ FIXING INCONSISTENT CLOCK STATES - Setting to:', { 
        clockIn: shouldBeClockIn, 
        clockOut: shouldBeClockOut 
      });
      
      // Update React state
      setVerifiedClockIn(shouldBeClockIn);
      setVerifiedClockOut(shouldBeClockOut);
      
      // Save to localStorage
      setLocalStorageValue('clockIn', shouldBeClockIn);
      setLocalStorageValue('clockOut', shouldBeClockOut);
      
      // Force component update
      setForceUpdate(prev => prev + 1);
    }
    
    return { clocked_in: shouldBeClockIn, clocked_out: shouldBeClockOut };
  };
  
  // Get attendance records for current month
  const { data: attendanceRecords, isLoading: recordsLoading, refetch: refetchAttendance, error: attendanceError } = useApiQuery(['attendanceRecords'], () => attendance.getRecords({
    userId: userId,
    startDate: format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), 'yyyy-MM-dd'),
    endDate: format(
      new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
      'yyyy-MM-dd'
    )
  }), {
    retry: 3,
    retryDelay: 1000,
    onError: (error) => {
      console.error('Failed to fetch attendance records:', error);
      setMessage('Failed to load monthly statistics. Please try refreshing the page.');
      setMessageType('error');
    }
  });

  // Get today's attendance
  const { data: todayAttendance, isLoading: todayLoading, refetch: refetchToday, error: todayError } = useApiQuery(
    ['todayAttendance'],
    () => attendance.getRecords({ startDate: format(new Date(), 'yyyy-MM-dd') }),
    {
      retry: 3,
      retryDelay: 1000,
      onError: (error) => {
        console.error('Failed to fetch today\'s attendance:', error);
        setMessage('Failed to load today\'s attendance status. Please try refreshing the page.');
        setMessageType('error');
      }
    }
  );

  // Force refresh data on component mount
  React.useEffect(() => {
    console.log('Component mounted - refreshing attendance data');
    
    // Define a function to load attendance data
    const loadAttendanceData = async () => {
      try {
        console.log('Loading attendance data...');
        // Fetch today's attendance first to quickly determine clock in/out status
        const todayResult = await attendance.getRecords({ startDate: format(new Date(), 'yyyy-MM-dd') });
        console.log('Fetched today attendance:', todayResult);
        
        // Only set localStorage values if we have an actual record
        if (todayResult && todayResult.length > 0 && userId) {
          const record = todayResult[0];
          const today = format(new Date(), 'yyyy-MM-dd');
          
          // Clear any existing localStorage values
          localStorage.removeItem(`clockIn_${userId}_${today}`);
          localStorage.removeItem(`clockOut_${userId}_${today}`);
          
          // Set localStorage values based on actual API data
          if (record.clockInTime && record.clockInTime !== '') {
            localStorage.setItem(`clockIn_${userId}_${today}`, 'true');
            setVerifiedClockIn(true);
          }
          
          if (record.clockOutTime && record.clockOutTime !== '') {
            localStorage.setItem(`clockOut_${userId}_${today}`, 'true');
            setVerifiedClockOut(true);
          }
        } else {
          // No records found, ensure localStorage is cleared
          if (userId) {
            const today = format(new Date(), 'yyyy-MM-dd');
            localStorage.removeItem(`clockIn_${userId}_${today}`);
            localStorage.removeItem(`clockOut_${userId}_${today}`);
            setVerifiedClockIn(false);
            setVerifiedClockOut(false);
          }
        }
        
        // Update the query cache directly
        queryClient.setQueryData(['todayAttendance'], todayResult);
        
        // Then fetch the month's records in the background
        const monthlyResult = await attendance.getRecords({
          userId: userId,
          startDate: format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), 'yyyy-MM-dd'),
          endDate: format(
            new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
            'yyyy-MM-dd'
          )
        });
        
        // Update the query cache directly
        queryClient.setQueryData(['attendanceRecords'], monthlyResult);
        
        console.log('All attendance data loaded successfully');
      } catch (error) {
        console.error('Error loading attendance data:', error);
        // On error, clear localStorage to be safe
        if (userId) {
          const today = format(new Date(), 'yyyy-MM-dd');
          localStorage.removeItem(`clockIn_${userId}_${today}`);
          localStorage.removeItem(`clockOut_${userId}_${today}`);
        }
      }
    };
    
    // Load data immediately
    loadAttendanceData();
    
    // Set a timer to refresh again after a short delay
    const timer = setTimeout(() => {
      console.log('Delayed refresh of attendance data');
      refetchAttendance();
      refetchToday();
    }, 2000);
    
    // Set up an interval to periodically check for attendance updates
    const intervalTimer = setInterval(() => {
      console.log('Periodic refresh of attendance data');
      refetchToday();
    }, 60000); // Check every minute
    
    return () => {
      clearTimeout(timer);
      clearInterval(intervalTimer);
    };
  }, [userId, queryClient]); // Add queryClient to dependencies

  // Add a separate effect to log data when it arrives
  React.useEffect(() => {
    if (todayAttendance && todayAttendance.length > 0 && todayAttendance[0]) {
      // Log the exact record for debugging
      console.log('Today attendance data arrived:', todayAttendance[0]);
      console.log('ClockIn field:', {
        clockInTime: todayAttendance[0].clockInTime,
        typeOfClockInTime: typeof todayAttendance[0].clockInTime
      });
      console.log('ClockOut field:', {
        clockOutTime: todayAttendance[0].clockOutTime,
        typeOfClockOutTime: typeof todayAttendance[0].clockOutTime
      });
    }
  }, [todayAttendance]);

  // Initialize status from API data
  useEffect(() => {
    // Reset localStorage and component state when there's no data
    if (todayAttendance && todayAttendance.length === 0) {
      console.log('No attendance record for today, resetting clock in/out status');
      if (userId) {
        localStorage.removeItem(`clockIn_${userId}_${format(new Date(), 'yyyy-MM-dd')}`);
        localStorage.removeItem(`clockOut_${userId}_${format(new Date(), 'yyyy-MM-dd')}`);
      }
      setVerifiedClockIn(false);
      setVerifiedClockOut(false);
      return;
    }
    
    // Skip if data is still loading or not available
    if (todayLoading || !todayAttendance || todayAttendance.length === 0) {
      return;
    }
    
    const record = todayAttendance[0];
    
    // Check for clock in
    if (record?.clockInTime && record.clockInTime !== '') {
      console.log('API data shows user is clocked in today');
      setVerifiedClockIn(true);
      if (userId) {
        localStorage.setItem(`clockIn_${userId}_${format(new Date(), 'yyyy-MM-dd')}`, 'true');
      }
    } else {
      // No valid clockInTime in the record
      setVerifiedClockIn(false);
      if (userId) {
        localStorage.removeItem(`clockIn_${userId}_${format(new Date(), 'yyyy-MM-dd')}`);
      }
    }
    
    // Check for clock out
    if (record?.clockOutTime && record.clockOutTime !== '') {
      console.log('API data shows user is clocked out today');
      setVerifiedClockOut(true);
      if (userId) {
        localStorage.setItem(`clockOut_${userId}_${format(new Date(), 'yyyy-MM-dd')}`, 'true');
      }
    } else {
      // No valid clockOutTime in the record
      setVerifiedClockOut(false);
      if (userId) {
        localStorage.removeItem(`clockOut_${userId}_${format(new Date(), 'yyyy-MM-dd')}`);
      }
    }
  }, [todayAttendance, todayLoading, userId]);

  const clockInMutation = useApiMutation((variables) => attendance.clockIn(variables), {
    onSuccess: () => {
      setShowOtpInput(true);
      setActionType('clockIn');
      setMessage('OTP has been sent to your manager. Please enter it to complete clock in.');
      setMessageType('info');
    },
    onError: () => {
      setMessage('Failed to request clock in. Please try again.');
      setMessageType('error');
    }
  });

  const clockOutMutation = useApiMutation((variables) => attendance.clockOut(variables), {
    onSuccess: () => {
      setShowOtpInput(true);
      setActionType('clockOut');
      setMessage(
        'OTP has been sent to your manager. Please enter it to complete clock out.'
      );
      setMessageType('info');
    },
    onError: () => {
      setMessage('Failed to request clock out. Please try again.');
      setMessageType('error');
    }
  });

  const verifyClockInMutation = useApiMutation((variables) => attendance.verifyClockIn(variables), {
    onSuccess: (data) => {
      console.log('Clock-in verification succeeded with data:', data);

      // Update the React Query cache for todayAttendance
      queryClient.setQueryData(['todayAttendance'], (oldData) => {
        if (!oldData || oldData.length === 0) {
          // If there's no existing data, create a new array with this record
          // Ensure the record has necessary fields
          const newRecord = {
            ...data,
            clockInTime: data.clockInTime || new Date().toISOString(),
            status: data.status || 'PRESENT'
          };
          console.log('Creating new today attendance record:', newRecord);
          return [newRecord];
        }

        // Otherwise update the existing record
        const updatedData = [...oldData];
        updatedData[0] = {
          ...updatedData[0],
          clockInTime: data.clockInTime || new Date().toISOString(),
          status: data.status || 'PRESENT'
        };
        console.log('Updated today attendance data:', updatedData[0]);
        return updatedData;
      });

      // Force invalidation of queries to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ['todayAttendance'] });
      queryClient.invalidateQueries({ queryKey: ['attendanceRecords'] });
      
      // Set verified clock in to true immediately
      setVerifiedClockIn(true);
      
      // Save to localStorage
      setLocalStorageValue('clockIn', true);

      setShowOtpInput(false);
      setOtp('');
      setActionType(null);
      setMessage('Successfully clocked in!');
      setMessageType('success');

      // Force state update with a small delay
      setTimeout(() => {
        forceClockInState();
      }, 300);

      // Refresh attendance data from server
      refetchAttendance();
      refetchToday();

      // Force another refetch after a short delay to ensure data is updated
      setTimeout(() => {
        console.log('Performing delayed refetch of attendance data');
        refetchAttendance();
        refetchToday();
        // Force state update again
        forceClockInState();
      }, 1000);
    },
    onError: (error) => {
      console.error('Clock-in verification failed:', error);
      setMessage('Invalid OTP. Please try again.');
      setMessageType('error');
      
      // Also check and clear any incorrect local state
      if (error.message && error.message.includes('No attendance record')) {
        // Clear localStorage and state if there's no record found
        setVerifiedClockIn(false);
        setLocalStorageValue('clockIn', false);
      }
    }
  });

  const verifyClockOutMutation = useApiMutation((variables) => attendance.verifyClockOut(variables), {
    onSuccess: (data) => {
      console.log('Clock-out verification succeeded with data:', data);

      // Update the React Query cache for todayAttendance
      queryClient.setQueryData(['todayAttendance'], (oldData) => {
        if (!oldData || oldData.length === 0) {
          // If there's no existing data, create a new array with this record
          const newRecord = {
            ...data,
            clockOutTime: data.clockOutTime || new Date().toISOString(),
            // Make sure we have a clock in time too
            clockInTime: data.clockInTime || new Date().toISOString(),
            status: data.status || 'PRESENT'
          };
          console.log('Creating new today attendance record with clock out:', newRecord);
          return [newRecord];
        }

        // Otherwise update the existing record
        const updatedData = [...oldData];
        updatedData[0] = {
          ...updatedData[0],
          clockOutTime: data.clockOutTime || new Date().toISOString(),
          status: data.status || updatedData[0].status || 'PRESENT'
        };
        console.log('Updated today attendance data with clock out:', updatedData[0]);
        return updatedData;
      });

      // Force invalidation of queries to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ['todayAttendance'] });
      queryClient.invalidateQueries({ queryKey: ['attendanceRecords'] });
      
      // Set verified clock out to true immediately
      setVerifiedClockOut(true);
      // Also ensure clock in is true (you can't clock out without being clocked in)
      setVerifiedClockIn(true);
      
      // Save to localStorage
      localStorage.setItem(`clockIn_${userId}_${format(new Date(), 'yyyy-MM-dd')}`, 'true');
      localStorage.setItem(`clockOut_${userId}_${format(new Date(), 'yyyy-MM-dd')}`, 'true');

      setShowOtpInput(false);
      setOtp('');
      setActionType(null);
      setMessage('Successfully clocked out!');
      setMessageType('success');

      // Force state update with a small delay
      setTimeout(() => {
        forceClockOutState();
      }, 300);

      // Refresh attendance data from server
      refetchAttendance();
      refetchToday();

      // Force another refetch after a short delay to ensure data is updated
      setTimeout(() => {
        console.log('Performing delayed refetch of attendance data after clock out');
        refetchAttendance();
        refetchToday();
        // Force state update again
        forceClockOutState();
      }, 1000);
    },
    onError: (error) => {
      console.error('Clock-out verification failed:', error);
      setMessage('Invalid OTP. Please try again.');
      setMessageType('error');
      
      // Also check and clear any incorrect local state
      if (error.message && error.message.includes('No attendance record')) {
        // Clear localStorage and state if there's no record found
        if (userId) {
          localStorage.removeItem(`clockOut_${userId}_${format(new Date(), 'yyyy-MM-dd')}`);
          setVerifiedClockOut(false);
        }
      }
    }
  });

  const handleClockIn = async () => {
    if (!userId) {
      setMessage('User ID is missing. Please log in again.');
      setMessageType('error');
      return;
    }
    try {
      console.log('Attempting to clock in with user ID:', userId);
      await clockInMutation.mutateAsync({ userId });
      console.log('Clock in successful');
    } catch (error) {
      console.error('Clock in error caught in component:', error);
      if (error instanceof Error) {
        setMessage(`Clock in failed: ${error.message}`);
      } else {
        setMessage('Clock in failed with unknown error');
      }
      setMessageType('error');
    }
  };

  const handleVerifyClockIn = async () => {
    if (!userId) {
      setMessage('User ID is missing. Please log in again.');
      setMessageType('error');
      return;
    }
    
    if (!otp) {
      setMessage('Please enter the OTP sent to your manager.');
      setMessageType('error');
      return;
    }
    
    try {
      console.log('Attempting to verify clock in with OTP:', otp);
      setMessage('Verifying OTP...');
      setMessageType('info');
      
      await verifyClockInMutation.mutateAsync({ userId, otp });
      // Verification success handling is now in the mutation's onSuccess callback
      
      // Force state update after successful verification
      forceClockInState();
    } catch (error) {
      console.error('Verify clock in error:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('Invalid') || error.message.includes('expired')) {
          setMessage('Invalid or expired OTP. Please try again or request a new OTP.');
        } else {
          setMessage(`Verification failed: ${error.message}`);
        }
      } else {
        setMessage('Verification failed with unknown error. Please try again.');
      }
      setMessageType('error');
    }
  };

  const handleClockOut = async () => {
    if (!userId) {
      setMessage('User ID is missing. Please log in again.');
      setMessageType('error');
      return;
    }
    try {
      console.log('Attempting to clock out with user ID:', userId);
      
      setMessage('Sending clock out request...');
      setMessageType('info');
      
      const result = await clockOutMutation.mutateAsync({ userId });
      console.log('Clock out OTP request successful:', result);
      
      setShowOtpInput(true);
      setActionType('clockOut');
      setMessage(
        'OTP has been sent to your manager. Please enter the OTP to complete clock out.'
      );
      setMessageType('info');
    } catch (error) {
      console.error('Clock out error caught in component:', error);
      
      if (error instanceof Error) {
        // Check for specific error message about no active clock-in
        if (error.message.includes('No active clock-in') || error.message.includes('no active clock-in')) {
          setMessage(
            'Cannot clock out: No active clock-in record found for today. Please refresh and try again.'
          );
          // Force refresh attendance data to resync with backend
          refetchAttendance();
          refetchToday();
        } else if (error.message.includes('Already clocked out')) {
          setMessage('You have already clocked out today.');
          refetchAttendance();
          refetchToday();
        } else {
          setMessage(`Clock out failed: ${error.message}`);
        }
      } else {
        setMessage('Clock out failed with unknown error. Please try again later.');
      }
      setMessageType('error');
    }
  };

  const handleVerifyClockOut = async () => {
    if (!userId) {
      setMessage('User ID is missing. Please log in again.');
      setMessageType('error');
      return;
    }
    
    if (!otp) {
      setMessage('Please enter the OTP sent to your manager.');
      setMessageType('error');
      return;
    }
    
    try {
      console.log('Attempting to verify clock out with OTP:', otp);
      setMessage('Verifying OTP...');
      setMessageType('info');
      
      await verifyClockOutMutation.mutateAsync({ userId, otp });
      // Verification success handling is now in the mutation's onSuccess callback
    } catch (error) {
      console.error('Verify clock out error:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('Invalid') || error.message.includes('expired')) {
          setMessage('Invalid or expired OTP. Please try again or request a new OTP.');
        } else {
          setMessage(`Verification failed: ${error.message}`);
        }
      } else {
        setMessage('Verification failed with unknown error. Please try again.');
      }
      setMessageType('error');
    }
  };

  const submitOtpVerification = () => {
    console.log('Submitting OTP verification for action:', actionType);
    if (actionType === 'clockIn') {
      // Force the verified clock in state immediately, before API response
      console.log('⚡ PREEMPTIVELY setting verifiedClockIn to true');
      setVerifiedClockIn(true);
      setLocalStorageValue('clockIn', true);
      setForceUpdate(prev => prev + 1);
      handleVerifyClockIn();
    } else if (actionType === 'clockOut') {
      // Force the verified clock out state immediately, before API response
      console.log('⚡ PREEMPTIVELY setting verifiedClockOut to true');
      setVerifiedClockIn(true); // Must be clocked in to clock out
      setVerifiedClockOut(true);
      setLocalStorageValue('clockIn', true);
      setLocalStorageValue('clockOut', true);
      setForceUpdate(prev => prev + 1);
      handleVerifyClockOut();
    } else {
      console.error('Unknown action type for OTP verification:', actionType);
      setMessage('Invalid action type. Please try again.');
      setMessageType('error');
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status.toUpperCase()) {
      case 'PRESENT':
        return 'bg-green-100 text-green-800';
      case 'ABSENT':
        return 'bg-red-100 text-red-800';
      case 'LATE':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Simplified check if already clocked in today
  const hasClockInToday = React.useMemo(() => {
    try {
      // First priority: Check if verified clock-in state is true
      if (verifiedClockIn) {
        console.log('Verified clock in state is true, user is clocked in');
        return true;
      }
      
      // Second priority: Check API data if available
      if (todayAttendance && todayAttendance.length > 0 && todayAttendance[0]) {
        const record = todayAttendance[0];
        
        // Check if clockInTime exists and is not empty
        const hasClockInTime = Boolean(record?.clockInTime) && record?.clockInTime !== '';

        // Check status as an additional indicator (case-insensitive)
        const status = ((record?.status || '') + '').toUpperCase();
        const validClockInStatuses = ['ON_TIME', 'LATE', 'PRESENT'];
        const hasValidStatus = validClockInStatuses.includes(status);

        // If API indicates clocked in, update our verified state
        if (hasClockInTime || hasValidStatus) {
          return true;
        }
      }
      
      // Check if we're already in the process of verifying a clock in
      if (showOtpInput && actionType === 'clockIn') {
        return true;
      }
      
      // Default: not clocked in
      return false;
    } catch (error) {
      console.error('Error in hasClockInToday:', error);
      return false;
    }
  }, [todayAttendance, verifiedClockIn, showOtpInput, actionType]);

  // Simplified check if already clocked out today
  const hasClockOutToday = React.useMemo(() => {
    try {
      // First priority: Check if verified clock-out state is true
      if (verifiedClockOut) {
        console.log('Verified clock out state is true, user is clocked out');
        return true;
      }

      // Second priority: Check API data if available
      if (todayAttendance && todayAttendance.length > 0 && todayAttendance[0]) {
        const record = todayAttendance[0];
        
        // Check if clockOutTime exists and is not empty/null
        const hasClockOutTime = Boolean(record?.clockOutTime) && record?.clockOutTime !== '' && record?.clockOutTime !== null;

        // If API indicates clocked out, update our verified state
        if (hasClockOutTime) {
          return true;
        }
      }
      
      // If we're already in the process of verifying a clock out, consider the user as clocked out
      if (showOtpInput && actionType === 'clockOut') {
        return true;
      }
      
      // Default: not clocked out
      return false;
    } catch (error) {
      console.error('Error in hasClockOutToday:', error);
      return false;
    }
  }, [todayAttendance, verifiedClockOut, showOtpInput, actionType]);

  // Log the values to debug
  React.useEffect(() => {
    console.log('STATE CHECK - hasClockInToday:', hasClockInToday);
    console.log('STATE CHECK - hasClockOutToday:', hasClockOutToday);
    console.log('STATE CHECK - verifiedClockIn:', verifiedClockIn);
    console.log('STATE CHECK - verifiedClockOut:', verifiedClockOut);
  }, [hasClockInToday, hasClockOutToday, verifiedClockIn, verifiedClockOut]);

  // Add debug logging before render
  const clockButtonProps = {
    hasClockInToday: Boolean(hasClockInToday || verifiedClockIn),
    hasClockOutToday: Boolean(hasClockOutToday || verifiedClockOut),
    verifiedClockIn,
    verifiedClockOut
  };
  console.log('RENDER - Clock button states:', clockButtonProps);

  // Force re-render of ClockButtons when states change
  useEffect(() => {
    // Force a re-render after any state change that affects buttons
    setForceUpdate(prev => prev + 1);
  }, [verifiedClockIn, verifiedClockOut, todayAttendance]);

  // Add a direct effect to watch for clock in success and ensure button state
  useEffect(() => {
    if (verifiedClockIn && !hasClockOutToday) {
      console.log('CRITICAL STATE: Clock-in detected but clock-out not ready, forcing update');
      // Force several updates with increasing delays
      setTimeout(() => forceClockInState(), 100);
      setTimeout(() => forceClockInState(), 500);
      setTimeout(() => forceClockInState(), 1000);
      
      // Force re-render
      setForceUpdate(prev => prev + 1);
    }
  }, [verifiedClockIn, hasClockOutToday]);

  // Call the check function on critical state changes
  useEffect(() => {
    checkAndUpdateClockStatus();
  }, [todayAttendance, actionType]);
  
  // Force check after a clock-in attempt
  useEffect(() => {
    if (message === 'Successfully clocked in!') {
      console.log('Clock-in success detected, forcing status update');
      setTimeout(() => {
        checkAndUpdateClockStatus();
        forceClockInState();
        setForceUpdate(prev => prev + 1);
      }, 500);
    }
  }, [message]);

  // Force check after a clock-out attempt
  useEffect(() => {
    if (message === 'Successfully clocked out!') {
      console.log('Clock-out success detected, forcing status update');
      setTimeout(() => {
        checkAndUpdateClockStatus();
        forceClockOutState();
        setForceUpdate(prev => prev + 1);
      }, 500);
    }
  }, [message]);

  // Calculate statistics
  const present = Array.isArray(attendanceRecords) ? attendanceRecords.filter(record => 
    (record.status || '').toUpperCase() === 'PRESENT').length : 0;
  const late = Array.isArray(attendanceRecords) ? attendanceRecords.filter(record => 
    (record.status || '').toUpperCase() === 'LATE').length : 0;
  const absent = Array.isArray(attendanceRecords) ? attendanceRecords.filter(record => 
    (record.status || '').toUpperCase() === 'ABSENT').length : 0;
  
  // Also count ON_TIME as present for statistics
  const onTime = Array.isArray(attendanceRecords) ? attendanceRecords.filter(record => 
    (record.status || '').toUpperCase() === 'ON_TIME').length : 0;
  
  const total = present + onTime + late + absent;
  const presentPercentage = total > 0 ? ((present + onTime) / total) * 100 : 0;
  const latePercentage = total > 0 ? (late / total) * 100 : 0;
  const absentPercentage = total > 0 ? (absent / total) * 100 : 0;

  // Add detailed logging for attendance records and status values
  console.log('Raw attendance records:', attendanceRecords);
  console.log('Records with PRESENT status:', attendanceRecords?.filter(record => record.status === 'PRESENT'));
  console.log('Records with LATE status:', attendanceRecords?.filter(record => record.status === 'LATE'));
  console.log('Records with ABSENT status:', attendanceRecords?.filter(record => record.status === 'ABSENT'));

  // Log calculated statistics for debugging
  React.useEffect(() => {
    console.log('Monthly statistics calculated:', {
      attendanceRecords: Array.isArray(attendanceRecords) ? attendanceRecords.length : 0,
      present,
      onTime,
      late, 
      absent,
      total,
      combined: present + onTime,
      presentPercentage,
      latePercentage,
      absentPercentage
    });
  }, [attendanceRecords, present, onTime, late, absent, total, presentPercentage, latePercentage, absentPercentage]);

  // Debug clock out button state
  React.useEffect(() => {
    console.log('Clock out button state:', {
      hasClockInToday: Boolean(hasClockInToday || verifiedClockIn),
      hasClockOutToday: Boolean(hasClockOutToday || verifiedClockOut),
      isPending: clockOutMutation.isPending,
      disabled: !hasClockInToday || hasClockOutToday || clockOutMutation.isPending,
      buttonText: hasClockOutToday ? 'Already Clocked Out' : (!hasClockInToday ? 'Clock In First' : 'Clock Out')
    });
  }, [hasClockInToday, hasClockOutToday, clockOutMutation.isPending]);

  // Add a function to determine the current attendance status
  const getDerivedStatus = React.useMemo(() => {
    try {
      // If no attendance data, return 'Not Marked'
      if (!todayAttendance || todayAttendance.length === 0 || !todayAttendance[0]) {
        console.log('No attendance data for today, status: Not Marked');
        return 'Not Marked';
      }
      
      // If verified clock-in from local state and there's a record, use that
      if (verifiedClockIn && todayAttendance && todayAttendance.length > 0) {
        console.log('User has verified clock in today, forcing status: ON_TIME');
        // If also clocked out, show as PRESENT
        if (verifiedClockOut) {
          return 'PRESENT';
        }
        return 'ON_TIME';
      }

      const record = todayAttendance[0];
      console.log('Deriving status from record:', record);
      
      // If the record has an explicit status, use it
      if (record?.status && record.status !== '') {
        const upperStatus = record.status.toUpperCase();
        console.log(`Using explicit status from record: ${upperStatus}`);
        return upperStatus;
      }
      
      // Derive status from clock in/out data
      if (record?.clockInTime && record?.clockOutTime) {
        console.log('User has both clock in and clock out times, status: PRESENT');
        return 'PRESENT';
      } else if (record?.clockInTime) {
        console.log('User has only clock in time, status: ON_TIME');
        return 'ON_TIME';
      } else {
        console.log('User has no clock times, status: Not Marked');
        return 'Not Marked';
      }
    } catch (error) {
      console.error('Error in getDerivedStatus:', error);
      return 'Not Marked';
    }
  }, [todayAttendance, verifiedClockIn, verifiedClockOut]);

  // Log the derived status for debugging
  React.useEffect(() => {
    console.log('Current derived status:', getDerivedStatus);
  }, [getDerivedStatus]);

  // Initialize attendance state from localStorage on component mount
  useEffect(() => {
    if (userId) {
      // Load values from localStorage
      const clockIn = getLocalStorageValue('clockIn');
      const clockOut = getLocalStorageValue('clockOut');
      
      console.log('Initializing from localStorage:', { clockIn, clockOut });
      
      // Only set state if different from current value
      if (clockIn !== verifiedClockIn) {
        setVerifiedClockIn(clockIn);
      }
      
      if (clockOut !== verifiedClockOut) {
        setVerifiedClockOut(clockOut);
      }
    }
  }, [userId, verifiedClockIn, verifiedClockOut]);

  // Sync state with API data when it changes
  useEffect(() => {
    if (todayAttendance && todayAttendance.length > 0) {
      const record = todayAttendance[0];
      const hasClockIn = Boolean(record?.clockInTime) && record.clockInTime !== '';
      const hasClockOut = Boolean(record?.clockOutTime) && record.clockOutTime !== '';
      
      console.log('API data changed, syncing with local state:', { hasClockIn, hasClockOut });
      
      // Only update if different from current state to avoid loops
      if (hasClockIn !== verifiedClockIn || hasClockOut !== verifiedClockOut) {
        console.log('Updating local state from API data');
        if (hasClockIn !== verifiedClockIn) setVerifiedClockIn(hasClockIn);
        if (hasClockOut !== verifiedClockOut) setVerifiedClockOut(hasClockOut);
        
        // Save to localStorage
        setLocalStorageValue('clockIn', hasClockIn);
        setLocalStorageValue('clockOut', hasClockOut);
      }
    }
  }, [todayAttendance, verifiedClockIn, verifiedClockOut]);

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Attendance</h1>
        <p className="text-lg text-gray-600 mt-1">{format(new Date(), 'EEEE, MMMM do, yyyy')}</p>
      </div>
      {message && (
        <div
          className={`mb-6 p-4 rounded-md ${messageType === 'success' ? 'bg-green-50 text-green-700' :
            messageType === 'error' ? 'bg-red-50 text-red-700' :
              'bg-blue-50 text-blue-700'
            } text-center`}>
          {message}
        </div>
      )}
      {/* Widgets Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Today's Status Widget */}
        <div
          className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
          <div className="px-6 py-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Today's Status</h3>
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
              {todayLoading ? (
                <div className="animate-pulse h-20 bg-gray-200 rounded"></div>
              ) : (
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center">
                    <div
                      className={`h-3 w-3 rounded-full ${
                        (getDerivedStatus === 'PRESENT' || getDerivedStatus === 'ON_TIME') ? 'bg-green-500' :
                        (getDerivedStatus === 'LATE') ? 'bg-yellow-500' :
                        (getDerivedStatus === 'ABSENT') ? 'bg-red-500' :
                        'bg-gray-400'
                      } mr-2`}></div>
                    <span className="text-base font-medium text-gray-800">
                      Status: {getDerivedStatus}
                    </span>
                  </div>

                  {todayAttendance?.[0]?.clockInTime && (
                    <div className="flex items-center text-sm text-gray-600">
                      <svg
                        className="h-5 w-5 text-green-500 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      Clock In: {format(new Date(todayAttendance[0]?.clockInTime), 'h:mm a')}
                    </div>
                  )}

                  {todayAttendance?.[0]?.clockOutTime && (
                    <div className="flex items-center text-sm text-gray-600">
                      <svg
                        className="h-5 w-5 text-red-500 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Clock Out: {format(new Date(todayAttendance[0]?.clockOutTime), 'h:mm a')}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Monthly Stats Widget */}
        <div
          className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
          <div className="px-6 py-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Monthly Statistics</h3>
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

            <div className="mt-4 space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Present</span>
                  <span className="text-sm font-medium">{present + onTime} days</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                  <div
                    className="bg-green-600 h-2.5 rounded-full"
                    style={{ width: `${presentPercentage}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Late</span>
                  <span className="text-sm font-medium">{late} days</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                  <div
                    className="bg-yellow-500 h-2.5 rounded-full"
                    style={{ width: `${latePercentage}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Absent</span>
                  <span className="text-sm font-medium">{absent} days</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                  <div
                    className="bg-red-500 h-2.5 rounded-full"
                    style={{ width: `${absentPercentage}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Clock In/Out Widget */}
        <div
          className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
          <div className="px-6 py-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Clock In/Out</h3>
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

            {!showOtpInput ? (
              <ClockButtons
                key={`clock-buttons-${verifiedClockIn}-${verifiedClockOut}-${hasClockInToday}-${hasClockOutToday}-${forceUpdate}`}
                hasClockInToday={Boolean(hasClockInToday || verifiedClockIn)}
                hasClockOutToday={Boolean(hasClockOutToday || verifiedClockOut)}
                onClockIn={handleClockIn}
                onClockOut={handleClockOut}
                isClockInPending={clockInMutation.isPending || false}
                isClockOutPending={clockOutMutation.isPending || false}
                status={todayAttendance?.[0]?.status || ''} />
            ) : (
              <div className="mt-4 space-y-4">
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                    Enter OTP
                  </label>
                  <input
                    id="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
                  <p className="mt-1 text-xs text-gray-500">
                    Enter the OTP sent to your manager to verify your {actionType === 'clockIn' ? 'clock in' : 'clock out'}.
                  </p>
                </div>

                <button
                  onClick={submitOtpVerification}
                  disabled={!otp || verifyClockInMutation.isPending || verifyClockOutMutation.isPending}
                  className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed">
                  {verifyClockInMutation.isPending || verifyClockOutMutation.isPending ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Verifying...
                    </span>
                  ) : `Verify ${actionType === 'clockIn' ? 'Clock In' : 'Clock Out'}`}
                </button>

                <button
                  onClick={() => {
                    setShowOtpInput(false);
                    setOtp('');
                    setActionType(null);
                  }}
                  className="w-full py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Attendance History */}
      <div
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Attendance History</h3>

          {recordsLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-40 bg-gray-200 rounded"></div>
            </div>
          ) : Array.isArray(attendanceRecords) && attendanceRecords.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clock In</th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clock Out</th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {attendanceRecords
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {format(parseISO(record.date), 'EEEE')}
                            {isToday(parseISO(record.date)) && <span className="ml-2 text-xs text-indigo-600">(Today)</span>}
                          </div>
                          <div className="text-sm text-gray-500">{format(parseISO(record.date), 'MMM do, yyyy')}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {record.clockInTime ? format(new Date(record.clockInTime), 'h:mm a') : '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {record.clockOutTime ? format(new Date(record.clockOutTime), 'h:mm a') : '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(record.status)}`}>
                            {record.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No attendance records found for this month.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffAttendance;


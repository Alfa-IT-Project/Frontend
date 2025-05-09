import React, { useEffect } from 'react';

const ClockButtons = ({
  hasClockInToday = false,
  hasClockOutToday = false,
  onClockIn,
  onClockOut,
  isClockInPending = false,
  isClockOutPending = false,
  status = ''
}) => {
  // Log props for debugging
  useEffect(() => {
    console.log('ClockButtons component props:', {
      hasClockInToday,
      hasClockOutToday,
      isClockInPending,
      isClockOutPending,
      status
    });
  }, [hasClockInToday, hasClockOutToday, isClockInPending, isClockOutPending, status]);

  // Get clock in button state
  const clockInButtonState = React.useMemo(() => {
    console.log('Calculating Clock In button state:', { 
      hasClockInToday, 
      hasClockOutToday, 
      isClockInPending 
    });
    
    // IMPORTANT: If already clocked in OR clocked out for the day, disable button
    const disabled = hasClockInToday || hasClockOutToday || isClockInPending;
    let buttonText = 'Clock In';
    let buttonClass = 'bg-green-600 hover:bg-green-700';
    
    if (hasClockInToday) {
      buttonText = 'Already Clocked In';
      buttonClass = 'bg-gray-400 cursor-not-allowed';
    } else if (hasClockOutToday) {
      buttonText = 'Already Completed Today';
      buttonClass = 'bg-gray-400 cursor-not-allowed';
    } else if (isClockInPending) {
      buttonText = 'Processing...';
      buttonClass = 'bg-gray-400 cursor-not-allowed';
    }
    
    return { disabled, buttonText, buttonClass };
  }, [hasClockInToday, hasClockOutToday, isClockInPending]);
  
  // Get clock out button state
  const clockOutButtonState = React.useMemo(() => {
    console.log('Calculating Clock Out button state:', { 
      hasClockInToday, 
      hasClockOutToday, 
      isClockOutPending 
    });
    
    const disabled = !hasClockInToday || hasClockOutToday || isClockOutPending;
    let buttonText = 'Clock Out';
    let buttonClass = 'bg-red-600 hover:bg-red-700';
    
    if (hasClockOutToday) {
      buttonText = 'Already Clocked Out';
      buttonClass = 'bg-gray-400 cursor-not-allowed';
    } else if (!hasClockInToday) {
      buttonText = 'Clock In First';
      buttonClass = 'bg-gray-400 cursor-not-allowed';
    } else if (isClockOutPending) {
      buttonText = 'Processing...';
      buttonClass = 'bg-gray-400 cursor-not-allowed';
    }
    
    return { disabled, buttonText, buttonClass };
  }, [hasClockInToday, hasClockOutToday, isClockOutPending]);
  
  // Log button states for debugging
  useEffect(() => {
    console.log('Button states:', {
      clockIn: clockInButtonState,
      clockOut: clockOutButtonState
    });
  }, [clockInButtonState, clockOutButtonState]);

  // Direct console log in render to see final props
  console.log('⚠️ RENDERING ClockButtons with props:', { 
    hasClockInToday, 
    hasClockOutToday,
    clockInDisabled: clockInButtonState.disabled,
    clockOutDisabled: clockOutButtonState.disabled
  });

  return (
    <div className="mt-4 space-y-4">
      <button
        onClick={onClockIn}
        disabled={clockInButtonState.disabled}
        className={`w-full py-3 px-4 ${clockInButtonState.buttonClass} text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-75`}
        data-testid="clock-in-button">
        {isClockInPending ? (
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
            Processing...
          </span>
        ) : clockInButtonState.buttonText}
      </button>
      <button
        onClick={onClockOut}
        disabled={clockOutButtonState.disabled}
        className={`w-full py-3 px-4 ${clockOutButtonState.buttonClass} text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-75`}
        data-testid="clock-out-button">
        {isClockOutPending ? (
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
            Processing...
          </span>
        ) : clockOutButtonState.buttonText}
      </button>
    </div>
  );
};

export default ClockButtons;

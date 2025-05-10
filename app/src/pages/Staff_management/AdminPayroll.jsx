import React, { useState } from 'react';
import { StaffSelection } from '../../components/Staff_management/payroll/StaffSelection';
import { StaffPayrollDashboard } from '../../components/Staff_management/payroll/StaffPayrollDashboard';

const AdminPayroll = () => {
  const [selectedStaffId, setSelectedStaffId] = useState(null);

  const handleSelectStaff = (staffId) => {
    setSelectedStaffId(staffId);
  };

  const handleBack = () => {
    setSelectedStaffId(null);
  };

  return (
    <div>
      {selectedStaffId ? (
        <StaffPayrollDashboard 
          staffId={selectedStaffId} 
          onBack={handleBack} 
          isAdmin={true} 
        />
      ) : (
        <StaffSelection onSelectStaff={handleSelectStaff} />
      )}
    </div>
  );
};

export default AdminPayroll; 
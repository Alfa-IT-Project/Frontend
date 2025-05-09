import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { payroll } from '../../../services/api';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { formatCurrency } from '../../../utils/format';
import PayrollForm from '../PayrollForm';
import Modal from '../ui/modal';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import PayrollCheckModal from './PayrollCheckModal';

export const StaffPayrollDashboard = ({ staffId, onBack, isAdmin = false }) => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth() + 1).toString().padStart(2, '0'));
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  const { data: response, isLoading, refetch } = useQuery({
    queryKey: ['staffPayroll', staffId],
    queryFn: () => payroll.getStaffPayroll(staffId),
  });

  const approveMutation = useMutation({
    mutationFn: (id) => payroll.approve(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staffPayroll', staffId] });
    },
  });

  const markAsPaidMutation = useMutation({
    mutationFn: (id) => payroll.markAsPaid(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staffPayroll', staffId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => payroll.delete(id),
    onSuccess: () => {
      toast.success('Payroll record deleted successfully');
      refetch();
      setIsConfirmModalOpen(false);
    },
    onError: (error) => {
      console.error('Delete error:', error);
      const errorMessage = error.response?.data?.error || 
                          error.message || 
                          'Failed to delete payroll record';
      toast.error(errorMessage);
      setIsConfirmModalOpen(false);
      refetch();
    }
  });

  const payrollRecords = response?.data || [];
  const validPayrollRecords = payrollRecords.filter(record => !!record.id);
  const filteredRecords = validPayrollRecords.filter((record) => 
    record.year === selectedYear && 
    record.month === selectedMonth);

  const currentRecord = filteredRecords[0];
  const totalPayroll = currentRecord?.netSalary || 0;

  const handleEdit = (record) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    console.log(`Attempting to delete payroll record: ${id}`);
    // First verify the record exists
    payroll.getById(id)
      .then(() => {
        setRecordToDelete(id);
        setIsConfirmModalOpen(true);
      })
      .catch((error) => {
        console.error(`Record verification failed: ${id}`, error);
        toast.error(
          `Cannot delete record: ${error.response?.data?.error || 'Record not found'}`
        );
        // Force refresh the data to update the UI
        queryClient.invalidateQueries({ queryKey: ['staffPayroll', staffId] });
      });
  };

  const confirmDelete = () => {
    if (!recordToDelete) return;
    
    // Double check that the record still exists in our current state
    const recordExists = validPayrollRecords.some(record => record.id === recordToDelete);
    
    if (!recordExists) {
      toast.warning('Record no longer exists or has already been deleted');
      setIsConfirmModalOpen(false);
      // Refresh the data
      refetch();
      return;
    }
    
    deleteMutation.mutate(recordToDelete);
  };

  const handlePrintCheck = () => {
    // Ensure all salary values are proper numbers before passing to PayrollCheckModal
    if (currentRecord) {
      // Create a copy with all salary values converted to numbers
      currentRecord.basicSalary = Number(currentRecord.basicSalary) || 0;
      currentRecord.allowances = Number(currentRecord.allowances) || 0;
      currentRecord.deductions = Number(currentRecord.deductions) || 0;
      currentRecord.netSalary = Number(currentRecord.netSalary) || 0;
      
      // Log the values to verify
      console.log('Prepared record for print:', {
        basicSalary: currentRecord.basicSalary,
        allowances: currentRecord.allowances,
        deductions: currentRecord.deductions,
        netSalary: currentRecord.netSalary,
        types: {
          basicSalary: typeof currentRecord.basicSalary,
          allowances: typeof currentRecord.allowances,
          deductions: typeof currentRecord.deductions,
          netSalary: typeof currentRecord.netSalary,
        }
      });
    }
    
    setIsPrintModalOpen(true);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button onClick={onBack} variant="outline">Back</Button>
          <h1 className="text-2xl font-bold">Payroll Details</h1>
        </div>
        <div className="flex gap-4">
          <select
            value={selectedMonth}
            onChange={(e) => {
              setSelectedMonth(e.target.value);
              // Refresh data when changing month
              queryClient.invalidateQueries({ queryKey: ['staffPayroll', staffId] });
            }}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
            {Array.from({ length: 12 }, (_, i) => {
              const month = (i + 1).toString().padStart(2, '0');
              return (
                <option key={month} value={month}>
                  {format(new Date(2000, i), 'MMMM')}
                </option>
              );
            })}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => {
              setSelectedYear(e.target.value);
              // Refresh data when changing year
              queryClient.invalidateQueries({ queryKey: ['staffPayroll', staffId] });
            }}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
            {Array.from({ length: 5 }, (_, i) => (
              <option key={i} value={new Date().getFullYear() - i}>
                {new Date().getFullYear() - i}
              </option>
            ))}
          </select>
          {isAdmin && (
            <Button onClick={() => setIsModalOpen(true)}>Add Payroll Record</Button>
          )}
        </div>
      </div>
      {currentRecord ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900">Net Salary</h3>
              <p className="text-3xl font-bold text-indigo-600 mt-2">
                {formatCurrency(currentRecord.netSalary)}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900">Status</h3>
              <p
                className={`text-2xl font-bold mt-2 ${
                  currentRecord.status === 'PAID' ? 'text-green-600' :
                  currentRecord.status === 'APPROVED' ? 'text-blue-600' :
                  'text-yellow-600'
                }`}>
                {currentRecord.status}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900">Payment Date</h3>
              <p className="text-2xl font-bold text-gray-600 mt-2">
                {currentRecord.paymentDate ? new Date(currentRecord.paymentDate).toLocaleDateString() : 'Pending'}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Component</TableHead>
                  <TableHead>Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Basic Salary</TableCell>
                  <TableCell>{formatCurrency(currentRecord.basicSalary)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Allowances</TableCell>
                  <TableCell>{formatCurrency(currentRecord.allowances)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Deductions</TableCell>
                  <TableCell>{formatCurrency(currentRecord.deductions)}</TableCell>
                </TableRow>
                <TableRow className="font-bold">
                  <TableCell>Net Salary</TableCell>
                  <TableCell>{formatCurrency(currentRecord.netSalary)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {isAdmin && (
            <div className="mt-6 flex justify-end gap-4">
              {currentRecord.status === 'PENDING' && (
                <>
                  <Button
                    onClick={() => handleEdit(currentRecord)}
                    variant="outline"
                    className="text-blue-600 border-blue-600">
                    Edit
                  </Button>
                </>
              )}
              
              <Button
                onClick={() => handleDelete(currentRecord.id)}
                variant="outline"
                className="text-red-600 border-red-600"
                disabled={deleteMutation.isPending}>
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </Button>
              
              {currentRecord.status === 'PENDING' && (
                <Button
                  onClick={() => approveMutation.mutate(currentRecord.id)}
                  className="bg-blue-600 hover:bg-blue-700">
                  Approve Payroll
                </Button>
              )}
              {currentRecord.status === 'APPROVED' && (
                <Button
                  onClick={() => markAsPaidMutation.mutate(currentRecord.id)}
                  className="bg-green-600 hover:bg-green-700">
                  Mark as Paid
                </Button>
              )}
              
              {(currentRecord.status === 'APPROVED' || currentRecord.status === 'PAID') && (
                <Button onClick={handlePrintCheck} className="bg-purple-600 hover:bg-purple-700">
                  🖨️ Print Check
                </Button>
              )}
            </div>
          )}
          
          {/* For staff users (non-admin), also show print check button if status is approved or paid */}
          {!isAdmin && (currentRecord.status === 'APPROVED' || currentRecord.status === 'PAID') && (
            <div className="mt-6 flex justify-end gap-4">
              <Button onClick={handlePrintCheck} className="bg-purple-600 hover:bg-purple-700">
                🖨️ Print Check
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No payroll record found for the selected period.</p>
          {isAdmin && (
            <Button
              onClick={() => {
                setSelectedRecord(null);
                setIsModalOpen(true);
              }}
              className="mt-4">
              Create New Payroll Record
            </Button>
          )}
        </div>
      )}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedRecord(null);
        }}
        title={selectedRecord ? "Edit Payroll Record" : "Create Payroll Record"}>
        <PayrollForm
          staffId={staffId}
          initialData={selectedRecord}
          onSuccess={() => {
            setIsModalOpen(false);
            setSelectedRecord(null);
            queryClient.invalidateQueries({ queryKey: ['staffPayroll', staffId] });
          }} />
      </Modal>
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        title="Confirm Delete">
        <div className="py-4">
          <p className="text-gray-700 mb-4">Are you sure you want to delete this payroll record? This action cannot be undone.</p>
          <div className="flex justify-end gap-4">
            <Button onClick={() => setIsConfirmModalOpen(false)} variant="outline">
              Cancel
            </Button>
            <Button onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </Button>
          </div>
        </div>
      </Modal>
      {currentRecord && (
        <PayrollCheckModal
          record={currentRecord}
          isOpen={isPrintModalOpen}
          onClose={() => setIsPrintModalOpen(false)} />
      )}
    </div>
  );
}; 
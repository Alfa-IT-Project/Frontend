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
import { 
  ArrowLeftIcon, 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  CheckCircleIcon, 
  BanknotesIcon,
  DocumentIcon,
  PrinterIcon,
  CurrencyDollarIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

export const StaffPayrollDashboard = ({ staffId, onBack, isAdmin = false }) => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth() + 1).toString().padStart(2, '0'));
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('details'); // 'details' or 'history'

  // Log admin status to verify it's being passed correctly
  console.log('StaffPayrollDashboard - isAdmin:', isAdmin);

  const { data: response, isLoading, refetch } = useQuery({
    queryKey: ['staffPayroll', staffId],
    queryFn: () => payroll.getStaffPayroll(staffId),
  });

  const approveMutation = useMutation({
    mutationFn: (id) => payroll.approve(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staffPayroll', staffId] });
      toast.success('Payroll record approved successfully');
    },
  });

  const markAsPaidMutation = useMutation({
    mutationFn: (id) => payroll.markAsPaid(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staffPayroll', staffId] });
      toast.success('Payroll record marked as paid');
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
  const historyRecords = validPayrollRecords.sort((a, b) => {
    // Sort by year and month, most recent first
    if (a.year !== b.year) return Number(b.year) - Number(a.year);
    return Number(b.month) - Number(a.month);
  });

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

  // Format a date string in readable format
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    try {
      return format(new Date(dateString), 'MMMM d, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };

  if (isLoading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <Button 
            onClick={onBack} 
            variant="outline" 
            className="text-gray-700 hover:bg-gray-100 flex items-center gap-1.5 border-gray-300 h-10 rounded-full px-4 transition-all duration-200 hover:shadow-sm">
            <ArrowLeftIcon className="h-5 w-5" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">Staff Payroll</h1>
        </div>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-gray-50 px-4 py-2 rounded-full flex items-center gap-2 h-11 shadow-sm border border-gray-200">
            <select
              value={selectedMonth}
              onChange={(e) => {
                setSelectedMonth(e.target.value);
                queryClient.invalidateQueries({ queryKey: ['staffPayroll', staffId] });
              }}
              className="bg-transparent text-gray-700 border-none focus:ring-0 focus:outline-none appearance-none pr-8 pl-2 py-1 h-8">
              {Array.from({ length: 12 }, (_, i) => {
                const month = (i + 1).toString().padStart(2, '0');
                return (
                  <option key={month} value={month} className="text-gray-800">
                    {format(new Date(2000, i), 'MMMM')}
                  </option>
                );
              })}
            </select>
          </div>
          
          <div className="bg-gray-50 px-4 py-2 rounded-full flex items-center gap-2 h-11 shadow-sm border border-gray-200">
            <select
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(e.target.value);
                queryClient.invalidateQueries({ queryKey: ['staffPayroll', staffId] });
              }}
              className="bg-transparent text-gray-700 border-none focus:ring-0 focus:outline-none appearance-none pr-8 pl-2 py-1 h-8">
              {Array.from({ length: 5 }, (_, i) => (
                <option key={i} value={new Date().getFullYear() - i} className="text-gray-800">
                  {new Date().getFullYear() - i}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button
            className={`px-5 py-2 rounded-full font-medium transition-all duration-200 h-11 shadow-sm ${
              activeTab === 'details' 
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow' 
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
            onClick={() => setActiveTab('details')}>
            Current Period
          </button>
          <button
            className={`px-5 py-2 rounded-full font-medium transition-all duration-200 h-11 shadow-sm ${
              activeTab === 'history' 
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow' 
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
            onClick={() => setActiveTab('history')}>
            History
          </button>
        </div>
      </div>
      
      {activeTab === 'details' && (
        <>
          {currentRecord ? (
            <>
              {isAdmin && (
                <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 mb-6">
                  <div className="flex flex-wrap gap-3">
                    {currentRecord.status === 'PENDING' && (
                      <>
                        <Button
                          onClick={() => handleEdit(currentRecord)}
                          className="bg-white text-blue-600 border border-blue-600 hover:bg-blue-50 py-2 px-4 rounded-full transition-all duration-200 flex items-center gap-1.5 text-sm">
                          <PencilIcon className="h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDelete(currentRecord.id)}
                          className="bg-white text-red-600 border border-red-600 hover:bg-red-50 py-2 px-4 rounded-full transition-all duration-200 flex items-center gap-1.5 text-sm">
                          <TrashIcon className="h-4 w-4" />
                          Delete
                        </Button>
                        <Button
                          onClick={() => approveMutation.mutate(currentRecord.id)}
                          className="bg-blue-600 text-white hover:bg-blue-700 py-2 px-4 rounded-full transition-all duration-200 flex items-center gap-1.5 text-sm">
                          <CheckCircleIcon className="h-4 w-4" />
                          Approve
                        </Button>
                      </>
                    )}
                    {currentRecord.status === 'APPROVED' && (
                      <Button
                        onClick={() => markAsPaidMutation.mutate(currentRecord.id)}
                        className="bg-green-600 text-white hover:bg-green-700 py-2 px-4 rounded-full transition-all duration-200 flex items-center gap-1.5 text-sm">
                        <BanknotesIcon className="h-4 w-4" />
                        Mark as Paid
                      </Button>
                    )}
                    {currentRecord.status === 'PAID' && (
                      <Button
                        onClick={handlePrintCheck}
                        className="bg-purple-600 text-white hover:bg-purple-700 py-2 px-4 rounded-full transition-all duration-200 flex items-center gap-1.5 text-sm">
                        <PrinterIcon className="h-4 w-4" />
                        Print Check
                      </Button>
                    )}
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium text-gray-500">Net Salary</h3>
                    <CurrencyDollarIcon className="h-5 w-5 text-indigo-600" />
                  </div>
                  <p className="text-2xl font-bold text-indigo-600">
                    {formatCurrency(currentRecord.netSalary)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {format(new Date(parseInt(selectedYear), parseInt(selectedMonth) - 1), 'MMMM yyyy')}
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium text-gray-500">Status</h3>
                    <CheckCircleIcon className="h-5 w-5 text-green-600" />
                  </div>
                  <p
                    className={`text-2xl font-bold ${
                      currentRecord.status === 'PAID' ? 'text-green-600' :
                      currentRecord.status === 'APPROVED' ? 'text-blue-600' :
                      'text-yellow-600'
                    }`}>
                    {currentRecord.status}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Last updated: {formatDate(currentRecord.updatedAt || '')}</p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium text-gray-500">Payment Date</h3>
                    <CalendarIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-600">
                    {currentRecord.paymentDate ? format(new Date(currentRecord.paymentDate), 'MMM d') : 'Pending'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {currentRecord.paymentDate ? format(new Date(currentRecord.paymentDate), 'yyyy') : ''}
                  </p>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 mb-6">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                  <h2 className="text-lg font-medium text-gray-800">Salary Breakdown</h2>
                </div>
                <div className="overflow-hidden">
                  <Table className="border-collapse">
                    <TableHeader>
                      <TableRow className="border-b border-gray-100">
                        <TableHead className="border-0">Component</TableHead>
                        <TableHead className="border-0">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow className="border-b border-gray-100">
                        <TableCell className="font-medium border-0">Basic Salary</TableCell>
                        <TableCell className="border-0">{formatCurrency(currentRecord.basicSalary)}</TableCell>
                      </TableRow>
                      <TableRow className="border-b border-gray-100">
                        <TableCell className="font-medium text-green-700 border-0">Allowances</TableCell>
                        <TableCell className="text-green-700 border-0">{formatCurrency(currentRecord.allowances)}</TableCell>
                      </TableRow>
                      <TableRow className="border-b border-gray-100">
                        <TableCell className="font-medium text-red-700 border-0">Deductions</TableCell>
                        <TableCell className="text-red-700 border-0">-{formatCurrency(currentRecord.deductions)}</TableCell>
                      </TableRow>
                      <TableRow className="bg-gray-50">
                        <TableCell className="font-bold border-0">Net Salary</TableCell>
                        <TableCell className="font-bold border-0">{formatCurrency(currentRecord.netSalary)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
              <DocumentIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No Payroll Record Found</h3>
              <p className="text-gray-500 mb-6">
                There is no payroll record for {format(new Date(parseInt(selectedYear), parseInt(selectedMonth) - 1), 'MMMM yyyy')}
              </p>
              {isAdmin && (
                <Button 
                  onClick={() => {
                    setSelectedRecord(null);
                    setIsModalOpen(true);
                  }}
                  className="bg-indigo-600 text-white hover:bg-indigo-700 px-5 py-2 rounded-full transition-all duration-200 mx-auto flex items-center justify-center gap-1.5 w-auto">
                  <PlusIcon className="h-5 w-5" />
                  Create Payroll
                </Button>
              )}
            </div>
          )}
        </>
      )}
      
      {activeTab === 'history' && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-medium text-gray-800">Payment History</h2>
          </div>
          <div className="overflow-x-auto">
            <Table className="border-collapse">
              <TableHeader>
                <TableRow className="border-b border-gray-100">
                  <TableHead className="bg-gray-50 border-0">Period</TableHead>
                  <TableHead className="bg-gray-50 border-0">Basic Salary</TableHead>
                  <TableHead className="bg-gray-50 border-0">Allowances</TableHead>
                  <TableHead className="bg-gray-50 border-0">Deductions</TableHead>
                  <TableHead className="bg-gray-50 border-0">Net Salary</TableHead>
                  <TableHead className="bg-gray-50 border-0">Status</TableHead>
                  <TableHead className="bg-gray-50 border-0">Payment Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {historyRecords.length > 0 ? (
                  historyRecords.map((record) => (
                    <TableRow key={record.id} className="hover:bg-gray-50 border-b border-gray-100">
                      <TableCell className="border-0">
                        {format(new Date(parseInt(record.year), parseInt(record.month) - 1), 'MMM yyyy')}
                      </TableCell>
                      <TableCell className="border-0">{formatCurrency(record.basicSalary)}</TableCell>
                      <TableCell className="text-green-700 border-0">{formatCurrency(record.allowances)}</TableCell>
                      <TableCell className="text-red-700 border-0">-{formatCurrency(record.deductions)}</TableCell>
                      <TableCell className="font-medium border-0">{formatCurrency(record.netSalary)}</TableCell>
                      <TableCell className="border-0">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${
                            record.status === 'PAID' ? 'bg-green-100 text-green-800' :
                            record.status === 'APPROVED' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                          {record.status}
                        </span>
                      </TableCell>
                      <TableCell className="border-0">
                        {record.paymentDate ? 
                          format(new Date(record.paymentDate), 'MMM d, yyyy') : 
                          <span className="text-gray-400">-</span>}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500 border-0">
                      <DocumentIcon className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                      <p>No payroll history found</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
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
            toast.success(selectedRecord ? 'Payroll record updated' : 'Payroll record created');
          }}
        />
      </Modal>

      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        title="Confirm Delete">
        <div className="p-6">
          <div className="flex items-center justify-center mb-4 text-red-500">
            <TrashIcon className="h-12 w-12 text-red-500 mx-auto" />
          </div>
          <p className="text-center mb-6">
            Are you sure you want to delete this payroll record?
          </p>
          <div className="flex justify-center gap-3">
            <Button
              onClick={() => setIsConfirmModalOpen(false)}
              className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-5 py-2 rounded-full">
              Cancel
            </Button>
            <Button
              onClick={confirmDelete}
              className="bg-red-600 text-white hover:bg-red-700 px-5 py-2 rounded-full">
              Delete
            </Button>
          </div>
        </div>
      </Modal>

      <PayrollCheckModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        record={selectedRecord || currentRecord}
      />
    </div>
  );
}; 
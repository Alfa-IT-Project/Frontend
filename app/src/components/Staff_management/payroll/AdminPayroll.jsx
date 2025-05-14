import React, { useState, useEffect } from 'react';
import { payroll } from '../../services/api';
import Modal from '../ui/modal';
import Chart from '../ui/chart';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { formatCurrency } from '../../utils/format';
import PayrollForm from '../PayrollForm';
import PrintCheck from './PrintCheck';

export const AdminPayroll = () => {
  const queryClient = useQueryClient();
  const [payrollRecords, setPayrollRecords] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCheckModalOpen, setIsCheckModalOpen] = useState(false);
  const [checkRecord, setCheckRecord] = useState(null);
  const [showApprovalSuccessModal, setShowApprovalSuccessModal] = useState(false);
  const [recentlyApprovedRecord, setRecentlyApprovedRecord] = useState(null);

  const { data: response, isLoading } = useQuery({
    queryKey: ['payroll'],
    queryFn: () => payroll.getAll(),
  });

  const approveMutation = useMutation({
    mutationFn: (id) => payroll.approve(id),
    onSuccess: async (data, id) => {
      queryClient.invalidateQueries({ queryKey: ['payroll'] });
      // Find the approved record in the current list or fetch it
      const approvedRecord = payrollRecords.find(record => record.id === id) || 
                          (await payroll.getById(id)).data;
      
      if (approvedRecord) {
        setRecentlyApprovedRecord(approvedRecord);
        setShowApprovalSuccessModal(true);
      }
    },
  });

  const markAsPaidMutation = useMutation({
    mutationFn: (id) => payroll.markAsPaid(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payroll'] });
    },
  });

  useEffect(() => {
    fetchPayrollRecords();
    extractDepartments();
  }, [selectedMonth, selectedYear, selectedDepartment]);

  const fetchPayrollRecords = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await payroll.getAll();
      let filteredRecords = response.data;

      if (selectedMonth) {
        filteredRecords = filteredRecords.filter((record) => record.month === selectedMonth.toString().padStart(2, '0'));
      }

      if (selectedYear) {
        filteredRecords = filteredRecords.filter((record) => record.year === selectedYear.toString());
      }

      if (selectedDepartment) {
        filteredRecords = filteredRecords.filter((record) => record.user?.department === selectedDepartment);
      }

      setPayrollRecords(filteredRecords);
    } catch (err) {
      setError('Failed to fetch payroll records');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const extractDepartments = () => {
    const uniqueDepartments = Array.from(
      new Set(payrollRecords.map((record) => record.user?.department).filter(Boolean))
    );
    setDepartments(uniqueDepartments);
  };

  const handleApprove = async (id) => {
    try {
      approveMutation.mutate(id);
    } catch (err) {
      setError('Failed to approve payroll record');
      console.error(err);
    }
  };

  const handleMarkAsPaid = async (id) => {
    try {
      await payroll.markAsPaid(id);
      fetchPayrollRecords();
    } catch (err) {
      setError('Failed to mark payroll record as paid');
      console.error(err);
    }
  };

  const handleEdit = (record) => {
    setSelectedRecord(record);
    setShowModal(true);
  };

  const handleUpdate = async (data) => {
    try {
      await payroll.update(selectedRecord.id, data);
      setShowModal(false);
      fetchPayrollRecords();
    } catch (err) {
      setError('Failed to update payroll record');
      console.error(err);
    }
  };

  const handlePrintCheck = (record) => {
    setCheckRecord(record);
    setIsCheckModalOpen(true);
  };

  // Handler for printing check after approval
  const handlePrintApprovedCheck = () => {
    setCheckRecord(recentlyApprovedRecord);
    setShowApprovalSuccessModal(false);
    setIsCheckModalOpen(true);
  };

  const getSummaryStats = () => {
    const totalRecords = payrollRecords.length;
    const totalSalary = payrollRecords.reduce((sum, record) => sum + record.netSalary, 0);
    const pendingRecords = payrollRecords.filter((record) => record.status === 'PENDING').length;
    const paidRecords = payrollRecords.filter((record) => record.status === 'PAID').length;

    return {
      totalRecords,
      totalSalary,
      pendingRecords,
      paidRecords,
    };
  };

  const getChartData = () => {
    const statusCounts = {
      PENDING: payrollRecords.filter((record) => record.status === 'PENDING').length,
      APPROVED: payrollRecords.filter((record) => record.status === 'APPROVED').length,
      PAID: payrollRecords.filter((record) => record.status === 'PAID').length,
    };

    return {
      labels: ['Pending', 'Approved', 'Paid'],
      datasets: [
        {
          label: 'Payroll Status',
          data: [statusCounts.PENDING, statusCounts.APPROVED, statusCounts.PAID],
          backgroundColor: ['#FCD34D', '#60A5FA', '#34D399'],
        },
      ],
    };
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Payroll Management</h1>
        <div className="flex gap-4">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i + 1}>
                {new Date(2000, i).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
            {Array.from({ length: 5 }, (_, i) => (
              <option key={i} value={new Date().getFullYear() - i}>
                {new Date().getFullYear() - i}
              </option>
            ))}
          </select>
          <Button onClick={() => setIsModalOpen(true)}>Add New Record</Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Total Payroll</h3>
          <p className="text-3xl font-bold text-indigo-600 mt-2">
            {formatCurrency(getSummaryStats().totalSalary)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Pending Records</h3>
          <p className="text-3xl font-bold text-yellow-600 mt-2">{getSummaryStats().pendingRecords}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Approved Records</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{getSummaryStats().totalRecords - getSummaryStats().pendingRecords - getSummaryStats().paidRecords}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Paid Records</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">{getSummaryStats().paidRecords}</p>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Approved Payrolls - Print Checks</h3>
        
        {payrollRecords.filter(record => record.status === 'APPROVED').length === 0 ? (
          <p className="text-gray-500 italic">No approved payroll records found. Approve a record to print checks.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {payrollRecords
              .filter(record => record.status === 'APPROVED')
              .map(record => (
                <div
                  key={record.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">{record.user?.name || 'Employee'}</h4>
                      <p className="text-sm text-gray-500">{record.user?.department || 'Department'}</p>
                    </div>
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                      {record.status}
                    </span>
                  </div>
                  <div className="text-sm mb-3">
                    <div className="flex justify-between py-1">
                      <span>Period:</span>
                      <span>{record.month}/{record.year}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>Net Salary:</span>
                      <span className="font-bold">{formatCurrency(record.netSalary)}</span>
                    </div>
                  </div>
                  <Button
                    variant="default"
                    className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2"
                    onClick={() => handlePrintCheck(record)}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-printer">
                      <polyline points="6 9 6 2 18 2 18 9"></polyline>
                      <path
                        d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                      <rect x="6" y="14" width="12" height="8"></rect>
                    </svg>
                    Print Check
                  </Button>
                </div>
              ))}
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow md:col-span-2">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Payroll Status Distribution</h3>
          <Chart data={getChartData()} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-4">
            <Button
              className="w-full"
              onClick={() => {
                const pendingIds = payrollRecords
                  .filter(record => record.status === 'PENDING')
                  .map(record => record.id);
                // Only approve the first one to trigger the modal
                if (pendingIds.length > 0) {
                  approveMutation.mutate(pendingIds[0]);
                  // For the rest, use regular approval
                  pendingIds.slice(1).forEach(id => payroll.approve(id));
                }
              }}>
              Approve All Pending
            </Button>
            <Button
              className="w-full"
              onClick={() => {
                const approvedIds = payrollRecords
                  .filter(record => record.status === 'APPROVED')
                  .map(record => record.id);
                approvedIds.forEach(id => markAsPaidMutation.mutate(id));
              }}>
              Mark All Approved as Paid
            </Button>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Period</TableHead>
              <TableHead>Basic Salary</TableHead>
              <TableHead>Allowances</TableHead>
              <TableHead>Deductions</TableHead>
              <TableHead>Net Salary</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payrollRecords.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{record.user?.name || '-'}</TableCell>
                <TableCell>{record.user?.department || '-'}</TableCell>
                <TableCell>{`${record.month}/${record.year}`}</TableCell>
                <TableCell>{formatCurrency(record.basicSalary)}</TableCell>
                <TableCell>{formatCurrency(record.allowances)}</TableCell>
                <TableCell>{formatCurrency(record.deductions)}</TableCell>
                <TableCell>{formatCurrency(record.netSalary)}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      record.status === 'PAID' ? 'bg-green-100 text-green-800' :
                      record.status === 'APPROVED' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                    {record.status}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {record.status === 'PENDING' && (
                      <Button variant="ghost" onClick={() => handleApprove(record.id)}>
                        Approve
                      </Button>
                    )}
                    {record.status === 'APPROVED' && (
                      <>
                        <Button variant="ghost" onClick={() => markAsPaidMutation.mutate(record.id)}>
                          Mark as Paid
                        </Button>
                        <Button
                          variant="default"
                          className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-1"
                          onClick={() => handlePrintCheck(record)}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-printer">
                            <polyline points="6 9 6 2 18 2 18 9"></polyline>
                            <path
                              d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                            <rect x="6" y="14" width="12" height="8"></rect>
                          </svg>
                          Print Check
                        </Button>
                      </>
                    )}
                    {record.status === 'PAID' && (
                      <Button
                        variant="outline"
                        className="bg-green-50 text-green-600 border-green-200 hover:bg-green-100 flex items-center gap-1"
                        onClick={() => handlePrintCheck(record)}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="feather feather-printer">
                          <polyline points="6 9 6 2 18 2 18 9"></polyline>
                          <path
                            d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                          <rect x="6" y="14" width="12" height="8"></rect>
                        </svg>
                        Print Check
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setSelectedRecord(record);
                        setShowModal(true);
                      }}>
                      Edit
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Edit Payroll Record">
        {selectedRecord && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleUpdate({
                basicSalary: parseFloat(formData.get('basicSalary')),
                allowances: parseFloat(formData.get('allowances')),
                deductions: parseFloat(formData.get('deductions')),
              });
            }}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Basic Salary
                </label>
                <input
                  type="number"
                  name="basicSalary"
                  defaultValue={selectedRecord.basicSalary}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Allowances
                </label>
                <input
                  type="number"
                  name="allowances"
                  defaultValue={selectedRecord.allowances}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Deductions
                </label>
                <input
                  type="number"
                  name="deductions"
                  defaultValue={selectedRecord.deductions}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                  Save Changes
                </button>
              </div>
            </div>
          </form>
        )}
      </Modal>
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedRecord(null);
        }}
        title={selectedRecord ? 'Edit Payroll Record' : 'Add New Payroll Record'}>
        <PayrollForm
          initialData={selectedRecord}
          onSuccess={(record) => {
            setIsModalOpen(false);
            setSelectedRecord(null);
            fetchPayrollRecords();
          }} />
      </Modal>
      {/* Modal that appears after approving a payroll record */}
      <Modal
        isOpen={showApprovalSuccessModal}
        onClose={() => setShowApprovalSuccessModal(false)}
        title="Payroll Record Approved">
        <div className="py-4">
          <div className="bg-green-50 p-4 rounded-md mb-4">
            <p className="text-green-800">
              <span className="font-bold">Success!</span> The payroll record for {recentlyApprovedRecord?.user?.name || 'Employee'} 
              ({recentlyApprovedRecord?.month}/{recentlyApprovedRecord?.year}) has been approved.
            </p>
          </div>
          
          <p className="mb-6 font-medium text-lg text-center">Would you like to print a check for this payment?</p>
          
          <div className="flex justify-center gap-4">
            <Button variant="ghost" onClick={() => setShowApprovalSuccessModal(false)}>
              Not Now
            </Button>
            <Button
              variant="default"
              className="bg-green-600 hover:bg-green-700 text-white px-8 flex items-center gap-2"
              onClick={handlePrintApprovedCheck}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-printer">
                <polyline points="6 9 6 2 18 2 18 9"></polyline>
                <path
                  d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                <rect x="6" y="14" width="12" height="8"></rect>
              </svg>
              Print Check
            </Button>
          </div>
        </div>
      </Modal>
      {checkRecord && (
        <PrintCheck
          record={checkRecord}
          isOpen={isCheckModalOpen}
          onClose={() => setIsCheckModalOpen(false)} />
      )}
    </div>
  );
}; 
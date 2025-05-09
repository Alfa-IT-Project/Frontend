import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { payroll } from '../../services/api';
import { Button } from '../../components/Staff_management/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/Staff_management/ui/table';
import { formatCurrency } from '../../utils/format';
import { PDFDownloadLink } from '@react-pdf/renderer';
import SalarySheetPDF from '../../components/Staff_management/SalarySheetPDF';
import Modal from '../../components/Staff_management/ui/modal';
import PayrollForm from '../../components/Staff_management/PayrollForm';
import { toast } from 'react-toastify';

const StaffPayroll = () => {
  const userId = localStorage.getItem('userId');
  const queryClient = useQueryClient();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const { data: response, isLoading } = useQuery({
    queryKey: ['staffPayroll', userId],
    queryFn: () => payroll.getStaffPayroll(userId || ''),
  });

  const payrollRecords = response?.data || [];

  const filteredRecords = payrollRecords.filter((record) => 
    Number(record.year) === selectedYear && 
    Number(record.month) === selectedMonth);

  const handleEdit = (record) => {
    setSelectedRecord(record);
    setIsEditModalOpen(true);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Salary Records</h1>
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
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Current Month Salary</h3>
          <p className="text-3xl font-bold text-indigo-600 mt-2">
            {formatCurrency(filteredRecords[0]?.netSalary || 0)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Total Allowances</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {formatCurrency(filteredRecords[0]?.allowances || 0)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Total Deductions</h3>
          <p className="text-3xl font-bold text-red-600 mt-2">
            {formatCurrency(filteredRecords[0]?.deductions || 0)}
          </p>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
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
            {filteredRecords.map((record) => (
              <TableRow key={record.id}>
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
                  <div className="flex space-x-2">
                    {record.status === 'PENDING' && (
                      <Button
                        variant="outline"
                        className="text-blue-600 border-blue-600"
                        onClick={() => handleEdit(record)}>
                        Edit
                      </Button>
                    )}
                    {record.status === 'PAID' && (
                      <PDFDownloadLink
                        document={<SalarySheetPDF record={record} />}
                        fileName={`salary-sheet-${record.month}-${record.year}.pdf`}>
                        {({
                          loading
                        }) => (
                          <Button variant="ghost" disabled={loading}>
                            {loading ? 'Preparing...' : 'Download PDF'}
                          </Button>
                        )}
                      </PDFDownloadLink>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedRecord(null);
        }}
        title="Edit Payroll Record">
        {selectedRecord && (
          <PayrollForm
            initialData={selectedRecord}
            onSuccess={() => {
              setIsEditModalOpen(false);
              setSelectedRecord(null);
              queryClient.invalidateQueries({ queryKey: ['staffPayroll', userId] });
              toast.success('Payroll record updated successfully');
            }} />
        )}
      </Modal>
    </div>
  );
};

export default StaffPayroll; 
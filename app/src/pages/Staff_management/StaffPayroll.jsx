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
import { format } from 'date-fns';
import { 
  CurrencyDollarIcon, 
  DocumentArrowDownIcon, 
  PencilIcon, 
  ChartBarIcon, 
  BanknotesIcon, 
  ReceiptPercentIcon,
  CalendarIcon 
} from '@heroicons/react/24/outline';

const StaffPayroll = () => {
  const userId = localStorage.getItem('userId');
  const queryClient = useQueryClient();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [activeTab, setActiveTab] = useState('current'); // 'current' or 'history'

  const { data: response, isLoading } = useQuery({
    queryKey: ['staffPayroll', userId],
    queryFn: () => payroll.getStaffPayroll(userId || ''),
  });

  const payrollRecords = response?.data || [];

  const filteredRecords = payrollRecords.filter((record) => 
    Number(record.year) === selectedYear && 
    Number(record.month) === selectedMonth);
    
  const historyRecords = payrollRecords.sort((a, b) => {
    // Sort by year and month, most recent first
    if (Number(a.year) !== Number(b.year)) return Number(b.year) - Number(a.year);
    return Number(b.month) - Number(a.month);
  });

  const handleEdit = (record) => {
    setSelectedRecord(record);
    setIsEditModalOpen(true);
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
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-gray-50 px-4 py-2 rounded-full flex items-center gap-2 h-11 shadow-sm border border-gray-200">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="bg-transparent text-gray-700 border-none focus:ring-0 focus:outline-none appearance-none pr-8 pl-2 py-1 h-8">
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i + 1} className="text-gray-800">
                  {format(new Date(2000, i), 'MMMM')}
                </option>
              ))}
            </select>
            <CalendarIcon className="h-5 w-5 text-gray-500" />
          </div>
          
          <div className="bg-gray-50 px-4 py-2 rounded-full flex items-center gap-2 h-11 shadow-sm border border-gray-200">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="bg-transparent text-gray-700 border-none focus:ring-0 focus:outline-none appearance-none pr-8 pl-2 py-1 h-8">
              {Array.from({ length: 5 }, (_, i) => (
                <option key={i} value={new Date().getFullYear() - i} className="text-gray-800">
                  {new Date().getFullYear() - i}
                </option>
              ))}
            </select>
            <ChartBarIcon className="h-5 w-5 text-gray-500" />
          </div>
        </div>
        
        <div className="flex gap-3">
          <button
            className={`px-5 py-2 rounded-full font-medium transition-all duration-200 h-11 shadow-sm ${
              activeTab === 'current' 
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow' 
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
            onClick={() => setActiveTab('current')}>
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
      
      {activeTab === 'current' && (
        <>
          {filteredRecords.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium text-gray-500">Net Salary</h3>
                    <CurrencyDollarIcon className="h-5 w-5 text-indigo-600" />
                  </div>
                  <p className="text-2xl font-bold text-indigo-600">
                    {formatCurrency(filteredRecords[0]?.netSalary || 0)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {format(new Date(selectedYear, selectedMonth - 1), 'MMMM yyyy')}
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium text-gray-500">Allowances</h3>
                    <BanknotesIcon className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(filteredRecords[0]?.allowances || 0)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Additional benefits and bonuses
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium text-gray-500">Deductions</h3>
                    <ReceiptPercentIcon className="h-5 w-5 text-red-600" />
                  </div>
                  <p className="text-2xl font-bold text-red-600">
                    {formatCurrency(filteredRecords[0]?.deductions || 0)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Taxes and other withholdings
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 mb-6">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                  <h2 className="text-lg font-medium text-gray-800">Salary Breakdown</h2>
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
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow className="hover:bg-gray-50 border-b border-gray-100">
                        <TableCell className="border-0">{`${filteredRecords[0].month}/${filteredRecords[0].year}`}</TableCell>
                        <TableCell className="font-medium border-0">{formatCurrency(filteredRecords[0].basicSalary)}</TableCell>
                        <TableCell className="text-green-700 border-0">{formatCurrency(filteredRecords[0].allowances)}</TableCell>
                        <TableCell className="text-red-700 border-0">{formatCurrency(filteredRecords[0].deductions)}</TableCell>
                        <TableCell className="font-semibold border-0">{formatCurrency(filteredRecords[0].netSalary)}</TableCell>
                        <TableCell className="border-0">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${
                              filteredRecords[0].status === 'PAID' ? 'bg-green-100 text-green-800' :
                              filteredRecords[0].status === 'APPROVED' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                            {filteredRecords[0].status}
                          </span>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                
                {filteredRecords[0]?.status === 'PAID' && (
                  <div className="p-6 border-t border-gray-100 bg-gray-50">
                    <div className="flex items-center justify-end">
                      <PDFDownloadLink
                        document={<SalarySheetPDF record={filteredRecords[0]} />}
                        fileName={`salary-sheet-${filteredRecords[0].month}-${filteredRecords[0].year}.pdf`}
                        className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm transition-colors gap-1.5">
                        {({
                          loading
                        }) => (
                          <>
                            <DocumentArrowDownIcon className="h-5 w-5" />
                            {loading ? 'Preparing Document...' : 'Download Salary Statement'}
                          </>
                        )}
                      </PDFDownloadLink>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 p-8">
              <div className="text-center">
                <p className="text-lg text-gray-500">No payroll records found for this period</p>
              </div>
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
                      <TableCell className="text-red-700 border-0">{formatCurrency(record.deductions)}</TableCell>
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
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500 border-0">
                      No payroll records found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
      
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
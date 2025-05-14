import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { payroll } from '../../services/api';
import { Button } from '../../components/Staff_management/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/Staff_management/ui/table';
import { formatCurrency } from '../../utils/format';

const Payroll = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const { data: response, isLoading } = useQuery({
    queryKey: ['payroll'],
    queryFn: () => payroll.getAll(),
  });

  const payrollRecords = response?.data || [];

  if (isLoading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Payroll Records</h1>
        <Button 
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl transition-all duration-200 shadow-sm transform hover:-translate-y-0.5" 
          onClick={() => setIsModalOpen(true)}>
          Add Record
        </Button>
      </div>
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <div className="p-6 bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-gray-200 rounded-t-xl">
          <h2 className="text-lg font-medium text-gray-800 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            Staff Payroll Records
          </h2>
          <p className="text-sm text-gray-500 mt-1">Manage employee payroll information</p>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="py-4 px-6 font-semibold text-gray-600">Employee</TableHead>
                <TableHead className="py-4 px-6 font-semibold text-gray-600">Department</TableHead>
                <TableHead className="py-4 px-6 font-semibold text-gray-600">Period</TableHead>
                <TableHead className="py-4 px-6 font-semibold text-gray-600">Basic Salary</TableHead>
                <TableHead className="py-4 px-6 font-semibold text-gray-600">Allowances</TableHead>
                <TableHead className="py-4 px-6 font-semibold text-gray-600">Deductions</TableHead>
                <TableHead className="py-4 px-6 font-semibold text-gray-600">Net Salary</TableHead>
                <TableHead className="py-4 px-6 font-semibold text-gray-600">Status</TableHead>
                <TableHead className="py-4 px-6 font-semibold text-gray-600 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payrollRecords.length > 0 ? (
                payrollRecords.map((record) => (
                  <TableRow key={record.id} className="hover:bg-indigo-50/30 transition-all duration-150">
                    <TableCell className="py-4 px-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold">
                          {(record.user?.name || '-').charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">{record.user?.name || '-'}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {record.user?.department || '-'}
                      </span>
                    </TableCell>
                    <TableCell className="py-4 px-6 text-gray-600">{`${record.month}/${record.year}`}</TableCell>
                    <TableCell className="py-4 px-6 text-gray-600">{formatCurrency(record.basicSalary)}</TableCell>
                    <TableCell className="py-4 px-6 font-medium text-green-600">{formatCurrency(record.allowances)}</TableCell>
                    <TableCell className="py-4 px-6 font-medium text-red-600">{formatCurrency(record.deductions)}</TableCell>
                    <TableCell className="py-4 px-6 font-bold text-gray-900">{formatCurrency(record.netSalary)}</TableCell>
                    <TableCell className="py-4 px-6">
                      <span
                        className={`px-3 py-1.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          record.status === 'PAID' ? 'bg-green-100 text-green-800' :
                          record.status === 'APPROVED' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                        {record.status}
                      </span>
                    </TableCell>
                    <TableCell className="py-4 px-6 text-right">
                      <Button
                        className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-4 py-2 rounded-xl transition-all duration-200 text-sm shadow-sm hover:shadow"
                        onClick={() => {
                          setSelectedRecord(record);
                          setIsModalOpen(true);
                        }}>
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-12 text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <p>No payroll records found</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Payroll; 
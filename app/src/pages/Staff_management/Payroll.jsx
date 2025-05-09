import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { payroll } from '../../services/api';
import { Button } from '../components/Staff_management/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/Staff_management/ui/table';
import { formatCurrency } from '../utils/format';

const Payroll = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const { data: response, isLoading } = useQuery({
    queryKey: ['payroll'],
    queryFn: () => payroll.getAll(),
  });

  const payrollRecords = response?.data || [];

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Payroll Records</h1>
        <Button onClick={() => setIsModalOpen(true)}>Add Record</Button>
      </div>
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
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSelectedRecord(record);
                    setIsModalOpen(true);
                  }}>
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Payroll; 
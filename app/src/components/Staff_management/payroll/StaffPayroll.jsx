import React, { useState, useEffect } from 'react';
import { payroll } from '../../services/api';
import { PDFDownloadLink } from '@react-pdf/renderer';
import SalarySheetPDF from '../SalarySheetPDF';
import { format } from 'date-fns';

export const StaffPayroll = ({ record }) => {
  return (
    <PDFDownloadLink
      document={<SalarySheetPDF record={record} />}
      fileName={`salary-sheet-${record.month}-${record.year}.pdf`}>
      {({ loading }) => loading ? <span>Preparing...</span> : <span>Download</span>}
    </PDFDownloadLink>
  );
};

export const StaffPayrollComponent = ({ staffId }) => {
  const [payrollRecords, setPayrollRecords] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (staffId) {
      fetchPayrollRecords();
    }
  }, [staffId, selectedMonth, selectedYear]);

  const fetchPayrollRecords = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await payroll.getStaffPayroll(staffId);
      setPayrollRecords(response.data);
    } catch (err) {
      setError('Failed to fetch payroll records');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (record) => {
    return <StaffPayroll record={record} />;
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Payroll Records</h1>
      <div className="mb-6 flex gap-4">
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="p-2 border rounded">
          <option value="">All Months</option>
          {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
            <option key={month} value={month}>
              {format(new Date(2000, month - 1), 'MMMM')}
            </option>
          ))}
        </select>

        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="p-2 border rounded">
          <option value="">All Years</option>
          {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border">Month/Year</th>
                <th className="py-2 px-4 border">Basic Salary</th>
                <th className="py-2 px-4 border">Allowances</th>
                <th className="py-2 px-4 border">Deductions</th>
                <th className="py-2 px-4 border">Net Salary</th>
                <th className="py-2 px-4 border">Status</th>
                <th className="py-2 px-4 border">Payment Date</th>
                <th className="py-2 px-4 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payrollRecords.map((record) => (
                <tr key={record.id}>
                  <td className="py-2 px-4 border">
                    {format(new Date(parseInt(record.year), parseInt(record.month) - 1), 'MMMM yyyy')}
                  </td>
                  <td className="py-2 px-4 border">${record.basicSalary.toFixed(2)}</td>
                  <td className="py-2 px-4 border">${record.allowances.toFixed(2)}</td>
                  <td className="py-2 px-4 border">${record.deductions.toFixed(2)}</td>
                  <td className="py-2 px-4 border">${record.netSalary.toFixed(2)}</td>
                  <td className="py-2 px-4 border">
                    <span
                      className={`px-2 py-1 rounded ${
                        record.status === 'PAID' ? 'bg-green-100 text-green-800' :
                        record.status === 'APPROVED' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="py-2 px-4 border">
                    {record.paymentDate ? format(new Date(record.paymentDate), 'MMM dd, yyyy') : '-'}
                  </td>
                  <td className="py-2 px-4 border">
                    {handleDownload(record)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}; 
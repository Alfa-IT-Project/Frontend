import React, { useState, useEffect } from 'react';
import { payroll } from '../../../services/api';
import { format } from 'date-fns';
import styles from '../staff-management.module.css';
import { 
  CurrencyDollarIcon, 
  ChartBarIcon,
  MinusCircleIcon,
  CalculatorIcon,
  CalendarIcon,
  ArrowLeftIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

const StaffPayrollComponent = ({ staffId, onBack }) => {
  const [payrollRecords, setPayrollRecords] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth() + 1).toString().padStart(2, '0'));
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('records'); // 'records' or 'summary'

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

  // Filter records based on selected month and year
  const filteredRecords = payrollRecords.filter(record => {
    const monthMatch = selectedMonth ? record.month === selectedMonth : true;
    const yearMatch = selectedYear ? record.year === selectedYear : true;
    return monthMatch && yearMatch;
  });

  // Calculate summary data
  const totalNetSalary = filteredRecords.reduce((sum, record) => sum + (record.netSalary || 0), 0);
  const totalAllowances = filteredRecords.reduce((sum, record) => sum + (record.allowances || 0), 0);
  const totalDeductions = filteredRecords.reduce((sum, record) => sum + (record.deductions || 0), 0);
  const averageSalary = filteredRecords.length > 0 ? totalNetSalary / filteredRecords.length : 0;

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          {onBack && (
            <button 
              onClick={onBack} 
              className="text-gray-700 hover:bg-gray-100 flex items-center gap-1.5 border border-gray-300 h-10 rounded-full px-4 transition-all duration-200 hover:shadow-sm">
              <ArrowLeftIcon className="h-5 w-5" />
              Back
            </button>
          )}
          <h1 className="text-2xl font-bold text-gray-800">My Payroll</h1>
        </div>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-gray-50 px-4 py-2 rounded-full flex items-center gap-2 h-11 shadow-sm border border-gray-200">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
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
              onChange={(e) => setSelectedYear(e.target.value)}
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
              activeTab === 'records' 
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow' 
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
            onClick={() => setActiveTab('records')}>
            Records
          </button>
          <button
            className={`px-5 py-2 rounded-full font-medium transition-all duration-200 h-11 shadow-sm ${
              activeTab === 'summary' 
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow' 
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
            onClick={() => setActiveTab('summary')}>
            Summary
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-700 flex items-center gap-2">
          <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <>
          {activeTab === 'summary' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="border-b border-gray-100 bg-gray-50 px-5 py-3">
                  <h3 className="text-sm font-medium text-gray-700">Net Salary</h3>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-indigo-100 p-2.5">
                      <CurrencyDollarIcon className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">${totalNetSalary.toFixed(2)}</p>
                      <p className="text-xs text-gray-500 mt-0.5">For {filteredRecords.length} record(s)</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="border-b border-gray-100 bg-gray-50 px-5 py-3">
                  <h3 className="text-sm font-medium text-gray-700">Allowances</h3>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-green-100 p-2.5">
                      <ChartBarIcon className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">${totalAllowances.toFixed(2)}</p>
                      <p className="text-xs text-gray-500 mt-0.5">Across all periods</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="border-b border-gray-100 bg-gray-50 px-5 py-3">
                  <h3 className="text-sm font-medium text-gray-700">Deductions</h3>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-red-100 p-2.5">
                      <MinusCircleIcon className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">${totalDeductions.toFixed(2)}</p>
                      <p className="text-xs text-gray-500 mt-0.5">Across all periods</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="border-b border-gray-100 bg-gray-50 px-5 py-3">
                  <h3 className="text-sm font-medium text-gray-700">Average Salary</h3>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-purple-100 p-2.5">
                      <CalculatorIcon className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">${averageSalary.toFixed(2)}</p>
                      <p className="text-xs text-gray-500 mt-0.5">Per payment period</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'records' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month/Year</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Basic Salary</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Allowances</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deductions</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Salary</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRecords.length > 0 ? (
                    filteredRecords.map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {format(new Date(parseInt(record.year), parseInt(record.month) - 1), 'MMMM yyyy')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                          ${record.basicSalary.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-700">
                          ${record.allowances.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-700">
                          ${record.deductions.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          ${record.netSalary.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 inline-flex text-xs font-medium rounded-full ${
                              record.status === 'PAID' ? 'bg-green-100 text-green-800' :
                              record.status === 'APPROVED' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                            {record.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {record.paymentDate ? format(new Date(record.paymentDate), 'MMM dd, yyyy') : '-'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                        No payroll records found for this period
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StaffPayrollComponent; 
import React, { useState } from 'react';
import PerformanceForm from './PerformanceForm';
import PerformanceList from './PerformanceList';
import { useApiQuery } from '../../hooks/useApi';
import { getPerformanceReviews } from '../../services/performanceService';
import { isWithinInterval } from 'date-fns';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Performance = () => {
  const userRole = localStorage.getItem('role');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedQuarter, setSelectedQuarter] = useState(Math.floor((new Date().getMonth() / 3)) + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const { data: reviews, isLoading } = useApiQuery(['performanceReviews'], () => getPerformanceReviews());

  const getQuarterDates = (quarter, year) => {
    const startMonth = (quarter - 1) * 3;
    const startDate = new Date(year, startMonth, 1);
    const endDate = new Date(year, startMonth + 3, 0, 23, 59, 59, 999);
    return { startDate, endDate };
  };

  const { startDate, endDate } = getQuarterDates(selectedQuarter, selectedYear);

  const filteredReviews = reviews?.filter(review => {
    const currentPeriod = `${selectedYear}-Q${selectedQuarter}`;
    const isInQuarter = review.period === currentPeriod;
    const isInDepartment = selectedDepartment === 'all' || review.user?.department === selectedDepartment;
    return isInQuarter && isInDepartment;
  }) || [];

  const departments = Array.from(new Set(reviews?.map(r => r.user?.department).filter(Boolean)));
  const totalReviews = filteredReviews.length;
  const averageRating = totalReviews > 0 
    ? filteredReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews 
    : 0;

  const chartData = {
    labels: departments,
    datasets: [
      {
        label: 'Average Rating',
        data: departments.map(dept => {
          const deptReviews = filteredReviews.filter(r => r.user?.department === dept);
          const avg = deptReviews.length > 0 
            ? deptReviews.reduce((sum, r) => sum + r.rating, 0) / deptReviews.length 
            : 0;
          return avg;
        }),
        backgroundColor: 'rgba(79, 70, 229, 0.7)',
        borderColor: 'rgb(79, 70, 229)',
        borderWidth: 2,
        borderRadius: 8,
        hoverBackgroundColor: 'rgba(79, 70, 229, 0.9)',
        hoverBorderColor: 'rgb(79, 70, 229)',
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 14,
            family: "'Inter', sans-serif"
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#1F2937',
        bodyColor: '#4B5563',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.raw;
            const department = departments[context.dataIndex];
            const deptReviews = filteredReviews.filter(r => r.user?.department === department);
            return `${label}: ${value.toFixed(1)}/5.0`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        title: {
          display: true,
          text: 'Average Rating',
          font: {
            size: 14,
            family: "'Inter', sans-serif"
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 12,
            family: "'Inter', sans-serif"
          }
        }
      }
    }
  };

  const getQuarterName = (quarter) => {
    const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
    return quarters[quarter - 1];
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {userRole === 'ADMIN' && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Performance Management</h1>
            <PerformanceForm />
          </div>

          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <select
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}>
              <option value="all">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            <select
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={selectedQuarter}
              onChange={(e) => setSelectedQuarter(Number(e.target.value))}>
              {[1, 2, 3, 4].map((q) => (
                <option key={q} value={q}>
                  {getQuarterName(q)} {selectedYear}
                </option>
              ))}
            </select>
            <select
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}>
              {[2022, 2023, 2024, 2025].map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900">Quarterly Average Rating</h3>
              <p className="text-3xl font-bold text-indigo-600 mt-2">
                {averageRating.toFixed(1)}/5
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900">Reviews This Quarter</h3>
              <p className="text-3xl font-bold text-indigo-600 mt-2">
                {totalReviews}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900">Pending Reviews</h3>
              <p className="text-3xl font-bold text-indigo-600 mt-2">
                {reviews?.filter(r => {
                  const { startDate, endDate } = getQuarterDates(selectedQuarter, selectedYear);
                  const reviewDate = new Date(r.createdAt);
                  return isWithinInterval(reviewDate, { start: startDate, end: endDate }) && !r.feedback;
                }).length || 0}
              </p>
            </div>
          </div>

          {/* Performance Chart */}
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Department Performance Overview</h3>
              <div className="text-sm text-gray-500">
                {getQuarterName(selectedQuarter)} {selectedYear}
              </div>
            </div>
            <div className="h-[400px]">
              <Bar data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>
      )}
      <PerformanceList reviews={filteredReviews || []} />
    </div>
  );
};

export default Performance; 
import React, { useState, useMemo } from 'react';
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
  const [isChartExpanded, setIsChartExpanded] = useState(false);

  const { data: reviews, isLoading } = useApiQuery(['performanceReviews'], () => getPerformanceReviews());

  const getQuarterDates = (quarter, year) => {
    const startMonth = (quarter - 1) * 3;
    const startDate = new Date(year, startMonth, 1);
    const endDate = new Date(year, startMonth + 3, 0, 23, 59, 59, 999);
    return { startDate, endDate };
  };

  const { startDate, endDate } = getQuarterDates(selectedQuarter, selectedYear);

  // Use useMemo for heavy calculations to prevent re-rendering
  const { filteredReviews, departments } = useMemo(() => {
    const filtered = reviews?.filter(review => {
      const currentPeriod = `${selectedYear}-Q${selectedQuarter}`;
      const isInQuarter = review.period === currentPeriod;
      const isInDepartment = selectedDepartment === 'all' || review.user?.department === selectedDepartment;
      return isInQuarter && isInDepartment;
    }) || [];

    const depts = Array.from(new Set(reviews?.map(r => r.user?.department).filter(Boolean)));
    
    return { filteredReviews: filtered, departments: depts };
  }, [reviews, selectedDepartment, selectedQuarter, selectedYear]);

  // Memoize chart data to prevent unnecessary recalculations
  const chartData = useMemo(() => ({
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
  }), [departments, filteredReviews]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 600, // Faster animations
    },
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
            const value = context.raw;
            const department = departments[context.dataIndex];
            return `Average Rating: ${value.toFixed(1)}/5.0`;
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

  // Skeleton loading component
  const SkeletonLoading = () => (
    <div className="animate-pulse">
      <div className="h-8 w-64 bg-gray-200 rounded mb-6"></div>
      <div className="flex gap-4 mb-6">
        <div className="h-10 w-40 bg-gray-200 rounded"></div>
        <div className="h-10 w-40 bg-gray-200 rounded"></div>
        <div className="h-10 w-40 bg-gray-200 rounded"></div>
      </div>
      <div className="h-[400px] bg-gray-200 rounded mb-8"></div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <SkeletonLoading />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {userRole === 'ADMIN' && (
        <div className="mb-8">
          {/* Filters Row - Now includes the Create New Review button */}
          <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
            <div className="flex flex-wrap gap-4">
              <select
                className="bg-indigo-100 text-indigo-700 px-5 py-2.5 rounded-xl border-0 shadow-md hover:bg-indigo-200 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
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
                className="bg-indigo-100 text-indigo-700 px-5 py-2.5 rounded-xl border-0 shadow-md hover:bg-indigo-200 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                value={selectedQuarter}
                onChange={(e) => setSelectedQuarter(Number(e.target.value))}>
                {[1, 2, 3, 4].map((q) => (
                  <option key={q} value={q}>
                    {getQuarterName(q)} {selectedYear}
                  </option>
                ))}
              </select>
              <select
                className="bg-indigo-100 text-indigo-700 px-5 py-2.5 rounded-xl border-0 shadow-md hover:bg-indigo-200 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}>
                {[2022, 2023, 2024, 2025].map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <PerformanceForm />
          </div>
          
          {/* Performance Reviews List */}
          <div className="mb-8">
            <PerformanceList reviews={filteredReviews} />
          </div>

          {/* Performance Chart */}
          <div className="bg-white rounded-2xl shadow hover:shadow-lg transition-all duration-300 border border-gray-100 mb-8 overflow-hidden">
            {/* Chart Header with Toggle */}
            <div 
              className="p-6 border-b border-gray-100 flex justify-between items-center cursor-pointer" 
              onClick={() => setIsChartExpanded(!isChartExpanded)}
            >
              <div className="flex items-center">
                <h3 className="text-lg font-semibold text-gray-900">Department Performance Overview</h3>
                <div className="ml-4 text-sm text-gray-500 px-3 py-1 bg-gray-50 rounded-full">
                  {getQuarterName(selectedQuarter)} {selectedYear}
                </div>
              </div>
              <button
                className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
                aria-expanded={isChartExpanded}
                aria-label={isChartExpanded ? 'Collapse chart' : 'Expand chart'}
              >
                {isChartExpanded ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </button>
            </div>
            
            {/* Chart Content */}
            <div 
              className={`transition-all duration-500 ease-in-out ${
                isChartExpanded 
                  ? 'max-h-[450px] opacity-100 p-6' 
                  : 'max-h-0 opacity-0 p-0 overflow-hidden'
              }`}
            >
              <div className="h-[400px]">
                <Bar data={chartData} options={chartOptions} />
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Show Performance List for non-admin users */}
      {userRole !== 'ADMIN' && <PerformanceList reviews={filteredReviews} />}
    </div>
  );
};

export default Performance; 
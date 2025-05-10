import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import {
  HomeIcon,
  CalendarIcon,
  BanknotesIcon,
  ChartBarIcon,
  ClockIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { 
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/solid';
import styles from './staff-management.module.css';

const DashboardLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [userRole, setUserRole] = useState(localStorage.getItem('role') || '');
  const [userName, setUserName] = useState(localStorage.getItem('userName') || '');

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const getPageTitle = (pathname) => {
    switch (pathname) {
      case '/manager':
        return 'Dashboard Overview';
      case '/leaves':
        return 'Leave Management';
      case '/payroll':
        return 'Payroll Management';
      case '/performance':
        return 'Performance Evaluation';
      case '/user-management':
        return 'Staff Management';
      case '/scheduler':
        return 'Work Schedule';
      case '/attendance-records':
        return 'Attendance Records';
      case '/calendar':
        return 'My Calendar';
      case '/attendance':
        return 'My Attendance';
      case '/profile':
        return 'User Profile';
      case '/settings':
        return 'Account Settings';
      default:
        // Fallback to the capitalized pathname if no custom title is defined
        return pathname === '/' ? 'Dashboard' : 
               pathname.substring(1).charAt(0).toUpperCase() + pathname.substring(1).slice(1);
    }
  };

  const NavItem = ({
    to,
    icon: Icon,
    label,
    isActive
  }) => (
    <Link
      to={to}
      onClick={() => isMobile && setIsMobileMenuOpen(false)}
      className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
        isActive
          ? 'bg-yellow-900 text-yellow-300'
          : 'text-yellow-300 hover:bg-yellow-900'
      }`}>
      <Icon
        className={`h-5 w-5 mr-2 ${isActive ? 'text-yellow-300' : 'text-yellow-300'}`} />
      {label}
    </Link>
  );

  return (
    <div className={`${styles['staff-management-module']} min-h-screen bg-gray-50`}>
      {/* Top Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 z-20 bg-black shadow-lg">
        <div className="flex items-center justify-between h-16 px-4">
          {/* Logo and Title */}
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-yellow-300">Staff Management</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            <NavItem 
              to={userRole === 'ADMIN' ? "/manager" : "/staff"} 
              icon={HomeIcon} 
              label="Dashboard" 
              isActive={isActive(userRole === 'ADMIN' ? '/manager' : '/staff')} 
            />
            
            <NavItem
              to="/leaves"
              icon={CalendarIcon}
              label="Leave Management"
              isActive={isActive('/leaves')} />
            
            <NavItem
              to="/payroll"
              icon={BanknotesIcon}
              label="Payroll"
              isActive={isActive('/payroll')} />
            
            <NavItem
              to="/performance"
              icon={ChartBarIcon}
              label="Performance"
              isActive={isActive('/performance')} />

            {userRole === 'ADMIN' && (
              <>
                <NavItem
                  to="/user-management"
                  icon={UserIcon}
                  label="Staff Management"
                  isActive={isActive('/user-management')} />
                <NavItem
                  to="/scheduler"
                  icon={UserGroupIcon}
                  label="Scheduler"
                  isActive={isActive('/scheduler')} />
                <NavItem
                  to="/attendance-records"
                  icon={ClipboardDocumentListIcon}
                  label="Attendance Records"
                  isActive={isActive('/attendance-records')} />
              </>
            )}

            {userRole === 'STAFF' && (
              <>
                <NavItem
                  to="/calendar"
                  icon={CalendarIcon}
                  label="Calendar"
                  isActive={isActive('/calendar')} />
                <NavItem
                  to="/attendance"
                  icon={ClockIcon}
                  label="Attendance"
                  isActive={isActive('/attendance')} />
              </>
            )}
          </nav>

          {/* User Profile and Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div
                className="flex items-center cursor-pointer"
                onClick={() => setIsProfileOpen(!isProfileOpen)}>
                <div className="h-8 w-8 rounded-full bg-yellow-900 flex items-center justify-center">
                  <UserIcon className="h-5 w-5 text-yellow-300" />
                </div>
                <span className="ml-2 text-yellow-300 hidden md:inline">{userName}</span>
              </div>
              
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-black rounded-md shadow-lg py-1 z-50">
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-yellow-300 hover:bg-yellow-900">
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-yellow-300 hover:bg-yellow-900 focus:outline-none">
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-10 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed top-16 left-0 right-0 bg-black z-20 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
        }`}>
        <nav className="px-2 pt-2 pb-3 space-y-1">
          <NavItem 
            to={userRole === 'ADMIN' ? "/manager" : "/staff"} 
            icon={HomeIcon} 
            label="Dashboard" 
            isActive={isActive(userRole === 'ADMIN' ? '/manager' : '/staff')} 
          />
          
          <NavItem
            to="/leaves"
            icon={CalendarIcon}
            label="Leave Management"
            isActive={isActive('/leaves')} />
          
          <NavItem
            to="/payroll"
            icon={BanknotesIcon}
            label="Payroll"
            isActive={isActive('/payroll')} />
          
          <NavItem
            to="/performance"
            icon={ChartBarIcon}
            label="Performance"
            isActive={isActive('/performance')} />

          {userRole === 'ADMIN' && (
            <>
              <NavItem
                to="/user-management"
                icon={UserIcon}
                label="Staff Management"
                isActive={isActive('/user-management')} />
              <NavItem
                to="/scheduler"
                icon={UserGroupIcon}
                label="Scheduler"
                isActive={isActive('/scheduler')} />
              <NavItem
                to="/attendance-records"
                icon={ClipboardDocumentListIcon}
                label="Attendance Records"
                isActive={isActive('/attendance-records')} />
            </>
          )}

          {userRole === 'STAFF' && (
            <>
              <NavItem
                to="/calendar"
                icon={CalendarIcon}
                label="Calendar"
                isActive={isActive('/calendar')} />
              <NavItem
                to="/attendance"
                icon={ClockIcon}
                label="Attendance"
                isActive={isActive('/attendance')} />
            </>
          )}
        </nav>
      </div>

      {/* Main Content */}
      <div className="pt-16">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout; 
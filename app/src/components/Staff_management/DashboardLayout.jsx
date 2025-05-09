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
  ChevronDoubleLeftIcon, 
  ChevronDoubleRightIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/solid';

const DashboardLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
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
      case '/':
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
          ? 'bg-indigo-50 text-indigo-700 shadow-sm'
          : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
      }`}>
      <Icon
        className={`h-5 w-5 ${(isSidebarCollapsed && !isMobile) ? 'mx-auto' : 'mr-3'} ${isActive ? 'text-indigo-600' : 'text-gray-500'}`} />
      {(!isSidebarCollapsed || isMobile) && label}
    </Link>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-20 bg-white shadow-md">
        <div className="flex items-center justify-between h-16 px-4">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-md text-gray-500 hover:text-gray-600 focus:outline-none">
            {isMobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
          <h1 className="text-xl font-semibold text-gray-800">Staff Management</h1>
          <div className="w-6" /> {/* Spacer for balance */}
        </div>
      </div>
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-10 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)} />
      )}
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 bg-white shadow-lg z-10 transition-all duration-300 ${
          isMobile
            ? `${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} w-full md:w-72`
            : `${isSidebarCollapsed ? 'w-16' : 'w-72'}`
        }`}>
        <div className="flex flex-col h-full">
          {/* Logo/Header */}
          <div
            className="flex items-center justify-center h-16 bg-gradient-to-r from-indigo-600 to-indigo-800">
            {(!isSidebarCollapsed || isMobile) && <h1 className="text-white text-xl font-semibold">Staff Management</h1>}
          </div>

          {/* Toggle Button - Desktop Only */}
          {!isMobile && (
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="absolute -right-3 top-20 bg-white rounded-full p-1 shadow-md border border-gray-200 hover:bg-gray-50 transition-colors">
              {isSidebarCollapsed ? (
                <ChevronDoubleRightIcon className="h-5 w-5 text-gray-600" />
              ) : (
                <ChevronDoubleLeftIcon className="h-5 w-5 text-gray-600" />
              )}
            </button>
          )}

          {/* User Profile Section */}
          {(!isSidebarCollapsed || isMobile) && (
            <div className="px-4 py-4 border-b border-gray-200">
              <div
                className="flex items-center cursor-pointer"
                onClick={() => setIsProfileOpen(!isProfileOpen)}>
                <div
                  className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                  <UserIcon className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{userName}</p>
                  <p className="text-xs text-gray-500">{userRole}</p>
                </div>
              </div>
              
              {isProfileOpen && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                    Your Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                    Settings
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            <div className="space-y-2">
              <NavItem to="/" icon={HomeIcon} label="Dashboard" isActive={isActive('/')} />
              
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

              {userRole === 'ADMIN' ? (
                <>
                  {(!isSidebarCollapsed || isMobile) && (
                    <div className="px-4 py-2 mt-6">
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Admin Tools
                      </h3>
                    </div>
                  )}
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
              ) : (
                <>
                  {(!isSidebarCollapsed || isMobile) && (
                    <div className="px-4 py-2 mt-6">
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        My Tools
                      </h3>
                    </div>
                  )}
                  <NavItem
                    to="/calendar"
                    icon={CalendarIcon}
                    label="My Calendar"
                    isActive={isActive('/calendar')} />
                  <NavItem
                    to="/attendance"
                    icon={ClockIcon}
                    label="Attendance"
                    isActive={isActive('/attendance')} />
                </>
              )}
            </div>
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className={`w-full flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isSidebarCollapsed && !isMobile
                  ? 'text-gray-600 hover:text-gray-900'
                  : 'text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
              }`}>
              <ArrowRightOnRectangleIcon className={`h-5 w-5 ${(isSidebarCollapsed && !isMobile) ? '' : 'mr-2'}`} />
              {(!isSidebarCollapsed || isMobile) && 'Logout'}
            </button>
          </div>
        </div>
      </aside>
      {/* Main Content */}
      <main
        className={`min-h-screen transition-all duration-300 ${
          isMobile
            ? 'pt-16'
            : `${isSidebarCollapsed ? 'pl-16' : 'pl-72'}`
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Bar */}
          <div
            className="flex items-center justify-between h-16 bg-white border-b border-gray-200 px-6">
            <h2 className="text-xl font-semibold text-gray-800">
              {getPageTitle(location.pathname)}
            </h2>
            <div className="flex items-center space-x-4">
              <button
                className="p-1 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <span className="sr-only">View notifications</span>
                <span className="text-xl">🔔</span>
              </button>
              <span className="text-sm text-gray-700">{format(new Date(), 'EEEE, MMMM do')}</span>
            </div>
          </div>

          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout; 
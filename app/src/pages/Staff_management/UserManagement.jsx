import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { users } from '../../services/api';
import { Button } from '../../components/Staff_management/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/Staff_management/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/Staff_management/ui/table';
import { PlusIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';

const UserManagement = () => {
  const queryClient = useQueryClient();
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: "STAFF",
    department: '',
    phoneNumber: '',
    emergencyContact: '',
    address: '',
    city: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: "success"
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      try {
        const response = await users.getAll();
        return response;
      } catch (error) {
        console.error('Error fetching users:', error);
        if (error.response?.status === 401) {
          // Handle authentication error
          throw new Error('Authentication required. Please log in again.');
        }
        throw error;
      }
    },
    retry: 1, // Only retry once if there's an error
    onError: (error) => {
      setSnackbar({
        open: true,
        message: `Error fetching users: ${error.message}`,
        severity: 'error'
      });
    }
  });

  // Extract users data safely from the response
  const usersData = React.useMemo(() => {
    if (!data) return [];
    
    try {
      // Check if data is already an array
      if (Array.isArray(data)) return data;
      
      // Try to extract array from various response formats
      const anyData = data;
      if (anyData.data) {
        if (Array.isArray(anyData.data)) return anyData.data;
        if (anyData.data.data && Array.isArray(anyData.data.data)) return anyData.data.data;
      }
    } catch (e) {
      console.error("Error extracting user data:", e);
    }
    
    return [];
  }, [data]);

  // Filter users based on search term
  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return usersData;
    
    return usersData.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [usersData, searchTerm]);

  const createMutation = useMutation({
    mutationFn: (data) => users.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      handleCloseDialog();
      setSnackbar({
        open: true,
        message: 'Staff member added successfully',
        severity: 'success'
      });
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: `Error adding staff member: ${error}`,
        severity: 'error'
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data
    }) => 
      users.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      handleCloseDialog();
      setSnackbar({
        open: true,
        message: 'Staff member updated successfully',
        severity: 'success'
      });
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: `Error updating staff member: ${error}`,
        severity: 'error'
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => users.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setSnackbar({
        open: true,
        message: 'Staff member deleted successfully',
        severity: 'success'
      });
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: `Error deleting staff member: ${error}`,
        severity: 'error'
      });
    }
  });

  const handleOpenDialog = (isEdit = false, user) => {
    if (isEdit && user) {
      setIsEditMode(true);
      setSelectedUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        password: '', // Password is not included when editing
        role: user.role,
        department: user.department || '',
        phoneNumber: user.phoneNumber || '',
        emergencyContact: user.emergencyContact || '',
        address: user.address || '',
        city: user.city || ''
      });
    } else {
      setIsEditMode(false);
      setSelectedUser(null);
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'STAFF',
        department: '',
        phoneNumber: '',
        emergencyContact: '',
        address: '',
        city: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (isEditMode && selectedUser) {
      const { password, ...updateData } = formData;
      updateMutation.mutate({ id: selectedUser.id, data: updateData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
          <Button
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors shadow-sm transform hover:-translate-y-0.5 rounded-xl px-4 py-2"
            onClick={() => handleOpenDialog()}>
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Staff Member
          </Button>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <div className="p-6 bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-gray-200 rounded-t-xl">
            <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
              Staff Directory
            </h3>
            <p className="text-sm text-gray-500 mt-1">Manage user accounts and staff information</p>
            
            <div className="mt-4 relative">
              <div className="flex items-center relative">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3" />
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="pl-10 pr-10 py-2 border border-gray-300 rounded-xl w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 text-gray-400 hover:text-gray-600"
                    aria-label="Clear search">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>
              {searchTerm && (
                <div className="mt-2 text-sm text-gray-500">
                  Found {filteredUsers.length} {filteredUsers.length === 1 ? 'result' : 'results'} for "{searchTerm}"
                </div>
              )}
            </div>
          </div>
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 text-red-800 p-6 rounded-lg m-4 border border-red-200">
                Error loading staff data
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="py-4 px-6 font-semibold text-gray-600">Name</TableHead>
                    <TableHead className="py-4 px-6 font-semibold text-gray-600">Email</TableHead>
                    <TableHead className="py-4 px-6 font-semibold text-gray-600">Department</TableHead>
                    <TableHead className="py-4 px-6 font-semibold text-gray-600">Phone Number</TableHead>
                    <TableHead className="py-4 px-6 font-semibold text-gray-600">Role</TableHead>
                    <TableHead className="py-4 px-6 font-semibold text-gray-600 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers && filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id} className="hover:bg-indigo-50/30 transition-all duration-150">
                        <TableCell className="py-4 px-6">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold">
                              {user.name.charAt(0)}
                            </div>
                            <div className="ml-4">
                              <div className="font-medium text-gray-900">{user.name}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 px-6 text-gray-600">{user.email}</TableCell>
                        <TableCell className="py-4 px-6">
                          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {user.department || 'N/A'}
                          </span>
                        </TableCell>
                        <TableCell className="py-4 px-6 text-gray-600">{user.phoneNumber || 'N/A'}</TableCell>
                        <TableCell className="py-4 px-6">
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                            user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {user.role}
                          </span>
                        </TableCell>
                        <TableCell className="py-4 px-6 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDialog(true, user)}
                            className="text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-full mr-1">
                            <PencilIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(user.id)}
                            className="text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-full">
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12 text-gray-500">
                        <div className="flex flex-col items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                          <p>{searchTerm.trim() ? `No staff members found matching "${searchTerm}"` : 'No staff members found'}</p>
                          {searchTerm.trim() && (
                            <Button
                              onClick={() => setSearchTerm('')}
                              className="mt-4 text-sm bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-4 py-2 rounded-lg">
                              Clear Search
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </div>
      {/* Add/Edit Staff Dialog */}
      {openDialog && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div
            className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-t-xl">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                </svg>
                {isEditMode ? 'Edit Staff Member' : 'Add New Staff Member'}
              </h3>
              <p className="text-sm text-gray-500 mt-1">Enter the staff member details below</p>
            </div>
            
            <div className="px-6 py-4 overflow-y-auto flex-1">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 block">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter full name" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 block">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter email address" />
                  </div>
                  
                  {!isEditMode && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 block">Password</label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter password" />
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 block">Department</label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter department" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 block">Phone Number</label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter phone number" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 block">Emergency Contact</label>
                    <input
                      type="text"
                      name="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter emergency contact" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 block">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter address" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 block">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter city" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 block">Role</label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                      <option value="STAFF">Staff</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            
            <div
              className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3 rounded-b-xl">
              <Button
                variant="outline"
                onClick={handleCloseDialog}
                className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl">
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm rounded-xl transition-all duration-200 transform hover:-translate-y-0.5"
                disabled={createMutation.isPending || updateMutation.isPending}>
                {createMutation.isPending || updateMutation.isPending ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : isEditMode ? 'Save Changes' : 'Add Staff'}
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Snackbar for notifications */}
      {snackbar.open && (
        <div
          className={`fixed bottom-5 right-5 z-50 px-6 py-3 rounded-xl shadow-lg animate-in slide-in-from-right duration-300 ${
            snackbar.severity === 'success' ? 'bg-green-50 text-green-800 border border-green-200' :
            snackbar.severity === 'error' ? 'bg-red-50 text-red-800 border border-red-200' :
            'bg-blue-50 text-blue-800 border border-blue-200'
          }`}>
          <div className="flex items-center">
            {snackbar.severity === 'success' && (
              <svg className="w-5 h-5 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd" />
              </svg>
            )}
            {snackbar.severity === 'error' && (
              <svg className="w-5 h-5 mr-2 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd" />
              </svg>
            )}
            <span className="font-medium">{snackbar.message}</span>
            <button
              className="ml-4 text-sm opacity-70 hover:opacity-100 bg-white/20 rounded-full h-6 w-6 flex items-center justify-center hover:bg-white/30 transition-colors"
              onClick={handleCloseSnackbar}>
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement; 
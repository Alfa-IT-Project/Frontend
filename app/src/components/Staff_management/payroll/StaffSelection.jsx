import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { users } from '../../../services/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';

export const StaffSelection = ({ onSelectStaff }) => {
  const { data: staffMembers, isLoading, error } = useQuery({
    queryKey: ['staff'],
    queryFn: users.getAll,
  });

  if (isLoading) return <div className="flex justify-center items-center h-40"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div></div>;
  if (error) console.error('Error fetching staff:', error);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <div className="p-6 bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-gray-200 rounded-t-xl">
          <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
            </svg>
            Staff Directory
          </h3>
          <p className="text-sm text-gray-500 mt-1">Select an employee to view or manage their payroll</p>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="py-4 px-6 font-semibold text-gray-600">Name</TableHead>
                <TableHead className="py-4 px-6 font-semibold text-gray-600">Department</TableHead>
                <TableHead className="py-4 px-6 font-semibold text-gray-600">Email</TableHead>
                <TableHead className="py-4 px-6 font-semibold text-gray-600 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staffMembers && staffMembers.length > 0 ? (
                staffMembers.map((staff) => (
                  <TableRow key={staff.id} className="hover:bg-indigo-50/30 transition-all duration-150">
                    <TableCell className="py-4 px-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold">
                          {staff.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">{staff.name}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {staff.department}
                      </span>
                    </TableCell>
                    <TableCell className="py-4 px-6 text-gray-600">{staff.email}</TableCell>
                    <TableCell className="py-4 px-6 text-right">
                      <Button 
                        onClick={() => onSelectStaff(staff.id)} 
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl transition-all duration-200 text-sm shadow-sm hover:shadow transform hover:-translate-y-0.5">
                        View Payroll
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-12 text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      <p>No staff members found</p>
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
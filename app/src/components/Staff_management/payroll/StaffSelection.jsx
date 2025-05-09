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

  if (isLoading) return <div>Loading staff list...</div>;
  if (error) console.error('Error fetching staff:', error);

  return (
    <div className="container mx-auto py-6">
      <h2 className="text-2xl font-bold mb-6">Select Staff Member</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staffMembers && staffMembers.length > 0 ? (
              staffMembers.map((staff) => (
                <TableRow key={staff.id}>
                  <TableCell>{staff.name}</TableCell>
                  <TableCell>{staff.department}</TableCell>
                  <TableCell>{staff.email}</TableCell>
                  <TableCell>
                    <Button onClick={() => onSelectStaff(staff.id)} variant="outline">
                      View Payroll
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  No staff members found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}; 
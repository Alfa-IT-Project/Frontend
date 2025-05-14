import React from 'react';
import { format } from 'date-fns';

const Profile = ({ user }) => {
  return (
    <div className="p-6">
      {/* Profile Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Profile</h1>
        <p className="text-lg text-gray-600 mt-1">View your personal information</p>
      </div>
      {/* Profile Content */}
      <div className="max-w-4xl mx-auto">
        <div
          className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Full Name</label>
                  <div className="mt-1 text-sm text-gray-900">{user?.name}</div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500">Email Address</label>
                  <div className="mt-1 text-sm text-gray-900">{user?.email}</div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500">Role</label>
                  <div className="mt-1 text-sm text-gray-900">{user?.role}</div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Employee ID</label>
                  <div className="mt-1 text-sm text-gray-900">{user?.id}</div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500">Department</label>
                  <div className="mt-1 text-sm text-gray-900">{user?.department || 'Not specified'}</div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500">Join Date</label>
                  <div className="mt-1 text-sm text-gray-900">
                    {user?.joinDate ? format(new Date(user.joinDate), 'MMMM d, yyyy') : 'Not specified'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div
          className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800">Contact Information</h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Phone Number</label>
                  <div className="mt-1 text-sm text-gray-900">{user?.phone || 'Not specified'}</div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500">Emergency Contact</label>
                  <div className="mt-1 text-sm text-gray-900">{user?.emergencyContact || 'Not specified'}</div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Address</label>
                  <div className="mt-1 text-sm text-gray-900">{user?.address || 'Not specified'}</div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500">City</label>
                  <div className="mt-1 text-sm text-gray-900">{user?.city || 'Not specified'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 
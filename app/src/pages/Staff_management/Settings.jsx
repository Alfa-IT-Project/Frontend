import React, { useState } from 'react';
import { settings } from '../../services/settingsService';
import { useApiQuery, useApiMutation } from '../../hooks/useApi';
import { toast } from 'react-toastify';

const Settings = ({ user }) => {
  const [localSettings, setLocalSettings] = useState({
    timeZone: 'UTC+5:30',
    dateFormat: 'DD/MM/YYYY'
  });

  const userId = user?.id || '';

  const { data: userSettings, isLoading } = useApiQuery(['userSettings', userId], () => settings.getSettings(userId), {
    enabled: !!userId
  });

  // Update local settings when userSettings changes
  React.useEffect(() => {
    if (userSettings) {
      setLocalSettings(userSettings);
    }
  }, [userSettings]);

  const updateSettingsMutation = useApiMutation((updatedSettings) => settings.updateSettings(userId, updatedSettings), {
    onSuccess: (data) => {
      setLocalSettings(data);
      toast.success('Settings updated successfully');
    },
    onError: () => {
      toast.error('Failed to update settings');
    }
  });

  const handleSelectChange = (setting, value) => {
    setLocalSettings(prev => ({ ...prev, [setting]: value }));
    updateSettingsMutation.mutate({ [setting]: value });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div
          className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
        <p className="text-lg text-gray-600 mt-1">Manage your account settings</p>
      </div>
      <div className="max-w-4xl mx-auto">
        {/* Account Settings */}
        <div
          className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800">Account Settings</h2>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Account Status</label>
                <div className="mt-1 text-sm text-gray-900">Active</div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500">Last Login</label>
                <div className="mt-1 text-sm text-gray-900">
                  {user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Not available'}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500">Account Type</label>
                <div className="mt-1 text-sm text-gray-900">{user?.role}</div>
              </div>
            </div>
          </div>
        </div>

        {/* System Settings */}
        <div
          className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800">System Settings</h2>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-900">Time Zone</label>
                  <p className="text-sm text-gray-500">Your local time zone</p>
                </div>
                <select
                  value={localSettings.timeZone}
                  onChange={(e) => handleSelectChange('timeZone', e.target.value)}
                  className="mt-1 block w-32 rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                  <option>UTC+5:30</option>
                  <option>UTC+0:00</option>
                  <option>UTC+1:00</option>
                  <option>UTC-5:00</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-900">Date Format</label>
                  <p className="text-sm text-gray-500">Preferred date display format</p>
                </div>
                <select
                  value={localSettings.dateFormat}
                  onChange={(e) => handleSelectChange('dateFormat', e.target.value)}
                  className="mt-1 block w-32 rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                  <option>DD/MM/YYYY</option>
                  <option>MM/DD/YYYY</option>
                  <option>YYYY-MM-DD</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 
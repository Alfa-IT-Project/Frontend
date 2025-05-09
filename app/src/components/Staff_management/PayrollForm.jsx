import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { payroll } from '../../services/api';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select } from './ui/select';
import { formatCurrency } from '../../utils/format';
import { toast } from 'react-toastify';

const PayrollForm = ({ initialData, onSuccess, staffId }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: initialData ? {
      userId: initialData.userId,
      month: initialData.month,
      year: initialData.year,
      basicSalary: initialData.basicSalary,
      allowances: initialData.allowances,
      deductions: initialData.deductions,
    } : {
      userId: staffId,
      month: (new Date().getMonth() + 1).toString().padStart(2, '0'),
      year: new Date().getFullYear().toString(),
      basicSalary: 0,
      allowances: 0,
      deductions: 0,
    },
  });

  const basicSalary = watch('basicSalary') || 0;
  const allowances = watch('allowances') || 0;
  const deductions = watch('deductions') || 0;

  const netSalary = Number(basicSalary) + Number(allowances) - Number(deductions);

  const onSubmit = async (data) => {
    try {
      if (!data.userId) {
        toast.error('Staff ID is required');
        return;
      }

      const formattedData = {
        ...data,
        basicSalary: Number(data.basicSalary),
        allowances: Number(data.allowances),
        deductions: Number(data.deductions),
        netSalary: Number(netSalary),
      };

      let result;
      if (initialData) {
        result = await payroll.update(initialData.id, formattedData);
        toast.success('Payroll record updated successfully');
      } else {
        result = await payroll.create(formattedData);
        toast.success('Payroll record created successfully');
      }
      onSuccess(result.data);
    } catch (error) {
      console.error('Failed to save payroll record:', error);
      toast.error(error.response?.data?.error || 'Failed to save payroll record');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Month</label>
          <Select {...register('month', { required: true })} className="mt-1">
            {Array.from({ length: 12 }, (_, i) => {
              const monthNum = i + 1;
              const monthStr = monthNum.toString().padStart(2, '0');
              return (
                <option key={i} value={monthStr}>
                  {new Date(2000, i).toLocaleString('default', { month: 'long' })}
                </option>
              );
            })}
          </Select>
          {errors.month && <span className="text-red-500 text-sm">Month is required</span>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Year</label>
          <Select {...register('year', { required: true })} className="mt-1">
            {Array.from({ length: 5 }, (_, i) => {
              const year = new Date().getFullYear() - i;
              return (
                <option key={i} value={year.toString()}>
                  {year}
                </option>
              );
            })}
          </Select>
          {errors.year && <span className="text-red-500 text-sm">Year is required</span>}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Basic Salary</label>
          <Input
            type="number"
            min="0"
            step="0.01"
            {...register('basicSalary', { required: true, min: 0 })}
            className="mt-1" />
          {errors.basicSalary && <span className="text-red-500 text-sm">Basic Salary is required</span>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Allowances</label>
          <Input
            type="number"
            min="0"
            step="0.01"
            {...register('allowances', { required: true, min: 0 })}
            className="mt-1" />
          {errors.allowances && <span className="text-red-500 text-sm">Allowances is required</span>}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Deductions</label>
        <Input
          type="number"
          min="0"
          step="0.01"
          {...register('deductions', { required: true, min: 0 })}
          className="mt-1" />
        {errors.deductions && <span className="text-red-500 text-sm">Deductions is required</span>}
      </div>
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Salary Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Basic Salary:</span>
            <span>{formatCurrency(basicSalary)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Allowances:</span>
            <span>{formatCurrency(allowances)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Deductions:</span>
            <span>{formatCurrency(deductions)}</span>
          </div>
          <div className="flex justify-between border-t pt-2">
            <span className="font-medium">Net Salary:</span>
            <span className="font-medium">{formatCurrency(netSalary)}</span>
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </form>
  );
};

export default PayrollForm; 
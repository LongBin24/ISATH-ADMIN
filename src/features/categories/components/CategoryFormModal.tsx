'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { Category } from '../types';
import { categorySchema, CategoryFormValues } from '../schema';
import { DynamicIcon } from './DynamicIcon';

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CategoryFormValues) => void;
  initialData?: Category | null;
  isLoading?: boolean;
}

const AVAILABLE_ICONS = ['Utensils', 'ShoppingBag', 'Zap', 'Car', 'Home', 'HeartPulse', 'GraduationCap', 'Plane'];

export const CategoryFormModal: React.FC<CategoryFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      icon: 'Utensils',
      totalBudget: 0,
      color: 'bg-blue-100 text-blue-700',
    },
  });

  const selectedIcon = watch('icon');

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        icon: initialData.icon,
        totalBudget: initialData.totalBudget,
        color: initialData.color || 'bg-blue-100 text-blue-700',
      });
    } else {
      reset({
        name: '',
        icon: 'Utensils',
        totalBudget: 0,
        color: 'bg-blue-100 text-blue-700',
      });
    }
  }, [initialData, reset]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl border border-slate-100 animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h2 className="text-xl font-bold text-[#003377] font-google-sans">
            {initialData ? 'កែសម្រួលប្រភេទ' : 'បង្កើតប្រភេទថ្មី'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pt-4">
          {/* Category Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5 font-google-sans">
              ឈ្មោះប្រភេទ (Name)
            </label>
            <input
              type="text"
              {...register('name')}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#FFC83D] font-google-sans text-slate-800"
              placeholder="ឧ. អាហារ"
            />
            {errors.name && <p className="text-xs text-rose-500 mt-1 font-google-sans">{errors.name.message}</p>}
          </div>

          {/* Icon Selector */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5 font-google-sans">
              ជ្រើសរើសរូបតំណាង (Icon)
            </label>
            <div className="grid grid-cols-4 gap-2.5 max-h-40 overflow-y-auto p-1">
              {AVAILABLE_ICONS.map((iconName) => (
                <button
                  key={iconName}
                  type="button"
                  onClick={() => setValue('icon', iconName)}
                  className={`p-3 rounded-xl flex items-center justify-center border transition-all ${
                    selectedIcon === iconName
                      ? 'border-[#003377] bg-[#003377]/10 text-[#003377]'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-slate-50'
                  }`}
                >
                  <DynamicIcon name={iconName} className="w-5 h-5" />
                </button>
              ))}
            </div>
            {errors.icon && <p className="text-xs text-rose-500 mt-1 font-google-sans">{errors.icon.message}</p>}
          </div>

          {/* Total Budget */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5 font-google-sans">
              ថវិកាកំណត់ ($ Budget)
            </label>
            <input
              type="number"
              step="any"
              {...register('totalBudget', { valueAsNumber: true })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#FFC83D] font-google-sans text-slate-800"
              placeholder="0.00"
            />
            {errors.totalBudget && <p className="text-xs text-rose-500 mt-1 font-google-sans">{errors.totalBudget.message}</p>}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-google-sans text-sm font-medium transition-colors"
            >
              បោះបង់
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 rounded-xl bg-[#FFC83D] hover:bg-[#f6bd30] text-[#003377] font-google-sans text-sm shadow-sm transition-all disabled:opacity-50"
            >
              {isLoading ? 'កំពុងរក្សាទុក...' : 'រក្សាទុក'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
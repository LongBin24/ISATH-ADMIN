import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Category } from '../types';
import { DynamicIcon } from './DynamicIcon';

interface CategoryCardProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, onEdit, onDelete }) => {
  return (
    <div className="group relative bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-48">
      {/* Absolute Edit/Delete Action Icons on Hover (Top Right) */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 bg-white/90 backdrop-blur-sm p-1 rounded-xl shadow-sm border border-slate-100">
        <button
          onClick={() => onEdit(category)}
          className="p-1.5 text-slate-500 hover:text-[#003377] hover:bg-slate-100 rounded-lg transition-colors"
          title="Edit Category"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(category.id)}
          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          title="Delete Category"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Card Header with Icon Container */}
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${category.color || 'bg-[#003377]/10 text-[#003377]'}`}>
          <DynamicIcon name={category.icon} className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-[#003377] font-google-sans">
            {category.name}
          </h3>
          <p className="text-xs text-slate-500 font-google-sans mt-0.5">
            {category.transactionCount} ប្រតិបត្តិការ
          </p>
        </div>
      </div>

      {/* Card Footer Budget info */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs font-google-sans text-slate-400">ថវិកាកំណត់</span>
        <span className="text-base font-bold text-slate-800 font-google-sans">
          ${category.totalBudget.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </span>
      </div>
    </div>
  );
};
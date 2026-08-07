import React from 'react';
import { Plus } from 'lucide-react';

interface AddCategoryCardProps {
  onClick: () => void;
}

export const AddCategoryCard: React.FC<AddCategoryCardProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="group w-full h-48 rounded-2xl border-2 border-dashed border-slate-200 hover:border-[#FFC83D] bg-slate-50/50 hover:bg-[#FFC83D]/5 transition-all duration-300 flex flex-col items-center justify-center gap-3 cursor-pointer"
    >
      <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#003377] group-hover:bg-[#FFC83D] group-hover:text-[#003377] transition-colors">
        <Plus className="w-6 h-6" />
      </div>
      <div className="text-center">
        <span className="block font-bold text-[#003377] font-['Hanuman'] text-sm">
          ប្រភេទថ្មី
        </span>
        <span className="text-xs text-slate-400 font-[var(--font-sans)]">
          Add New Category
        </span>
      </div>
    </button>
  );
};

import {LucideIcon} from "lucide-react";

interface StatsCardProps {
    title:string;
    value:number;
    icon: LucideIcon; 
    color: string;
}

export default function StatsCard({
    title,
    value,
    icon:Icon,
    color
} : StatsCardProps){

     return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm flex items-center justify-between border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow">
      <div className="space-y-1">
        <p className="text-slate-500 dark:text-slate-400 text-sm font-hanuman">{title}</p>
        <h3 className="text-3xl font-bold font-google-sans" style={{ color: color }}>
          {value.toLocaleString()}
        </h3>
      </div>
      <div className="p-4 rounded-xl" style={{ backgroundColor: `${color}20` }}>
        <Icon size={28} style={{ color: color }} />
      </div>
    </div>
  );
}
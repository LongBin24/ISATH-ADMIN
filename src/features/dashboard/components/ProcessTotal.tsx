"use client";

import { ProcessSummary } from "../type";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { X } from "lucide-react";

export default function ProcessStatsModal({
    open,
    onOpenChange,
    data,
    isLoading
}: {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    data?: ProcessSummary;
    isLoading: boolean;
}) {
    return (
        <Dialog open = {open} onOpenChange = {onOpenChange}>
            <DialogContent className=" max-w-[400px] p-8 rounded-[28px]">
                <div className=" flex items-center justify-between mb-6">
                    <DialogTitle className="text-xl font-bold text-[#003377] mb-8 font-google-sans">ប្រត្តិបត្តិការ</DialogTitle>
                    <button onClick={()=> onOpenChange(false)} aria-label = "close" className="mb-8 rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"><X/></button>
                </div>

                <div className="space-y-4 mb-10">
                    { isLoading ? (
                       [1,2,3,4].map((i)=> <div key={i} className="h-14 w-full bg-slate-100 animate-pulse rounded-2xl"/>) 
                    ):(
                    <>  
                        <StatRow label="សរុប" value={data?.totalProcesses ?? 48.291} />
                        <StatRow label="ថ្ងៃនេះ" value={data?.totalCompleted ?? 234} />
                        <StatRow label="ចំណូល" value={data?.totalIncome ?? 28.540} />
                        <StatRow label="ចំណាយ" value={data?.totalExpenses ?? 19.751} />
                    </> 
                    )}
                </div>

                 <button onClick={() => onOpenChange(false)} className="w-full py-4 bg-[#FFC83D] text-[#003377] font-bold rounded-2xl font-hanuman"> បិទ </button>

            </DialogContent>
        </Dialog>
    );
}

function StatRow({label,value}:{label: string; value:number}){
 return(
    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
      <span className="text-slate-500 font-hanuman text-sm">{label}</span>
      <span className="text-[#003377] font-bold font-google-sans text-lg">{value.toLocaleString()}</span>

      
    </div>
 )
}


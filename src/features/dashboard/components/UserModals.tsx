import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { CheckCircle2 } from "lucide-react";

export function SuccessModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[440px] text-center p-12 rounded-3xl border-none shadow-2xl">
        <div className="flex flex-col items-center gap-6">
          <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center animate-bounce">
            <CheckCircle2 size={48} strokeWidth={3} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold font-hanuman">បានបង្កើតដោយជោគជ័យ!</h2>
            <p className="text-slate-500 font-hanuman text-sm leading-relaxed">
              ការបង្កើតអ្នកប្រើប្រាស់ថ្មីត្រូវបានរក្សាទុកក្នុងប្រព័ន្ធដោយជោគជ័យ។
            </p>
          </div>
          <button 
            onClick={onClose}
            className="w-full py-4 bg-[#FFC83D] hover:bg-[#eab308] text-[#003377] font-bold rounded-2xl transition-all shadow-lg shadow-yellow-200 dark:shadow-none"
          >
            បិទ
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
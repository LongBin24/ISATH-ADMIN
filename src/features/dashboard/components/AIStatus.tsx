const aiMetrics = [
    {label: 'ការបែងចែកប្រភេទ',value:98.2},
    {label: 'OCR ',value:94.4},
    {label: 'Voice',value:91.4},
];
export default function AIStatus(){
    return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
      <h3 className="text-lg font-bold mb-6 font-hanuman text-[#003377] dark:text-white">ស្ថានភាព AI</h3>
      <div className="space-y-6">
        {aiMetrics.map((item) => (
          <div key={item.label} className="space-y-2">
            <div className="flex justify-between items-center text-sm font-hanuman">
              <span className="text-slate-600 dark:text-slate-400">{item.label}</span>
              <span className="font-google-sans font-bold text-green-600">{item.value}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.4)]" 
                style={{ width: `${item.value}%` }} 
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
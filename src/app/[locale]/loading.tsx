export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center font-google-sans bg-slate-50 dark:bg-slate-950">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#003377] border-t-transparent dark:border-[#FFC83D] dark:border-t-transparent" />
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
          កំពុងផ្ទុក... / Loading...
        </p>
      </div>
    </div>
  );
}

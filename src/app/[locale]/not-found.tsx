import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center font-google-sans px-4 bg-slate-50 dark:bg-slate-950">
      <div className="text-center">
        <h1 className="text-7xl font-extrabold text-[#003377] dark:text-[#FFC83D]">
          404
        </h1>

        <h2 className="mt-4 text-2xl font-bold text-slate-800 dark:text-white">
          រកមិនឃើញទំព័រនេះទេ / Page Not Found
        </h2>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-sm">
          ទំព័រដែលអ្នកកំពុងស្វែងរកមិនមាន ឬត្រូវបានផ្លាស់ប្តូរទីតាំង។
        </p>

        <Link
          href="/"
          className="mt-6 inline-flex rounded-full bg-[#FFC83D] px-6 py-3 text-sm font-bold text-[#003377] shadow-sm transition hover:bg-[#f5b91f]"
        >
          ត្រឡប់ទៅទំព័រដើម / Back to Home
        </Link>
      </div>
    </main>
  );
}

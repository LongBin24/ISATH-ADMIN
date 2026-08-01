export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-6xl font-bold text-[#003377]">404</h1>

      <h2 className="mt-4 text-2xl font-semibold">
        រកមិនឃើញទំព័រនេះទេ
      </h2>

      <p className="mt-2 text-gray-500">
        ទំព័រដែលអ្នកកំពុងស្វែងរកមិនមានទេ។
      </p>

      <a
        href="/"
        className="mt-8 rounded-full bg-[#FFC83D] px-6 py-3 font-semibold text-[#003377]"
      >
        ត្រឡប់ទៅទំព័រដើម
      </a>
    </main>
  );
}
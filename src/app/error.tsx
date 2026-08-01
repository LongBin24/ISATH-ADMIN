"use client";

import { useEffect } from "react";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-3xl font-bold">មានបញ្ហាមួយបានកើតឡើង</h1>

      <p className="mt-4 text-gray-500">{error.message}</p>

      <button
        onClick={() => reset()}
        className="mt-6 rounded-lg bg-yellow-400 px-4 py-2"
      >
        ព្យាយាមម្ដងទៀត
      </button>
    </div>
  );
}
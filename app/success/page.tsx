"use client";

import { useEffect, useState } from "react";
import { Button } from "@whop/react/components";
import Link from "next/link";

export default function SuccessPage() {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    setShowConfetti(true);
  }, []);

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center p-4 text-center relative overflow-hidden">
      {/* Confetti removed */}

      <div className="bg-brand-card border border-gray-800 rounded-3xl p-8 max-w-md w-full shadow-2xl transform transition-all animate-in zoom-in duration-300">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-green-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-white mb-4">Thank You!</h1>
        <p className="text-white mb-8">
          Your donation has been received. We appreciate your support!
        </p>

        <Link href="/" className="w-full">
          <button className="w-full bg-gray-800 text-white font-bold py-3 rounded-xl hover:bg-gray-700 transition-colors">
            Return Home
          </button>
        </Link>
      </div>
    </div>
  );
}

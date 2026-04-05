"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      <h1 className="text-6xl font-extrabold text-gray-200 mb-4">!</h1>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        문제가 발생했습니다
      </h2>
      <p className="text-gray-500 mb-6">
        잠시 후 다시 시도해 주세요.
      </p>
      <button
        onClick={reset}
        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
      >
        다시 시도
      </button>
    </div>
  );
}

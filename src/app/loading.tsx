export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center">
      <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      <p className="mt-4 text-gray-500 text-sm">로딩 중...</p>
    </div>
  );
}

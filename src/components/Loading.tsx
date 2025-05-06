// components/Loading.tsx

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-10 h-10 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        <p className="text-gray-600 text-sm">Loading, please wait...</p>
      </div>
    </div>
  );
}

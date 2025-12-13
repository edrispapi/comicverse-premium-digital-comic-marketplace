import React from 'react';
export function AppFallback() {
  return (
    <div className="bg-comic-black min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-red-500"></div>
        <p className="text-white text-lg">Loading Universe...</p>
      </div>
    </div>
  );
}
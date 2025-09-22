import React from 'react';

const LoadingFallback: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
        <h1 className="text-3xl font-bold mb-4 text-yellow-400">BLKOUT Liberation Platform</h1>
        <p className="text-gray-300 mb-2">🏴‍☠️ Loading community liberation tools...</p>
        <p className="text-sm text-gray-500">75% Creator Sovereignty • Democratic Governance • Black Queer Joy</p>
      </div>
    </div>
  );
};

export default LoadingFallback;
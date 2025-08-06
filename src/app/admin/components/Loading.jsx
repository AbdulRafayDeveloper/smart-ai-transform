import React from "react";

function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <div className="flex justify-center space-x-2 mb-6">
          <div className="w-4 h-4 bg-black rounded-full animate-bounce delay-100"></div>
          <div className="w-4 h-4 bg-black rounded-full animate-bounce delay-200"></div>
          <div className="w-4 h-4 bg-black rounded-full animate-bounce delay-300"></div>
        </div>
        <h1 className="text-2xl font-semibold text-black mb-2 justify-center">
          Loading...
        </h1>
        <p className="text-black justify-center">
          Please wait while the records are being loaded.
        </p>
      </div>
    </div>
  );
}

export default Loading;

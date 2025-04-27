import React from "react";

const DashboardShimmer: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="space-y-6 max-w-2xl mx-auto px-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="card bg-base-100 shadow-md border border-base-300 animate-pulse"
        >
          <div className="card-body p-4 md:p-6">
            <div className="h-4 bg-base-300 rounded w-3/4 mb-3"></div>
            <div className="h-3 bg-base-300 rounded w-full mb-2"></div>
            <div className="h-3 bg-base-300 rounded w-5/6"></div>
            <div className="flex justify-between items-center pt-3 border-t border-base-300 mt-3">
              <div className="h-3 bg-base-300 rounded w-1/4"></div>
              <div className="flex space-x-1">
                <div className="h-6 w-6 bg-base-300 rounded-full"></div>
                <div className="h-6 w-6 bg-base-300 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardShimmer;

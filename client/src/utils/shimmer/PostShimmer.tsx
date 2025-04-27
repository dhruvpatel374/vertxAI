// src/components/PostShimmer.jsx (Create this new file)

import React from "react";

const PostShimmer: React.FC = () => {
  return (
    <div className="card bg-base-100 shadow-md border border-base-300 animate-pulse">
      <div className="card-body p-4 md:p-6">
        {/* Shimmer Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="h-3 bg-base-300 rounded w-1/4"></div>
          <div className="h-3 bg-base-300 rounded w-1/3"></div>
        </div>

        {/* Shimmer Content */}
        <div className="space-y-3 mb-5">
          <div className="h-3 bg-base-300 rounded w-full"></div>
          <div className="h-3 bg-base-300 rounded w-5/6"></div>
          <div className="h-3 bg-base-300 rounded w-3/4"></div>
        </div>

        {/* Shimmer Footer */}
        <div className="flex justify-between items-center pt-3 border-t border-base-300">
          <div className="h-3 bg-base-300 rounded w-1/4"></div>
          <div className="flex space-x-2">
            <div className="h-5 w-5 bg-base-300 rounded"></div>
            <div className="h-5 w-5 bg-base-300 rounded"></div>
            <div className="h-5 w-5 bg-base-300 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component to render multiple shimmers easily
export const ShimmerFeed: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }).map((_, index) => (
        <PostShimmer key={index} />
      ))}
    </div>
  );
};

export default PostShimmer;

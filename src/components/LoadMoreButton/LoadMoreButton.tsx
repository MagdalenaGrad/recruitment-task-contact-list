import React from "react";
import "./LoadMoreButton.css";

interface LoadMoreButtonProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export const LoadMoreButton = ({ onClick, disabled = false, loading = false }: LoadMoreButtonProps) => {
  return (
    <div className="load-more-container">
      <button
        className="load-more-button"
        onClick={onClick}
        disabled={disabled || loading}
      >
        {loading ? "Loading..." : "Load More"}
      </button>
    </div>
  );
};


import React from "react";
import "./ErrorMessage.css";

interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
}

export const ErrorMessage = ({ message, onRetry }: ErrorMessageProps) => {
  return (
    <div className="error-container">
      <div className="error-icon">⚠️</div>
      <div className="error-message">{message}</div>
      <button className="retry-button" onClick={onRetry}>
        Try Again
      </button>
    </div>
  );
};


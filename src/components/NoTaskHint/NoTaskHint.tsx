import React from 'react';

interface EmptyStateProps {
  message: string;
  buttonText?: string;
  showButton?: boolean;
  onButtonClick?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  message,
  buttonText = '刷新列表',
  showButton = true,
  onButtonClick
}) => {
  return (
    <div className="text-center py-10 bg-gray-50 rounded-lg">
      <p className="mt-4 ">{message}</p>
      {showButton && onButtonClick && (
        <button 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors"
          onClick={onButtonClick}
        >
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  color = 'purple' 
}) => {
  const sizeClass = {
    small: 'w-5 h-5',
    medium: 'w-10 h-10',
    large: 'w-16 h-16',
  };

  const colorClass = {
    purple: 'border-purple-600',
    white: 'border-white',
    gray: 'border-gray-300',
  };

  return (
    <div className="flex justify-center items-center">
      <div 
        className={`${sizeClass[size]} border-4 border-t-transparent ${colorClass[color as keyof typeof colorClass]} rounded-full animate-spin`}
      ></div>
    </div>
  );
};

export default LoadingSpinner;

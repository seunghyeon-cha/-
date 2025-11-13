'use client';

import { ButtonHTMLAttributes } from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const Button = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  className,
  disabled,
  children,
  ...props
}: ButtonProps) => {
    const baseStyles =
      'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60';

    const variantStyles = {
      primary:
        'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 disabled:bg-gray-400',
      secondary:
        'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300 disabled:bg-gray-100',
      outline:
        'bg-transparent text-primary-500 border border-primary-500 hover:bg-primary-50 active:bg-primary-100 disabled:border-gray-300 disabled:text-gray-400',
      ghost:
        'bg-transparent text-gray-500 hover:bg-gray-100 active:bg-gray-200 disabled:bg-transparent disabled:text-gray-400',
    };

    const sizeStyles = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 text-base',
      lg: 'h-12 px-6 text-base',
    };

    const widthStyles = fullWidth ? 'w-full' : '';

  return (
    <button
      className={clsx(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        widthStyles,
        isLoading && 'cursor-wait',
        className,
      )}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>로딩 중...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;

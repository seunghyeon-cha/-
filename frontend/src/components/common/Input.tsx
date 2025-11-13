'use client';

import { InputHTMLAttributes } from 'react';
import { clsx } from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: string;
  fullWidth?: boolean;
}

const Input = ({
  label,
  error,
  success,
  fullWidth = false,
  className,
  disabled,
  type = 'text',
  ...props
}: InputProps) => {
    const baseStyles =
      'h-11 px-4 rounded-lg text-base transition-all duration-200 border outline-none';

    const stateStyles = {
      default:
        'border-gray-300 bg-white focus:border-2 focus:border-primary-500',
      error: 'border-error bg-red-50',
      success: 'border-success bg-green-50',
      disabled:
        'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed',
    };

    const getStateStyle = () => {
      if (disabled) return stateStyles.disabled;
      if (error) return stateStyles.error;
      if (success) return stateStyles.success;
      return stateStyles.default;
    };

    const widthStyles = fullWidth ? 'w-full' : '';

  return (
    <div className={clsx('flex flex-col gap-2', widthStyles)}>
      {label && (
        <label className="text-sm font-bold text-gray-700">{label}</label>
      )}

      <input
        type={type}
        className={clsx(baseStyles, getStateStyle(), widthStyles, className)}
        disabled={disabled}
        {...props}
      />

        {error && (
          <div className="flex items-center gap-2 text-xs text-error">
            <svg
              className="h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

      {success && !error && (
        <div className="flex items-center gap-2 text-xs text-success">
          <svg
            className="h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span>{success}</span>
        </div>
      )}
    </div>
  );
};

export default Input;

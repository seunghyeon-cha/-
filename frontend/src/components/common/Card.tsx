'use client';

import { HTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
}

const Card = ({
  children,
  hover = false,
  padding = 'md',
  shadow = 'md',
  className,
  ...props
}: CardProps) => {
  const baseStyles = 'bg-white rounded-lg transition-all duration-200';

  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const shadowStyles = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
  };

  const hoverStyles = hover
    ? 'hover:shadow-lg hover:-translate-y-1 cursor-pointer'
    : '';

  return (
    <div
      className={clsx(
        baseStyles,
        paddingStyles[padding],
        shadowStyles[shadow],
        hoverStyles,
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;

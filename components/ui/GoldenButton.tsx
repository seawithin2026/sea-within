'use client';

import { ReactNode } from 'react';

interface GoldenButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'golden' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function GoldenButton({
  children,
  href,
  onClick,
  variant = 'golden',
  size = 'md',
  className = '',
}: GoldenButtonProps) {
  const sizeClasses = {
    sm: 'px-6 py-2.5 text-[11px]',
    md: 'px-10 py-3.5 text-[13px]',
    lg: 'px-14 py-4 text-[14px]',
  };

  const baseClasses = `
    inline-block font-body font-medium tracking-[3px] uppercase
    transition-all duration-300 rounded cursor-pointer
    ${sizeClasses[size]}
    ${variant === 'golden'
      ? 'bg-gradient-to-br from-golden-400 to-golden-600 text-sanctuary-dark hover:translate-y-[-2px] hover:shadow-[0_10px_30px_rgba(229,173,67,0.3)]'
      : 'bg-transparent text-sea-100 border border-white/20 hover:border-golden-400/50 hover:text-golden-400'
    }
    ${className}
  `;

  if (href) {
    return <a href={href} className={baseClasses}>{children}</a>;
  }

  return <button onClick={onClick} className={baseClasses}>{children}</button>;
}

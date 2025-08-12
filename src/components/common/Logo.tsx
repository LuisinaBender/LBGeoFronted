import React from 'react';
import { Settings } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function Logo({ size = 'md', showText = true }: LogoProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl',
  };

  return (
    <div className="flex items-center space-x-2">
      <div className="relative">
        <Settings 
          className={`${sizeClasses[size]} text-blue-600 animate-spin-slow`}
          style={{ animationDuration: '3s' }}
        />
      </div>
      {showText && (
        <span className={`font-bold text-slate-800 ${textSizeClasses[size]}`}>
          LBGeo
        </span>
      )}
    </div>
  );
}
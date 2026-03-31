import React from 'react';
import { Crown } from 'lucide-react';

interface PremiumBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function PremiumBadge({ size = 'md', showLabel = false }: PremiumBadgeProps) {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  if (showLabel) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/20 text-accent text-xs">
        <Crown className={sizeClasses[size]} />
        Premium
      </span>
    );
  }

  return <Crown className={`${sizeClasses[size]} text-accent`} />;
}

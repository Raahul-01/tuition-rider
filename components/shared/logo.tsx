import React from 'react';
import Image from 'next/image';

interface LogoProps {
  className?: string;
}

export function Logo({ className = "" }: LogoProps) {
  return (
    <div className={className}>
      <Image
        src="/images/logo.png"
        alt="Tuition Rider Logo"
        width={32}
        height={32}
        className="w-full h-full object-contain"
        priority
      />
    </div>
  );
} 
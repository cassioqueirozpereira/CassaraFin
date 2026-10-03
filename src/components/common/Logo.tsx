import React from 'react';
import Image from 'next/image';

interface LogoProps {
  variant?: 'full' | 'icon' | 'image';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'full',
  size = 'md',
  className = '',
  showSubtitle = false,
}) => {
  const sizeMap = {
    sm: { icon: 'w-7 h-7', text: 'text-base', image: 28 },
    md: { icon: 'w-9 h-9', text: 'text-xl', image: 36 },
    lg: { icon: 'w-12 h-12', text: 'text-2xl', image: 48 },
  };

  const currentSize = sizeMap[size];

  if (variant === 'image') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <Image
          src="/logo.png"
          alt="Cassara Tech / CassaraFin"
          width={currentSize.image * 3}
          height={currentSize.image}
          className="object-contain h-auto"
          priority
        />
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 group ${className}`}>
      {/* 3D Stylized Gradient Ribbon C Logo */}
      <div
        className={`${currentSize.icon} relative flex items-center justify-center rounded-xl bg-gradient-to-tr from-[#6C22FF] via-[#0055FF] to-[#00A3FF] p-[2px] shadow-[0_0_20px_rgba(0,163,255,0.35)] group-hover:shadow-[0_0_25px_rgba(108,34,255,0.5)] transition-all duration-300 transform group-hover:scale-105`}
      >
        <div className="w-full h-full bg-[#09090b] rounded-[10px] flex items-center justify-center relative overflow-hidden">
          {/* Internal gradient shine */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#6C22FF]/30 via-[#0055FF]/20 to-[#00A3FF]/40 opacity-80" />
          
          {/* Stylized Ribbon C SVG Path */}
          <svg
            className="w-3/4 h-3/4 relative z-10 text-white"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="cassara-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00C6FF" />
                <stop offset="50%" stopColor="#0072FF" />
                <stop offset="100%" stopColor="#8A23FE" />
              </linearGradient>
            </defs>
            <path
              d="M 80,25 C 65,10 35,10 20,25 C 5,40 5,60 20,75 C 35,90 65,90 80,75 L 65,60 C 55,70 35,70 25,60 C 15,50 15,50 25,40 C 35,30 55,30 65,40 Z"
              fill="url(#cassara-grad)"
            />
          </svg>
        </div>
      </div>

      {variant === 'full' && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 font-bold tracking-tight text-white leading-none">
            <span className={`${currentSize.text} tracking-tight`}>Cassara</span>
            <span className={`${currentSize.text} bg-gradient-to-r from-[#00A3FF] via-[#2563EB] to-[#9333EA] bg-clip-text text-transparent font-extrabold`}>
              Fin
            </span>
          </div>
          {showSubtitle && (
            <span className="text-[10px] tracking-widest text-neutral-400 font-medium uppercase mt-0.5">
              Cassara Tech Solutions
            </span>
          )}
        </div>
      )}
    </div>
  );
};

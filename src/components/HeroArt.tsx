"use client";

import React from 'react';

export default function HeroArt() {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* The Phone Placeholder */}
      <div
        className="relative w-[280px] h-[560px] border-2 border-ink rounded-[40px] shadow-2xl transform -rotate-3 transition-transform"
        style={{
          background: 'radial-gradient(circle, #000 0.8px, transparent 1.2px)',
          backgroundSize: '4px 4px',
          backgroundColor: '#fff'
        }}
      >
        {/* Screen content placeholder */}
        <div className="absolute inset-0 p-6 flex flex-col gap-4">
          <div className="w-1/2 h-4 bg-ink/10 rounded" />
          <div className="w-full h-32 bg-ink/5 rounded-xl" />
          <div className="w-full h-4 bg-ink/10 rounded" />
          <div className="w-2/3 h-4 bg-ink/10 rounded" />
        </div>
      </div>
    </div>
  );
}

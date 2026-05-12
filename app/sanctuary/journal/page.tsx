'use client';

import { useState, useMemo } from 'react';

type Stage = 'closed' | 'opening' | 'logo' | 'write';

export default function JournalPage() {
  const [stage, setStage] = useState<Stage>('closed');

  const today = useMemo(() => {
    return new Date().toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, []);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black">
      {/* WATER BACKGROUND */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/videos/deep-water.mp4"
        autoPlay
        loop
        muted
        playsInline
      />

      <div className="absolute inset-0 bg-black/40" />

      {/* MAIN CONTENT */}
      <div className="relative z-10 flex h-full w-full items-center justify-center">

        {/* CLOSED BOOK */}
        {stage === 'closed' && (
          <div
            onClick={() => setStage('opening')}
            className="cursor-pointer transition-transform duration-700 hover:scale-105"
          >
            <img
              src="/images/sea-within-book-closed.png"
              className="h-[340px] w-auto drop-shadow-[0_25px_40px_rgba(0,0,0,0.7)]"
            />
          </div>
        )}

        {/* OPENING ANIMATION */}
        {stage === 'opening' && (
          <div className="relative w-[700px] h-[450px] perspective-1000">
            {/* LEFT COVER */}
            <div
              className="absolute left-0 top-0 h-full w-1/2 origin-right bg-[#1a1a1a] rounded-l-lg shadow-2xl"
              style={{
                animation: 'coverOpen 1s forwards ease-out',
              }}
            />

            {/* PAGE FAN */}
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute left-0 top-0 h-full w-1/2 origin-right bg-white rounded-l-lg shadow-xl"
                style={{
                  animation: `pageFlip ${0.6 + i * 0.08}s forwards ease-out`,
                  opacity: 0,
                }}
              />
            ))}

            {/* RIGHT COVER */}
            <div className="absolute right-0 top-0 h-full w-1/2 bg-[#1a1a1a] rounded-r-lg shadow-2xl" />

            {/* OPEN BOOK FRAME */}
            <img
              src="/images/book-open-frame.png"
              className="absolute inset-0 w-full h-full opacity-0"
              style={{
                animation: 'fadeIn 0.8s forwards ease-out',
                animationDelay: '1.2s',
              }}
              onAnimationEnd={() => setStage('logo')}
            />

            {/* KEYFRAMES */}
            <style jsx>{`
              .perspective-1000 {
                perspective: 1000px;
              }

              @keyframes coverOpen {
                from { transform: rotateY(0deg); }
                to { transform: rotateY(-180deg); }
              }

              @keyframes pageFlip {
                0% { transform: rotateY(0deg); opacity: 0; }
                40% { opacity: 1; }
                100% { transform: rotateY(-180deg); opacity: 0; }
              }

              @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
              }
            `}</style>
          </div>
        )}

        {/* LOGO PAGE */}
        {stage === 'logo' && (
          <div
            className="relative w-[900px] max-w-[95vw] cursor-pointer"
            onClick={() => setStage('write')}
          >
            <img
              src="/images/sea-within-logo-page.jpg"
              className="w-full h-auto rounded-lg shadow-[0_30px_60px_rgba(0,0,0,0.8)]"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="rounded-full bg-black/40 px-4 py-2 text-sm text-amber-100">
                Tap to begin writing
              </span>
            </div>
          </div>
        )}

        {/* WRITING PAGE */}
        {stage === 'write' && (
          <div className="relative w-[900px] max-w-[95vw]">
            <img
              src="/images/parchment-page.jpg"
              className="w-full h-auto rounded-lg shadow-[0_30px_60px_rgba(0,0,0,0.8)]"
            />

            <div className="absolute inset-0 px-10 py-8 flex flex-col">
              {/* DATE */}
              <div className="text-right text-[#4b2e1a] text-sm font-medium">
                {today}
              </div>

              {/* TEXTAREA */}
              <textarea
                className="mt-4 h-full w-full bg-transparent resize-none text-[#3b2414] text-lg leading-relaxed outline-none"
                placeholder="Let the sea within you speak..."
              />

              {/* SAVE BUTTON */}
              <div className="mt-4 flex justify-end">
                <button className="rounded-full bg-amber-200/80 px-5 py-2 text-sm font-semibold text-[#3b2414] shadow-md shadow-black/30 hover:bg-amber-300">
                  Save to my book
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

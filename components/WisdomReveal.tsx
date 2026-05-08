"use client";
import { useEffect, useState } from "react";

export default function WisdomReveal() {
  const [messages, setMessages] = useState([]);
  const [activeMessage, setActiveMessage] = useState(null);

  useEffect(() => {
    async function fetchMessages() {
      const res = await fetch("/api/messages?type=wisdom");
      const data = await res.json();
      setMessages(data);
    }
    fetchMessages();
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* HERO VIDEO */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-70"
      >
        <source src="/videos/ocean-night.mp4" type="video/mp4" />
      </video>

      {/* OVERLAY GRADIENT */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/80 pointer-events-none" />

      {/* FLOATING LOTUS LANTERNS */}
      <div className="absolute inset-0">
        {messages.map((msg, i) => (
          <div
            key={msg.id}
            onClick={() => setActiveMessage(msg)}
            className="absolute cursor-pointer transition-transform hover:scale-110"
            style={{
              left: `${10 + (i * 15) % 80}%`,
              top: `${20 + (i * 12) % 60}%`,
              animation: `float ${12 + (i % 5)}s ease-in-out infinite`,
              zIndex: 5,
            }}
          >
            <img
              src="/lotus/lotus-amber.png"
              alt="lotus"
              className="w-24 drop-shadow-[0_0_15px_rgba(255,200,120,0.7)]"
            />
          </div>
        ))}
      </div>

      {/* MODAL */}
      {activeMessage && (
        <div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setActiveMessage(null)}
        >
          <div className="bg-black/60 border border-white/20 p-6 rounded-xl max-w-md text-center text-white shadow-xl">
            <p className="text-lg leading-relaxed">{activeMessage.message}</p>
            <p className="text-sm mt-4 opacity-70">— {activeMessage.author}</p>
          </div>
        </div>
      )}

      {/* PAGE TITLE */}
      <div className="absolute top-10 w-full text-center z-40">
        <h1 className="text-4xl font-light text-white tracking-wide drop-shadow-lg">
          The Lotus Drift
        </h1>
        <p className="text-white/70 mt-2 text-sm">
          Where your shared wisdom becomes light upon the water
        </p>
      </div>

      {/* FLOAT ANIMATION */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-20px) translateX(10px); }
          100% { transform: translateY(0px) translateX(0px); }
        }
      `}</style>
    </div>
  );
  <style>{`
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
    100% { transform: translateY(0px); }
  }

  @keyframes glow {
    0% { filter: drop-shadow(0 0 10px rgba(255, 180, 80, 0.6)); }
    50% { filter: drop-shadow(0 0 25px rgba(255, 180, 80, 0.9)); }
    100% { filter: drop-shadow(0 0 10px rgba(255, 180, 80, 0.6)); }
  }

  .lotus {
    animation: float 6s ease-in-out infinite;
  }

  .lotus-glow {
    animation: glow 4s ease-in-out infinite;
  }
`}</style>

}

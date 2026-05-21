"use client";

import { useEffect, useRef, useState } from "react";

export default function JournalMirrorPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [messages, setMessages] = useState<string[]>([]);
  const [listening, setListening] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);

  // CAMERA CONTROL — FIXED
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch {
      addMessage("Camera permission denied or unavailable.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
  };

  const toggleCamera = () => {
    if (!cameraOn) {
      setCameraOn(true);
      startCamera();
    } else {
      setCameraOn(false);
      stopCamera();
    }
  };

  // ADD MESSAGE
  const addMessage = (text: string) => {
    setMessages((prev) => [...prev, text]);
  };

  // CRISIS DETECTION
  const detectCrisis = (text: string) => {
    const crisis = [
      "kill myself",
      "end my life",
      "don't want to live",
      "hurt myself",
    ];
    return crisis.some((k) => text.includes(k));
  };

  const crisisResponse = () =>
    "I’m really glad you shared this. You deserve support from someone who can be with you in a real, human way. If you can, consider reaching out to someone you trust or a trained listener in your area.";

  // INTERACTION MODE
  const interactionResponses = [
    "I hear what you're saying.",
    "You're expressing something clearly.",
    "You're thinking through something real.",
    "You're noticing what's happening for you.",
    "You're putting words to something important.",
    "You're staying present with yourself.",
    "You're giving this moment your attention.",
  ];

  const getInteractionResponse = () =>
    interactionResponses[Math.floor(Math.random() * interactionResponses.length)];

  // KNOWLEDGE MODE
  const isKnowledgeQuestion = (text: string) => {
    return (
      text.startsWith("how do i") ||
      text.startsWith("what is") ||
      text.startsWith("steps to") ||
      text.startsWith("how can i") ||
      text.startsWith("explain") ||
      text.startsWith("teach me") ||
      text.startsWith("show me how")
    );
  };

  const knowledgeEngine = (text: string) => {
    if (text.includes("better myself")) {
      return (
        "People usually improve themselves by:\n" +
        "• Understanding their values\n" +
        "• Building small consistent habits\n" +
        "• Practicing self-awareness\n" +
        "• Learning new skills\n" +
        "• Taking care of their physical and emotional health\n" +
        "• Reflecting on what matters to them"
      );
    }

    if (text.includes("find my qualities") || text.includes("my qualities")) {
      return (
        "People identify their qualities by:\n" +
        "• Noticing what comes naturally\n" +
        "• Observing how they act under pressure\n" +
        "• Recognizing what others appreciate\n" +
        "• Reflecting on moments they felt aligned\n" +
        "• Understanding what they value"
      );
    }

    if (text.includes("confidence")) {
      return (
        "Confidence often grows from:\n" +
        "• Keeping small promises to yourself\n" +
        "• Practicing skills repeatedly\n" +
        "• Understanding your strengths\n" +
        "• Allowing yourself to try without perfection\n" +
        "• Building trust in your own actions"
      );
    }

    return "Here’s what people usually explore when they ask this: learning, observing themselves, and taking small steps toward clarity.";
  };

  // SPEECH-TO-TEXT — FIXED
  const SpeechRecognition =
    typeof window !== "undefined"
      ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      : null;

  const recognitionRef = useRef<any>(null);

  const startListening = () => {
    if (!SpeechRecognition) {
      addMessage("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      handleTranscript(transcript);
    };

    recognition.onerror = () => {
      addMessage("Voice recognition error.");
      setListening(false);
    };

    recognition.onend = () => {
      if (listening) recognition.start();
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
  };

  const toggleListening = () => {
    if (!listening) {
      setListening(true);
      startListening();
    } else {
      setListening(false);
      stopListening();
    }
  };

  // HANDLE TRANSCRIPT — UPDATED TONE
  const handleTranscript = (raw: string) => {
    if (!raw) return;
    const text = raw.toLowerCase().trim();
    if (!text) return;

    if (detectCrisis(text)) {
      addMessage(crisisResponse());
      return;
    }

    if (isKnowledgeQuestion(text)) {
      addMessage(knowledgeEngine(text));
      return;
    }

    addMessage(getInteractionResponse());
  };

  // DEBUG INPUT
  const handleDebugInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const value = (e.target as HTMLInputElement).value;
      (e.target as HTMLInputElement).value = "";
      handleTranscript(value);
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-[#050608] text-[#f7f5f2]">

      {/* HEADER WITH CAMERA + MIC BUTTONS */}
      <header className="h-14 flex items-center px-4 border-b border-white/10 gap-3">

        {/* CAMERA BUTTON */}
        <button
          onClick={toggleCamera}
          className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center transition hover:bg-white/10"
        >
          <span
            className={`transition-opacity ${
              cameraOn ? "opacity-100" : "opacity-40"
            }`}
          >
            📷
          </span>
        </button>

        {/* MIC BUTTON */}
        <button
          onClick={toggleListening}
          className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center transition hover:bg-white/10"
        >
          <span
            className={`transition-opacity ${
              listening ? "opacity-100" : "opacity-40"
            }`}
          >
            🎤
          </span>
        </button>

      </header>

      <main className="flex flex-1 overflow-hidden flex-col md:flex-row">

        {/* MIRROR */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className={`flex-1 object-cover transform -scale-x-100 brightness-[1.05] contrast-[1.02] ${
            cameraOn ? "opacity-100" : "opacity-0"
          } transition-opacity duration-300`}
        />

        {/* DESKTOP PANEL */}
        <aside className="hidden md:flex w-[28%] max-w-[420px] min-w-[260px] p-8 bg-gradient-to-b from-[#14151b] to-[#050608] border-l border-white/10 flex-col">
          <div className="flex-1 overflow-y-auto mt-2 space-y-3 pr-2 min-h-[200px]">
            {messages.map((m, i) => (
              <div key={i} className="text-sm leading-relaxed opacity-90">{m}</div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="mt-4 text-xs opacity-70">
            Dev test: type text as if spoken, press Enter.
            <input
              onKeyDown={handleDebugInput}
              className="w-full mt-1 p-2 rounded bg-[#0a0b0e] border border-white/10 text-xs"
              placeholder="Simulated speech…"
            />
          </div>
        </aside>

        {/* MOBILE DRAWER */}
        <div className="md:hidden absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#050608] to-[#14151b] p-4 border-t border-white/10">
          <div className="max-h-[40vh] overflow-y-auto space-y-3 mb-3 min-h-[120px]">
            {messages.map((m, i) => (
              <div key={i} className="text-sm leading-relaxed opacity-90">{m}</div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

      </main>
    </div>
  );
}

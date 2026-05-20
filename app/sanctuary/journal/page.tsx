"use client";

import { useEffect, useRef, useState } from "react";

export default function JournalMirrorPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [messages, setMessages] = useState<string[]>([]);
  const [mode, setMode] = useState<"inactive" | "active_support">("inactive");
  const [listening, setListening] = useState(false);

  const [themes, setThemes] = useState<{ theme: string; createdAt: string }[]>([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        addMessage("Unable to access camera. Please allow permissions.");
      }
    }
    startCamera();
  }, []);

  const addMessage = (text: string) => {
    setMessages((prev) => [...prev, text]);
  };

  const logTheme = (theme: string) => {
    setThemes((prev) => [
      ...prev,
      { theme, createdAt: new Date().toISOString() },
    ]);
  };

  const containsActivationPhrase = (text: string) => {
    const phrases = [
      "i need support",
      "i need guidance",
      "i need comfort",
      "talk to me",
      "i need you",
    ];
    return phrases.some((p) => text.includes(p));
  };

  const detectCrisis = (text: string) => {
    const crisisKeywords = [
      "kill myself",
      "end my life",
      "don't want to live",
      "dont want to live",
      "hurt myself",
    ];
    return crisisKeywords.some((k) => text.includes(k));
  };

  const crisisResponse = () => {
    return (
      "I’m really glad you shared this. You deserve support from someone who can be with you in a real, human way. " +
      "If you can, consider reaching out to someone you trust or a trained listener in your area."
    );
  };

  const detectTone = (text: string) => {
    if (text.includes("tired") || text.includes("overwhelmed")) {
      logTheme("stress");
      return "stressed";
    }
    if (text.includes("sad") || text.includes("lonely")) {
      logTheme("sadness");
      return "sad";
    }
    if (text.includes("proud") || text.includes("accomplished")) {
      logTheme("pride");
      return "proud";
    }
    if (text.includes("happy") || text.includes("grateful")) {
      logTheme("joy");
      return "joyful";
    }
    if (text.includes("not good enough") || text.includes("worthless")) {
      logTheme("self_doubt");
      return "self_doubt";
    }
    return "neutral";
  };

  const supportiveLine = (tone: string) => {
    switch (tone) {
      case "sad":
        return "I’m here with you. You’re not alone in this moment.";
      case "stressed":
        return "You’ve been carrying a lot. It’s okay to pause.";
      case "joyful":
        return "I’m glad you’re feeling lighter today.";
      case "self_doubt":
        return "You deserve kindness, especially from yourself.";
      case "proud":
        return "You’ve worked hard for this. Let yourself feel it.";
      default:
        return "Take your time. You don’t have to rush anything here.";
    }
  };

  const handleTranscript = (raw: string) => {
    if (!raw) return;
    const text = raw.toLowerCase().trim();
    if (!text) return;

    if (containsActivationPhrase(text)) {
      setMode("active_support");
      addMessage("Hello beautiful soul. I’m here with you.");
      return;
    }

    if (detectCrisis(text)) {
      addMessage(crisisResponse());
      return;
    }

    const tone = detectTone(text);

    if (mode !== "active_support") return;

    addMessage(supportiveLine(tone));
  };

  // --- FREE SPEECH-TO-TEXT (WEB SPEECH API) ---
  const SpeechRecognition =
    typeof window !== "undefined"
      ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      : null;

  const recognitionRef = useRef<any>(null);

  const startSpeechRecognition = () => {
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
      addMessage("Voice recognition error. Try again when you're ready.");
    };

    recognition.onend = () => {
      if (listening) recognition.start();
    };

    recognition.start();
    return recognition;
  };

  const toggleListening = () => {
    if (!listening) {
      setListening(true);
      recognitionRef.current = startSpeechRecognition();
    } else {
      setListening(false);
      recognitionRef.current?.stop();
    }
  };

  const handleDebugInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const value = (e.target as HTMLInputElement).value;
      (e.target as HTMLInputElement).value = "";
      handleTranscript(value);
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-[#050608] text-[#f7f5f2]">
      <header className="h-14 flex items-center px-6 border-b border-white/10">
        <div className="tracking-widest uppercase text-sm opacity-80">
          Sea Within
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="flex-1 object-cover transform -scale-x-100 brightness-[1.05] contrast-[1.02]"
        />

        <aside className="w-[28%] max-w-[420px] min-w-[260px] p-8 bg-gradient-to-b from-[#14151b] to-[#050608] border-l border-white/10 flex flex-col">
          <div className="uppercase tracking-widest text-xs opacity-70">
            Sea Within Mirror
          </div>

          <div className="flex-1 overflow-y-auto mt-4 space-y-3 pr-2">
            {messages.map((m, i) => (
              <div key={i} className="text-sm leading-relaxed opacity-90">
                {m}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <button
            onClick={toggleListening}
            className={`mt-4 py-2 px-4 rounded-full border text-sm transition ${
              listening
                ? "bg-white/10 border-white/40"
                : "bg-transparent border-white/20"
            }`}
          >
            {listening ? "Listening..." : "Start Listening"}
          </button>

          <p className="text-xs opacity-60 mt-3">
            Speak freely. When you’re ready for guidance, say your activation phrase.
          </p>

          <div className="mt-4 text-xs opacity-70">
            Dev test: type text as if spoken, press Enter.
            <input
              onKeyDown={handleDebugInput}
              className="w-full mt-1 p-2 rounded bg-[#0a0b0e] border border-white/10 text-xs"
              placeholder="Simulated speech…"
            />
          </div>
        </aside>
      </main>
    </div>
  );
}

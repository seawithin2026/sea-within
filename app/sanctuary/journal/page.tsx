"use client";

import { useEffect, useRef, useState } from "react";

export default function JournalMirrorPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [messages, setMessages] = useState<string[]>([]);
  const [mode, setMode] = useState<"inactive" | "active_support">("inactive");
  const [listening, setListening] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);

  // CAMERA
  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch {
        addMessage("Unable to access camera. Please allow permissions.");
      }
    }
    startCamera();
  }, []);

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

  // INTERACTION MODE — gentle acknowledgments
  const interactionResponses = [
    "You’re noticing something real in yourself.",
    "You’re meeting yourself honestly in this moment.",
    "You’re giving space to what you’re feeling.",
    "You’re seeing yourself with clarity.",
    "You’re acknowledging your truth.",
    "You’re showing up for yourself right now.",
    "You’re letting yourself be seen.",
  ];

  const getInteractionResponse = () =>
    interactionResponses[Math.floor(Math.random() * interactionResponses.length)];

  // KNOWLEDGE MODE — detect “how do I / what is / steps to”
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

  // KNOWLEDGE ENGINE — safe, factual, non‑advice explanations
  const knowledgeEngine = (text: string) => {
    if (text.includes("better myself")) {
      return (
        "Here are some ways people work on bettering themselves:\n" +
        "• Understanding their values\n" +
        "• Building small consistent habits\n" +
        "• Practicing self-awareness\n" +
        "• Learning new skills\n" +
        "• Taking care of their physical and emotional health\n" +
        "• Reflecting on what matters to them\n" +
        "These are general approaches anyone can explore."
      );
    }

    if (text.includes("find my qualities") || text.includes("my qualities")) {
      return (
        "People identify their qualities by:\n" +
        "• Noticing what comes naturally to them\n" +
        "• Observing how they act under stress or pressure\n" +
        "• Recognizing what others appreciate about them\n" +
        "• Reflecting on moments they felt proud or aligned\n" +
        "• Understanding what they value and why\n" +
        "Qualities are patterns in how you show up, not perfection."
      );
    }

    if (text.includes("confidence")) {
      return (
        "Confidence often grows from:\n" +
        "• Keeping small promises to yourself\n" +
        "• Practicing skills repeatedly\n" +
        "• Understanding your strengths\n" +
        "• Allowing yourself to try without perfection\n" +
        "• Building trust in your own actions\n" +
        "It’s a gradual process, not a fixed trait."
      );
    }

    return "I hear your question. Here’s what I found: people often explore this by learning, observing themselves, and taking small steps toward clarity.";
  };

  // HANDLE TRANSCRIPT
  const handleTranscript = (raw: string) => {
    if (!raw) return;
    const text = raw.toLowerCase().trim();
    if (!text) return;

    // CRISIS
    if (detectCrisis(text)) {
      addMessage(crisisResponse());
      return;
    }

    // KNOWLEDGE MODE
    if (isKnowledgeQuestion(text)) {
      addMessage("I hear your question.");
      addMessage(knowledgeEngine(text));
      return;
    }

    // INTERACTION MODE
    addMessage(getInteractionResponse());
  };

  // SPEECH-TO-TEXT
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
      addMessage("Voice recognition error. You can try again.");
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
      <header className="h-14 flex items-center px-6 border-b border-white/10">
        <div className="tracking-widest uppercase text-sm opacity-80">Sea Within</div>
      </header>

      <main className="flex flex-1 overflow-hidden flex-col md:flex-row">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="flex-1 object-cover transform -scale-x-100 brightness-[1.05] contrast-[1.02]"
        />

        {/* Desktop Panel */}
        <aside className="hidden md:flex w-[28%] max-w-[420px] min-w-[260px] p-8 bg-gradient-to-b from-[#14151b] to-[#050608] border-l border-white/10 flex-col">
          <div className="uppercase tracking-widest text-xs opacity-70">Sea Within Mirror</div>

          <div className="flex-1 overflow-y-auto mt-4 space-y-3 pr-2">
            {messages.map((m, i) => (
              <div key={i} className="text-sm leading-relaxed opacity-90">{m}</div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <button
            onClick={toggleListening}
            className={`mt-4 py-2 px-4 rounded-full border text-sm transition ${
              listening ? "bg-white/10 border-white/40" : "bg-transparent border-white/20"
            }`}
          >
            {listening ? "Listening..." : "Start Listening"}
          </button>

          <div className="mt-4 text-xs opacity-70">
            Dev test: type text as if spoken, press Enter.
            <input
              onKeyDown={handleDebugInput}
              className="w-full mt-1 p-2 rounded bg-[#0a0b0e] border border-white/10 text-xs"
              placeholder="Simulated speech…"
            />
          </div>
        </aside>

        {/* Mobile Drawer */}
        <div className="md:hidden absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#050608] to-[#14151b] p-4 border-t border-white/10">
          <div className="max-h-[40vh] overflow-y-auto space-y-3 mb-3">
            {messages.map((m, i) => (
              <div key={i} className="text-sm leading-relaxed opacity-90">{m}</div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <button
            onClick={toggleListening}
            className={`w-full py-2 px-4 rounded-full border text-sm transition ${
              listening ? "bg-white/10 border-white/40" : "bg-transparent border-white/20"
            }`}
          >
            {listening ? "Listening..." : "Start Listening"}
          </button>
        </div>
      </main>
    </div>
  );
}

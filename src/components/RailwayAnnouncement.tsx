"use client";

import { useEffect, useState, useRef, useCallback } from "react";

interface RailwayAnnouncementProps {
  onTogglePlay?: (isPlaying: boolean) => void;
}

const HINDI_SCRIPT =
  "🔔 Yatri-gan kripya dhyan dein... Aapke bade sapno aur startup pitches ke saath, Mumbai se Goa jaane wali RailPitch Express, platform number ek par rawana hone ke liye taiyar hai. Aasha karte hain aap is khoobsurat safar ke liye poori tarah tayar hain. Shubh yatra!";

const ENGLISH_SCRIPT =
  "🔔 May I have your attention, please... Boarding all big dreams and startup pitches, the RailPitch Express from Mumbai to Goa is now ready on platform number one. We hope you are ready for this incredible journey. Wishing you a pleasant journey!";

export function RailwayAnnouncement({ onTogglePlay }: RailwayAnnouncementProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [voiceGender, setVoiceGender] = useState<"female" | "male">("female");
  const [echoEnabled, setEchoEnabled] = useState(true);
  const [activeLang, setActiveLang] = useState<"hi" | "en">("hi");
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const [cardMinimized, setCardMinimized] = useState(false);
  const [audioStatus, setAudioStatus] = useState("Ready on Platform 1");

  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const mediaSourceConnectedRef = useRef(false);
  const isPlayingRef = useRef(false);
  const echoGainRef = useRef<GainNode | null>(null);

  // Initialize AudioContext lazily
  const getAudioContext = useCallback((): AudioContext | null => {
    try {
      const AudioCtx =
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      if (!audioCtxRef.current || audioCtxRef.current.state === "closed") {
        audioCtxRef.current = new AudioCtx();
      }
      if (audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }
      return audioCtxRef.current;
    } catch {
      return null;
    }
  }, []);

  // Authentic Radio Station Mic Squelch & Station PA chime starting effect
  const playRadioStationTune = useCallback((): Promise<void> => {
    return new Promise((resolve) => {
      const ctx = getAudioContext();
      if (!ctx) {
        resolve();
        return;
      }

      try {
        const now = ctx.currentTime;

        // 1. Radio Mic Click & Static Squelch Burst (50ms)
        const noiseBufferSize = Math.floor(ctx.sampleRate * 0.05);
        const noiseBuffer = ctx.createBuffer(1, noiseBufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < noiseBufferSize; i++) {
          output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (noiseBufferSize * 0.4));
        }

        const noiseSource = ctx.createBufferSource();
        noiseSource.buffer = noiseBuffer;

        const noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = "bandpass";
        noiseFilter.frequency.setValueAtTime(2800, now);
        noiseFilter.Q.setValueAtTime(3, now);

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.18, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

        noiseSource.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(ctx.destination);
        noiseSource.start(now);

        // 2. Classic Indian Railways Announcement Chime Sequence: D5 (587Hz) -> F#5 (740Hz) -> A5 (880Hz)
        const chimeNotes = [
          { freq: 587.33, start: now + 0.08, duration: 0.38 },
          { freq: 739.99, start: now + 0.44, duration: 0.38 },
          { freq: 880.0, start: now + 0.82, duration: 0.62 },
        ];

        chimeNotes.forEach(({ freq, start, duration }) => {
          // Fundamental tone
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, start);

          gain.gain.setValueAtTime(0.001, start);
          gain.gain.exponentialRampToValueAtTime(0.3, start + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, start + duration);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(start);
          osc.stop(start + duration);

          // Harmonic overtone for resonant station bell bell effect
          const oscHarmonic = ctx.createOscillator();
          const gainHarmonic = ctx.createGain();
          oscHarmonic.type = "sine";
          oscHarmonic.frequency.setValueAtTime(freq * 2, start);

          gainHarmonic.gain.setValueAtTime(0.001, start);
          gainHarmonic.gain.exponentialRampToValueAtTime(0.09, start + 0.015);
          gainHarmonic.gain.exponentialRampToValueAtTime(0.001, start + duration * 0.7);

          oscHarmonic.connect(gainHarmonic);
          gainHarmonic.connect(ctx.destination);
          oscHarmonic.start(start);
          oscHarmonic.stop(start + duration);
        });

        // Total chime concludes at ~1.45s
        setTimeout(() => resolve(), 1450);
      } catch {
        resolve();
      }
    });
  }, [getAudioContext]);

  // Setup Web Audio Echo / PA Hall Delay Network on the audio element
  const connectAudioWithEcho = useCallback(
    (audioEl: HTMLAudioElement) => {
      const ctx = getAudioContext();
      if (!ctx || mediaSourceConnectedRef.current) return;

      try {
        const source = ctx.createMediaElementSource(audioEl);
        mediaSourceConnectedRef.current = true;

        // Dry path
        const dryGain = ctx.createGain();
        dryGain.gain.setValueAtTime(0.95, ctx.currentTime);
        source.connect(dryGain);
        dryGain.connect(ctx.destination);

        // Wet station echo / hall reverb path
        const delayNode = ctx.createDelay();
        delayNode.delayTime.setValueAtTime(0.22, ctx.currentTime); // 220ms authentic station delay

        const feedbackGain = ctx.createGain();
        feedbackGain.gain.setValueAtTime(0.32, ctx.currentTime); // 32% feedback

        // Acoustic bandpass filter simulating station platform acoustic reflections
        const filter = ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.setValueAtTime(1400, ctx.currentTime);
        filter.Q.setValueAtTime(0.8, ctx.currentTime);

        const wetGain = ctx.createGain();
        wetGain.gain.setValueAtTime(echoEnabled ? 0.36 : 0.0, ctx.currentTime);
        echoGainRef.current = wetGain;

        // Connect echo loop: source -> filter -> delay -> wetGain -> destination
        // and delay -> feedbackGain -> filter (loop)
        source.connect(filter);
        filter.connect(delayNode);
        delayNode.connect(wetGain);
        wetGain.connect(ctx.destination);

        delayNode.connect(feedbackGain);
        feedbackGain.connect(filter);
      } catch (err) {
        console.warn("Could not connect audio graph:", err);
      }
    },
    [echoEnabled, getAudioContext]
  );

  // Update echo wet gain dynamically
  useEffect(() => {
    if (echoGainRef.current && audioCtxRef.current) {
      echoGainRef.current.gain.setValueAtTime(
        echoEnabled ? 0.36 : 0.0,
        audioCtxRef.current.currentTime
      );
    }
  }, [echoEnabled]);

  // Main Playback sequence: Radio Tune -> Actual Audio with Echo
  const startAnnouncement = useCallback(
    async (genderOverride?: "female" | "male") => {
      const targetGender = genderOverride || voiceGender;
      setIsPlaying(true);
      setIsMuted(false);
      isPlayingRef.current = true;
      setAutoplayBlocked(false);
      onTogglePlay?.(true);

      const audioSrc =
        targetGender === "female"
          ? "/audio/announcement-female.wav"
          : "/audio/announcement-male.wav";

      try {
        setAudioStatus("📻 Station Chime & Mic Tuning...");
        await playRadioStationTune();
        if (!isPlayingRef.current) return;

        setAudioStatus(`📢 Broadcasting ${targetGender.toUpperCase()} Voice with Station Echo...`);

        // Play audio element with PA echo effect
        if (!audioElementRef.current) {
          audioElementRef.current = new Audio();
          audioElementRef.current.crossOrigin = "anonymous";
        }

        const audioEl = audioElementRef.current;
        audioEl.src = audioSrc;
        connectAudioWithEcho(audioEl);

        audioEl.onended = () => {
          setIsPlaying(false);
          isPlayingRef.current = false;
          setAudioStatus("Ready on Platform 1");
          onTogglePlay?.(false);
        };

        audioEl.onerror = () => {
          setIsPlaying(false);
          isPlayingRef.current = false;
          setAudioStatus("Ready on Platform 1");
          onTogglePlay?.(false);
        };

        await audioEl.play();
      } catch (err) {
        console.warn("Audio playback interrupted or blocked:", err);
        setAutoplayBlocked(true);
        setIsPlaying(false);
        isPlayingRef.current = false;
        setAudioStatus("Ready on Platform 1");
        onTogglePlay?.(false);
      }
    },
    [connectAudioWithEcho, onTogglePlay, playRadioStationTune, voiceGender]
  );

  const stopAnnouncement = useCallback(() => {
    setIsPlaying(false);
    isPlayingRef.current = false;
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current.currentTime = 0;
    }
    if (audioCtxRef.current && audioCtxRef.current.state === "running") {
      audioCtxRef.current.suspend();
    }
    setAudioStatus("Ready on Platform 1");
    onTogglePlay?.(false);
  }, [onTogglePlay]);

  const togglePlay = () => {
    if (isPlaying) {
      setIsMuted(true);
      stopAnnouncement();
    } else {
      setIsMuted(false);
      startAnnouncement();
    }
  };

  // Browser Autoplay handling: Play once per session
  useEffect(() => {
    const hasPlayed = sessionStorage.getItem("railpitch_announcement_played");
    if (!hasPlayed) {
      const timer = setTimeout(() => {
        sessionStorage.setItem("railpitch_announcement_played", "true");
        startAnnouncement().catch(() => {
          setAutoplayBlocked(true);
          setIsPlaying(false);
          isPlayingRef.current = false;
        });
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [startAnnouncement]);

  return (
    <>
      {/* ── Floating Speaker / Audio Control Pill (Fixed Top-Right) ── */}
      <div
        className="fixed top-24 right-5 z-40 flex items-center gap-2 select-none"
        style={{ fontFamily: "inherit" }}
      >
        {autoplayBlocked && !isPlaying && (
          <button
            onClick={() => {
              setAutoplayBlocked(false);
              startAnnouncement();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold shadow-lg animate-pulse transition-all cursor-pointer"
            style={{
              background: "#102720",
              color: "#f5e7b9",
              border: "1px solid #c8a356",
            }}
            title="Click to play station announcement with chime and echo"
          >
            <span>🔔</span>
            <span>Station Announcement Available</span>
            <span className="text-[10px] bg-[#c8a356] text-[#102720] px-1.5 py-0.5 rounded font-black">
              PLAY
            </span>
          </button>
        )}

        <div className="relative group">
          <button
            onClick={togglePlay}
            aria-label={isPlaying ? "Mute Announcement" : "Play Railway Announcement"}
            className="flex items-center justify-center w-11 h-11 rounded-full shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer"
            style={{
              background: isPlaying ? "#0f6b61" : isMuted ? "#2a3d36" : "#102720",
              color: isPlaying ? "#ffffff" : "#dbe1d9",
              border: isPlaying ? "2px solid #5ae0cc" : "2px solid #3d5a4e",
              boxShadow: isPlaying
                ? "0 0 16px rgba(15, 107, 97, 0.5), 0 8px 24px rgba(0,0,0,0.3)"
                : "0 6px 18px rgba(0,0,0,0.25)",
            }}
          >
            {isPlaying ? (
              <div className="flex items-center justify-center relative">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                </svg>
                <span className="absolute -top-1.5 -right-1.5 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
              </div>
            ) : (
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </svg>
            )}
          </button>

          <div className="absolute right-0 top-12 hidden group-hover:flex flex-col items-end pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50">
            <span
              className="px-2.5 py-1 text-[10px] font-bold rounded shadow-md whitespace-nowrap"
              style={{
                background: "#0c1f19",
                color: "#e6f2eb",
                border: "1px solid #23473b",
              }}
            >
              {isPlaying ? "Mute Station Chime & Announcement" : "Railway Chime & Announcement"}
            </span>
          </div>
        </div>
      </div>

      {/* ── Vintage Indian Railways Notice Card / Station Ticker ── */}
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 my-6">
        <div
          className="relative rounded-xl overflow-hidden shadow-2xl transition-all duration-300"
          style={{
            background: "#fffdf7",
            border: "2px solid #213c32",
            boxShadow: "0 12px 36px rgba(16, 39, 32, 0.12), 0 2px 6px rgba(16, 39, 32, 0.08)",
          }}
        >
          {/* Station Board Top Bar — Classic IR Enamel Signboard Styling */}
          <div
            className="px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2"
            style={{
              background: "linear-gradient(90deg, #112e25 0%, #174235 60%, #0d261e 100%)",
              borderBottom: "2px solid #c8a356",
              color: "#ffffff",
            }}
          >
            <div className="flex items-center gap-2.5">
              <span
                className={`w-2.5 h-2.5 rounded-full ${isPlaying ? "bg-emerald-400 animate-ping" : "bg-amber-400"}`}
              />
              <span className="text-[10px] sm:text-[11px] font-black tracking-widest text-[#f5ce7b] uppercase">
                INDIAN RAILWAYS · CENTRAL PASSENGER INFORMATION
              </span>
              <span className="hidden md:inline-block text-[#8ea79d] text-[10px]">
                | PLATFORM 01 · EXPEDITION BROADCAST
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Gender Voice Selector */}
              <div className="flex bg-[#0c1f19] rounded p-0.5 border border-[#2b5143]">
                <button
                  onClick={() => {
                    setVoiceGender("female");
                    if (isPlaying) startAnnouncement("female");
                  }}
                  className={`px-2 py-0.5 text-[10px] font-black rounded transition-colors cursor-pointer ${voiceGender === "female" ? "bg-[#e8775f] text-white" : "text-[#a0b8ad] hover:text-white"}`}
                  title="Switch to Female Announcer Voice"
                >
                  👩 FEMALE
                </button>
                <button
                  onClick={() => {
                    setVoiceGender("male");
                    if (isPlaying) startAnnouncement("male");
                  }}
                  className={`px-2 py-0.5 text-[10px] font-black rounded transition-colors cursor-pointer ${voiceGender === "male" ? "bg-[#0f6b61] text-white" : "text-[#a0b8ad] hover:text-white"}`}
                  title="Switch to Male Announcer Voice"
                >
                  👨 MALE
                </button>
              </div>

              {/* Station Echo FX Toggle */}
              <button
                onClick={() => setEchoEnabled(!echoEnabled)}
                className={`px-2 py-0.5 text-[10px] font-black rounded border transition-colors cursor-pointer ${echoEnabled ? "bg-[#1f4a3c] text-[#7ee3c2] border-[#39826a]" : "bg-[#0c1f19] text-[#718c81] border-[#203c31]"}`}
                title="Toggle Platform Echo / Radio Reverb Effect"
              >
                📻 ECHO {echoEnabled ? "ON" : "OFF"}
              </button>

              {/* Language Switcher Tabs */}
              <div className="flex bg-[#0c1f19] rounded p-0.5 border border-[#2b5143]">
                <button
                  onClick={() => setActiveLang("hi")}
                  className={`px-2 py-0.5 text-[10px] font-black rounded transition-colors cursor-pointer ${activeLang === "hi" ? "bg-[#c8a356] text-[#0c1f19]" : "text-[#a0b8ad] hover:text-white"}`}
                >
                  हिंदी / HINDI
                </button>
                <button
                  onClick={() => setActiveLang("en")}
                  className={`px-2 py-0.5 text-[10px] font-black rounded transition-colors cursor-pointer ${activeLang === "en" ? "bg-[#c8a356] text-[#0c1f19]" : "text-[#a0b8ad] hover:text-white"}`}
                >
                  ENGLISH
                </button>
              </div>

              {/* Minimizer toggle */}
              <button
                onClick={() => setCardMinimized(!cardMinimized)}
                className="text-[#9cb5aa] hover:text-white text-xs px-2 py-0.5 font-mono cursor-pointer"
                title={cardMinimized ? "Expand announcement details" : "Minimize announcement"}
              >
                {cardMinimized ? "▼ EXPAND" : "▲ MINIMIZE"}
              </button>
            </div>
          </div>

          {/* Station Notice Content */}
          {!cardMinimized && (
            <div className="p-4 sm:p-6 bg-[#fbf9f2]">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1 pr-0 md:pr-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-extrabold tracking-wider px-2 py-0.5 rounded bg-[#e8f1ec] text-[#0f6b61] border border-[#c1ddd0]">
                      {activeLang === "hi" ? "HINDI / HINGLISH ANNOUNCEMENT" : "OFFICIAL ENGLISH NOTICE"}
                    </span>
                    <span className="text-[10px] text-[#6b7c73] font-semibold">
                      MUMBAI CSMT ➔ GOA MADGAON (RP-0426)
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-[#efe4cd] text-[#634e20]">
                      {voiceGender === "female" ? "VOICE: FEMALE" : "VOICE: MALE"}
                    </span>
                  </div>

                  <blockquote className="m-0 text-[13px] sm:text-[14px] leading-relaxed text-[#102720] font-medium italic border-l-3 border-[#0f6b61] pl-3 py-1">
                    {activeLang === "hi" ? HINDI_SCRIPT : ENGLISH_SCRIPT}
                  </blockquote>
                </div>

                <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-2 border-t md:border-t-0 md:border-l border-[#e2e7e0] pt-3 md:pt-0 md:pl-5 min-w-[210px]">
                  <button
                    onClick={() => {
                      if (isPlaying) {
                        stopAnnouncement();
                      } else {
                        startAnnouncement();
                      }
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded text-[11px] font-extrabold shadow-sm transition-all transform active:scale-95 cursor-pointer"
                    style={{
                      background: isPlaying ? "#e8775f" : "#0f6b61",
                      color: "white",
                    }}
                  >
                    {isPlaying ? (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <rect x="6" y="4" width="4" height="16" />
                          <rect x="14" y="4" width="4" height="16" />
                        </svg>
                        <span>Pause Broadcast</span>
                      </>
                    ) : (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                        <span>Play Station Chime</span>
                      </>
                    )}
                  </button>

                  <div className="text-right">
                    <span className="block text-[9px] font-bold text-[#62776c] uppercase tracking-wider">
                      Engine: Radio Squelch + Chime + Echo
                    </span>
                    <span className="text-[10px] text-[#0f6b61] font-bold">
                      {audioStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

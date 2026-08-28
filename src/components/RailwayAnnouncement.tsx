"use client";

import { useEffect, useState, useRef, useCallback } from "react";

interface RailwayAnnouncementProps {
  onTogglePlay?: (isPlaying: boolean) => void;
}

export function RailwayAnnouncement({ onTogglePlay }: RailwayAnnouncementProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const mediaSourceConnectedRef = useRef(false);
  const isPlayingRef = useRef(false);

  // Initialize AudioContext lazily on user action or autoplay
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

  // Authentic Radio Station Mic Squelch & Station PA Chime (D5 -> F#5 -> A5)
  const playRadioStationTune = useCallback((): Promise<void> => {
    return new Promise((resolve) => {
      const ctx = getAudioContext();
      if (!ctx) {
        resolve();
        return;
      }

      try {
        const now = ctx.currentTime;

        // 1. Radio Mic Click & Static Squelch Burst
        const noiseBufferSize = Math.floor(ctx.sampleRate * 0.045);
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
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

        noiseSource.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(ctx.destination);
        noiseSource.start(now);

        // 2. Indian Railways Station Chime Sequence: D5 (587Hz) -> F#5 (740Hz) -> A5 (880Hz)
        const chimeNotes = [
          { freq: 587.33, start: now + 0.08, duration: 0.38 },
          { freq: 739.99, start: now + 0.44, duration: 0.38 },
          { freq: 880.0, start: now + 0.82, duration: 0.62 },
        ];

        chimeNotes.forEach(({ freq, start, duration }) => {
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

          // Bell harmonic overtone for resonant station PA sound
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

        setTimeout(() => resolve(), 1450);
      } catch {
        resolve();
      }
    });
  }, [getAudioContext]);

  // Connect HTML Audio Element through Web Audio PA Echo DSP graph
  const setupAudioEchoGraph = useCallback(
    (audioEl: HTMLAudioElement) => {
      const ctx = getAudioContext();
      if (!ctx || mediaSourceConnectedRef.current) return;

      try {
        const source = ctx.createMediaElementSource(audioEl);
        mediaSourceConnectedRef.current = true;

        // Dry speech path
        const dryGain = ctx.createGain();
        dryGain.gain.setValueAtTime(0.95, ctx.currentTime);
        source.connect(dryGain);
        dryGain.connect(ctx.destination);

        // Platform Echo / Hall Reverb loop (220ms delay, 32% feedback)
        const delayNode = ctx.createDelay();
        delayNode.delayTime.setValueAtTime(0.22, ctx.currentTime);

        const feedbackGain = ctx.createGain();
        feedbackGain.gain.setValueAtTime(0.32, ctx.currentTime);

        const filter = ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.setValueAtTime(1400, ctx.currentTime);
        filter.Q.setValueAtTime(0.8, ctx.currentTime);

        const wetGain = ctx.createGain();
        wetGain.gain.setValueAtTime(0.35, ctx.currentTime);

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
    [getAudioContext]
  );

  // Helper to play a single audio track with promise resolution on finish
  const playTrack = useCallback(
    (src: string): Promise<void> => {
      return new Promise((resolve) => {
        if (!audioElementRef.current) {
          audioElementRef.current = new Audio();
          audioElementRef.current.crossOrigin = "anonymous";
        }

        const audioEl = audioElementRef.current;
        audioEl.src = src;
        setupAudioEchoGraph(audioEl);

        audioEl.onended = () => resolve();
        audioEl.onerror = () => resolve();

        audioEl.play().catch(() => resolve());
      });
    },
    [setupAudioEchoGraph]
  );

  // Complete Announcement Sequence:
  // 1. Radio Mic Squelch + Chime
  // 2. First Audio: /audio/announcement-male.wav
  // 3. Second Audio: /audio/announcement-female.wav
  const startAnnouncement = useCallback(async () => {
    setIsPlaying(true);
    setIsMuted(false);
    isPlayingRef.current = true;
    setAutoplayBlocked(false);
    onTogglePlay?.(true);

    try {
      // Step 1: Radio station mic squelch & 3-tone chime
      await playRadioStationTune();
      if (!isPlayingRef.current) return;

      // Step 2: The audio that was second now plays first (Male version)
      await playTrack("/audio/announcement-male.wav");
      if (!isPlayingRef.current) return;

      // Brief breath pause between broadcasts
      await new Promise((r) => setTimeout(r, 600));
      if (!isPlayingRef.current) return;

      // Step 3: The audio that was first now plays second (Female version)
      await playTrack("/audio/announcement-female.wav");
    } catch (err) {
      console.warn("Announcement playback issue:", err);
    } finally {
      setIsPlaying(false);
      isPlayingRef.current = false;
      onTogglePlay?.(false);
    }
  }, [onTogglePlay, playRadioStationTune, playTrack]);

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

  // Automatically start announcement whenever the website is opened
  useEffect(() => {
    let started = false;

    const triggerPlay = () => {
      if (started || isPlayingRef.current) return;
      started = true;
      startAnnouncement().catch(() => {
        setAutoplayBlocked(true);
        setIsPlaying(false);
        isPlayingRef.current = false;
      });
    };

    // Immediate attempt on mount
    const timer = setTimeout(triggerPlay, 400);

    // Fallback: if browser autoplay sandbox restricts audio until first user gesture,
    // any touch, scroll, key, or tap anywhere on the page unlocks and plays it immediately
    const handleGesture = () => {
      triggerPlay();
      window.removeEventListener("pointerdown", handleGesture);
      window.removeEventListener("touchstart", handleGesture);
      window.removeEventListener("scroll", handleGesture);
      window.removeEventListener("keydown", handleGesture);
    };

    window.addEventListener("pointerdown", handleGesture, { once: true, passive: true });
    window.addEventListener("touchstart", handleGesture, { once: true, passive: true });
    window.addEventListener("scroll", handleGesture, { once: true, passive: true });
    window.addEventListener("keydown", handleGesture, { once: true, passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("pointerdown", handleGesture);
      window.removeEventListener("touchstart", handleGesture);
      window.removeEventListener("scroll", handleGesture);
      window.removeEventListener("keydown", handleGesture);
    };
  }, [startAnnouncement]);

  return (
    <div
      className="fixed top-24 right-5 z-40 flex items-center gap-2 select-none"
      style={{ fontFamily: "inherit" }}
    >
      {/* Autoplay blocked prompt chip */}
      {autoplayBlocked && !isPlaying && (
        <button
          onClick={() => {
            setAutoplayBlocked(false)
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
          <span>Announcement Available</span>
          <span className="text-[10px] bg-[#c8a356] text-[#102720] px-1.5 py-0.5 rounded font-black">
            PLAY
          </span>
        </button>
      )}

      {/* Minimalist Floating Speaker Button */}
      <div className="relative group">
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? "Mute Announcement" : "Play Station Announcement"}
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

        {/* Hover Tooltip */}
        <div className="absolute right-0 top-12 hidden group-hover:flex flex-col items-end pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50">
          <span
            className="px-2.5 py-1 text-[10px] font-bold rounded shadow-md whitespace-nowrap"
            style={{
              background: "#0c1f19",
              color: "#e6f2eb",
              border: "1px solid #23473b",
            }}
          >
            {isPlaying ? "Mute Station Announcement" : "Station Announcement"}
          </span>
        </div>
      </div>
    </div>
  );
}

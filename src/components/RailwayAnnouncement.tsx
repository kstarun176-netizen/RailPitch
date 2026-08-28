"use client";

import { usePathname } from "next/navigation";

import { useEffect, useState, useRef, useCallback } from "react";

interface RailwayAnnouncementProps {
  onTogglePlay?: (isPlaying: boolean) => void;
}

export function RailwayAnnouncement({ onTogglePlay }: RailwayAnnouncementProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const mediaSourceConnectedRef = useRef(false);
  const isPlayingRef = useRef(false);
  const crowdNodesRef = useRef<{ stop: () => void } | null>(null);

  // Initialize AudioContext
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

  // Authentic 20% Light Railway Station Crowd & Platform Ambience
  const startCrowdAmbience = useCallback((): { stop: () => void } | null => {
    const ctx = getAudioContext();
    if (!ctx) return null;

    try {
      const now = ctx.currentTime;

      // 1. Looping Station Platform Crowd Murmur Buffer (3.5s smooth loop)
      const bufferLen = Math.floor(ctx.sampleRate * 3.5);
      const crowdBuffer = ctx.createBuffer(2, bufferLen, ctx.sampleRate);
      for (let ch = 0; ch < 2; ch++) {
        const data = crowdBuffer.getChannelData(ch);
        let lastOut = 0.0;
        for (let i = 0; i < bufferLen; i++) {
          // Pink/Brownian noise for organic human vocal chatter acoustics
          const white = Math.random() * 2 - 1;
          lastOut = (lastOut * 0.95) + (white * 0.05);
          data[i] = lastOut * 3.2;
        }
      }

      const crowdSource = ctx.createBufferSource();
      crowdSource.buffer = crowdBuffer;
      crowdSource.loop = true;

      // Multi-band acoustic filtering for distant platform crowd frequencies
      const filter1 = ctx.createBiquadFilter();
      filter1.type = "bandpass";
      filter1.frequency.setValueAtTime(650, now);
      filter1.Q.setValueAtTime(1.2, now);

      const filter2 = ctx.createBiquadFilter();
      filter2.type = "lowpass";
      filter2.frequency.setValueAtTime(2200, now);

      // Ultra-gentle 10% background gain (0.095) with smooth fade-in
      const crowdGain = ctx.createGain();
      crowdGain.gain.setValueAtTime(0.001, now);
      crowdGain.gain.exponentialRampToValueAtTime(0.095, now + 0.4); // Exactly ~10% volume

      // Distant low train rumble hum (62Hz) on platform tracks
      const rumbleOsc = ctx.createOscillator();
      const rumbleGain = ctx.createGain();
      rumbleOsc.type = "sine";
      rumbleOsc.frequency.setValueAtTime(62, now);
      rumbleGain.gain.setValueAtTime(0.02, now);

      crowdSource.connect(filter1);
      filter1.connect(filter2);
      filter2.connect(crowdGain);
      crowdGain.connect(ctx.destination);

      rumbleOsc.connect(rumbleGain);
      rumbleGain.connect(crowdGain);

      crowdSource.start(now);
      rumbleOsc.start(now);

      return {
        stop: () => {
          try {
            const stopTime = ctx.currentTime;
            crowdGain.gain.setValueAtTime(crowdGain.gain.value, stopTime);
            crowdGain.gain.exponentialRampToValueAtTime(0.0001, stopTime + 0.5);
            setTimeout(() => {
              try {
                crowdSource.stop();
                rumbleOsc.stop();
              } catch {}
            }, 550);
          } catch {}
        },
      };
    } catch {
      return null;
    }
  }, [getAudioContext]);

  // Radio Station Mic Squelch & Station Chime Tune (D5 -> F#5 -> A5)
  const playRadioStationTune = useCallback((): Promise<void> => {
    return new Promise((resolve) => {
      const ctx = getAudioContext();
      if (!ctx) {
        resolve();
        return;
      }

      try {
        const now = ctx.currentTime;

        // Radio mic click / squelch (40ms)
        const noiseBufferSize = Math.floor(ctx.sampleRate * 0.04);
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
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

        noiseSource.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(ctx.destination);
        noiseSource.start(now);

        // Classic Indian Railways Announcement Chime (D5 -> F#5 -> A5)
        const chimeNotes = [
          { freq: 587.33, start: now + 0.07, duration: 0.38 },
          { freq: 739.99, start: now + 0.43, duration: 0.38 },
          { freq: 880.0, start: now + 0.81, duration: 0.62 },
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

          // Bell overtone harmonic
          const oscHarmonic = ctx.createOscillator();
          const gainHarmonic = ctx.createGain();
          oscHarmonic.type = "sine";
          oscHarmonic.frequency.setValueAtTime(freq * 2, start);

          gainHarmonic.gain.setValueAtTime(0.001, start);
          gainHarmonic.gain.exponentialRampToValueAtTime(0.08, start + 0.015);
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

  // Setup Web Audio Platform Echo (220ms delay, 32% feedback)
  const setupAudioEchoGraph = useCallback(
    (audioEl: HTMLAudioElement) => {
      const ctx = getAudioContext();
      if (!ctx || mediaSourceConnectedRef.current) return;

      try {
        const source = ctx.createMediaElementSource(audioEl);
        mediaSourceConnectedRef.current = true;

        // Direct path
        const dryGain = ctx.createGain();
        dryGain.gain.setValueAtTime(0.95, ctx.currentTime);
        source.connect(dryGain);
        dryGain.connect(ctx.destination);

        // Platform Echo path (220ms delay, 32% feedback, 1400Hz filter)
        const delayNode = ctx.createDelay();
        delayNode.delayTime.setValueAtTime(0.22, ctx.currentTime);

        const feedbackGain = ctx.createGain();
        feedbackGain.gain.setValueAtTime(0.32, ctx.currentTime);

        const filter = ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.setValueAtTime(1400, ctx.currentTime);
        filter.Q.setValueAtTime(0.8, ctx.currentTime);

        const wetGain = ctx.createGain();
        wetGain.gain.setValueAtTime(0.34, ctx.currentTime);

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

  // Start Announcement (Single Audio + 20% Station Crowd Sound + Echo)
  const startAnnouncement = useCallback(async () => {
    if (isPlayingRef.current) return;

    // Ensure AudioContext is actively running
    const ctx = getAudioContext();
    if (ctx && ctx.state === "suspended") {
      try {
        await ctx.resume();
      } catch {}
    }

    setIsPlaying(true);
    setIsMuted(false);
    isPlayingRef.current = true;
    onTogglePlay?.(true);

    try {
      // 1. Start 20% railway crowd sound in the background
      if (crowdNodesRef.current) crowdNodesRef.current.stop();
      crowdNodesRef.current = startCrowdAmbience();

      // 2. Play starting radio squelch and 3-tone station chime
      await playRadioStationTune();
      if (!isPlayingRef.current) return;

      // 3. Play the announcement audio track with platform echo
      await new Promise<void>((resolve) => {
        if (!audioElementRef.current) {
          audioElementRef.current = new Audio();
          audioElementRef.current.crossOrigin = "anonymous";
        }

        const audioEl = audioElementRef.current;
        audioEl.src = "/audio/announcement-male.wav";
        setupAudioEchoGraph(audioEl);

        audioEl.onended = () => resolve();
        audioEl.onerror = () => resolve();

        const playPromise = audioEl.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => resolve());
        }
      });
    } catch (err) {
      console.warn("Playback error:", err);
    } finally {
      // Stop background crowd sound smoothly when announcement finishes
      if (crowdNodesRef.current) {
        crowdNodesRef.current.stop();
        crowdNodesRef.current = null;
      }
      setIsPlaying(false);
      isPlayingRef.current = false;
      onTogglePlay?.(false);
      // Mark announcement as played for this session
      if (typeof window !== "undefined") {
        sessionStorage.setItem("railpitch_announcement_played", "true");
      }
    }
  }, [getAudioContext, onTogglePlay, playRadioStationTune, setupAudioEchoGraph, startCrowdAmbience]);

  const stopAnnouncement = useCallback(() => {
    setIsPlaying(false);
    isPlayingRef.current = false;
    if (crowdNodesRef.current) {
      crowdNodesRef.current.stop();
      crowdNodesRef.current = null;
    }
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

  const pathname = usePathname();

  // Automatically start on website enter without needing to click the audio button
  useEffect(() => {
    // Ensure autoplay only on the root home page
    if (pathname !== "/") return;

    // Check session flag for first-time play
    if (typeof window !== "undefined") {
      const played = sessionStorage.getItem("railpitch_announcement_played");
      if (played) return;
    }

    let started = false;

    const triggerAutoPlay = async () => {
      if (started || isPlayingRef.current) return;
      started = true;

      const ctx = getAudioContext();
      if (ctx && ctx.state === "suspended") {
        try {
          await ctx.resume();
        } catch {}
      }

      startAnnouncement().catch(() => {});
    };

    // 1. Immediate attempt upon entering website
    triggerAutoPlay();
    const t1 = setTimeout(triggerAutoPlay, 50);
    const t2 = setTimeout(triggerAutoPlay, 250);

    // 2. Seamless automatic unlock on ANY initial visitor activity (moving mouse, scrolling, touching screen)
    const events = [
      "pointermove",
      "mousemove",
      "mouseenter",
      "scroll",
      "wheel",
      "focus",
      "touchstart",
      "pointerdown",
      "mousedown",
      "keydown",
    ];

    const handleNaturalActivity = () => {
      triggerAutoPlay();
      events.forEach((ev) => window.removeEventListener(ev, handleNaturalActivity, true));
      events.forEach((ev) => document.removeEventListener(ev, handleNaturalActivity, true));
    };

    events.forEach((ev) => window.addEventListener(ev, handleNaturalActivity, { capture: true, once: true, passive: true }));
    events.forEach((ev) => document.addEventListener(ev, handleNaturalActivity, { capture: true, once: true, passive: true }));

    // Cleanup on unmount: stop any playing audio when leaving home page
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      events.forEach((ev) => window.removeEventListener(ev, handleNaturalActivity, true));
      events.forEach((ev) => document.removeEventListener(ev, handleNaturalActivity, true));
      stopAnnouncement();
    };
  }, [pathname, getAudioContext, startAnnouncement, stopAnnouncement]);


  return (
    <div
      className="fixed top-24 right-5 z-40 flex items-center gap-2 select-none"
      style={{ fontFamily: "inherit" }}
    >
      {/* Hidden audio tag for browser native autoplay hints */}
      <audio
        ref={audioElementRef}
        src="/audio/announcement-male.wav"
        preload="auto"
        playsInline
        style={{ display: "none" }}
      />

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

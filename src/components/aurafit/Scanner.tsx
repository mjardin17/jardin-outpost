"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { analyzeMealPhoto, type MealEstimate } from "./visionClient";

type ScannerProps = {
  onResult: (estimate: MealEstimate) => void;
};

export default function Scanner({ onResult }: ScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [status, setStatus] = useState<"idle" | "scanning" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setCameraOn(false);
  }, []);

  useEffect(() => stopCamera, [stopCamera]);

  async function startCamera() {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraOn(true);
    } catch {
      setError("Couldn't access the camera. Check browser permissions and try again.");
    }
  }

  async function captureAndAnalyze() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    const base64 = dataUrl.split(",")[1];

    setStatus("scanning");
    setError(null);
    try {
      const estimate = await analyzeMealPhoto(base64);
      onResult(estimate);
      setStatus("idle");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed.");
      setStatus("error");
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
      <div className="relative aspect-video bg-black">
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          muted
          playsInline
        />
        <canvas ref={canvasRef} className="hidden" />
        {!cameraOn && (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-950">
            <button
              onClick={startCamera}
              className="rounded-full border border-cyan-400/50 px-6 py-3 text-sm font-medium text-cyan-300 transition-colors hover:bg-cyan-400/10"
            >
              Enable camera
            </button>
          </div>
        )}
        {cameraOn && (
          <div className="absolute inset-6 rounded-xl border-2 border-dashed border-cyan-400/40" />
        )}
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-zinc-800 px-4 py-3">
        <p className="text-xs text-zinc-500">
          {status === "scanning" ? "Analyzing volumetric scale..." : "Center your plate in frame."}
        </p>
        <button
          onClick={captureAndAnalyze}
          disabled={!cameraOn || status === "scanning"}
          className="rounded-full bg-cyan-400 px-5 py-2 text-sm font-semibold text-zinc-950 transition-opacity disabled:opacity-40"
        >
          {status === "scanning" ? "Scanning..." : "Scan plate"}
        </button>
      </div>
      {error && (
        <p className="border-t border-red-500/30 bg-red-500/10 px-4 py-2 text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

"use client";

import { useState, useRef } from "react";

export default function Home() {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState("");

  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      streamRef.current = stream;

      const recorder = new MediaRecorder(stream);

      recorderRef.current = recorder;
      chunksRef.current = [];

      recorder.onstart = () => {
        console.log("recording started");
      };

      recorder.ondataavailable = (e) => {
        console.log("data:", e.data);
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        console.log("stopped");

        const blob = new Blob(chunksRef.current, {
          type: "audio/webm",
        });

        const url = URL.createObjectURL(blob);
        setAudioURL(url);

        streamRef.current?.getTracks().forEach((t) => t.stop());
      };

      recorder.start();

      setRecording(true);

      setTimeout(() => {
        recorder.stop();
        setRecording(false);
      }, 3000);

    } catch (err) {
      console.error("MIC ERROR:", err);
    }
  };

  return (
    <main style={{ padding: 40 }}>
      <h1>🎤 Audio Test</h1>

      <button onClick={startRecording}>
        {recording ? "Recording..." : "Start Recording"}
      </button>

      {audioURL && (
        <div style={{ marginTop: 20 }}>
          <audio controls src={audioURL} />
        </div>
      )}
    </main>
  );
}
"use client";

import { useState, useRef } from "react";

const words = [
  "champignon",
  "montagne",
  "baignoire",
  "cigogne",
];

export default function Home() {
  const [index, setIndex] = useState(0);
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState("");
  const [feedback, setFeedback] = useState("");

  const chunksRef = useRef<Blob[]>([]);

  const word = words[index];

  const playModel = () => {
    const u = new SpeechSynthesisUtterance(word);
    u.lang = "fr-FR";
    speechSynthesis.speak(u);
  };

  const nextWord = () => {
    setIndex((prev) => (prev + 1) % words.length);
    setAudioURL("");
    setFeedback("");
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    const recorder = new MediaRecorder(stream);
    chunksRef.current = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, {
        type: "audio/webm",
      });

      const url = URL.createObjectURL(blob);
      setAudioURL(url);

      stream.getTracks().forEach((t) => t.stop());

      // 🎯 fake evaluation
      const ok = Math.random() > 0.5;

      setFeedback(
        ok
          ? "🟢 Bon son /ɲ/"
          : "🔴 À améliorer : essaie de prononcer 'gn' comme dans 'montagne'"
      );
    };

    recorder.start();
    setRecording(true);

    setTimeout(() => {
      recorder.stop();
      setRecording(false);
    }, 3000);
  };

  return (
    <main style={{ padding: 40 }}>
      <h1>🇫🇷 Prononciation /ɲ/</h1>

      <h2 style={{ fontSize: 30 }}>{word}</h2>

      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={playModel}>▶ Écouter</button>

        <button onClick={startRecording}>
          {recording ? "Recording..." : "🎤 Enregistrer"}
        </button>

        <button onClick={nextWord}>➡ Suivant</button>
      </div>

      {audioURL && (
        <div style={{ marginTop: 20 }}>
          <audio controls src={audioURL} />
        </div>
      )}

      {feedback && (
        <p style={{ marginTop: 20, fontSize: 18 }}>
          {feedback}
        </p>
      )}
    </main>
  );
}

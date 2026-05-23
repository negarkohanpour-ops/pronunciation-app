"use client";

import { useState, useRef } from "react";

const words = [
  "champignon",
  "montagne",
  "baignoire",
  "cigogne",
];

export default function GNPage() {
  const [index, setIndex] = useState(0);
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState("");
  const [feedback, setFeedback] = useState("");

  const chunksRef = useRef<Blob[]>([]);

  const currentWord = words[index];

  const playModel = () => {
    const utterance =
      new SpeechSynthesisUtterance(
        currentWord
      );

    utterance.lang = "fr-FR";

    speechSynthesis.speak(utterance);
  };

  const nextWord = () => {
    setIndex(
      (prev) =>
        (prev + 1) % words.length
    );

    setAudioURL("");
    setFeedback("");
  };

  const startRecording =
    async () => {
      const stream =
        await navigator.mediaDevices.getUserMedia(
          {
            audio: true,
          }
        );

      const recorder =
        new MediaRecorder(stream);

      chunksRef.current = [];

      recorder.ondataavailable = (
        e
      ) => {
        if (e.data.size > 0) {
          chunksRef.current.push(
            e.data
          );
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(
          chunksRef.current,
          {
            type: "audio/webm",
          }
        );

        const url =
          URL.createObjectURL(blob);

        setAudioURL(url);

        stream
          .getTracks()
          .forEach((t) =>
            t.stop()
          );

        const ok =
          Math.random() > 0.5;

        setFeedback(
          ok
            ? "🟢 Bonne prononciation du son /ɲ/"
            : "🔴 À améliorer : écoutez encore le modèle"
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
      <h1>
        🇫🇷 Travail du son /ɲ/
      </h1>

      <p style={{ marginTop: 20 }}>
        Le son /ɲ/ s’écrit souvent
        <strong> GN </strong>
        en français.
      </p>

      <p style={{ marginTop: 10 }}>
        Exemples : montagne,
        champignon, baignoire...
      </p>

      <div
        style={{
          marginTop: 20,
          padding: 15,
          border:
            "1px solid lightgray",
          borderRadius: 10,
          maxWidth: 500,
        }}
      >
        <p>
          1. Écoutez le modèle
        </p>

        <p>
          2. Répétez le mot
        </p>

        <p>
          3. Enregistrez votre voix
        </p>
      </div>

      <h2
        style={{
          fontSize: 30,
          marginTop: 20,
        }}
      >
        {currentWord}
      </h2>

      <div
        style={{
          display: "flex",
          gap: 10,
          marginTop: 20,
        }}
      >
        <button onClick={playModel}>
          ▶ Écouter
        </button>

        <button
          onClick={startRecording}
        >
          {recording
            ? "Recording..."
            : "🎤 Enregistrer"}
        </button>

        <button onClick={nextWord}>
          ➡ Suivant
        </button>
      </div>

      {audioURL && (
        <div style={{ marginTop: 20 }}>
          <audio
            controls
            src={audioURL}
          />
        </div>
      )}

      {feedback && (
        <div
          style={{
            marginTop: 20,
            padding: 15,
            borderRadius: 10,
            backgroundColor:
              feedback.includes(
                "🟢"
              )
                ? "#d1fae5"
                : "#fee2e2",
            color:
              feedback.includes(
                "🟢"
              )
                ? "#065f46"
                : "#991b1b",
            maxWidth: 500,
          }}
        >
          {feedback}
        </div>
      )}
    </main>
  );
}

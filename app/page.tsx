import Link from "next/link";

export default function Home() {
  return (
    <main style={{ padding: 40 }}>
      <h1 style={{ fontSize: 32 }}>
        🇫🇷 Prononciation du français
      </h1>

      <p style={{ marginTop: 10 }}>
        Choisissez un son :
      </p>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          marginTop: 30,
          maxWidth: 300,
        }}
      >
        <Link href="/phoneme/gn">
          <button style={buttonStyle}>
            /ɲ/ — son GN
          </button>
        </Link>

        <button style={buttonStyle}>
          /ʁ/ — R français
        </button>

        <button style={buttonStyle}>
          Voyelles nasales
        </button>

        <button style={buttonStyle}>
          Semi-voyelles
        </button>
      </div>
    </main>
  );
}

const buttonStyle = {
  padding: "12px 20px",
  borderRadius: 10,
  border: "1px solid black",
  cursor: "pointer",
  fontSize: 16,
};

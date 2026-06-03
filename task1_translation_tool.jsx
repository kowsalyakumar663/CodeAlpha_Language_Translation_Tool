import { useState, useEffect } from "react";

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "hi", name: "Hindi" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "zh", name: "Chinese" },
  { code: "ar", name: "Arabic" },
  { code: "pt", name: "Portuguese" },
  { code: "ru", name: "Russian" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "it", name: "Italian" },
];

export default function TranslationTool() {
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("hi");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    setCharCount(inputText.length);
  }, [inputText]);

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    setError("");
    setTranslatedText("");

    const sourceName = LANGUAGES.find((l) => l.code === sourceLang)?.name;
    const targetName = LANGUAGES.find((l) => l.code === targetLang)?.name;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [
            {
              role: "user",
              content: `Translate the following text from ${sourceName} to ${targetName}. Return ONLY the translated text, nothing else, no explanations.\n\nText: ${inputText}`,
            },
          ],
        }),
      });
      const data = await response.json();
      const result = data.content?.[0]?.text || "Translation failed.";
      setTranslatedText(result);
    } catch (err) {
      setError("Translation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSwap = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setInputText(translatedText);
    setTranslatedText(inputText);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInputText("");
    setTranslatedText("");
    setError("");
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
      fontFamily: "'Georgia', serif",
      padding: "30px 16px",
      color: "#fff",
    }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "36px" }}>
        <div style={{ fontSize: "40px", marginBottom: "8px" }}>🌐</div>
        <h1 style={{
          fontSize: "clamp(26px, 6vw, 40px)",
          fontWeight: "800",
          letterSpacing: "2px",
          background: "linear-gradient(90deg, #a78bfa, #60a5fa, #34d399)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          margin: 0,
        }}>Language Translation Tool</h1>
        <p style={{ color: "#94a3b8", marginTop: "8px", fontSize: "15px" }}>
          AI-powered · 12 Languages · Instant Results
        </p>
        <div style={{
          display: "inline-block",
          marginTop: "8px",
          padding: "4px 14px",
          borderRadius: "20px",
          background: "rgba(167,139,250,0.15)",
          border: "1px solid rgba(167,139,250,0.4)",
          fontSize: "12px",
          color: "#a78bfa",
          letterSpacing: "1px"
        }}>CodeAlpha Internship — Task 1</div>
      </div>

      {/* Main Card */}
      <div style={{
        maxWidth: "860px",
        margin: "0 auto",
        background: "rgba(255,255,255,0.05)",
        borderRadius: "20px",
        border: "1px solid rgba(255,255,255,0.1)",
        backdropFilter: "blur(10px)",
        overflow: "hidden",
      }}>
        {/* Language Selectors */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "20px 24px",
          background: "rgba(255,255,255,0.04)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          flexWrap: "wrap",
        }}>
          <div style={{ flex: 1, minWidth: "120px" }}>
            <label style={{ fontSize: "11px", color: "#94a3b8", letterSpacing: "1px", display: "block", marginBottom: "6px" }}>SOURCE</label>
            <select
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "10px",
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "#fff",
                fontSize: "15px",
                cursor: "pointer",
                outline: "none",
              }}
            >
              {LANGUAGES.map((l) => <option key={l.code} value={l.code} style={{ background: "#302b63" }}>{l.name}</option>)}
            </select>
          </div>

          <button
            onClick={handleSwap}
            title="Swap languages"
            style={{
              marginTop: "18px",
              width: "42px", height: "42px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #a78bfa, #60a5fa)",
              border: "none",
              cursor: "pointer",
              fontSize: "18px",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
              transition: "transform 0.2s",
            }}
            onMouseEnter={e => e.target.style.transform = "rotate(180deg)"}
            onMouseLeave={e => e.target.style.transform = "rotate(0deg)"}
          >⇄</button>

          <div style={{ flex: 1, minWidth: "120px" }}>
            <label style={{ fontSize: "11px", color: "#94a3b8", letterSpacing: "1px", display: "block", marginBottom: "6px" }}>TARGET</label>
            <select
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "10px",
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "#fff",
                fontSize: "15px",
                cursor: "pointer",
                outline: "none",
              }}
            >
              {LANGUAGES.map((l) => <option key={l.code} value={l.code} style={{ background: "#302b63" }}>{l.name}</option>)}
            </select>
          </div>
        </div>

        {/* Text Areas */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {/* Input */}
          <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
              <span style={{ fontSize: "12px", color: "#a78bfa", letterSpacing: "1px" }}>INPUT TEXT</span>
              <span style={{ fontSize: "12px", color: charCount > 900 ? "#f87171" : "#64748b" }}>{charCount}/1000</span>
            </div>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value.slice(0, 1000))}
              placeholder="Enter text to translate..."
              rows={5}
              style={{
                width: "100%",
                background: "transparent",
                border: "none",
                outline: "none",
                color: "#e2e8f0",
                fontSize: "16px",
                resize: "vertical",
                fontFamily: "inherit",
                lineHeight: "1.6",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Output */}
          <div style={{ padding: "20px 24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
              <span style={{ fontSize: "12px", color: "#34d399", letterSpacing: "1px" }}>TRANSLATION</span>
              {translatedText && (
                <button onClick={handleCopy} style={{
                  background: "transparent", border: "none", cursor: "pointer",
                  color: copied ? "#34d399" : "#94a3b8", fontSize: "13px",
                }}>
                  {copied ? "✅ Copied!" : "📋 Copy"}
                </button>
              )}
            </div>
            <div style={{
              minHeight: "100px",
              color: loading ? "#64748b" : translatedText ? "#e2e8f0" : "#475569",
              fontSize: "16px",
              lineHeight: "1.6",
              fontStyle: translatedText ? "normal" : "italic",
            }}>
              {loading ? (
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{
                    width: "20px", height: "20px",
                    border: "3px solid rgba(167,139,250,0.3)",
                    borderTop: "3px solid #a78bfa",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                  }} />
                  Translating...
                </div>
              ) : error ? (
                <span style={{ color: "#f87171" }}>{error}</span>
              ) : translatedText || "Translation will appear here..."}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div style={{
          display: "flex", gap: "12px", padding: "16px 24px",
          background: "rgba(255,255,255,0.03)",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          flexWrap: "wrap",
        }}>
          <button
            onClick={handleTranslate}
            disabled={!inputText.trim() || loading}
            style={{
              flex: 1,
              padding: "14px",
              borderRadius: "12px",
              background: inputText.trim() && !loading
                ? "linear-gradient(135deg, #a78bfa, #60a5fa)"
                : "rgba(255,255,255,0.1)",
              border: "none",
              color: "#fff",
              fontSize: "16px",
              fontWeight: "700",
              cursor: inputText.trim() && !loading ? "pointer" : "not-allowed",
              letterSpacing: "1px",
              transition: "opacity 0.2s",
            }}
          >
            {loading ? "Translating..." : "🌐 Translate"}
          </button>
          <button
            onClick={handleClear}
            style={{
              padding: "14px 20px",
              borderRadius: "12px",
              background: "rgba(248,113,113,0.15)",
              border: "1px solid rgba(248,113,113,0.3)",
              color: "#f87171",
              fontSize: "15px",
              cursor: "pointer",
            }}
          >🗑 Clear</button>
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: "center", marginTop: "30px", color: "#475569", fontSize: "13px" }}>
        Built with Claude AI · CodeAlpha Internship Project
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        select option { background: #302b63; color: #fff; }
        textarea::placeholder { color: #475569; }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}

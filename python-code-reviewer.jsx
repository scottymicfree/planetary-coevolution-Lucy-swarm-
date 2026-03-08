import { useState, useRef } from "react";

const SEVERITY_CONFIG = {
  critical: {
    label: "Critical",
    color: "#ff3b3b",
    bg: "rgba(255,59,59,0.08)",
    border: "rgba(255,59,59,0.3)",
    dot: "#ff3b3b",
    order: 0,
  },
  high: {
    label: "High",
    color: "#ff8c00",
    bg: "rgba(255,140,0,0.08)",
    border: "rgba(255,140,0,0.3)",
    dot: "#ff8c00",
    order: 1,
  },
  medium: {
    label: "Medium",
    color: "#f5c518",
    bg: "rgba(245,197,24,0.07)",
    border: "rgba(245,197,24,0.3)",
    dot: "#f5c518",
    order: 2,
  },
  low: {
    label: "Low",
    color: "#4ec9a0",
    bg: "rgba(78,201,160,0.08)",
    border: "rgba(78,201,160,0.3)",
    dot: "#4ec9a0",
    order: 3,
  },
  info: {
    label: "Info",
    color: "#6b9fd4",
    bg: "rgba(107,159,212,0.07)",
    border: "rgba(107,159,212,0.25)",
    dot: "#6b9fd4",
    order: 4,
  },
};

const SAMPLE_CODE = `import pickle
import os

def get_user_data(user_id):
    query = "SELECT * FROM users WHERE id = " + user_id
    result = db.execute(query)
    return result

def load_config(path):
    with open(path, 'rb') as f:
        config = pickle.load(f)
    return config

def process_items(items):
    result = []
    for i in range(len(items)):
        result = result + [items[i] * 2]
    return result

def authenticate(username, password):
    if password == "admin123":
        return True
    stored = db.get_password(username)
    return password == stored

class DataProcessor:
    def __init__(self):
        self.data = []
    
    def add(self, item):
        self.data.append(item)
    
    def get_all(self):
        return self.data
`;

function SeverityBadge({ severity }) {
  const cfg = SEVERITY_CONFIG[severity];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        padding: "2px 10px",
        borderRadius: "20px",
        fontSize: "11px",
        fontWeight: "700",
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        color: cfg.color,
        fontFamily: "'DM Mono', monospace",
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          background: cfg.dot,
          flexShrink: 0,
        }}
      />
      {cfg.label}
    </span>
  );
}

function IssueCard({ issue, index }) {
  const [copied, setCopied] = useState(false);
  const cfg = SEVERITY_CONFIG[issue.severity];

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `[${issue.severity.toUpperCase()}] ${issue.title}\n\n${issue.description}\n\nSuggestion: ${issue.suggestion}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      style={{
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        borderLeft: `3px solid ${cfg.color}`,
        borderRadius: "8px",
        padding: "14px 16px",
        marginBottom: "10px",
        transition: "transform 0.15s ease",
        cursor: "default",
        animation: `slideIn 0.3s ease ${index * 0.05}s both`,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateX(3px)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateX(0)")}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px", marginBottom: "8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <SeverityBadge severity={issue.severity} />
          {issue.line && (
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", color: "#888", background: "rgba(255,255,255,0.06)", padding: "2px 7px", borderRadius: "4px", border: "1px solid rgba(255,255,255,0.1)" }}>
              line {issue.line}
            </span>
          )}
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", color: "#666", background: "rgba(255,255,255,0.04)", padding: "2px 7px", borderRadius: "4px" }}>
            {issue.category}
          </span>
        </div>
        <button
          onClick={handleCopy}
          title="Copy as PR comment"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "5px",
            color: copied ? "#4ec9a0" : "#888",
            cursor: "pointer",
            padding: "3px 9px",
            fontSize: "11px",
            fontFamily: "'DM Mono', monospace",
            flexShrink: 0,
            transition: "all 0.2s",
          }}
        >
          {copied ? "✓ copied" : "copy"}
        </button>
      </div>
      <div style={{ fontFamily: "'Fraunces', serif", fontWeight: "600", fontSize: "14px", color: "#e8e4dc", marginBottom: "5px" }}>
        {issue.title}
      </div>
      <div style={{ fontSize: "13px", color: "#aaa", lineHeight: "1.55", marginBottom: "8px" }}>
        {issue.description}
      </div>
      {issue.suggestion && (
        <div style={{ fontSize: "12px", color: cfg.color, fontFamily: "'DM Mono', monospace", background: "rgba(0,0,0,0.2)", padding: "7px 10px", borderRadius: "5px", lineHeight: "1.5" }}>
          💡 {issue.suggestion}
        </div>
      )}
    </div>
  );
}

function ScoreMeter({ score }) {
  const color = score >= 80 ? "#4ec9a0" : score >= 60 ? "#f5c518" : score >= 40 ? "#ff8c00" : "#ff3b3b";
  const label = score >= 80 ? "Good" : score >= 60 ? "Needs Work" : score >= 40 ? "Poor" : "Critical";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
      <div style={{ position: "relative", width: "64px", height: "64px", flexShrink: 0 }}>
        <svg width="64" height="64" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="6" />
          <circle
            cx="32" cy="32" r="26"
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeDasharray={`${2 * Math.PI * 26}`}
            strokeDashoffset={`${2 * Math.PI * 26 * (1 - score / 100)}`}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.8s ease" }}
          />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Mono', monospace", fontWeight: "700", fontSize: "15px", color }}>
          {score}
        </div>
      </div>
      <div>
        <div style={{ fontFamily: "'Fraunces', serif", fontSize: "18px", fontWeight: "700", color }}>{label}</div>
        <div style={{ fontSize: "12px", color: "#666", fontFamily: "'DM Mono', monospace" }}>quality score</div>
      </div>
    </div>
  );
}

export default function CodeReviewer() {
  const [code, setCode] = useState(SAMPLE_CODE);
  const [issues, setIssues] = useState(null);
  const [summary, setSummary] = useState(null);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [error, setError] = useState(null);
  const textareaRef = useRef(null);

  const runReview = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setIssues(null);
    setSummary(null);
    setScore(null);
    setError(null);
    setActiveFilter("all");

    const systemPrompt = `You are an expert Python code reviewer. Analyze the provided Python code and return a JSON object ONLY — no markdown, no explanation, no backticks.

The JSON must have this exact shape:
{
  "score": <integer 0-100, overall code quality>,
  "summary": "<1-2 sentence overview of the code's main issues>",
  "issues": [
    {
      "severity": "<critical|high|medium|low|info>",
      "category": "<Security|Performance|Style|Correctness|Maintainability|Best Practice>",
      "title": "<short issue title>",
      "line": <line number or null>,
      "description": "<clear explanation of the problem>",
      "suggestion": "<concrete fix or improvement>"
    }
  ]
}

Severity guide:
- critical: security vulnerabilities, data loss risks, crashes
- high: bugs, dangerous patterns, broken logic
- medium: performance issues, bad practices that affect reliability
- low: style violations, minor inefficiencies
- info: suggestions, best practice nudges

Sort issues from most severe to least. Be specific, actionable, and Python-idiomatic.`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: systemPrompt,
          messages: [{ role: "user", content: `Review this Python code:\n\n${code}` }],
        }),
      });
      const data = await response.json();
      const raw = data.content?.map((b) => b.text || "").join("") || "";
      const clean = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setIssues(parsed.issues || []);
      setSummary(parsed.summary || "");
      setScore(parsed.score ?? null);
    } catch (e) {
      setError("Failed to parse review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const counts = issues
    ? Object.keys(SEVERITY_CONFIG).reduce((acc, s) => {
        acc[s] = issues.filter((i) => i.severity === s).length;
        return acc;
      }, {})
    : {};

  const filtered =
    issues?.filter((i) => activeFilter === "all" || i.severity === activeFilter) || [];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,600;0,700;1,400&family=DM+Mono:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0e0e10; }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
        textarea:focus { outline: none; }
      `}</style>
      <div style={{ minHeight: "100vh", background: "#0e0e10", color: "#e8e4dc", fontFamily: "'DM Mono', monospace", padding: "0" }}>
        {/* Header */}
        <div style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "18px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,0.02)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "32px", height: "32px", background: "linear-gradient(135deg, #ff3b3b 0%, #ff8c00 100%)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>
              🐍
            </div>
            <div>
              <div style={{ fontFamily: "'Fraunces', serif", fontWeight: "700", fontSize: "17px", letterSpacing: "-0.01em" }}>PyReview</div>
              <div style={{ fontSize: "10px", color: "#555", letterSpacing: "0.08em", textTransform: "uppercase" }}>Python Code Reviewer</div>
            </div>
          </div>
          <div style={{ fontSize: "11px", color: "#444", letterSpacing: "0.04em" }}>
            severity-first · python-native
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0", height: "calc(100vh - 65px)" }}>
          {/* Left: Code Input */}
          <div style={{ borderRight: "1px solid rgba(255,255,255,0.07)", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "11px", color: "#555", letterSpacing: "0.06em", textTransform: "uppercase" }}>paste your python</span>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={() => { setCode(""); setIssues(null); setSummary(null); setScore(null); }}
                  style={{ background: "none", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "5px", color: "#666", cursor: "pointer", padding: "4px 12px", fontSize: "11px", fontFamily: "'DM Mono', monospace" }}
                >
                  clear
                </button>
                <button
                  onClick={() => setCode(SAMPLE_CODE)}
                  style={{ background: "none", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "5px", color: "#666", cursor: "pointer", padding: "4px 12px", fontSize: "11px", fontFamily: "'DM Mono', monospace" }}
                >
                  load sample
                </button>
              </div>
            </div>
            <textarea
              ref={textareaRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="# Paste your Python code here..."
              spellCheck={false}
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                color: "#c9c5bd",
                fontFamily: "'DM Mono', monospace",
                fontSize: "12.5px",
                lineHeight: "1.7",
                padding: "18px 22px",
                resize: "none",
                overflowY: "auto",
                caretColor: "#ff8c00",
              }}
            />
            <div style={{ padding: "14px 20px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "11px", color: "#444" }}>
                {code.split("\n").length} lines · {code.length} chars
              </span>
              <button
                onClick={runReview}
                disabled={loading || !code.trim()}
                style={{
                  background: loading ? "rgba(255,140,0,0.15)" : "linear-gradient(135deg, #ff3b3b, #ff8c00)",
                  border: "none",
                  borderRadius: "7px",
                  color: loading ? "#ff8c00" : "#fff",
                  cursor: loading || !code.trim() ? "not-allowed" : "pointer",
                  padding: "9px 22px",
                  fontSize: "13px",
                  fontFamily: "'DM Mono', monospace",
                  fontWeight: "500",
                  letterSpacing: "0.02em",
                  transition: "opacity 0.2s",
                  opacity: !code.trim() ? 0.4 : 1,
                  animation: loading ? "pulse 1.2s ease infinite" : "none",
                }}
              >
                {loading ? "reviewing..." : "→ Review Code"}
              </button>
            </div>
          </div>

          {/* Right: Results */}
          <div style={{ display: "flex", flexDirection: "column", overflowY: "auto" }}>
            {!issues && !loading && (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px", color: "#333", padding: "40px" }}>
                <div style={{ fontSize: "40px", opacity: 0.3 }}>🔍</div>
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: "18px", color: "#3a3a3a" }}>No review yet</div>
                <div style={{ fontSize: "12px", color: "#2a2a2a", textAlign: "center", lineHeight: "1.6" }}>Paste your Python code on the left<br />and click Review Code</div>
              </div>
            )}

            {loading && (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px", padding: "40px" }}>
                <div style={{ fontSize: "32px", animation: "pulse 1s ease infinite" }}>⚡</div>
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: "16px", color: "#555" }}>Analyzing your code...</div>
                <div style={{ fontSize: "11px", color: "#333" }}>checking security, logic, style & more</div>
              </div>
            )}

            {error && (
              <div style={{ margin: "20px", padding: "14px", background: "rgba(255,59,59,0.08)", border: "1px solid rgba(255,59,59,0.2)", borderRadius: "8px", color: "#ff3b3b", fontSize: "13px" }}>
                {error}
              </div>
            )}

            {issues && (
              <>
                {/* Summary bar */}
                <div style={{ padding: "18px 22px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
                    <ScoreMeter score={score} />
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "flex-end" }}>
                      {Object.entries(counts).filter(([, c]) => c > 0).map(([s, c]) => (
                        <div key={s} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: SEVERITY_CONFIG[s].color, display: "inline-block" }} />
                          <span style={{ fontSize: "11px", color: "#888" }}>{c} {s}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {summary && (
                    <div style={{ fontSize: "12.5px", color: "#777", lineHeight: "1.6", fontStyle: "italic", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "12px" }}>
                      {summary}
                    </div>
                  )}
                </div>

                {/* Filter tabs */}
                <div style={{ padding: "12px 22px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {["all", ...Object.keys(SEVERITY_CONFIG).filter((s) => counts[s] > 0)].map((f) => {
                    const cfg = f === "all" ? { color: "#888", bg: "rgba(255,255,255,0.05)", border: "rgba(255,255,255,0.1)" } : SEVERITY_CONFIG[f];
                    const isActive = activeFilter === f;
                    return (
                      <button
                        key={f}
                        onClick={() => setActiveFilter(f)}
                        style={{
                          background: isActive ? cfg.bg : "transparent",
                          border: `1px solid ${isActive ? cfg.border : "rgba(255,255,255,0.07)"}`,
                          borderRadius: "5px",
                          color: isActive ? cfg.color : "#555",
                          cursor: "pointer",
                          padding: "4px 12px",
                          fontSize: "11px",
                          fontFamily: "'DM Mono', monospace",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          transition: "all 0.15s",
                        }}
                      >
                        {f === "all" ? `all (${issues.length})` : `${f} (${counts[f]})`}
                      </button>
                    );
                  })}
                </div>

                {/* Issues list */}
                <div style={{ padding: "16px 22px", overflowY: "auto" }}>
                  {filtered.length === 0 ? (
                    <div style={{ textAlign: "center", color: "#333", padding: "30px", fontFamily: "'Fraunces', serif", fontSize: "15px" }}>
                      No issues in this category 🎉
                    </div>
                  ) : (
                    filtered.map((issue, i) => (
                      <IssueCard key={i} issue={issue} index={i} />
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

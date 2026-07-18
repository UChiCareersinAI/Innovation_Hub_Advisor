import { useState, useEffect, useRef } from "react";

// ─── CONFIG ────────────────────────────────────────────────────────────────
const SPREADSHEET_ID = "1gd9Ybyq19BwMtoxgY2pMCy2ogVD9ZrFNcu5Tig8jJbo";
const SHEET_NAME = "Innovation Hub";

// PASTE YOUR SERVICE ACCOUNT PRIVATE KEY HERE (keep the \n line breaks)
const SERVICE_ACCOUNT_EMAIL = "innovation-hub-reader@careers-in-ai-testing-123.iam.gserviceaccount.com";
const PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDBnVxl+zSxVU4e\nqGb1T2oGLPR+4U228tfiDXvydMBDIPLRmaD/ELEsziSHYMH5VPzaOnOjYIdTLFaA\n9bPAXmOkoWax7l5nCqfKpd7Oxsc9yqgVvk90tMfjXrg2beuxRWiz7Bee81kKDL3H\nriOpRLMGBa4rpBY/UT5WE1qszb4e4ZfIFdC2ZcGynSQNBhEpNio+rL7fOBkFH+dA\ndczLYuRCA1VvKoH/XVtT2bJ7ZHVei92tH1rzs0L/w8MAOCOFkeipUu/lv640rP0+\nM7TDLt01MZnEwdL9dj42PjagNaZVntVTpXc6igKf+q29ViSOJBHV/+so+4sQYGYm\nAqnlCoP1AgMBAAECggEAHXmQTHIutmRvLRmj+uppEKGdYwd3pkdX+DDnUqTVdCK6\n9I+3w7zNzC1hwD5JqWR3zd0iJ5gVYeMZFC7Te5CjCLgNgz7vni4wFxijT8VRJaYJ\naq37OKAg4gtUbezT+bvAUcu6WNdhEbeY2KI5CZbMzjjlJ/2l6WO74qy1nCMCM38O\nq18B1z+aX+iifkl6dj6cXXTskBA6g+RnRflOWGwyQNLv1zXdZZm1eJzvwVbcATA5\n0QXcshb1eiFSL7T7IPsTl56JwYXIbPH745HH63cAJbo+TutJdYzzICuCSXq7K+bE\nOjTBuMtJGbzjsKwcolMwQyZkeVMu1miAF/uldoZnrQKBgQDgq6urokGeV5XMH3jv\nNfcDGC0FteOm5c8TBHkqDL0QSmkhf2IWShBCI7mgQ+XkrTrAwcMtAj1UUlDoBdZd\nnqo53c/jWgAK28HnMGsxbFSkHk5O1fps70bwzZ0KYsM2mYQqVQ019JhRVx3atJ2a\nspiJLAfiHCqWuiW9xwKeOnDKFwKBgQDcnQ0z03gUE0ksl4RwzrTVz0A3eyltKsMB\n5c8bwnUB2FGy+H0lss89NHoS01TcSGq4dTv1fp6qECNuv2M21ApVWv5obeSw5vtV\nIpnnWg/Vqu4r1G/+jRVyRxOz82uYLs0zOAuyXTDktGZYf3NAVVPJkpOkKoM0FZXc\n1NVCs1qF0wKBgEmFI+pIcHymYKipa+OrnyduE92YheSpszef8R5niL75+qkxjCGL\nHwLluerODT7lySImxf3Gi9c6EKu8rUd5km7ZPRxC6VykSTGkUI+dyZzjJfD6aLaZ\nHnfScR9i7krBtdQ8fNQ5NFb50RUuoZxr8SqCNBoz6WPlilAt/ZdVvG8FAoGBAJ30\nSH6h2yisgkjOF0JZjXpEUFso8Ik8A7F5I+dhPDtc8WntplT2iJDu4LRX4TtzEg4N\nyidESD/FHElv+I5KFTf11Y9Zl1LdnnffNUhC4HGAV9TD3ofn5cITh9Tg5VlpsPwK\nFb3YIWiujVSxtAgMz9fT/aed1KDXD5y0Ohjup1KHAoGALrFktP6pyIyFCSgJ2i8E\n5VrzrNVYJSJwFlWbZdYxy8ll0C8QKkd1OpWJzz5EqWN/tu0KvS6rGdl6oBX/G54n\npBXi6qifWsl+CnlACjOm9yMxkBr5WDB1rR6CummTNkPf2H4EHIYYe/ykbUS2BGG0\nH7GimB5/Hc0Ro9OjI7rxwOE=\n";

// ─── GOOGLE SHEETS JWT AUTH ─────────────────────────────────────────────────
async function getAccessToken() {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const payload = {
    iss: SERVICE_ACCOUNT_EMAIL,
    scope: "https://www.googleapis.com/auth/spreadsheets.readonly",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
  };

  const encode = (obj) =>
    btoa(JSON.stringify(obj)).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");

  const headerB64 = encode(header);
  const payloadB64 = encode(payload);
  const signingInput = `${headerB64}.${payloadB64}`;

  // Import private key
  const pemContents = PRIVATE_KEY.replace(/-----BEGIN PRIVATE KEY-----/, "")
    .replace(/-----END PRIVATE KEY-----/, "")
    .replace(/\n/g, "");
  const binaryDer = Uint8Array.from(atob(pemContents), (c) => c.charCodeAt(0));

  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8",
    binaryDer.buffer,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    cryptoKey,
    new TextEncoder().encode(signingInput)
  );

  const signatureB64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");

  const jwt = `${signingInput}.${signatureB64}`;

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`,
  });

  const tokenData = await tokenRes.json();
  return tokenData.access_token;
}

async function fetchSheetData() {
  const token = await getAccessToken();
  const range = encodeURIComponent(`${SHEET_NAME}!A:T`);
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const data = await res.json();
  return data.values || [];
}

function parseRows(values) {
  if (!values || values.length < 2) return [];
  const headers = values[1]; // Row 2 is real headers (row 1 is descriptions)
  return values.slice(2).map((row) => {
    const obj = {};
    headers.forEach((h, i) => { obj[h] = row[i] || ""; });
    return obj;
  });
}

function isExpired(row) {
  const removal = row["Removal Date [Internal]"];
  if (!removal) return false;
  const d = new Date(removal);
  return !isNaN(d) && d < new Date();
}

function hasFlag(row) {
  const msg = row["Failure Message"] || "";
  return msg.includes("[FAIL") || msg.includes("[WARN");
}

function flagSeverity(row) {
  const msg = row["Failure Message"] || "";
  if (msg.includes("[FAIL")) return "fail";
  if (msg.includes("[WARN")) return "warn";
  return null;
}

// ─── CLAUDE API ─────────────────────────────────────────────────────────────
async function callClaude(systemPrompt, userMessage) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    }),
  });
  const data = await res.json();
  return data.content?.[0]?.text || "No response.";
}

// ─── NEWSLETTER FORMATTER ────────────────────────────────────────────────────
function formatNewsletterRow(row) {
  const type = row["Resource Type [External Search]"] || "";
  const title = row["Title"] || "Untitled";
  const url = row["URL"] || "";
  const employer = row["Employer/Host"] || "";
  const location = row["Location"] || "";
  const date = row["Date"] || "Rolling";
  const oneliner = row["One-liner"] || "";
  const flag = flagSeverity(row);

  const titleLink = url ? `**[${title}](${url})**` : `**${title}**`;

  let formatted = "";
  if (["Full Time Role", "Internship- Summer", "Internship- Academic Year"].includes(type)) {
    formatted = `**${employer}** | ${titleLink} | ${location} | ${date}`;
  } else if (type === "Event" || type === "Program") {
    formatted = `${titleLink} | ${employer || ""} | ${date}\n${oneliner}`;
  } else if (type === "Cool Tools & Resources" || type === "Chatbot Prompt") {
    formatted = `${titleLink}\n${oneliner}`;
  } else {
    formatted = `${titleLink} | ${employer} | ${date}\n${oneliner}`;
  }

  return { formatted, flag, row };
}

function groupByType(rows) {
  const groups = {
    "Full Time Role": [],
    "Internship- Summer": [],
    "Internship- Academic Year": [],
    "Event": [],
    "Program": [],
    "Cool Tools & Resources": [],
    "Chatbot Prompt": [],
    "Other": [],
  };
  rows.forEach((row) => {
    const type = row["Resource Type [External Search]"] || "Other";
    if (groups[type]) groups[type].push(row);
    else groups["Other"].push(row);
  });
  return groups;
}

// ─── STYLES ─────────────────────────────────────────────────────────────────
const styles = {
  app: {
    minHeight: "100vh",
    background: "#0f1117",
    color: "#e8e6e0",
    fontFamily: "'Inter', -apple-system, sans-serif",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    borderBottom: "1px solid #1e2330",
    padding: "18px 32px",
    display: "flex",
    alignItems: "center",
    gap: "16px",
    background: "#0f1117",
  },
  logo: {
    width: "32px",
    height: "32px",
    background: "linear-gradient(135deg, #c84b31, #e8623a)",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    fontWeight: "700",
    color: "#fff",
    flexShrink: 0,
  },
  headerTitle: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#e8e6e0",
    letterSpacing: "-0.01em",
  },
  headerSub: {
    fontSize: "12px",
    color: "#5a6070",
    marginTop: "1px",
  },
  modeBar: {
    display: "flex",
    gap: "0",
    padding: "0 32px",
    borderBottom: "1px solid #1e2330",
    background: "#0f1117",
  },
  modeBtn: (active) => ({
    padding: "12px 20px",
    fontSize: "13px",
    fontWeight: active ? "600" : "400",
    color: active ? "#e8e6e0" : "#5a6070",
    background: "none",
    border: "none",
    borderBottom: active ? "2px solid #c84b31" : "2px solid transparent",
    cursor: "pointer",
    transition: "all 0.15s",
    marginBottom: "-1px",
  }),
  main: {
    flex: 1,
    display: "flex",
    gap: "0",
    overflow: "hidden",
    height: "calc(100vh - 97px)",
  },
  sidebar: {
    width: "280px",
    borderRight: "1px solid #1e2330",
    padding: "20px",
    overflowY: "auto",
    flexShrink: 0,
    background: "#0d0f14",
  },
  sidebarLabel: {
    fontSize: "10px",
    fontWeight: "700",
    color: "#5a6070",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    marginBottom: "10px",
    marginTop: "20px",
  },
  filterGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    marginBottom: "8px",
  },
  filterChip: (active) => ({
    padding: "6px 10px",
    fontSize: "12px",
    borderRadius: "6px",
    border: active ? "1px solid #c84b31" : "1px solid #1e2330",
    background: active ? "rgba(200,75,49,0.12)" : "transparent",
    color: active ? "#e8623a" : "#8a8f9e",
    cursor: "pointer",
    textAlign: "left",
    transition: "all 0.12s",
  }),
  content: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  outputArea: {
    flex: 1,
    overflowY: "auto",
    padding: "24px 32px",
  },
  chatInput: {
    borderTop: "1px solid #1e2330",
    padding: "16px 24px",
    display: "flex",
    gap: "12px",
    alignItems: "flex-end",
    background: "#0d0f14",
  },
  textarea: {
    flex: 1,
    background: "#1a1d26",
    border: "1px solid #1e2330",
    borderRadius: "10px",
    color: "#e8e6e0",
    fontSize: "13px",
    padding: "12px 14px",
    resize: "none",
    outline: "none",
    fontFamily: "inherit",
    lineHeight: "1.5",
    minHeight: "44px",
    maxHeight: "120px",
  },
  sendBtn: (loading) => ({
    padding: "10px 18px",
    background: loading ? "#2a2d3a" : "#c84b31",
    color: loading ? "#5a6070" : "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: loading ? "not-allowed" : "pointer",
    transition: "all 0.15s",
    flexShrink: 0,
  }),
  resourceCard: (flag) => ({
    background: flag === "fail" ? "rgba(200,75,49,0.06)" : flag === "warn" ? "rgba(230,180,50,0.06)" : "#13161f",
    border: `1px solid ${flag === "fail" ? "rgba(200,75,49,0.3)" : flag === "warn" ? "rgba(230,180,50,0.25)" : "#1e2330"}`,
    borderRadius: "10px",
    padding: "14px 16px",
    marginBottom: "10px",
  }),
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "6px",
  },
  cardTitle: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#e8e6e0",
  },
  flagBadge: (flag) => ({
    fontSize: "10px",
    fontWeight: "700",
    padding: "2px 7px",
    borderRadius: "4px",
    background: flag === "fail" ? "rgba(200,75,49,0.2)" : "rgba(230,180,50,0.2)",
    color: flag === "fail" ? "#e8623a" : "#e6b432",
    border: flag === "fail" ? "1px solid rgba(200,75,49,0.4)" : "1px solid rgba(230,180,50,0.3)",
    flexShrink: 0,
    marginLeft: "8px",
  }),
  cardMeta: {
    fontSize: "12px",
    color: "#5a6070",
    marginBottom: "4px",
  },
  cardOneliner: {
    fontSize: "12px",
    color: "#8a8f9e",
    lineHeight: "1.5",
  },
  cardFlag: {
    fontSize: "11px",
    color: "#e6b432",
    marginTop: "8px",
    padding: "6px 8px",
    background: "rgba(230,180,50,0.08)",
    borderRadius: "6px",
    fontFamily: "monospace",
  },
  sectionHeader: {
    fontSize: "11px",
    fontWeight: "700",
    color: "#5a6070",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    marginTop: "24px",
    marginBottom: "12px",
    paddingBottom: "8px",
    borderBottom: "1px solid #1e2330",
  },
  emptyState: {
    textAlign: "center",
    padding: "60px 32px",
    color: "#3a3f50",
  },
  emptyIcon: {
    fontSize: "32px",
    marginBottom: "12px",
  },
  emptyTitle: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#5a6070",
    marginBottom: "6px",
  },
  emptyDesc: {
    fontSize: "13px",
    color: "#3a3f50",
    lineHeight: "1.6",
  },
  copyBtn: {
    padding: "8px 14px",
    background: "#1a1d26",
    border: "1px solid #1e2330",
    borderRadius: "6px",
    color: "#8a8f9e",
    fontSize: "12px",
    cursor: "pointer",
    marginBottom: "20px",
  },
  statusBar: {
    padding: "8px 32px",
    fontSize: "11px",
    color: "#3a3f50",
    borderBottom: "1px solid #1e2330",
    background: "#0d0f14",
    display: "flex",
    gap: "16px",
    alignItems: "center",
  },
  dot: (color) => ({
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: color,
    display: "inline-block",
    marginRight: "5px",
  }),
  chatMessage: (role) => ({
    marginBottom: "16px",
    display: "flex",
    flexDirection: "column",
    alignItems: role === "user" ? "flex-end" : "flex-start",
  }),
  chatBubble: (role) => ({
    maxWidth: "80%",
    padding: "12px 16px",
    borderRadius: role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
    background: role === "user" ? "#c84b31" : "#1a1d26",
    color: role === "user" ? "#fff" : "#e8e6e0",
    fontSize: "13px",
    lineHeight: "1.6",
    whiteSpace: "pre-wrap",
    border: role === "assistant" ? "1px solid #1e2330" : "none",
  }),
};

// ─── MAIN APP ────────────────────────────────────────────────────────────────
export default function AdvisorTool() {
  const [mode, setMode] = useState("newsletter");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [filters, setFilters] = useState({ industry: [], type: [] });
  const [newsletterOutput, setNewsletterOutput] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const chatEndRef = useRef(null);

  // Load sheet on mount
  useEffect(() => {
    (async () => {
      try {
        const values = await fetchSheetData();
        const parsed = parseRows(values).filter((r) => !isExpired(r));
        setRows(parsed);
      } catch (e) {
        setLoadError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Build newsletter output when filters change (newsletter mode)
  useEffect(() => {
    if (mode !== "newsletter") return;
    let filtered = rows.filter((r) => r["Newsletter this week?"] === "TRUE");
    if (filters.industry.length > 0) {
      filtered = filtered.filter((r) =>
        filters.industry.some((ind) => (r["Industry"] || "").includes(ind))
      );
    }
    if (filters.type.length > 0) {
      filtered = filtered.filter((r) =>
        filters.type.includes(r["Resource Type [External Search]"])
      );
    }
    setNewsletterOutput(filtered.map(formatNewsletterRow));
  }, [rows, filters, mode]);

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const toggleFilter = (bucket, val) => {
    setFilters((prev) => {
      const current = prev[bucket];
      return {
        ...prev,
        [bucket]: current.includes(val) ? current.filter((v) => v !== val) : [...current, val],
      };
    });
  };

  const industries = [...new Set(
    rows.flatMap((r) => (r["Industry"] || "").split(",").map((s) => s.trim()).filter(Boolean))
  )].sort();

  const resourceTypes = [...new Set(rows.map((r) => r["Resource Type [External Search]"]).filter(Boolean))].sort();

  const handleChatSend = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg = chatInput.trim();
    setChatInput("");
    setChatMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setChatLoading(true);

    try {
      // Build resource context for Claude
      const liveRows = rows.filter((r) => !isExpired(r));
      const resourceContext = liveRows.map((r) => ({
        type: r["Resource Type [External Search]"],
        title: r["Title"],
        employer: r["Employer/Host"],
        industry: r["Industry"],
        location: r["Location"],
        date: r["Date"],
        oneliner: r["One-liner"],
        url: r["URL"],
        roleType: r["Role Type"],
        roleTag: r["Role Tag"],
        flag: flagSeverity(r) || "none",
        flagMsg: r["Failure Message"] || "",
      }));

      const systemPrompt = `You are an advisor tool for UChicago Career Advancement staff. You help advisors find relevant career resources for students from the Innovation Hub database.

When given advising session notes, identify the most relevant resources for that student's situation. Return a bulleted list formatted for an advising email, grouped by resource type. 

For each resource:
- Format: • [Title](URL) | Employer | Location | Deadline
- If the resource has a flag (FAIL or WARN), add ⚠️ before it and note the flag message in parentheses after the entry
- Only include resources that are genuinely relevant to the student's situation
- Group by: Internships, Full-Time Roles, Events & Programs, Tools & Resources

Be concise. The output should be paste-ready for an advising follow-up email.

Here is the current Innovation Hub database (${liveRows.length} live resources):
${JSON.stringify(resourceContext, null, 2)}`;

      const reply = await callClaude(systemPrompt, userMsg);
      setChatMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (e) {
      setChatMessages((prev) => [...prev, { role: "assistant", content: `Error: ${e.message}` }]);
    } finally {
      setChatLoading(false);
    }
  };

  const copyNewsletter = () => {
    const text = newsletterOutput
      .map(({ formatted, flag, row }) => {
        let out = formatted;
        if (flag) out = `[${flag.toUpperCase()}] ${out}\n  ⚠ ${row["Failure Message"]}`;
        return out;
      })
      .join("\n\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const groups = groupByType(newsletterOutput.map((o) => o.row));
  const sectionLabels = {
    "Full Time Role": "Full-Time Roles",
    "Internship- Summer": "Summer Internships",
    "Internship- Academic Year": "Academic Year Internships",
    "Event": "Events",
    "Program": "Programs",
    "Cool Tools & Resources": "Tools & Resources",
    "Chatbot Prompt": "Chatbot Prompts",
    "Other": "Other",
  };

  if (loading) {
    return (
      <div style={{ ...styles.app, alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", color: "#5a6070" }}>
          <div style={{ fontSize: "24px", marginBottom: "12px" }}>⟳</div>
          <div style={{ fontSize: "14px" }}>Loading Innovation Hub…</div>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div style={{ ...styles.app, alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", color: "#e8623a", maxWidth: "400px" }}>
          <div style={{ fontSize: "24px", marginBottom: "12px" }}>⚠</div>
          <div style={{ fontSize: "14px", marginBottom: "8px", fontWeight: "600" }}>Could not load sheet</div>
          <div style={{ fontSize: "12px", color: "#5a6070" }}>{loadError}</div>
        </div>
      </div>
    );
  }

  const flagCount = newsletterOutput.filter((o) => o.flag).length;

  return (
    <div style={styles.app}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.logo}>U</div>
        <div>
          <div style={styles.headerTitle}>Innovation Hub — Advisor Tool</div>
          <div style={styles.headerSub}>Careers in Artificial Intelligence · UChicago Career Advancement</div>
        </div>
      </div>

      {/* Mode tabs */}
      <div style={styles.modeBar}>
        <button style={styles.modeBtn(mode === "newsletter")} onClick={() => setMode("newsletter")}>
          Newsletter
        </button>
        <button style={styles.modeBtn(mode === "advising")} onClick={() => setMode("advising")}>
          Advising Email
        </button>
      </div>

      {/* Status bar */}
      <div style={styles.statusBar}>
        <span><span style={styles.dot("#2ecc71")} />{rows.length} live resources</span>
        {mode === "newsletter" && (
          <>
            <span><span style={styles.dot("#c84b31")} />{newsletterOutput.length} in this issue</span>
            {flagCount > 0 && (
              <span><span style={styles.dot("#e6b432")} />{flagCount} flagged — review before sending</span>
            )}
          </>
        )}
      </div>

      <div style={styles.main}>
        {/* Sidebar */}
        <div style={styles.sidebar}>
          {mode === "newsletter" && (
            <>
              <div style={styles.sidebarLabel}>Filter by Type</div>
              <div style={styles.filterGroup}>
                {resourceTypes.map((t) => (
                  <button
                    key={t}
                    style={styles.filterChip(filters.type.includes(t))}
                    onClick={() => toggleFilter("type", t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <div style={styles.sidebarLabel}>Filter by Industry</div>
              <div style={styles.filterGroup}>
                {industries.map((ind) => (
                  <button
                    key={ind}
                    style={styles.filterChip(filters.industry.includes(ind))}
                    onClick={() => toggleFilter("industry", ind)}
                  >
                    {ind}
                  </button>
                ))}
              </div>
            </>
          )}

          {mode === "advising" && (
            <>
              <div style={styles.sidebarLabel}>How to use</div>
              <div style={{ fontSize: "12px", color: "#5a6070", lineHeight: "1.7" }}>
                Paste your advising session notes into the chat. The tool will identify relevant resources from the live database and format them for a follow-up email.
                <br /><br />
                <span style={{ color: "#8a8f9e" }}>Example: "Student is a junior interested in ML engineering, targeting summer internships, has Python experience, open to remote."</span>
              </div>
              <div style={{ ...styles.sidebarLabel, marginTop: "24px" }}>Flags</div>
              <div style={{ fontSize: "12px", color: "#5a6070", lineHeight: "1.7" }}>
                <span style={{ color: "#e8623a" }}>■ FAIL</span> — required field missing or URL dead. Review before sharing with student.
                <br /><br />
                <span style={{ color: "#e6b432" }}>■ WARN</span> — data extracted but low confidence. Spot-check before sharing.
              </div>
            </>
          )}
        </div>

        {/* Main content */}
        <div style={styles.content}>
          {mode === "newsletter" && (
            <div style={styles.outputArea}>
              {newsletterOutput.length === 0 ? (
                <div style={styles.emptyState}>
                  <div style={styles.emptyIcon}>◻</div>
                  <div style={styles.emptyTitle}>No resources match your filters</div>
                  <div style={styles.emptyDesc}>Adjust the filters in the sidebar, or check that "Newsletter this week?" is marked TRUE in the sheet.</div>
                </div>
              ) : (
                <>
                  <button style={styles.copyBtn} onClick={copyNewsletter}>
                    {copied ? "✓ Copied to clipboard" : "Copy all for Mailchimp"}
                  </button>
                  {Object.entries(sectionLabels).map(([key, label]) => {
                    const sectionRows = newsletterOutput.filter(
                      (o) => o.row["Resource Type [External Search]"] === key
                    );
                    if (sectionRows.length === 0) return null;
                    return (
                      <div key={key}>
                        <div style={styles.sectionHeader}>{label} ({sectionRows.length})</div>
                        {sectionRows.map((item, i) => {
                          const { row, flag } = item;
                          return (
                            <div key={i} style={styles.resourceCard(flag)}>
                              <div style={styles.cardHeader}>
                                <div style={styles.cardTitle}>
                                  {row["URL"] ? (
                                    <a href={row["URL"]} target="_blank" rel="noreferrer" style={{ color: "#e8e6e0", textDecoration: "none" }}>
                                      {row["Title"] || "Untitled"}
                                    </a>
                                  ) : (row["Title"] || "Untitled")}
                                </div>
                                {flag && (
                                  <span style={styles.flagBadge(flag)}>
                                    {flag.toUpperCase()}
                                  </span>
                                )}
                              </div>
                              <div style={styles.cardMeta}>
                                {[row["Employer/Host"], row["Location"], row["Date"]].filter(Boolean).join(" · ")}
                              </div>
                              <div style={styles.cardOneliner}>{row["One-liner"]}</div>
                              {flag && row["Failure Message"] && (
                                <div style={styles.cardFlag}>{row["Failure Message"]}</div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          )}

          {mode === "advising" && (
            <>
              <div style={styles.outputArea}>
                {chatMessages.length === 0 ? (
                  <div style={styles.emptyState}>
                    <div style={styles.emptyIcon}>✉</div>
                    <div style={styles.emptyTitle}>Paste your advising notes below</div>
                    <div style={styles.emptyDesc}>The tool will match relevant resources from the database and format them for a follow-up email.</div>
                  </div>
                ) : (
                  chatMessages.map((msg, i) => (
                    <div key={i} style={styles.chatMessage(msg.role)}>
                      <div style={styles.chatBubble(msg.role)}>{msg.content}</div>
                    </div>
                  ))
                )}
                {chatLoading && (
                  <div style={styles.chatMessage("assistant")}>
                    <div style={{ ...styles.chatBubble("assistant"), color: "#5a6070" }}>Searching database…</div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
              <div style={styles.chatInput}>
                <textarea
                  style={styles.textarea}
                  placeholder="Paste advising session notes here…"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleChatSend(); }
                  }}
                  rows={2}
                />
                <button style={styles.sendBtn(chatLoading)} onClick={handleChatSend} disabled={chatLoading}>
                  {chatLoading ? "…" : "Send"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

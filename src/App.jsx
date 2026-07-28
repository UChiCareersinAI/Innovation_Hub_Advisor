import { useState, useEffect, useRef, useMemo } from "react";

// ─── CONFIG ────────────────────────────────────────────────────────────────
const SPREADSHEET_ID = "1gd9Ybyq19BwMtoxgY2pMCy2ogVD9ZrFNcu5Tig8jJbo";
const SHEET_NAME = "Innovation Hub";

// PASTE YOUR SERVICE ACCOUNT PRIVATE KEY HERE (keep the \n line breaks)
const SERVICE_ACCOUNT_EMAIL = "innovation-hub-reader@careers-in-ai-testing-123.iam.gserviceaccount.com";
const LINK_DROPPER_URL = "https://script.google.com/macros/s/AKfycbwclZ54wqPLcGvztf18EgGl-Xk3r277bkwCHg-GA5YxP9HcFhUgMkPdF3Rs-V1AeCPUaA/exec";
const PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC1RDD5cqO1XeRb\nQMU3cpgiPVBVYkKsIB6Esc10m50+rcpRD3fI3lh02UIyAZm7hLdV0TTt6vlC6vPG\n1MW4k90z3Sb2pO/Sc+ZfkaC9R4wqWWoIiz2FzVmNaUyY7x6hGMeUC8dcpBgpYI5H\n1t8lfRJhrP5b93EjhCExub9q9RaN9/HuuFK4LVAkiOCNQscZfGWU8osfXoD3Ibmo\nxVR+PrdP4oa9dzYmr0KZCgFgM/gWBP+ktgXQDmKTyWew9PD1tjcGpQk6h0kP3xBx\nm6j4gBH89bI0jZfeFOFa7rnl/h8iMQW1K3NqfYwdfi7IPskvp5dzGF1GGGO2CdVJ\nSAibV+nRAgMBAAECggEAAYqkBrwQCruNdONMsL13OsvQvFrTWF9xI6sM2p1KmZ53\nYEf7FR9jIH0a74ik/hPJbh04d7PvekoRSDdV0OLPidimCMkTbyO8PDigJa9HW10Y\nLkdLtDY1o7LB04di6EceW+Vw1NUCWFg9ZNyjGFCAwh7wiRemMSbR6YhejuZI5+yg\nf+qPh4KTOthts0PoC0v+fNbpTk4wlwNPFcnLrGhM4m17bYew9Jn8iP5faGMCklGo\ny+jalD0ZNg7N82Q9G7ZLZJkbWWFzHp9H+xGl9q2pHSxUZSK3EG7QlX8fj/lDy855\n5iW8DjzWj1mSBZqpH7lXD49kV6WRp4szWuhW2bCi4QKBgQDX6+MWOb9ffI1erjf4\njlH2RQ8y/Lv9vzEOo78XYnAix9GTsmUffzgllfFl3mCNwJtWlB89BnsyTeg6lhnL\nG8an7W07o/C0x7UnGjeL41kVka8fyBYMNMcGi/6d9F63J5uG86NSMkEXpyYPAA9F\nc+KfOTYm4dCtGvzxLmAUO3wcYQKBgQDW6ZJdQSFTVvch5pJmuNmPjMsdoF05OU6e\nl7lyHSYqU1NblrlBoM2fGjzyshnczNyswWc9t3Svuj3DGGpArT7KQXSvsNehGZ4j\nKzf3Yj2dz1h9+yhO9Fokpyto9We+X5p7XBFGgPYv17TgzfyZLFipO1mrR1YXVcBH\nspdNoWJDcQKBgEH2URB4IcuU7EcxZ+3p5IYcgNEtvmx9XQpA4d7N9r3ZV2AMjrH5\nlnh8/xsEvXBwl8PySjzFXxt2C2zicAzJdn3UnZsrsRw5KlFAxBlbIdrh/6Lw6DNg\naDDK0cUFY24Gjo/CnHE+4v3L1WeduAyao2/K9Y0ZTTuk1AMGDNoBdh/hAoGALOmj\nLNnvnPsPqoYFEnKPBPDngcmBsfPH+ly65J4y26WORhW5oX15e0aAdjfCL+KgO3ov\nmTY9rHu/bIYtrlaGSL5lJFJQvdocsjzV9V0Sg2hRlgJm6hkmvYIyED048RAJuL4E\n3jcVO+pYYqKpp1kdLkC4/JJr63SAOnuYIyEW6AECgYAlCnU9Z5EdJBHsr42JHO0D\nws0mb1SKish1KDMs2EZdo4jjck7BzAMJh3DLw5LgjItxcocUgKCXDs8IFzETsOxg\nsP6riMZOSPK7HovVXJF5cEUjs5WCF9kh56lvcPJpGq+66+SvawjldzXmtf5OJJ6v\nncIG6OszaPFfjP9fTpe9Xw==\n-----END PRIVATE KEY-----\n";

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
  const headers = values[0]; // Row 2 is real headers (row 1 is descriptions)
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
    background: "#FFFFFF",
    color: "#000000",
    fontFamily: "'Gotham', 'Gotham SSm', 'Helvetica Neue', Helvetica, Arial, sans-serif",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    borderBottom: "1px solid #1e2330",
    padding: "18px 32px",
    display: "flex",
    alignItems: "center",
    gap: "16px",
    background: "#FFFFFF",
  },
  logo: {
    width: "32px",
    height: "32px",
    background: "#800000",
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
    color: "#000000",
    letterSpacing: "-0.01em",
  },
  headerSub: {
    fontSize: "12px",
    color: "#737373",
    marginTop: "1px",
  },
  modeBar: {
    display: "flex",
    gap: "0",
    padding: "0 32px",
    borderBottom: "1px solid #1e2330",
    background: "#FFFFFF",
  },
  modeBtn: (active) => ({
    padding: "12px 20px",
    fontSize: "13px",
    fontWeight: active ? "600" : "400",
    color: active ? "#000000" : "#737373",
    background: "none",
    border: "none",
    borderBottom: active ? "2px solid #800000" : "2px solid transparent",
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
    background: "#F5F5F5",
  },
  sidebarLabel: {
    fontSize: "10px",
    fontWeight: "700",
    color: "#737373",
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
    color: active ? "#800000" : "#737373",
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
    background: "#F5F5F5",
  },
  textarea: {
    flex: 1,
    background: "#F9F9F9",
    border: "1px solid #1e2330",
    borderRadius: "10px",
    color: "#000000",
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
    background: loading ? "#D9D9D9" : "#800000",
    color: loading ? "#737373" : "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: loading ? "not-allowed" : "pointer",
    transition: "all 0.15s",
    flexShrink: 0,
  }),
  resourceCard: (flag) => ({
    background: flag === "fail" ? "rgba(128,0,0,0.04)" : flag === "warn" ? "rgba(230,180,50,0.06)" : "#FFFFFF",
    border: `1px solid ${flag === "fail" ? "rgba(128,0,0,0.3)" : flag === "warn" ? "rgba(230,180,50,0.25)" : "#D9D9D9"}`,
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
    color: "#000000",
  },
  flagBadge: (flag) => ({
    fontSize: "10px",
    fontWeight: "700",
    padding: "2px 7px",
    borderRadius: "4px",
    background: flag === "fail" ? "rgba(128,0,0,0.1)" : "rgba(230,180,50,0.2)",
    color: flag === "fail" ? "#800000" : "#e6b432",
    border: flag === "fail" ? "1px solid rgba(128,0,0,0.4)" : "1px solid rgba(230,180,50,0.3)",
    flexShrink: 0,
    marginLeft: "8px",
  }),
  cardMeta: {
    fontSize: "12px",
    color: "#737373",
    marginBottom: "4px",
  },
  cardOneliner: {
    fontSize: "12px",
    color: "#737373",
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
    color: "#737373",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    marginTop: "24px",
    marginBottom: "12px",
    paddingBottom: "8px",
    borderBottom: "1px solid #1e2330",
  },
  emptyState: {
    textAlign: "left",
    padding: "60px 32px",
    color: "#A6A6A6",
  },
  emptyIcon: {
    fontSize: "32px",
    marginBottom: "12px",
  },
  emptyTitle: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#737373",
    marginBottom: "6px",
  },
  emptyDesc: {
    fontSize: "13px",
    color: "#A6A6A6",
    lineHeight: "1.6",
  },
  copyBtn: {
    padding: "8px 14px",
    background: "#800000",
    border: "1px solid #800000",
    borderRadius: "6px",
    color: "#fff",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
    marginBottom: "20px",
  },
  clearBtn: {
    padding: "6px 12px",
    fontSize: "11px",
    fontWeight: "600",
    color: "#800000",
    background: "transparent",
    border: "1px solid #800000",
    borderRadius: "6px",
    cursor: "pointer",
    marginBottom: "8px",
  },
  statusBar: {
    padding: "8px 32px",
    fontSize: "11px",
    color: "#A6A6A6",
    borderBottom: "1px solid #1e2330",
    background: "#F5F5F5",
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
    background: role === "user" ? "#800000" : "#F9F9F9",
    color: role === "user" ? "#fff" : "#000000",
    fontSize: "13px",
    lineHeight: "1.6",
    whiteSpace: "pre-wrap",
    border: role === "assistant" ? "1px solid #1e2330" : "none",
  }),
};

// ─── MAIN APP ────────────────────────────────────────────────────────────────

function formatForOutput(row, format) {
  const type = row["Resource Type [External Search]"] || "";
  const title = row["Title"] || "Untitled";
  const url = row["URL"] || "";
  const employer = row["Employer/Host"] || "";
  const location = row["Location"] || "";
  const date = row["Date"] || "";
  const oneliner = row["One-liner"] || "";
  const roleTag = row["Role Tag"] || "";

  if (format === "html") {
    const link = (text, href) => href ? `<a href="${href}" style="color:#800000;text-decoration:none;">${text}</a>` : text;
    const bold = (text) => `<strong>${text}</strong>`;
    const italic = (text) => `<em>${text}</em>`;
    const center = (text) => `<p style="font-family:Helvetica,Arial,sans-serif;font-size:16px;line-height:1.4;text-align:center;margin:0 0 12px 0;padding:0 20px;">${text}</p>`;
    const line = (text) => `<p style="font-family:Helvetica,Arial,sans-serif;font-size:16px;line-height:1.4;margin:0 0 12px 0;padding:0 20px;">${text}</p>`;
    const pipe = " | ";

    const tagColors = {
      "Technical AI": { bg: "#E87722", text: "#fff" },
      "General AI": { bg: "#1a73e8", text: "#fff" },
      "Startup": { bg: "#E8B800", text: "#000" }
    };

    const renderTags = (tagStr) => {
      if (!tagStr) return "";
      return tagStr.split(",").map(t => t.trim()).filter(Boolean).map(t => {
        const colors = tagColors[t] || { bg: "#ccc", text: "#000" };
        return `<span style="display:inline-block;background:${colors.bg};color:${colors.text};font-size:11px;font-weight:700;padding:2px 8px;border-radius:12px;margin-left:6px;vertical-align:middle;">${t}</span>`;
      }).join("");
    };

    if (["Full Time Role", "Internship- Summer", "Internship- Academic Year"].includes(type)) {
      const parts = [bold(link(employer, url)), bold(title), location ? italic(location) : null, date].filter(Boolean);
      return line(parts.join(pipe) + renderTags(roleTag));
    }
    if (type === "Program") {
      const parts = [bold(link(employer, url)), bold(title), location || null, date].filter(Boolean);
      return line(parts.join(pipe) + renderTags(roleTag));
    }
    if (type === "Career Advisors") {
      const parts = [bold(title), employer, italic(link("Schedule a conversation!", url))].filter(Boolean);
      return line(parts.join(pipe));
    }
    if (type === "Cool Tools & Resources") {
      const parts = [bold(link(title, url)), oneliner].filter(Boolean);
      return line(parts.join(pipe));
    }
    if (type === "Event") {
      const parts = [bold(link(title, url)), location || null, date || null, oneliner || null].filter(Boolean);
      return center(parts.join(pipe));
    }
    if (type === "Chatbot Prompt") {
      return center(oneliner);
    }
    return null;
  }

  // Plain text
  const plainLink = (text, href) => href ? `${text} (${href})` : text;
  const tagLabels = roleTag ? ` [${roleTag}]` : "";

  if (["Full Time Role", "Internship- Summer", "Internship- Academic Year"].includes(type)) {
    const parts = [plainLink(employer.toUpperCase(), url), title.toUpperCase(), location, date].filter(Boolean);
    return parts.join(" | ") + tagLabels;
  }
  if (type === "Program") {
    const parts = [plainLink(employer.toUpperCase(), url), title.toUpperCase(), location, date].filter(Boolean);
    return parts.join(" | ") + tagLabels;
  }
  if (type === "Career Advisors") {
    const parts = [title.toUpperCase(), employer, `Schedule a conversation! (${url})`].filter(Boolean);
    return parts.join(" | ");
  }
  if (type === "Cool Tools & Resources") {
    const parts = [plainLink(title.toUpperCase(), url), oneliner].filter(Boolean);
    return parts.join(" | ");
  }
  if (type === "Event") {
    const parts = [plainLink(title.toUpperCase(), url), location, date, oneliner].filter(Boolean);
    return parts.join(" | ");
  }
  if (type === "Chatbot Prompt") {
    return oneliner;
  }
  return null;
}

export default function AdvisorTool() {

  // ── ADVISING HUB LOGIC ─────────────────────────────────────────────────────
  const SESSION_TYPES = [
    { value: "intro-first-year", label: "Intro Meeting — First Years",
      resourceDefaults: ["resume", "tools", "programs"],
      promptContext: "First introduction meeting. Focus action items on resume setup, booking follow-up, exploring career resources. Keep tone welcoming.",
      defaultActions: ["Download the UChicago resume template and fill in your information.", "Book a follow-up advising session on Handshake for later this quarter."] },
    { value: "career-exploration", label: "Career Exploration",
      resourceDefaults: ["programs", "tools"],
      promptContext: "Career exploration session. Focus on continuing to explore paths, attending events, reflecting on experiences.",
      defaultActions: ["Continue exploring different career paths — say yes to opportunities and reflect on what you enjoy.", "Book a follow-up session on Handshake to discuss networking strategies."] },
    { value: "resume-review", label: "Resume Review",
      resourceDefaults: ["resume"],
      promptContext: "Resume review session. Focus on specific edits discussed, sending updated resume back by end of next week.",
      defaultActions: ["Update your resume based on our feedback — each bullet should be 1.5-2 lines: strong action verb + description + results.", "Reply to this email with your updated resume (Word Doc or Google Drive share) by end of next week."] },
    { value: "job-search", label: "Job Search & Networking",
      resourceDefaults: ["summer-intern", "ay-intern", "full-time", "tools"],
      promptContext: "Job search and networking strategy session. Focus on job alerts, LinkedIn follow-ups, informational interviews.",
      defaultActions: ["Set up job alerts on LinkedIn and Handshake for your target companies.", "Set up at least 3 informational interviews with professionals at companies you're targeting.", "Keep me posted when you get any interview requests!"] },
    { value: "interview-prep", label: "Interview Prep",
      resourceDefaults: ["tools"],
      promptContext: "Interview prep session. Focus on preparing with resources shared, sending thank you note after interview.",
      defaultActions: ["Prepare for your interview using the resources and feedback from today.", "Send a thank you note to the interviewer within 2 hours of the interview if possible.", "Keep me posted on how it goes!"] },
    { value: "search-checkin", label: "Internship / Job Search Check-In",
      resourceDefaults: ["summer-intern", "ay-intern", "full-time"],
      promptContext: "Mid-search check-in. Focus on next concrete steps in the search.",
      defaultActions: ["Keep applying broadly — aim for at least 3 new applications this week.", "Book a follow-up session on Handshake to check in on progress."] },
    { value: "post-internship", label: "Post-Internship & Career Goals Check-In",
      resourceDefaults: ["full-time", "summer-intern", "resume"],
      promptContext: "Post-internship check-in. Focus on updating resume with summer experience, clarifying goals for next cycle.",
      defaultActions: ["Update your resume to reflect your summer experience.", "Book a follow-up session on Handshake once your resume is updated."] },
    { value: "portfolio-intro", label: "Careers In Portfolio Intro",
      resourceDefaults: ["resume", "tools", "programs", "summer-intern", "ay-intern"],
      promptContext: "General Careers In Portfolio intro (not industry-specific). Focus on resume setup, exploring career resources broadly.",
      defaultActions: ["Download the UChicago resume template and start building it out.", "Explore Career Advancement's Careers In pages for resources and upcoming events.", "Book a follow-up advising session on Handshake."] },
  ];

  const RESOURCE_TYPE_OPTIONS = [
    { label: "Resume / Cover Letter", value: "resume", types: ["Cool Tools & Resources", "Career Advisors"] },
    { label: "AY Internship", value: "ay-intern", types: ["Internship- Academic Year"] },
    { label: "Summer Internship", value: "summer-intern", types: ["Internship- Summer"] },
    { label: "Full Time Role", value: "full-time", types: ["Full Time Role"] },
    { label: "Programs & Events", value: "programs", types: ["Program", "Event"] },
    { label: "Tools & Resources", value: "tools", types: ["Cool Tools & Resources"] },
    { label: "Research", value: "research", types: ["Cool Tools & Resources", "Program"] },
  ];

  const getActiveTypes = (selectedOptions) => {
    if (!selectedOptions || selectedOptions.length === 0) return null;
    const types = new Set();
    selectedOptions.forEach(val => {
      const opt = RESOURCE_TYPE_OPTIONS.find(o => o.value === val);
      if (opt) opt.types.forEach(t => types.add(t));
    });
    return types;
  };

  const inferResourceTypes = (notes) => {
    const t = notes.toLowerCase();
    const chips = [];
    if (/intern|summer intern/.test(t)) chips.push("summer-intern");
    if (/academic year|fall intern|ay intern/.test(t)) chips.push("ay-intern");
    if (/full.?time|new grad|fte/.test(t)) chips.push("full-time");
    if (/resume|cover letter/.test(t)) chips.push("resume");
    if (/research|lab|grant/.test(t)) chips.push("research");
    if (/event|conference|network|trek/.test(t)) chips.push("programs");
    if (/tool|platform|resource|learn/.test(t)) chips.push("tools");
    return chips;
  };

  const scoreAdvisingResource = (resource, notes, locPref, coSizes, rolTyps) => {
    let score = 0;
    const text = notes.toLowerCase();
    const loc = locPref.toLowerCase();
    const rLoc = ((resource.oneliner || "") + " " + (resource.location || "")).toLowerCase();
    if (loc) {
      if (rLoc.includes("remote") || rLoc.includes("virtual")) score += 1;
      if (rLoc.includes(loc.split(",")[0].trim())) score += 2;
    }
    if (coSizes.includes("Startup") && (resource.roleTag || "").includes("Startup")) score += 3;
    if (coSizes.includes("Startup") && (resource.employerAITag || "") === "AI Native") score += 2;
    if (rolTyps.includes("Software / Engineering") && (resource.roleTag || "").includes("Technical AI")) score += 2;
    if (rolTyps.includes("Data Science / ML") && (resource.industry || "").includes("Artificial Intelligence")) score += 2;
    if (rolTyps.includes("Research") && /research|grant|lab/.test((resource.title || "").toLowerCase())) score += 3;
    if (rolTyps.includes("Finance / Quant") && (resource.industry || "").includes("Finance")) score += 2;
    const resourceText = ((resource.title || "") + " " + (resource.oneliner || "") + " " + (resource.industry || "")).toLowerCase();
    const noteWords = text.split(/\W+/).filter(w => w.length > 3);
    noteWords.forEach(w => { if (resourceText.includes(w)) score += 0.5; });
    if (/research|lab|faculty|phd|grant/.test(text) && /research|grant|lab/.test(resourceText)) score += 2;
    if (/interview|leetcode|prep|practice/.test(text) && /interview|mock/.test(resourceText)) score += 3;
    if (/resume|cover letter/.test(text) && resource.type === "Career Advisors") score += 3;
    if (/finance|quant|trading/.test(text) && (resource.industry || "").includes("Finance")) score += 2;
    if (/startup|founder|vc/.test(text) && (resource.roleTag || "").includes("Startup")) score += 2;
    if (/healthcare|hospital|biotech/.test(text) && (resource.industry || "").includes("Healthcare")) score += 2;
    return score;
  };

  const handleSessionTypeToggle = (val) => {
    const next = sessionTypes.includes(val) ? sessionTypes.filter(x => x !== val) : [...sessionTypes, val];
    setSessionTypes(next);
    const defaults = new Set();
    next.forEach(st => {
      const found = SESSION_TYPES.find(s => s.value === st);
      if (found) found.resourceDefaults.forEach(d => defaults.add(d));
    });
    setResourceTypeFilter([...defaults]);
  };

  const toggleAdvisingArr = (arr, setArr, val) =>
    setArr(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);

  const handleAdvisingMatch = () => {
    if (!advisingNotes.trim()) return;
    setAdvisingMatchLoading(true);
    const inferred = inferResourceTypes(advisingNotes);
    const sessionDefaults = new Set();
    sessionTypes.forEach(st => {
      const found = SESSION_TYPES.find(s => s.value === st);
      if (found) found.resourceDefaults.forEach(d => sessionDefaults.add(d));
    });
    const merged = [...new Set([...sessionDefaults, ...inferred, ...resourceTypeFilter])];
    setActiveTypeFilter(merged);
    const activeTypes = getActiveTypes(merged);
    const liveRows = rows.filter(r => !isExpired(r) && r["Title"] && r["Resource Type [External Search]"]);
    const resourceObjs = liveRows.map(r => ({
      id: r["URL"] + r["Title"],
      type: r["Resource Type [External Search]"],
      title: r["Title"],
      oneliner: r["One-liner"] || "",
      url: r["URL"] || "",
      deadline: r["Date"] || r["Removal Date [Internal]"] || "Rolling",
      industry: r["Industry"] || "",
      location: r["Location"] || "",
      employer: r["Employer/Host"] || "",
      roleTag: r["Role Tag"] || "",
      employerAITag: r["Employer AI Tag"] || "",
      flag: flagSeverity(r),
      flagMsg: r["Failure Message"] || "",
    }));
    const results = resourceObjs
      .map(r => ({ ...r, score: scoreAdvisingResource(r, advisingNotes, locationPref, companySizes, roleTypePrefs) }))
      .filter(r => r.score > 0)
      .filter(r => !activeTypes || activeTypes.has(r.type))
      .sort((a, b) => b.score - a.score)
      .slice(0, 12);
    setAdvisingMatches(results);
    setAdvisingSelected({});
    setAdvisingDraft("");
    setAdvisingStep("review");
    setAdvisingMatchLoading(false);
  };

  const advisingFilteredMatches = useMemo(() => {
    if (!advisingMatches) return null;
    const activeTypes = getActiveTypes(activeTypeFilter);
    if (!activeTypes) return advisingMatches;
    return advisingMatches.filter(r => activeTypes.has(r.type));
  }, [advisingMatches, activeTypeFilter]);

  const handleAdvisingDraft = async () => {
    const selectedResources = advisingFilteredMatches ? advisingFilteredMatches.filter(r => advisingSelected[r.id]) : [];
    if (selectedResources.length === 0) return;
    setAdvisingDraftLoading(true);
    setAdvisingStep("draft");
    const sessionLabels = sessionTypes.map(v => SESSION_TYPES.find(s => s.value === v)?.label).filter(Boolean);
    const sessionContexts = sessionTypes.map(v => SESSION_TYPES.find(s => s.value === v)?.promptContext).filter(Boolean);
    const sessionDefaultActions = sessionTypes.flatMap(v => SESSION_TYPES.find(s => s.value === v)?.defaultActions || []);
    const resourceList = selectedResources.map(r =>
      `- ${r.title} (${r.type}): ${r.oneliner} | Link: ${r.url} | Deadline: ${r.deadline}${r.flag ? " ⚠️ " + r.flagMsg : ""}`
    ).join("\n");
    const contextLines = [
      locationPref && `Preferred locations: ${locationPref}`,
      companySizes.length && `Company preferences: ${companySizes.join(", ")}`,
      roleTypePrefs.length && `Role interests: ${roleTypePrefs.join(", ")}`,
    ].filter(Boolean).join("\n");
    const prompt = `You are a UChicago career advisor writing a follow-up email to a student after an advising session.\nStudent name: ${studentName || "the student"}\nSession type(s): ${sessionLabels.length ? sessionLabels.join(", ") : "General advising"}\nSession guidance: ${sessionContexts.join(" ")}\nAdvisor notes: ${advisingNotes}\n${contextLines ? "Student context:\n" + contextLines : ""}\nDefault action items (adapt based on notes):\n${sessionDefaultActions.map(a => "- " + a).join("\n")}\nResources to include:\n${resourceList}\nWrite a follow-up email. Rules: no filler phrases, action items as a clear bulleted list, weave resources near relevant action items, under 250 words, close with invitation to reach out, sign off as [Advisor Name].\nReturn only the email body. No subject line.`;
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 1000, messages: [{ role: "user", content: prompt }] }),
    });
    const data = await res.json();
    setAdvisingDraft(data.content?.[0]?.text || "");
    setAdvisingDraftLoading(false);
  };

  const resetAdvising = () => {
    setStudentName(""); setSessionTypes([]); setAdvisingNotes(""); setLocationPref("");
    setCompanySizes([]); setRoleTypePrefs([]); setResourceTypeFilter([]);
    setActiveTypeFilter([]); setAdvisingMatches(null); setAdvisingSelected({});
    setAdvisingDraft(""); setAdvisingStep("input");
  };
  };

  const copyNewsletter = () => {
    const sectionOrder = [
      ["Full Time Role", "Full-Time Roles"],
      ["Internship- Summer", "Summer Internships"],
      ["Internship- Academic Year", "Academic Year Internships"],
      ["Event", "Events"],
      ["Program", "Programs"],
      ["Cool Tools & Resources", "Tools & Resources"],
      ["Chatbot Prompt", "Chatbot Prompts"],
      ["Career Advisors", "Career Advisors"],
    ];
    const sections = [];
    for (const [key, label] of sectionOrder) {
      let sectionRows = newsletterOutput.filter((o, i) => o.row["Resource Type [External Search]"] === key && selectedRows.has(i));
      if (!showFlagged) sectionRows = sectionRows.filter(o => !o.flag);
      if (sectionRows.length === 0) continue;
      const lines = sectionRows.map(({ row, flag }) => {
        const out = formatForOutput(row, outputFormat);
        if (!out) return null;
        if (flag && showFlagged) return `[${flag.toUpperCase()}] ${out}\n  \u26a0 ${row["Failure Message"]}`;
        return out;
      }).filter(Boolean);
      if (lines.length === 0) continue;
      sections.push(label + "\n\n" + lines.join("\n\n"));
    }
    const text = sections.join("\n\n");
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

  const activeFilterCount = Object.entries(filters).reduce((n, [k, v]) => n + (Array.isArray(v) ? v.length : v ? 1 : 0), 0);
  const clearAll = () => setFilters({ industry: [], type: [], roleType: [], roleTag: [], metcalf: [], newsletterType: [], removalDateFrom: "", removalDateTo: "" });
  const newsletterOptions = ["AI, Tech, and Entrepreneurship", "Science & Research", "Healthcare & Global Health", "None / Hold"];
  const resourceTypeOptions = ["Internship- Summer", "Internship- Academic Year", "Full Time Role", "Event", "Program", "Cool Tools & Resources", "Chatbot Prompt", "Career Advisors", "Other"];


  const [mode, setMode] = useState("newsletter");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [filters, setFilters] = useState({ industry: [], type: [], roleType: [], roleTag: [], metcalf: [], newsletterType: [], removalDateFrom: "", removalDateTo: "" });
  const [newsletterOutput, setNewsletterOutput] = useState([]);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [chatMessages, setChatMessages] = useState([]);
  // Advising hub state
  const [studentName, setStudentName] = useState("");
  const [sessionTypes, setSessionTypes] = useState([]);
  const [advisingNotes, setAdvisingNotes] = useState("");
  const [locationPref, setLocationPref] = useState("");
  const [companySizes, setCompanySizes] = useState([]);
  const [roleTypePrefs, setRoleTypePrefs] = useState([]);
  const [resourceTypeFilter, setResourceTypeFilter] = useState([]);
  const [advisingMatches, setAdvisingMatches] = useState(null);
  const [activeTypeFilter, setActiveTypeFilter] = useState([]);
  const [advisingSelected, setAdvisingSelected] = useState({});
  const [advisingDraft, setAdvisingDraft] = useState("");
  const [advisingMatchLoading, setAdvisingMatchLoading] = useState(false);
  const [advisingDraftLoading, setAdvisingDraftLoading] = useState(false);
  const [advisingStep, setAdvisingStep] = useState("input");
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [outputFormat, setOutputFormat] = useState("plain");
  const [showFlagged, setShowFlagged] = useState(true);
  const chatEndRef = useRef(null);
  const [fbForm, setFbForm] = useState({ email: "", feedbackType: "", description: "" });
  const [fbSubmitting, setFbSubmitting] = useState(false);
  const [fbResult, setFbResult] = useState(null);
  const [ldForm, setLdForm] = useState({ newsletter: [], resourceType: '', url: '', removalDate: '', emailAddress: '' });
  const [ldSubmitting, setLdSubmitting] = useState(false);
  const [ldResult, setLdResult] = useState(null);

  // Load sheet on mount
  useEffect(() => {
    (async () => {
      try {
        const values = await fetchSheetData();
        const parsed = parseRows(values).filter((r) => !isExpired(r));
      console.log("Newsletter values:", parsed.slice(0,3).map(r => r["Newsletter this week?"]));
        setRows(parsed);
      } catch (e) {
        setLoadError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Reset selected rows when newsletter output changes
  useEffect(() => {
    const ids = new Set(newsletterOutput.map((_, i) => i));
    setSelectedRows(ids);
  }, [newsletterOutput]);

  // Build newsletter output when filters change (newsletter mode)
  useEffect(() => {
    if (mode !== "newsletter") return;
    let filtered = rows.filter((r) => r["Newsletter this week?"] === "TRUE" || r["Newsletter this week?"] === "true" || r["Newsletter this week?"] === "1" || r["Newsletter this week?"] === "true" || r["Newsletter this week?"] === "1");
    if (filters.industry.length > 0) {
      filtered = filtered.filter((r) =>
        filters.industry.some((ind) => (r["Industry"] || "").includes(ind))
      );
    }
    if (filters.type.length > 0)
      filtered = filtered.filter((r) => filters.type.includes(r["Resource Type [External Search]"]));
    if (filters.industry.length > 0)
      filtered = filtered.filter((r) => filters.industry.some((ind) => (r["Industry"] || "").includes(ind)));
    if (filters.roleType.length > 0)
      filtered = filtered.filter((r) => filters.roleType.some((rt) => (r["Role Type"] || "").includes(rt)));
    if (filters.roleTag.length > 0)
      filtered = filtered.filter((r) => filters.roleTag.some((tag) => (r["Role Tag"] || "").includes(tag)));
    if (filters.metcalf.length > 0)
      filtered = filtered.filter((r) => filters.metcalf.includes(r["Metcalf?"]));
    if (filters.newsletterType.length > 0)
      filtered = filtered.filter((r) => filters.newsletterType.some((nt) => (r["Newsletter Type"] || "").includes(nt)));
    if (filters.removalDateFrom || filters.removalDateTo) {
      filtered = filtered.filter((r) => {
        const rd = r["Removal Date [Internal]"];
        if (!rd) return true;
        const d = new Date(rd);
        if (isNaN(d)) return true;
        if (filters.removalDateFrom && d < new Date(filters.removalDateFrom)) return false;
        if (filters.removalDateTo && d > new Date(filters.removalDateTo)) return false;
        return true;
      });
    }
    const formatted = filtered.map(formatNewsletterRow);
    // Sort within each resource type: Metcalf TRUE first, then soonest removal date, then title
    formatted.sort((a, b) => {
      // Same resource type grouping is handled by sectionLabels rendering
      const aMetcalf = a.row["Metcalf?"] === "TRUE" ? 0 : 1;
      const bMetcalf = b.row["Metcalf?"] === "TRUE" ? 0 : 1;
      if (aMetcalf !== bMetcalf) return aMetcalf - bMetcalf;
      const aDate = new Date(a.row["Removal Date [Internal]"] || "9999-12-31");
      const bDate = new Date(b.row["Removal Date [Internal]"] || "9999-12-31");
      if (aDate - bDate !== 0) return aDate - bDate;
      return (a.row["Title"] || "").localeCompare(b.row["Title"] || "");
    });
    setNewsletterOutput(formatted);
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

  const roleTypes = [...new Set(rows.flatMap((r) => (r["Role Type"] || "").split(",").map((s) => s.trim()).filter(Boolean)))].sort();
  const roleTags = [...new Set(rows.flatMap((r) => (r["Role Tag"] || "").split(",").map((s) => s.trim()).filter(Boolean)))].sort();
  const locations = [...new Set(rows.map((r) => r["Location"]).filter(Boolean))].sort();
  const removalDates = [...new Set(rows.map((r) => r["Removal Date [Internal]"]).filter(Boolean))].sort();
  [...new Set(rows.flatMap((r) => (r["Role Type"] || "").split(",").map((s) => s.trim()).filter(Boolean)))].sort();
  [...new Set(rows.flatMap((r) => (r["Role Tag"] || "").split(",").map((s) => s.trim()).filter(Boolean)))].sort();
  [...new Set(rows.map((r) => r["Location"]).filter(Boolean))].sort();
  [...new Set(rows.map((r) => r["Date"]).filter(Boolean))].sort();
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

  const toggleNewsletter = (val) => {
    setLdForm((prev) => {
      if (val === "None / Hold") {
        if (prev.newsletter.includes("None / Hold")) return { ...prev, newsletter: [] };
        return { ...prev, newsletter: ["None / Hold"] };
      }
      const without = prev.newsletter.filter((v) => v !== "None / Hold");
      return { ...prev, newsletter: without.includes(val) ? without.filter((v) => v !== val) : [...without, val] };
    });
    setLdResult(null);
  };

  const handleLdSubmit = async () => {
    if (ldSubmitting) return;
    setLdSubmitting(true);
    setLdResult(null);
    try {
      const formUrl = "https://docs.google.com/forms/d/e/1FAIpQLSfbmwF-NScWPszvPhhMB487nnfIGPg_6WyY4cvNYqH29BC8pA/formResponse";
      const formData = new FormData();
      formData.append("entry.1356079722", ldForm.newsletter.join(", "));
      formData.append("entry.137735704", ldForm.resourceType);
      formData.append("entry.676459926", ldForm.url);
      formData.append("emailAddress", ldForm.emailAddress);
      await fetch(formUrl, {
        method: "POST",
        mode: "no-cors",
        body: formData,
      });
      const urlOk = ldForm.url.startsWith("http");
      setLdResult({ success: true, urlOk });
      setLdForm({ newsletter: [], resourceType: '', url: '', removalDate: '', emailAddress: '' });
    } catch (err) {
      setLdResult({ success: false, urlOk: false, error: err.message });
    } finally {
      setLdSubmitting(false);
    }
  };

  const handleFbSubmit = async () => {
    if (fbSubmitting) return;
    setFbSubmitting(true);
    setFbResult(null);
    try {
      const res = await fetch(LINK_DROPPER_URL, {
        method: "POST",
        body: JSON.stringify({
          type: "feedback",
          email: fbForm.email,
          feedbackType: fbForm.feedbackType,
          description: fbForm.description,
        }),
      });
      const data = await res.json();
      setFbResult({ success: data.success, error: data.error });
      if (data.success) setFbForm({ email: "", feedbackType: "", description: "" });
    } catch (err) {
      setFbResult({ success: false, error: err.message });
    } finally {
      setFbSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ ...styles.app, alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "left", color: "#737373" }}>
          <div style={{ fontSize: "24px", marginBottom: "12px" }}>⟳</div>
          <div style={{ fontSize: "14px" }}>Loading Innovation Hub…</div>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div style={{ ...styles.app, alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "left", color: "#800000", maxWidth: "400px" }}>
          <div style={{ fontSize: "24px", marginBottom: "12px" }}>⚠</div>
          <div style={{ fontSize: "14px", marginBottom: "8px", fontWeight: "600" }}>Could not load sheet</div>
          <div style={{ fontSize: "12px", color: "#737373" }}>{loadError}</div>
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
        <button style={styles.modeBtn(mode === "linkdropper")} onClick={() => setMode("linkdropper")}>
          Link Dropper
        </button>
        <button style={styles.modeBtn(mode === "feedback")} onClick={() => setMode("feedback")}>
          Feedback
        </button>
      </div>

      {/* Status bar */}
      <div style={styles.statusBar}>
        <span><span style={styles.dot("#2ecc71")} />{rows.length} live resources</span>
        {mode === "newsletter" && (
          <>
            <span><span style={styles.dot("#800000")} />{newsletterOutput.length} in this issue</span>
            {flagCount > 0 && (
              <span><span style={styles.dot("#EAAA00")} />{flagCount} flagged — review before sending</span>
            )}
          </>
        )}
      </div>

      <div style={styles.main}>
        {/* Sidebar */}
        <div style={{...styles.sidebar, display: (mode === "linkdropper" || mode === "feedback") ? "none" : "block"}}>
          {mode === "newsletter" && (
            <>
              {activeFilterCount > 0 && (
                <button style={styles.clearBtn} onClick={clearAll}>
                  Clear all filters ({activeFilterCount})
                </button>
              )}
              <div style={styles.sidebarLabel}>Newsletter Type <em style={{fontWeight:"400",fontSize:"9px"}}>Optional</em></div>
              <div style={styles.filterGroup}>
                {["AI, Tech, and Entrepreneurship", "Science & Research", "Healthcare & Global Health"].map((nt) => (
                  <button key={nt} style={styles.filterChip(filters.newsletterType.includes(nt))} onClick={() => toggleFilter("newsletterType", nt)}>{nt}</button>
                ))}
              </div>
              <div style={styles.sidebarLabel}>Resource Type</div>
              <div style={styles.filterGroup}>
                {resourceTypes.map((t) => (
                  <button key={t} style={styles.filterChip(filters.type.includes(t))} onClick={() => toggleFilter("type", t)}>{t}</button>
                ))}
              </div>
              <div style={styles.sidebarLabel}>Metcalf Eligible <em style={{fontWeight:"400",fontSize:"9px"}}>Optional</em></div>
              <div style={styles.filterGroup}>
                {["TRUE", "FALSE"].map((val) => (
                  <button key={val} style={styles.filterChip(filters.metcalf.includes(val))} onClick={() => toggleFilter("metcalf", val)}>{val === "TRUE" ? "Metcalf Eligible" : "Not Metcalf"}</button>
                ))}
              </div>
              <div style={styles.sidebarLabel}>Active Between <em style={{fontWeight:"400",fontSize:"9px"}}>Optional</em></div>
              <div style={{display:"flex",flexDirection:"column",gap:"6px",marginTop:"6px",marginBottom:"8px"}}>
                <div style={{fontSize:"10px",color:"#737373"}}>From</div>
                <input type="date" value={filters.removalDateFrom} onChange={(e) => setFilters(p => ({...p, removalDateFrom: e.target.value}))} style={{padding:"5px 8px",border:"1px solid #D9D9D9",borderRadius:"6px",fontSize:"12px",color:"#000",background:"#F9F9F9",outline:"none",width:"100%",boxSizing:"border-box"}} />
                <div style={{fontSize:"10px",color:"#737373"}}>To</div>
                <input type="date" value={filters.removalDateTo} onChange={(e) => setFilters(p => ({...p, removalDateTo: e.target.value}))} style={{padding:"5px 8px",border:"1px solid #D9D9D9",borderRadius:"6px",fontSize:"12px",color:"#000",background:"#F9F9F9",outline:"none",width:"100%",boxSizing:"border-box"}} />
              </div>
              <div style={styles.sidebarLabel}>Role Tag <em style={{fontWeight:"400",fontSize:"9px"}}>Optional</em></div>
              <div style={styles.filterGroup}>
                {roleTags.map((tag) => (
                  <button key={tag} style={styles.filterChip(filters.roleTag.includes(tag))} onClick={() => toggleFilter("roleTag", tag)}>{tag}</button>
                ))}
              </div>
              <div style={styles.sidebarLabel}>Role Type <em style={{fontWeight:"400",fontSize:"9px"}}>Optional</em></div>
              <div style={styles.filterGroup}>
                {roleTypes.map((rt) => (
                  <button key={rt} style={styles.filterChip(filters.roleType.includes(rt))} onClick={() => toggleFilter("roleType", rt)}>{rt}</button>
                ))}
              </div>
            </>
          )}
          {mode === "advising" && (
            <>
              <div style={styles.sidebarLabel}>Session Type</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginBottom: "12px" }}>
                {SESSION_TYPES.map(s => (
                  <button key={s.value} onClick={() => handleSessionTypeToggle(s.value)}
                    style={{ padding: "5px 8px", borderRadius: "5px", fontSize: "11px", fontWeight: sessionTypes.includes(s.value) ? 600 : 400, border: sessionTypes.includes(s.value) ? "1px solid #800000" : "1px solid #D9D9D9", background: sessionTypes.includes(s.value) ? "rgba(128,0,0,0.08)" : "transparent", color: sessionTypes.includes(s.value) ? "#800000" : "#737373", cursor: "pointer", textAlign: "left" }}>
                    {s.label}
                  </button>
                ))}
              </div>
              <div style={styles.sidebarLabel}>Resources to Include</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginBottom: "12px" }}>
                {RESOURCE_TYPE_OPTIONS.map(opt => (
                  <button key={opt.value} onClick={() => toggleAdvisingArr(resourceTypeFilter, setResourceTypeFilter, opt.value)}
                    style={{ padding: "5px 8px", borderRadius: "5px", fontSize: "11px", fontWeight: resourceTypeFilter.includes(opt.value) ? 600 : 400, border: resourceTypeFilter.includes(opt.value) ? "1px solid #2d5a27" : "1px solid #D9D9D9", background: resourceTypeFilter.includes(opt.value) ? "rgba(45,90,39,0.08)" : "transparent", color: resourceTypeFilter.includes(opt.value) ? "#2d5a27" : "#737373", cursor: "pointer", textAlign: "left" }}>
                    {opt.label}
                  </button>
                ))}
              </div>
              <div style={styles.sidebarLabel}>Flags</div>
              <div style={{ fontSize: "11px", color: "#737373", lineHeight: "1.7" }}>
                <span style={{ color: "#800000" }}>■ FAIL</span> — review before sharing.<br />
                <span style={{ color: "#e6b432" }}>■ WARN</span> — spot-check before sharing.
              </div>
            </>
          )}
        </div>

        {/* Main content */}
        <div style={styles.content}>
          {mode === "linkdropper" && (
            <div style={{flex:1,overflowY:"auto",padding:"40px",display:"flex",justifyContent:"center"}}>
              <div style={{maxWidth:"560px"}}>
                <div style={{fontSize:"13px",color:"#737373",marginBottom:"20px",lineHeight:"1.6"}}>Submit a new resource to the Innovation Hub. Required fields are marked *.</div>
                <div style={{marginBottom:"16px"}}>
                  <div style={styles.sidebarLabel}>Include in Newsletter *</div>
                  <div style={{display:"flex",flexDirection:"column",gap:"6px",marginTop:"6px"}}>
                    {newsletterOptions.map((opt) => (
                      <label key={opt} style={{display:"flex",alignItems:"center",gap:"8px",cursor:"pointer",fontSize:"13px",color:ldForm.newsletter.includes(opt)?"#800000":"#737373"}}>
                        <input type="checkbox" checked={ldForm.newsletter.includes(opt)} onChange={() => toggleNewsletter(opt)} disabled={(opt !== "None / Hold" && ldForm.newsletter.includes("None / Hold")) || (opt === "None / Hold" && ldForm.newsletter.length > 0 && !ldForm.newsletter.includes("None / Hold"))} style={{accentColor:"#800000"}} />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>
                <div style={{marginBottom:"16px"}}>
                  <div style={styles.sidebarLabel}>Resource Type *</div>
                  <select value={ldForm.resourceType} onChange={(e) => { setLdForm((p) => ({...p, resourceType: e.target.value})); setLdResult(null); }} style={{width:"100%",marginTop:"6px",padding:"8px 10px",background:"#F9F9F9",border:"1px solid #1e2330",borderRadius:"6px",color:ldForm.resourceType?"#000000":"#737373",fontSize:"13px",outline:"none"}}>
                    <option value="">Select a resource type...</option>
                    {resourceTypeOptions.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div style={{marginBottom:"16px"}}>
                  <div style={styles.sidebarLabel}>URL or Contact Info *</div>
                  <input type="text" value={ldForm.url} onChange={(e) => { setLdForm((p) => ({...p, url: e.target.value})); setLdResult(null); }} placeholder="https://..." style={{width:"100%",marginTop:"6px",padding:"8px 10px",background:"#F9F9F9",border:"1px solid #1e2330",borderRadius:"6px",color:"#000000",fontSize:"13px",outline:"none",boxSizing:"border-box"}} />
                </div>
                <div style={{marginBottom:"16px"}}>
                  <div style={styles.sidebarLabel}>Removal Date (optional)</div>
                  <input type="date" value={ldForm.removalDate} onChange={(e) => setLdForm((p) => ({...p, removalDate: e.target.value}))} style={{marginTop:"6px",padding:"8px 10px",background:"#F9F9F9",border:"1px solid #1e2330",borderRadius:"6px",color:"#000000",fontSize:"13px",outline:"none"}} />
                </div>
                <div style={{marginBottom:"24px"}}>
                  <div style={styles.sidebarLabel}>Your Email *</div>
                  <input type="email" value={ldForm.emailAddress} onChange={(e) => { setLdForm((p) => ({...p, emailAddress: e.target.value})); setLdResult(null); }} placeholder="cnetid@uchicago.edu" style={{width:"100%",marginTop:"6px",padding:"8px 10px",background:"#F9F9F9",border:"1px solid #1e2330",borderRadius:"6px",color:"#000000",fontSize:"13px",outline:"none",boxSizing:"border-box"}} />
                </div>
                <button onClick={handleLdSubmit} disabled={ldSubmitting} style={{padding:"10px 24px",background:ldSubmitting?"#D9D9D9":"#800000",color:ldSubmitting?"#737373":"#fff",border:"none",borderRadius:"8px",fontSize:"13px",fontWeight:"600",cursor:ldSubmitting?"not-allowed":"pointer"}}>
                  {ldSubmitting ? "Submitting…" : "Submit Resource"}
                </button>
                {ldResult && ldResult.success && (
                  <div style={{marginTop:"16px",padding:"12px 14px",background:"rgba(46,204,113,0.1)",border:"1px solid rgba(46,204,113,0.3)",borderRadius:"8px",fontSize:"13px",color:"#2ecc71"}}>
                    ✓ Resource submitted successfully.
                  </div>
                )}
                {ldResult && !ldResult.success && !ldResult.urlOk && (
                  <div style={{marginTop:"16px",padding:"16px",background:"#f5c518",border:"1px solid #d4a800",borderRadius:"8px",fontSize:"13px",color:"#000",lineHeight:"1.7",fontFamily:"Gotham, 'Gotham SSm', 'Helvetica Neue', Arial, sans-serif"}}>
                    <div style={{textAlign:"center",fontWeight:"700",marginBottom:"10px",fontSize:"14px"}}>⚠ Submission received but flagged for review.</div>
                    <div style={{textAlign:"left"}}>Paste the direct URL to the resource. Only ONE URL, starting with http.</div>
                    <div style={{textAlign:"left",marginTop:"6px"}}>If no webpage exists, provide contact information or a brief description of how students can access the resource.</div>
                    <div style={{textAlign:"left",marginTop:"6px"}}>Non-URL entries will need to pass human review before showing up in the Database. If urgent, flag for Lucy/Sandy.</div>
                  </div>
                )}
                {ldResult && !ldResult.success && ldResult.urlOk && (
                  <div style={{marginTop:"16px",padding:"12px 14px",background:"rgba(200,75,49,0.08)",border:"1px solid rgba(128,0,0,0.3)",borderRadius:"8px",fontSize:"13px",color:"#800000"}}>
                    ✗ Submission failed: {ldResult.error}
                  </div>
                )}
              </div>
            </div>
          )}

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
                  <div style={{display:"flex",gap:"12px",alignItems:"center",marginBottom:"20px",flexWrap:"wrap"}}>
                    <button style={styles.copyBtn} onClick={copyNewsletter}>
                      {copied ? "✓ Copied to clipboard" : "Copy for Mailchimp"}
                    </button>
                    <button onClick={() => setSelectedRows(new Set(newsletterOutput.map((_,i) => i)))} style={{padding:"4px 10px",fontSize:"11px",fontWeight:"600",borderRadius:"4px",border:"1px solid #800000",cursor:"pointer",background:"transparent",color:"#800000"}}>Select All</button>
                    <button onClick={() => setSelectedRows(new Set())} style={{padding:"4px 10px",fontSize:"11px",fontWeight:"600",borderRadius:"4px",border:"1px solid #737373",cursor:"pointer",background:"transparent",color:"#737373"}}>Deselect All</button>
                    <div style={{display:"flex",gap:"4px",background:"#F5F5F5",borderRadius:"6px",padding:"2px"}}>
                      <button onClick={() => setOutputFormat("plain")} style={{padding:"4px 10px",fontSize:"11px",fontWeight:"600",borderRadius:"4px",border:"none",cursor:"pointer",background:outputFormat==="plain"?"#800000":"transparent",color:outputFormat==="plain"?"#fff":"#737373"}}>Plain Text</button>
                      <button onClick={() => setOutputFormat("html")} style={{padding:"4px 10px",fontSize:"11px",fontWeight:"600",borderRadius:"4px",border:"none",cursor:"pointer",background:outputFormat==="html"?"#800000":"transparent",color:outputFormat==="html"?"#fff":"#737373"}}>HTML</button>
                    </div>
                    <div style={{display:"flex",gap:"4px",background:"#F5F5F5",borderRadius:"6px",padding:"2px"}}>
                      <button onClick={() => setShowFlagged(true)} style={{padding:"4px 10px",fontSize:"11px",fontWeight:"600",borderRadius:"4px",border:"none",cursor:"pointer",background:showFlagged?"#800000":"transparent",color:showFlagged?"#fff":"#737373"}}>Show All</button>
                      <button onClick={() => setShowFlagged(false)} style={{padding:"4px 10px",fontSize:"11px",fontWeight:"600",borderRadius:"4px",border:"none",cursor:"pointer",background:!showFlagged?"#800000":"transparent",color:!showFlagged?"#fff":"#737373"}}>Hide Flagged</button>
                    </div>
                  </div>
                  {Object.entries(sectionLabels).map(([key, label]) => {
                    if (key === "Other") return null;
                    let sectionRows = newsletterOutput.filter(
                      (o) => o.row["Resource Type [External Search]"] === key
                    );
                    if (!showFlagged) sectionRows = sectionRows.filter(o => !o.flag);
                    if (sectionRows.length === 0) return null;
                    return (
                      <div key={key}>
                        <div style={{...styles.sectionHeader, display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                          <span>{label} ({sectionRows.length})</span>
                        </div>
                        {sectionRows.map((item) => {
                          const { row, flag } = item;
                          const globalIdx = newsletterOutput.indexOf(item);
                          const isChecked = selectedRows.has(globalIdx);
                          const toggleCheck = () => setSelectedRows(prev => {
                            const next = new Set(prev);
                            if (next.has(globalIdx)) next.delete(globalIdx); else next.add(globalIdx);
                            return next;
                          });
                          return (
                            <div key={globalIdx} style={{...styles.resourceCard(flag), display:"flex", alignItems:"flex-start", gap:"10px"}}>
                              <input type="checkbox" checked={isChecked} onChange={toggleCheck} style={{marginTop:"3px", accentColor:"#800000", flexShrink:0, width:"16px", height:"16px", cursor:"pointer"}} />
                              <div style={{flex:1}}>
                              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"8px"}}>
                                <div style={{flex:1,fontSize:"13px",lineHeight:"1.6",textAlign:"left"}} dangerouslySetInnerHTML={{__html: (() => {
                                  const type = row["Resource Type [External Search]"] || "";
                                  const title = row["Title"] || "Untitled";
                                  const url = row["URL"] || "";
                                  const employer = row["Employer/Host"] || "";
                                  const location = row["Location"] || "";
                                  const date = row["Date"] || "";
                                  const oneliner = row["One-liner"] || "";
                                  const link = (text, href) => href ? `<a href="${href}" target="_blank" style="color:#800000">${text}</a>` : text;
                                  const bold = (text) => `<b>${text}</b>`;
                                  const italic = (text) => `<i>${text}</i>`;
                                  const pipe = " | ";
                                  if (outputFormat === "html") {
                                    if (["Full Time Role","Internship- Summer","Internship- Academic Year","Program"].includes(type)) {
                                      const parts = [bold(link(employer,url)), bold(title), location?italic(location):null, date].filter(Boolean);
                                      return parts.join(pipe);
                                    }
                                    if (type === "Career Advisors") return [bold(title), employer, italic(link("Schedule a conversation!",url))].filter(Boolean).join(pipe);
                                    if (type === "Cool Tools & Resources") return [bold(link(title,url)), oneliner].filter(Boolean).join(pipe);
                                    if (type === "Event") { const parts = [bold(link(title,url)), location||null, date||null, oneliner||null].filter(Boolean); return `<div style="text-align:center">${parts.join(pipe)}</div>`; }
                                    if (type === "Chatbot Prompt") return `<div style="text-align:center">${oneliner}</div>`;
                                    return bold(link(title,url));
                                  } else {
                                    const plainLink = (t,h) => h?`${t} (${h})`:t;
                                    if (["Full Time Role","Internship- Summer","Internship- Academic Year","Program"].includes(type)) return [plainLink(employer.toUpperCase(),url), title.toUpperCase(), location, date].filter(Boolean).join(" | ");
                                    if (type === "Career Advisors") return [title.toUpperCase(), employer, `Schedule a conversation! (${url})`].filter(Boolean).join(" | ");
                                    if (type === "Cool Tools & Resources") return [plainLink(title.toUpperCase(),url), oneliner].filter(Boolean).join(" | ");
                                    if (type === "Event") return [plainLink(title.toUpperCase(),url), location, date, oneliner].filter(Boolean).join(" | ");
                                    if (type === "Chatbot Prompt") return oneliner;
                                    return title;
                                  }
                                })()}} />
                                {flag && <span style={{...styles.flagBadge(flag),marginLeft:"12px",flexShrink:0}}>{flag.toUpperCase()}</span>}
                              </div>
                              {flag && row["Failure Message"] && (
                                <div style={styles.cardFlag}>{row["Failure Message"]}</div>
                              )}
                              </div>
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

          {mode === "feedback" && (
            <div style={{flex:1,overflowY:"auto",padding:"40px",display:"flex",justifyContent:"center"}}>
              <div style={{maxWidth:"560px",width:"100%"}}>
                <div style={{fontSize:"20px",fontWeight:"700",color:"#000",marginBottom:"6px",fontFamily:"Gotham, Helvetica, Arial, sans-serif"}}>Share Feedback</div>
                <div style={{fontSize:"13px",color:"#737373",marginBottom:"28px",lineHeight:"1.6"}}>
                  Help us improve the Innovation Hub Advisor Tool. All feedback goes directly to the team.
                </div>
                <div style={{marginBottom:"16px"}}>
                  <div style={styles.sidebarLabel}>Your Email</div>
                  <input type="email" value={fbForm.email} onChange={(e) => { setFbForm(p => ({...p, email: e.target.value})); setFbResult(null); }} placeholder="cnetid@uchicago.edu" style={{width:"100%",marginTop:"6px",padding:"8px 10px",background:"#F9F9F9",border:"1px solid #D9D9D9",borderRadius:"6px",color:"#000",fontSize:"13px",outline:"none",boxSizing:"border-box"}} />
                </div>
                <div style={{marginBottom:"16px"}}>
                  <div style={styles.sidebarLabel}>Feedback Type *</div>
                  <div style={{display:"flex",flexDirection:"column",gap:"8px",marginTop:"8px"}}>
                    {["Feedback on Current Features/Functions", "Feature Request", "General"].map((opt) => (
                      <button key={opt} onClick={() => { setFbForm(p => ({...p, feedbackType: opt})); setFbResult(null); }} style={{textAlign:"left",padding:"8px 12px",borderRadius:"6px",border:fbForm.feedbackType===opt?"2px solid #800000":"1px solid #D9D9D9",background:fbForm.feedbackType===opt?"rgba(128,0,0,0.05)":"#F9F9F9",color:fbForm.feedbackType===opt?"#800000":"#737373",fontSize:"13px",cursor:"pointer",fontWeight:fbForm.feedbackType===opt?"600":"400"}}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{marginBottom:"24px"}}>
                  <div style={styles.sidebarLabel}>Description *</div>
                  <textarea value={fbForm.description} onChange={(e) => { setFbForm(p => ({...p, description: e.target.value})); setFbResult(null); }} placeholder="Describe the issue, suggestion, or feedback in as much detail as helpful..." rows={6} style={{width:"100%",marginTop:"6px",padding:"10px 12px",background:"#F9F9F9",border:"1px solid #D9D9D9",borderRadius:"6px",color:"#000",fontSize:"13px",outline:"none",boxSizing:"border-box",resize:"vertical",fontFamily:"Gotham, Helvetica, Arial, sans-serif",lineHeight:"1.6"}} />
                </div>
                <button onClick={handleFbSubmit} disabled={fbSubmitting || !fbForm.feedbackType || !fbForm.description} style={{padding:"10px 24px",background:(fbSubmitting||!fbForm.feedbackType||!fbForm.description)?"#D9D9D9":"#800000",color:(fbSubmitting||!fbForm.feedbackType||!fbForm.description)?"#737373":"#fff",border:"none",borderRadius:"8px",fontSize:"13px",fontWeight:"600",cursor:(fbSubmitting||!fbForm.feedbackType||!fbForm.description)?"not-allowed":"pointer"}}>
                  {fbSubmitting ? "Submitting…" : "Submit Feedback"}
                </button>
                {fbResult && fbResult.success && (
                  <div style={{marginTop:"16px",padding:"12px 14px",background:"rgba(46,204,113,0.1)",border:"1px solid rgba(46,204,113,0.3)",borderRadius:"8px",fontSize:"13px",color:"#27ae60"}}>
                    ✓ Feedback submitted. Thank you!
                  </div>
                )}
                {fbResult && !fbResult.success && (
                  <div style={{marginTop:"16px",padding:"12px 14px",background:"rgba(200,0,0,0.05)",border:"1px solid rgba(200,0,0,0.2)",borderRadius:"8px",fontSize:"13px",color:"#800000"}}>
                    ✗ Submission failed: {fbResult.error}
                  </div>
                )}
              </div>
            </div>
          )}

          {mode === "advising" && (
            <div style={{ flex: 1, overflowY: "auto", padding: "24px 32px" }}>
              <div style={{ background: "#F9F9F9", borderRadius: "8px", padding: "20px", border: "1px solid #D9D9D9", marginBottom: "14px" }}>
                <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", color: "#800000", marginBottom: "8px" }}>Student Name</div>
                <input value={studentName} onChange={e => setStudentName(e.target.value)} placeholder="e.g. Alex Chen"
                  style={{ width: "100%", padding: "8px 10px", borderRadius: "5px", border: "1px solid #D9D9D9", background: "#fff", color: "#000", fontSize: "13px", outline: "none", boxSizing: "border-box", fontFamily: "inherit", marginBottom: "14px" }} />
                <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", color: "#800000", marginBottom: "8px" }}>Session Notes</div>
                <textarea value={advisingNotes} onChange={e => setAdvisingNotes(e.target.value)}
                  placeholder={"Paste bullet-point notes here.\n\n- junior, CS major, ML engineering interest\n- wants summer internship, open to startup\n- resume needs quantified impact bullets"}
                  style={{ width: "100%", minHeight: "100px", padding: "10px 12px", borderRadius: "5px", border: "1px solid #D9D9D9", background: "#fff", color: "#000", fontSize: "13px", lineHeight: 1.5, resize: "vertical", fontFamily: "inherit", outline: "none", boxSizing: "border-box", marginBottom: "14px" }} />
                <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", color: "#800000", marginBottom: "8px" }}>Preferred Locations</div>
                <input value={locationPref} onChange={e => setLocationPref(e.target.value)} placeholder="e.g. Chicago, New York, Remote"
                  style={{ width: "100%", padding: "8px 10px", borderRadius: "5px", border: "1px solid #D9D9D9", background: "#fff", color: "#000", fontSize: "13px", outline: "none", boxSizing: "border-box", fontFamily: "inherit", marginBottom: "8px" }} />
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "14px" }}>
                  {["Chicago", "New York", "San Francisco", "Remote", "Boston", "DC", "Austin"].map(l => (
                    <button key={l} onClick={() => setLocationPref(prev => prev ? (prev.includes(l) ? prev : prev + ", " + l) : l)}
                      style={{ fontSize: "11px", padding: "3px 9px", borderRadius: "12px", border: "1px solid #D9D9D9", background: locationPref.includes(l) ? "rgba(128,0,0,0.08)" : "#fff", color: locationPref.includes(l) ? "#800000" : "#737373", cursor: "pointer" }}>
                      {l}
                    </button>
                  ))}
                </div>
                <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", color: "#800000", marginBottom: "8px" }}>Company Type</div>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "14px" }}>
                  {["Startup", "Large Corporation", "Small Business", "Nonprofit", "Government / National Lab"].map(opt => (
                    <button key={opt} onClick={() => toggleAdvisingArr(companySizes, setCompanySizes, opt)}
                      style={{ padding: "5px 10px", borderRadius: "12px", fontSize: "11px", border: companySizes.includes(opt) ? "1px solid #800000" : "1px solid #D9D9D9", background: companySizes.includes(opt) ? "rgba(128,0,0,0.08)" : "#fff", color: companySizes.includes(opt) ? "#800000" : "#737373", cursor: "pointer" }}>
                      {opt}
                    </button>
                  ))}
                </div>
                <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", color: "#800000", marginBottom: "8px" }}>Role Types of Interest</div>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "18px" }}>
                  {["Software / Engineering", "Data Science / ML", "Research", "Business / Operations", "Product Management", "Design / UX", "Finance / Quant"].map(opt => (
                    <button key={opt} onClick={() => toggleAdvisingArr(roleTypePrefs, setRoleTypePrefs, opt)}
                      style={{ padding: "5px 10px", borderRadius: "12px", fontSize: "11px", border: roleTypePrefs.includes(opt) ? "1px solid #800000" : "1px solid #D9D9D9", background: roleTypePrefs.includes(opt) ? "rgba(128,0,0,0.08)" : "#fff", color: roleTypePrefs.includes(opt) ? "#800000" : "#737373", cursor: "pointer" }}>
                      {opt}
                    </button>
                  ))}
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button onClick={handleAdvisingMatch} disabled={!advisingNotes.trim() || advisingMatchLoading}
                    style={{ background: advisingNotes.trim() ? "#800000" : "#D9D9D9", color: advisingNotes.trim() ? "#fff" : "#737373", border: "none", borderRadius: "5px", padding: "9px 20px", fontSize: "13px", fontWeight: 600, cursor: advisingNotes.trim() ? "pointer" : "not-allowed" }}>
                    {advisingMatchLoading ? "Matching…" : "Find Matching Resources"}
                  </button>
                  {advisingStep !== "input" && (
                    <button onClick={resetAdvising}
                      style={{ background: "transparent", color: "#737373", border: "1px solid #D9D9D9", borderRadius: "5px", padding: "8px 14px", fontSize: "12px", cursor: "pointer" }}>
                      Start Over
                    </button>
                  )}
                </div>
              </div>
              {advisingFilteredMatches !== null && (
                <div style={{ background: "#F9F9F9", borderRadius: "8px", padding: "20px", border: "1px solid #D9D9D9", marginBottom: "14px" }}>
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "12px" }}>
                    <button onClick={() => setActiveTypeFilter([])}
                      style={{ fontSize: "11px", padding: "3px 10px", borderRadius: "12px", border: activeTypeFilter.length === 0 ? "1px solid #800000" : "1px solid #D9D9D9", background: activeTypeFilter.length === 0 ? "rgba(128,0,0,0.08)" : "#fff", color: activeTypeFilter.length === 0 ? "#800000" : "#737373", cursor: "pointer" }}>All</button>
                    {RESOURCE_TYPE_OPTIONS.map(opt => (
                      <button key={opt.value} onClick={() => toggleAdvisingArr(activeTypeFilter, setActiveTypeFilter, opt.value)}
                        style={{ fontSize: "11px", padding: "3px 10px", borderRadius: "12px", border: activeTypeFilter.includes(opt.value) ? "1px solid #800000" : "1px solid #D9D9D9", background: activeTypeFilter.includes(opt.value) ? "rgba(128,0,0,0.08)" : "#fff", color: activeTypeFilter.includes(opt.value) ? "#800000" : "#737373", cursor: "pointer" }}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  <div style={{ fontSize: "11px", color: "#737373", marginBottom: "10px" }}>
                    {advisingFilteredMatches.length} resource{advisingFilteredMatches.length !== 1 ? "s" : ""} · click to select
                    {Object.values(advisingSelected).filter(Boolean).length > 0 && (
                      <span style={{ color: "#800000", marginLeft: "10px", fontWeight: 600 }}>
                        {Object.values(advisingSelected).filter(Boolean).length} selected
                      </span>
                    )}
                  </div>
                  {advisingFilteredMatches.length === 0 ? (
                    <div style={{ fontSize: "13px", color: "#737373" }}>No matches for this filter. Try selecting "All".</div>
                  ) : (
                    advisingFilteredMatches.map(r => (
                      <div key={r.id} onClick={() => setAdvisingSelected(prev => ({ ...prev, [r.id]: !prev[r.id] }))}
                        style={{ border: advisingSelected[r.id] ? "1px solid #800000" : "1px solid #D9D9D9", borderRadius: "6px", padding: "10px 12px", marginBottom: "7px", cursor: "pointer", background: advisingSelected[r.id] ? "rgba(128,0,0,0.04)" : "#fff", display: "flex", gap: "10px", alignItems: "flex-start" }}>
                        <div style={{ marginTop: "2px", width: "16px", height: "16px", borderRadius: "4px", border: advisingSelected[r.id] ? "2px solid #800000" : "2px solid #D9D9D9", background: advisingSelected[r.id] ? "#800000" : "transparent", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {advisingSelected[r.id] && <span style={{ color: "#fff", fontSize: "10px" }}>✓</span>}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "3px" }}>
                            <span style={{ fontSize: "10px", fontWeight: 600, padding: "1px 6px", borderRadius: "3px", background: "#F0F0F0", color: "#737373", textTransform: "uppercase", letterSpacing: "0.04em" }}>{r.type}</span>
                            {r.flag === "fail" && <span style={{ fontSize: "10px", color: "#800000", fontWeight: 600 }}>⚠ FAIL</span>}
                            {r.flag === "warn" && <span style={{ fontSize: "10px", color: "#e6b432", fontWeight: 600 }}>⚠ WARN</span>}
                          </div>
                          <div style={{ fontWeight: 600, fontSize: "13px", color: "#000", marginBottom: "2px" }}>{r.title}</div>
                          <div style={{ fontSize: "12px", color: "#737373", lineHeight: 1.4 }}>{r.oneliner}</div>
                          <div style={{ fontSize: "11px", color: "#A6A6A6", marginTop: "3px" }}>Deadline: {r.deadline}</div>
                        </div>
                      </div>
                    ))
                  )}
                  {Object.values(advisingSelected).filter(Boolean).length > 0 && (
                    <button onClick={handleAdvisingDraft} disabled={advisingDraftLoading}
                      style={{ marginTop: "10px", background: "#800000", color: "#fff", border: "none", borderRadius: "5px", padding: "9px 20px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
                      {advisingDraftLoading ? "Drafting…" : `Draft Email with ${Object.values(advisingSelected).filter(Boolean).length} Resource${Object.values(advisingSelected).filter(Boolean).length > 1 ? "s" : ""}`}
                    </button>
                  )}
                </div>
              )}
              {(advisingDraft || advisingDraftLoading) && (
                <div style={{ background: "#F9F9F9", borderRadius: "8px", padding: "20px", border: "1px solid #D9D9D9" }}>
                  <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", color: "#800000", marginBottom: "12px" }}>Email Draft</div>
                  {advisingDraftLoading ? (
                    <div style={{ color: "#737373", fontSize: "13px" }}>Writing draft…</div>
                  ) : (
                    <>
                      <textarea value={advisingDraft} onChange={e => setAdvisingDraft(e.target.value)}
                        style={{ width: "100%", minHeight: "220px", padding: "12px", borderRadius: "5px", border: "1px solid #D9D9D9", background: "#fff", color: "#000", fontSize: "13px", lineHeight: 1.6, fontFamily: "inherit", resize: "vertical", outline: "none", boxSizing: "border-box" }} />
                      <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
                        <button onClick={() => navigator.clipboard.writeText(advisingDraft)}
                          style={{ background: "#800000", color: "#fff", border: "none", borderRadius: "5px", padding: "8px 16px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
                          Copy to Clipboard
                        </button>
                        <button onClick={handleAdvisingDraft}
                          style={{ background: "transparent", color: "#737373", border: "1px solid #D9D9D9", borderRadius: "5px", padding: "7px 14px", fontSize: "13px", cursor: "pointer" }}>
                          Regenerate
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
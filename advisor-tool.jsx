import { useState, useCallback, useMemo, useEffect } from "react";

// ── CONFIG ────────────────────────────────────────────────────────────────────
const SPREADSHEET_ID = "1gd9Ybyq19BwMtoxgY2pMCy2ogVD9ZrFNcu5Tig8jJbo";
const SHEET_NAME = "Innovation Hub";
const SERVICE_ACCOUNT_EMAIL = "innovation-hub-reader@careers-in-ai-testing-123.iam.gserviceaccount.com";
const PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDBnVxl+zSxVU4e\nqGb1T2oGLPR+4U228tfiDXvydMBDIPLRmaD/ELEsziSHYMH5VPzaOnOjYIdTLFaA\n9bPAXmOkoWax7l5nCqfKpd7Oxsc9yqgVvk90tMfjXrg2beuxRWiz7Bee81kKDL3H\nriOpRLMGBa4rpBY/UT5WE1qszb4e4ZfIFdC2ZcGynSQNBhEpNio+rL7fOBkFH+dA\ndczLYuRCA1VvKoH/XVtT2bJ7ZHVei92tH1rzs0L/w8MAOCOFkeipUu/lv640rP0+\nM7TDLt01MZnEwdL9dj42PjagNaZVntVTpXc6igKf+q29ViSOJBHV/+so+4sQYGYm\nAqnlCoP1AgMBAAECggEAHXmQTHIutmRvLRmj+uppEKGdYwd3pkdX+DDnUqTVdCK6\n9I+3w7zNzC1hwD5JqWR3zd0iJ5gVYeMZFC7Te5CjCLgNgz7vni4wFxijT8VRJaYJ\naq37OKAg4gtUbezT+bvAUcu6WNdhEbeY2KI5CZbMzjjlJ/2l6WO74qy1nCMCM38O\nq18B1z+aX+iifkl6dj6cXXTskBA6g+RnRflOWGwyQNLv1zXdZZm1eJzvwVbcATA5\n0QXcshb1eiFSL7T7IPsTl56JwYXIbPH745HH63cAJbo+TutJdYzzICuCSXq7K+bE\nOjTBuMtJGbzjsKwcolMwQyZkeVMu1miAF/uldoZnrQKBgQDgq6urokGeV5XMH3jv\nNfcDGC0FteOm5c8TBHkqDL0QSmkhf2IWShBCI7mgQ+XkrTrAwcMtAj1UUlDoBdZd\nnqo53c/jWgAK28HnMGsxbFSkHk5O1fps70bwzZ0KYsM2mYQqVQ019JhRVx3atJ2a\nspiJLAfiHCqWuiW9xwKeOnDKFwKBgQDcnQ0z03gUE0ksl4RwzrTVz0A3eyltKsMB\n5c8bwnUB2FGy+H0lss89NHoS01TcSGq4dTv1fp6qECNuv2M21ApVWv5obeSw5vtV\nIpnnWg/Vqu4r1G/+jRVyRxOz82uYLs0zOAuyXTDktGZYf3NAVVPJkpOkKoM0FZXc\n1NVCs1qF0wKBgEmFI+pIcHymYKipa+OrnyduE92YheSpszef8R5niL75+qkxjCGL\nHwLluerODT7lySImxf3Gi9c6EKu8rUd5km7ZPRxC6VykSTGkUI+dyZzjJfD6aLaZ\nHnfScR9i7krBtdQ8fNQ5NFb50RUuoZxr8SqCNBoz6WPlilAt/ZdVvG8FAoGBAJ30\nSH6h2yisgkjOF0JZjXpEUFso8Ik8A7F5I+dhPDtc8WntplT2iJDu4LRX4TtzEg4N\nyidESD/FHElv+I5KFTf11Y9Zl1LdnnffNUhC4HGAV9TD3ofn5cITh9Tg5VlpsPwK\nFb3YIWiujVSxtAgMz9fT/aed1KDXD5y0Ohjup1KHAoGALrFktP6pyIyFCSgJ2i8E\n5VrzrNVYJSJwFlWbZdYxy8ll0C8QKkd1OpWJzz5EqWN/tu0KvS6rGdl6oBX/G54n\npBXi6qifWsl+CnlACjOm9yMxkBr5WDB1rR6CummTNkPf2H4EHIYYe/ykbUS2BGG0\nH7GimB5/Hc0Ro9OjI7rxwOE=\n-----END PRIVATE KEY-----\n";

// ── GOOGLE SHEETS AUTH + FETCH ────────────────────────────────────────────────
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
  const pemContents = PRIVATE_KEY
    .replace(/-----BEGIN PRIVATE KEY-----/, "")
    .replace(/-----END PRIVATE KEY-----/, "")
    .replace(/\n/g, "");
  const binaryDer = Uint8Array.from(atob(pemContents), (c) => c.charCodeAt(0));
  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8", binaryDer.buffer,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5", cryptoKey, new TextEncoder().encode(signingInput)
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
  const headers = values[1]; // Row 2 is real headers
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

function flagSeverity(row) {
  const msg = row["Failure Message"] || "";
  if (msg.includes("[FAIL")) return "fail";
  if (msg.includes("[WARN")) return "warn";
  return null;
}

// ── SHEET ROW → RESOURCE OBJECT ───────────────────────────────────────────────
// Maps Innovation Hub columns to the scoring/display schema used by the hub UI
function sheetRowToResource(row, idx) {
  const industryRaw = row["Industry"] || "";
  const industries = industryRaw.split(",").map(s => s.trim()).filter(Boolean);

  const roleTagRaw = row["Role Tag"] || "";
  const tags = roleTagRaw.split(",").map(s => s.trim()).filter(Boolean);

  const employerAITag = row["Employer AI Tag"] || "";
  if (employerAITag === "AI Native" && !tags.includes("AI Native")) tags.push("AI Native");

  // Build keyword list from title + oneliner + industry + role type for semantic matching
  const title = (row["Title"] || "").toLowerCase();
  const oneliner = (row["One-liner"] || "").toLowerCase();
  const roleType = (row["Role Type"] || "").toLowerCase();
  const employer = (row["Employer/Host"] || "").toLowerCase();
  const location = (row["Location"] || "").toLowerCase();

  // Extract meaningful words as keywords (filter stop words)
  const stopWords = new Set(["the","a","an","and","or","for","to","in","at","of","with","by","is","are","that","this","you","will","on","as","it","be","from","your","our","we","have","has","can","all","its","their","who","how","what","get","use","help","make","build","work","role","new","using","into","about","each","also"]);
  const keywordText = `${title} ${oneliner} ${roleType} ${employer} ${location}`;
  const keywords = [...new Set(
    keywordText.split(/\W+/).filter(w => w.length > 3 && !stopWords.has(w))
  )].slice(0, 30);

  return {
    id: idx,
    type: row["Resource Type [External Search]"] || "",
    title: row["Title"] || "Untitled",
    oneliner: row["One-liner"] || "",
    url: row["URL"] || "",
    deadline: row["Date"] || row["Removal Date [Internal]"] || "Rolling",
    industry: industries,
    tags,
    location: row["Location"] || "",
    employer: row["Employer/Host"] || "",
    keywords,
    flag: flagSeverity(row),
    flagMsg: row["Failure Message"] || "",
  };
}


// ── Session type definitions ──────────────────────────────────────────────────
const SESSION_TYPES = [
  {
    value: "intro-first-year",
    label: "Intro Meeting — First Years",
    resourceDefaults: ["resume", "tools", "programs"],
    promptContext: "This was a first introduction meeting. Focus action items on: setting up their resume using the UChicago template, booking a follow-up session, and exploring career resources. Keep tone encouraging and welcoming.",
    defaultActions: [
      "Download the UChicago resume template and fill in your information — don't worry about perfection, we can workshop it together next time.",
      "Book a follow-up advising session on Handshake for later this quarter."
    ]
  },
  {
    value: "career-exploration",
    label: "Career Exploration",
    resourceDefaults: ["programs", "tools"],
    promptContext: "This was a career exploration session. Focus action items on: continuing to explore career paths, attending events, and reflecting on experiences. Encourage curiosity and openness.",
    defaultActions: [
      "Continue exploring different career paths — say yes to opportunities that come your way and reflect on what you enjoy.",
      "Book a follow-up advising session on Handshake to discuss networking strategies."
    ]
  },
  {
    value: "resume-review",
    label: "Resume Review",
    resourceDefaults: ["resume"],
    promptContext: "This was a resume review session. Focus action items on: specific resume edits discussed, sending the updated resume back by end of next week. Be specific about what needs fixing based on the notes.",
    defaultActions: [
      "Update your resume based on our feedback — ensure each bullet is 1.5–2 lines and follows: strong action verb + description + results.",
      "Reply to this email with your updated resume (Word Doc or Google Drive share) by end of next week."
    ]
  },
  {
    value: "job-search",
    label: "Job Search & Networking",
    resourceDefaults: ["summer-intern", "ay-intern", "full-time", "tools"],
    promptContext: "This was a job search and networking strategy session. Focus action items on: setting up job alerts, sending LinkedIn follow-ups, booking informational interviews. Be concrete about targets and timelines.",
    defaultActions: [
      "Set up job alerts on LinkedIn and Handshake for your target companies.",
      "Set up at least 3 informational interviews with professionals at companies you're targeting.",
      "Keep me posted when you get any interview requests!"
    ]
  },
  {
    value: "interview-prep",
    label: "Interview Prep",
    resourceDefaults: ["tools"],
    promptContext: "This was an interview prep session. Focus action items on: preparing with the resources shared, sending a thank you note after the interview, following up on outcomes. Be specific about the role if mentioned in notes.",
    defaultActions: [
      "Prepare for your interview using the resources and feedback from today.",
      "Send a thank you note to the interviewer within 2 hours of the interview if possible.",
      "Keep me posted on how it goes!"
    ]
  },
  {
    value: "search-checkin",
    label: "Internship / Job Search Check-In",
    resourceDefaults: ["summer-intern", "ay-intern", "full-time"],
    promptContext: "This was a mid-search check-in. Focus action items on: next concrete steps in the search, any application or networking targets to hit before the next session.",
    defaultActions: [
      "Keep applying broadly — aim for at least 3 new applications this week.",
      "Book a follow-up session on Handshake to check in on progress."
    ]
  },
  {
    value: "post-internship",
    label: "Post-Internship & Career Goals Check-In",
    resourceDefaults: ["full-time", "summer-intern", "resume"],
    promptContext: "This was a post-internship check-in. Focus action items on: updating the resume with summer experience, clarifying goals for the next search cycle, and building on what they learned.",
    defaultActions: [
      "Update your resume to reflect your summer experience — use the bullet framework we discussed.",
      "Book a follow-up session on Handshake once your resume is updated."
    ]
  },
  {
    value: "portfolio-intro",
    label: "Careers In Portfolio Intro",
    resourceDefaults: ["resume", "tools", "programs", "summer-intern", "ay-intern"],
    promptContext: "This was a general Careers In portfolio intro meeting (not industry-specific). Focus action items on: resume setup, exploring career resources broadly, and next steps in the search.",
    defaultActions: [
      "Download the UChicago resume template and start building it out.",
      "Explore the career resources and upcoming opportunities shared today.",
      "Book a follow-up advising session on Handshake."
    ]
  },
];

// ── Resource type options ─────────────────────────────────────────────────────
const RESOURCE_TYPE_OPTIONS = [
  { label: "Resume / Cover Letter", value: "resume", types: ["Cool Tools & Resources", "Career Advisors"] },
  { label: "AY Internship", value: "ay-intern", types: ["Internship- Academic Year"] },
  { label: "Summer Internship", value: "summer-intern", types: ["Internship- Summer"] },
  { label: "Full Time Role", value: "full-time", types: ["Full Time Role"] },
  { label: "Programs & Events", value: "programs", types: ["Program", "Event"] },
  { label: "Tools & Resources", value: "tools", types: ["Cool Tools & Resources"] },
  { label: "Research", value: "research", types: ["Cool Tools & Resources", "Program"] },
];

const COMPANY_SIZE_OPTIONS = ["Startup", "Large Corporation", "Small Business", "Nonprofit", "Government / National Lab"];
const ROLE_TYPE_OPTIONS = ["Software / Engineering", "Data Science / ML", "Research", "Business / Operations", "Product Management", "Design / UX", "Finance / Quant"];
const LOCATION_SUGGESTIONS = ["Chicago", "New York", "San Francisco", "Remote", "Boston", "DC", "Austin"];

const TYPE_COLORS = {
  "Full Time Role": "#800000",
  "Internship- Summer": "#9b4a00",
  "Internship- Academic Year": "#7a4800",
  "Event": "#1a3a6b",
  "Program": "#2d5a27",
  "Cool Tools & Resources": "#4a3570",
  "Career Advisors": "#555",
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function getActiveTypes(selectedOptions) {
  if (!selectedOptions || selectedOptions.length === 0) return null;
  const types = new Set();
  selectedOptions.forEach(val => {
    const opt = RESOURCE_TYPE_OPTIONS.find(o => o.value === val);
    if (opt) opt.types.forEach(t => types.add(t));
  });
  return types;
}

function scoreResource(resource, notes, locationPref, companySizes, roleTypes) {
  let score = 0;
  const text = notes.toLowerCase();
  const loc = locationPref.toLowerCase();

  if (loc) {
    const rLoc = (resource.oneliner + " " + (resource.location || "")).toLowerCase();
    if (rLoc.includes("remote") || rLoc.includes("virtual")) score += 1;
    if (rLoc.includes(loc.split(",")[0].trim())) score += 2;
  }

  if (companySizes.includes("Startup") && resource.tags.includes("Startup")) score += 3;
  if (companySizes.includes("Startup") && resource.tags.includes("AI Native")) score += 2;
  if (companySizes.includes("Large Corporation") && !resource.tags.includes("Startup") && !resource.tags.includes("AI Native")) score += 1;
  if (companySizes.includes("Government / National Lab") && resource.industry.some(i => i.includes("Research") || i.includes("National Security"))) score += 2;

  if (roleTypes.includes("Software / Engineering") && resource.tags.includes("Technical AI")) score += 2;
  if (roleTypes.includes("Data Science / ML") && (resource.tags.includes("Technical AI") || resource.industry.includes("Artificial Intelligence"))) score += 2;
  if (roleTypes.includes("Research") && resource.keywords.some(k => ["research","grant","lab","faculty"].includes(k))) score += 3;
  if (roleTypes.includes("Finance / Quant") && resource.industry.some(i => i.includes("Finance"))) score += 2;

  resource.keywords.forEach(kw => { if (text.includes(kw)) score += 1; });

  if (/research|lab|faculty|phd|grant/.test(text) && resource.keywords.some(k => ["research","grant","lab","faculty"].includes(k))) score += 2;
  if (/interview|leetcode|prep|practice/.test(text) && resource.id >= 15 && resource.id <= 17) score += 3;
  if (/resume|cover letter/.test(text) && resource.type === "Career Advisors") score += 3;
  if (/finance|quant|trading/.test(text) && resource.industry.some(i => i.includes("Finance"))) score += 2;
  if (/startup|founder|vc/.test(text) && resource.tags.includes("Startup")) score += 2;
  if (/healthcare|hospital|biotech/.test(text) && resource.industry.some(i => i.includes("Healthcare"))) score += 2;

  return score;
}

function inferResourceTypes(notes) {
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
}

// ── Sub-components ────────────────────────────────────────────────────────────
function SectionLabel({ children, sub }) {
  return (
    <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", color: "#800000", marginBottom: sub ? "4px" : "8px" }}>
      {children}
    </div>
  );
}

function ToggleChip({ label, active, onClick, color }) {
  const c = color || "#800000";
  return (
    <button onClick={onClick} style={{
      padding: "5px 11px", borderRadius: "20px", fontSize: "12px", fontWeight: 500,
      border: `1.5px solid ${active ? c : "#ddd"}`,
      background: active ? c + "18" : "#fff",
      color: active ? c : "#666",
      cursor: "pointer", transition: "all 0.1s", whiteSpace: "nowrap"
    }}>{label}</button>
  );
}

function TypeBadge({ type }) {
  const color = TYPE_COLORS[type] || "#666";
  return (
    <span style={{ background: color, color: "#fff", fontSize: "10px", fontWeight: 600, padding: "2px 7px", borderRadius: "3px", letterSpacing: "0.04em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
      {type}
    </span>
  );
}

function ResourceCard({ resource, selected, onToggle }) {
  return (
    <div onClick={onToggle} style={{
      border: selected ? "2px solid #800000" : "1.5px solid #e0dbd5",
      borderRadius: "6px", padding: "11px 13px", marginBottom: "7px",
      cursor: "pointer", background: selected ? "#fff8f8" : "#fff",
      display: "flex", gap: "11px", alignItems: "flex-start",
    }}>
      <div style={{
        marginTop: "2px", width: "17px", height: "17px", borderRadius: "4px",
        border: selected ? "2px solid #800000" : "2px solid #ccc",
        background: selected ? "#800000" : "#fff",
        flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center"
      }}>
        {selected && <span style={{ color: "#fff", fontSize: "11px" }}>✓</span>}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "3px" }}>
          <TypeBadge type={resource.type} />
          {resource.tags.map(t => (
            <span key={t} style={{ fontSize: "10px", color: "#666", background: "#f0ede8", padding: "1px 6px", borderRadius: "3px" }}>{t}</span>
          ))}
        </div>
        <div style={{ fontWeight: 600, fontSize: "13px", color: "#1a1a1a", marginBottom: "2px" }}>{resource.title}</div>
        <div style={{ fontSize: "12px", color: "#555", lineHeight: 1.45 }}>{resource.oneliner}</div>
        <div style={{ fontSize: "11px", color: "#aaa", marginTop: "3px" }}>Deadline: {resource.deadline}</div>
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function AdvisingHub() {
  // Input fields
  const [studentName, setStudentName] = useState("");
  const [sessionTypes, setSessionTypes] = useState([]);
  const [notes, setNotes] = useState("");
  const [locationPref, setLocationPref] = useState("");
  const [companySizes, setCompanySizes] = useState([]);
  const [roleTypes, setRoleTypes] = useState([]);
  const [resourceTypeFilter, setResourceTypeFilter] = useState([]);

  // Live data from Google Sheets
  const [liveResources, setLiveResources] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const values = await fetchSheetData();
        const parsed = parseRows(values).filter(r => !isExpired(r));
        const resources = parsed
          .filter(r => r["Resource Type [External Search]"] && r["Title"])
          .map((r, i) => sheetRowToResource(r, i));
        setLiveResources(resources);
      } catch (e) {
        setDataError(e.message);
      } finally {
        setDataLoading(false);
      }
    })();
  }, []);

  // Results state
  const [matches, setMatches] = useState(null);
  const [activeTypeFilter, setActiveTypeFilter] = useState([]);
  const [selected, setSelected] = useState({});
  const [draft, setDraft] = useState("");
  const [loadingMatch, setLoadingMatch] = useState(false);
  const [loadingDraft, setLoadingDraft] = useState(false);
  const [step, setStep] = useState("input");

  const toggleArr = (arr, setArr, val) =>
    setArr(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);

  // When session types change, update resource type defaults
  const handleSessionTypeToggle = (val) => {
    const next = sessionTypes.includes(val)
      ? sessionTypes.filter(x => x !== val)
      : [...sessionTypes, val];
    setSessionTypes(next);
    // Merge resource defaults from all selected session types
    const defaults = new Set();
    next.forEach(st => {
      const found = SESSION_TYPES.find(s => s.value === st);
      if (found) found.resourceDefaults.forEach(d => defaults.add(d));
    });
    setResourceTypeFilter([...defaults]);
  };

  const handleMatch = useCallback(() => {
    if (!notes.trim()) return;
    setLoadingMatch(true);

    // Merge: session defaults + inferred from notes + manual selections
    const inferred = inferResourceTypes(notes);
    const sessionDefaults = new Set();
    sessionTypes.forEach(st => {
      const found = SESSION_TYPES.find(s => s.value === st);
      if (found) found.resourceDefaults.forEach(d => sessionDefaults.add(d));
    });
    const merged = [...new Set([...sessionDefaults, ...inferred, ...resourceTypeFilter])];
    setActiveTypeFilter(merged);

    const activeTypes = getActiveTypes(merged);
    const results = liveResources
      .map(r => ({ ...r, score: scoreResource(r, notes, locationPref, companySizes, roleTypes) }))
      .filter(r => r.score > 0)
      .filter(r => !activeTypes || activeTypes.has(r.type))
      .sort((a, b) => b.score - a.score)
      .slice(0, 12);

    setMatches(results);
    setSelected({});
    setDraft("");
    setStep("review");
    setLoadingMatch(false);
  }, [notes, locationPref, companySizes, roleTypes, resourceTypeFilter, sessionTypes, liveResources]);

  const filteredMatches = useMemo(() => {
    if (!matches) return null;
    const activeTypes = getActiveTypes(activeTypeFilter);
    if (!activeTypes) return matches;
    return matches.filter(r => activeTypes.has(r.type));
  }, [matches, activeTypeFilter]);

  const toggleSelect = (id) => setSelected(prev => ({ ...prev, [id]: !prev[id] }));
  const selectedResources = filteredMatches ? filteredMatches.filter(r => selected[r.id]) : [];

  const handleDraft = useCallback(async () => {
    if (selectedResources.length === 0) return;
    setLoadingDraft(true);
    setStep("draft");

    const sessionLabels = sessionTypes.map(v => SESSION_TYPES.find(s => s.value === v)?.label).filter(Boolean);
    const sessionContexts = sessionTypes.map(v => SESSION_TYPES.find(s => s.value === v)?.promptContext).filter(Boolean);
    const sessionDefaultActions = sessionTypes.flatMap(v => SESSION_TYPES.find(s => s.value === v)?.defaultActions || []);

    const resourceList = selectedResources.map(r =>
      `- ${r.title} (${r.type}): ${r.oneliner} | Link: ${r.url} | Deadline: ${r.deadline}`
    ).join("\n");

    const contextLines = [
      locationPref && `Preferred locations: ${locationPref}`,
      companySizes.length && `Company preferences: ${companySizes.join(", ")}`,
      roleTypes.length && `Role interests: ${roleTypes.join(", ")}`,
    ].filter(Boolean).join("\n");

    const prompt = `You are a UChicago career advisor writing a follow-up email to a student after an advising session.

Student name: ${studentName || "the student"}
Session type(s): ${sessionLabels.length ? sessionLabels.join(", ") : "General advising"}

Session-specific guidance:
${sessionContexts.length ? sessionContexts.join(" ") : "Write a warm, helpful follow-up."}

Advisor's notes from the session:
${notes}
${contextLines ? `\nStudent context:\n${contextLines}` : ""}

Default action items for this session type (use these as a starting point, adapt based on notes above — remove any that don't apply, add specifics from the notes):
${sessionDefaultActions.map(a => `- ${a}`).join("\n")}

Resources to weave in:
${resourceList}

Write a follow-up email. Rules:
- No filler phrases or corporate speak
- Action items should be a clear bulleted list — specific, concrete, not vague
- Weave in the resources naturally near relevant action items (don't dump them all at the end)
- Under 250 words total
- Close with an invitation to reach out or book another session
- Sign off as [Advisor Name] (leave the name as a bracket placeholder)

Return only the email body. No subject line.`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 1000, messages: [{ role: "user", content: prompt }] }),
    });
    const data = await response.json();
    setDraft(data.content?.[0]?.text || "");
    setLoadingDraft(false);
  }, [selectedResources, notes, studentName, locationPref, companySizes, roleTypes, sessionTypes]);

  const reset = () => {
    setStudentName(""); setSessionTypes([]); setNotes(""); setLocationPref("");
    setCompanySizes([]); setRoleTypes([]); setResourceTypeFilter([]);
    setActiveTypeFilter([]); setMatches(null); setSelected({});
    setDraft(""); setStep("input");
  };

  const card = { background: "#fff", borderRadius: "8px", padding: "20px", border: "1px solid #e8e4df", marginBottom: "14px" };

  if (dataLoading) return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: "#f7f5f2", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", color: "#888" }}>
        <div style={{ fontSize: "28px", marginBottom: "12px" }}>⟳</div>
        <div style={{ fontSize: "14px", fontWeight: 500 }}>Loading Innovation Hub…</div>
        <div style={{ fontSize: "12px", color: "#aaa", marginTop: "4px" }}>Connecting to Google Sheets</div>
      </div>
    </div>
  );

  if (dataError) return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: "#f7f5f2", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", color: "#800000", maxWidth: "400px", padding: "20px" }}>
        <div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "8px" }}>Failed to load Innovation Hub</div>
        <div style={{ fontSize: "12px", color: "#666", background: "#fff", padding: "10px", borderRadius: "5px", border: "1px solid #e8e4df" }}>{dataError}</div>
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", maxWidth: "800px", margin: "0 auto", padding: "28px 20px", color: "#1a1a1a", minHeight: "100vh", background: "#f7f5f2" }}>

      {/* Header */}
      <div style={{ borderBottom: "3px solid #800000", paddingBottom: "14px", marginBottom: "22px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
          <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#800000" }}>Careers in AI</span>
          <span style={{ color: "#ddd" }}>|</span>
          <span style={{ fontSize: "11px", color: "#999", letterSpacing: "0.05em" }}>University of Chicago · Career Advancement</span>
        </div>
        <h1 style={{ margin: "5px 0 2px", fontSize: "21px", fontWeight: 700, letterSpacing: "-0.3px" }}>Advising Follow-Up Hub</h1>
        <p style={{ margin: 0, fontSize: "12.5px", color: "#777" }}>Paste session notes → match resources → draft the follow-up email.</p>
        <div style={{ marginTop: "5px", fontSize: "11px", color: "#aaa" }}>
          <span style={{ display: "inline-block", width: "6px", height: "6px", borderRadius: "50%", background: liveResources.length > 0 ? "#2d5a27" : "#ccc", marginRight: "5px", verticalAlign: "middle" }}></span>
          {liveResources.length > 0 ? `${liveResources.length} live resources from Innovation Hub` : "Connecting to Innovation Hub…"}
        </div>
      </div>

      {/* INPUT PANEL */}
      <div style={card}>

        {/* Student name */}
        <div style={{ marginBottom: "18px" }}>
          <SectionLabel>Student Name</SectionLabel>
          <input value={studentName} onChange={e => setStudentName(e.target.value)} placeholder="e.g. Alex Chen"
            style={{ width: "100%", padding: "8px 10px", borderRadius: "5px", border: "1.5px solid #ddd", fontSize: "14px", outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
        </div>

        {/* Session type */}
        <div style={{ marginBottom: "18px" }}>
          <SectionLabel>Session Type <span style={{ fontWeight: 400, color: "#aaa", textTransform: "none", letterSpacing: 0 }}>(optional · multi-select · sets resource defaults)</span></SectionLabel>
          <div style={{ display: "flex", gap: "7px", flexWrap: "wrap" }}>
            {SESSION_TYPES.map(s => (
              <ToggleChip key={s.value} label={s.label} active={sessionTypes.includes(s.value)}
                onClick={() => handleSessionTypeToggle(s.value)} color="#800000" />
            ))}
          </div>
        </div>

        {/* Session notes */}
        <div style={{ marginBottom: "18px" }}>
          <SectionLabel>Session Notes</SectionLabel>
          <textarea value={notes} onChange={e => setNotes(e.target.value)}
            placeholder={"Paste your bullet-point notes here.\n\n- junior, CS + Stats, interested in ML engineering\n- wants summer internship at a startup\n- resume bullets too vague, needs quantified impact\n- asked about AI research grant"}
            style={{ width: "100%", minHeight: "120px", padding: "10px 12px", borderRadius: "5px", border: "1.5px solid #ddd", fontSize: "13px", lineHeight: 1.5, resize: "vertical", fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} />
        </div>

        {/* Location */}
        <div style={{ marginBottom: "18px" }}>
          <SectionLabel>Preferred Locations</SectionLabel>
          <input value={locationPref} onChange={e => setLocationPref(e.target.value)} placeholder="e.g. Chicago, New York, Remote"
            style={{ width: "100%", padding: "8px 10px", borderRadius: "5px", border: "1.5px solid #ddd", fontSize: "13px", outline: "none", boxSizing: "border-box", fontFamily: "inherit", marginBottom: "7px" }} />
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {LOCATION_SUGGESTIONS.map(l => (
              <button key={l} onClick={() => setLocationPref(prev => prev ? (prev.includes(l) ? prev : prev + ", " + l) : l)}
                style={{ fontSize: "11px", padding: "3px 9px", borderRadius: "12px", border: "1px solid #ddd", background: locationPref.includes(l) ? "#fff0f0" : "#faf9f7", color: locationPref.includes(l) ? "#800000" : "#777", cursor: "pointer" }}>
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Company type */}
        <div style={{ marginBottom: "18px" }}>
          <SectionLabel>Company Type</SectionLabel>
          <div style={{ display: "flex", gap: "7px", flexWrap: "wrap" }}>
            {COMPANY_SIZE_OPTIONS.map(opt => (
              <ToggleChip key={opt} label={opt} active={companySizes.includes(opt)} onClick={() => toggleArr(companySizes, setCompanySizes, opt)} />
            ))}
          </div>
        </div>

        {/* Role types */}
        <div style={{ marginBottom: "18px" }}>
          <SectionLabel>Role Types of Interest</SectionLabel>
          <div style={{ display: "flex", gap: "7px", flexWrap: "wrap" }}>
            {ROLE_TYPE_OPTIONS.map(opt => (
              <ToggleChip key={opt} label={opt} active={roleTypes.includes(opt)} onClick={() => toggleArr(roleTypes, setRoleTypes, opt)} />
            ))}
          </div>
        </div>

        {/* Resource type pre-filter */}
        <div style={{ marginBottom: "20px" }}>
          <SectionLabel>Resources to Include <span style={{ fontWeight: 400, color: "#aaa", textTransform: "none", letterSpacing: 0 }}>(auto-set by session type · adjust as needed)</span></SectionLabel>
          <div style={{ display: "flex", gap: "7px", flexWrap: "wrap" }}>
            {RESOURCE_TYPE_OPTIONS.map(opt => (
              <ToggleChip key={opt.value} label={opt.label} active={resourceTypeFilter.includes(opt.value)}
                onClick={() => toggleArr(resourceTypeFilter, setResourceTypeFilter, opt.value)} color="#2d5a27" />
            ))}
          </div>
          {sessionTypes.length > 0 && resourceTypeFilter.length > 0 && (
            <div style={{ marginTop: "7px", fontSize: "11px", color: "#999" }}>
              Defaults set from: {sessionTypes.map(v => SESSION_TYPES.find(s => s.value === v)?.label).filter(Boolean).join(", ")}
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button onClick={handleMatch} disabled={!notes.trim() || loadingMatch}
            style={{ background: notes.trim() ? "#800000" : "#ccc", color: "#fff", border: "none", borderRadius: "5px", padding: "9px 20px", fontSize: "13.5px", fontWeight: 600, cursor: notes.trim() ? "pointer" : "not-allowed" }}>
            {loadingMatch ? "Matching…" : "Find Matching Resources"}
          </button>
          {step !== "input" && (
            <button onClick={reset} style={{ background: "transparent", color: "#888", border: "1.5px solid #ddd", borderRadius: "5px", padding: "8px 14px", fontSize: "13px", cursor: "pointer" }}>
              Start Over
            </button>
          )}
        </div>
      </div>

      {/* RESULTS PANEL */}
      {filteredMatches !== null && (
        <div style={card}>

          {/* Post-match type filters */}
          <div style={{ marginBottom: "14px" }}>
            <SectionLabel sub>Filter results</SectionLabel>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              <button onClick={() => setActiveTypeFilter([])}
                style={{ fontSize: "12px", padding: "4px 11px", borderRadius: "12px", border: `1.5px solid ${activeTypeFilter.length === 0 ? "#800000" : "#ddd"}`, background: activeTypeFilter.length === 0 ? "#fff0f0" : "#fff", color: activeTypeFilter.length === 0 ? "#800000" : "#666", cursor: "pointer" }}>
                All
              </button>
              {RESOURCE_TYPE_OPTIONS.map(opt => (
                <button key={opt.value} onClick={() => toggleArr(activeTypeFilter, setActiveTypeFilter, opt.value)}
                  style={{ fontSize: "12px", padding: "4px 11px", borderRadius: "12px", border: `1.5px solid ${activeTypeFilter.includes(opt.value) ? "#800000" : "#ddd"}`, background: activeTypeFilter.includes(opt.value) ? "#fff0f0" : "#fff", color: activeTypeFilter.includes(opt.value) ? "#800000" : "#666", cursor: "pointer" }}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "12px" }}>
            <span style={{ fontSize: "12px", color: "#999" }}>{filteredMatches.length} resource{filteredMatches.length !== 1 ? "s" : ""} · click to select</span>
            {selectedResources.length > 0 && <span style={{ fontSize: "12px", color: "#800000", fontWeight: 600 }}>{selectedResources.length} selected</span>}
          </div>

          {filteredMatches.length === 0 ? (
            <p style={{ color: "#888", fontSize: "13px" }}>No matches for this filter. Try selecting "All" or broadening the resource types.</p>
          ) : (
            filteredMatches.map(r => (
              <ResourceCard key={r.id} resource={r} selected={!!selected[r.id]} onToggle={() => toggleSelect(r.id)} />
            ))
          )}

          {selectedResources.length > 0 && (
            <button onClick={handleDraft} disabled={loadingDraft}
              style={{ marginTop: "10px", background: "#800000", color: "#fff", border: "none", borderRadius: "5px", padding: "9px 20px", fontSize: "13.5px", fontWeight: 600, cursor: "pointer" }}>
              {loadingDraft ? "Drafting…" : `Draft Email with ${selectedResources.length} Resource${selectedResources.length > 1 ? "s" : ""}`}
            </button>
          )}
        </div>
      )}

      {/* DRAFT PANEL */}
      {(draft || loadingDraft) && (
        <div style={card}>
          <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", color: "#800000", marginBottom: "12px" }}>
            Email Draft
            {sessionTypes.length > 0 && (
              <span style={{ fontWeight: 400, color: "#aaa", textTransform: "none", letterSpacing: 0, marginLeft: "8px", fontSize: "11px" }}>
                · {sessionTypes.map(v => SESSION_TYPES.find(s => s.value === v)?.label).filter(Boolean).join(", ")}
              </span>
            )}
          </div>
          {loadingDraft ? (
            <div style={{ color: "#aaa", fontSize: "13px" }}>Writing draft…</div>
          ) : (
            <>
              <textarea value={draft} onChange={e => setDraft(e.target.value)}
                style={{ width: "100%", minHeight: "240px", padding: "12px", borderRadius: "5px", border: "1.5px solid #ddd", fontSize: "13.5px", lineHeight: 1.6, fontFamily: "inherit", resize: "vertical", outline: "none", boxSizing: "border-box", color: "#1a1a1a" }} />
              <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
                <button onClick={() => navigator.clipboard.writeText(draft)}
                  style={{ background: "#800000", color: "#fff", border: "none", borderRadius: "5px", padding: "8px 16px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
                  Copy to Clipboard
                </button>
                <button onClick={handleDraft}
                  style={{ background: "transparent", color: "#555", border: "1.5px solid #ddd", borderRadius: "5px", padding: "7px 14px", fontSize: "13px", cursor: "pointer" }}>
                  Regenerate
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

with open('src/App.jsx') as f:
    app = f.read()

# 1. Add output format and approval status toggle state
app = app.replace(
    '  const [copied, setCopied] = useState(false);',
    '  const [copied, setCopied] = useState(false);\n  const [outputFormat, setOutputFormat] = useState("plain");\n  const [showFlagged, setShowFlagged] = useState(true);'
)

# 2. Add toggles UI after copy button
old_copy_btn = '''                  <button style={styles.copyBtn} onClick={copyNewsletter}>
                    {copied ? "✓ Copied to clipboard" : "Copy all for Mailchimp"}
                  </button>'''

new_copy_btn = '''                  <div style={{display:"flex",gap:"12px",alignItems:"center",marginBottom:"20px",flexWrap:"wrap"}}>
                    <button style={styles.copyBtn} onClick={copyNewsletter}>
                      {copied ? "✓ Copied to clipboard" : "Copy all for Mailchimp"}
                    </button>
                    <div style={{display:"flex",gap:"4px",background:"#F5F5F5",borderRadius:"6px",padding:"2px"}}>
                      <button onClick={() => setOutputFormat("plain")} style={{padding:"4px 10px",fontSize:"11px",fontWeight:"600",borderRadius:"4px",border:"none",cursor:"pointer",background:outputFormat==="plain"?"#800000":"transparent",color:outputFormat==="plain"?"#fff":"#737373"}}>Plain Text</button>
                      <button onClick={() => setOutputFormat("html")} style={{padding:"4px 10px",fontSize:"11px",fontWeight:"600",borderRadius:"4px",border:"none",cursor:"pointer",background:outputFormat==="html"?"#800000":"transparent",color:outputFormat==="html"?"#fff":"#737373"}}>HTML</button>
                    </div>
                    <div style={{display:"flex",gap:"4px",background:"#F5F5F5",borderRadius:"6px",padding:"2px"}}>
                      <button onClick={() => setShowFlagged(true)} style={{padding:"4px 10px",fontSize:"11px",fontWeight:"600",borderRadius:"4px",border:"none",cursor:"pointer",background:showFlagged?"#800000":"transparent",color:showFlagged?"#fff":"#737373"}}>Show All</button>
                      <button onClick={() => setShowFlagged(false)} style={{padding:"4px 10px",fontSize:"11px",fontWeight:"600",borderRadius:"4px",border:"none",cursor:"pointer",background:!showFlagged?"#800000":"transparent",color:!showFlagged?"#fff":"#737373"}}>Hide Flagged</button>
                    </div>
                  </div>'''

app = app.replace(old_copy_btn, new_copy_btn)

# 3. Add formatForOutput function before AdvisorTool component
format_fn = '''
function formatForOutput(row, format) {
  const type = row["Resource Type [External Search]"] || "";
  const title = row["Title"] || "Untitled";
  const url = row["URL"] || "";
  const employer = row["Employer/Host"] || "";
  const location = row["Location"] || "";
  const date = row["Date"] || "";
  const oneliner = row["One-liner"] || "";

  if (format === "html") {
    const link = (text, href) => href ? `<a href="${href}">${text}</a>` : text;
    const bold = (text) => `<b>${text}</b>`;
    const italic = (text) => `<i>${text}</i>`;
    const center = (text) => `<div style="text-align:center">${text}</div>`;
    const pipe = " | ";

    if (["Full Time Role", "Internship- Summer", "Internship- Academic Year"].includes(type)) {
      const parts = [bold(link(employer, url)), bold(title), location ? italic(location) : null, date].filter(Boolean);
      return parts.join(pipe);
    }
    if (type === "Program") {
      const parts = [bold(link(employer, url)), bold(title), location || null, date].filter(Boolean);
      return parts.join(pipe);
    }
    if (type === "Career Advisors") {
      const parts = [bold(title), employer, italic(link("Schedule a conversation!", url))].filter(Boolean);
      return parts.join(pipe);
    }
    if (type === "Cool Tools & Resources") {
      const parts = [bold(link(title, url)), oneliner].filter(Boolean);
      return parts.join(pipe);
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

  if (["Full Time Role", "Internship- Summer", "Internship- Academic Year"].includes(type)) {
    const parts = [plainLink(employer.toUpperCase(), url), title.toUpperCase(), location, date].filter(Boolean);
    return parts.join(" | ");
  }
  if (type === "Program") {
    const parts = [plainLink(employer.toUpperCase(), url), title.toUpperCase(), location, date].filter(Boolean);
    return parts.join(" | ");
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

'''

app = app.replace('export default function AdvisorTool()', format_fn + 'export default function AdvisorTool()')

# 4. Update copyNewsletter to use formatForOutput and respect showFlagged
old_copy = '''  const copyNewsletter = () => {
    const text = newsletterOutput
      .map(({ formatted, flag, row }) => {
        let out = formatted;
        if (flag) out = `[${flag.toUpperCase()}] ${out}\\n  ⚠ ${row["Failure Message"]}`;
        return out;
      })
      .join("\\n\\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };'''

new_copy = '''  const copyNewsletter = () => {
    const rows = showFlagged ? newsletterOutput : newsletterOutput.filter(o => !o.flag);
    const text = rows
      .map(({ row, flag }) => {
        if (row["Resource Type [External Search]"] === "Other") return null;
        const out = formatForOutput(row, outputFormat);
        if (!out) return null;
        if (flag && showFlagged) return `[${flag.toUpperCase()}] ${out}\\n  ⚠ ${row["Failure Message"]}`;
        return out;
      })
      .filter(Boolean)
      .join("\\n\\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };'''

app = app.replace(old_copy, new_copy)

# 5. Exclude "Other" from sectionLabels rendering and filter flagged
old_section_map = '''                  {Object.entries(sectionLabels).map(([key, label]) => {
                    const sectionRows = newsletterOutput.filter((o) => o.row["Resource Type [External Search]"] === key);
                    if (sectionRows.length === 0) return null;'''

new_section_map = '''                  {Object.entries(sectionLabels).map(([key, label]) => {
                    if (key === "Other") return null;
                    let sectionRows = newsletterOutput.filter((o) => o.row["Resource Type [External Search]"] === key);
                    if (!showFlagged) sectionRows = sectionRows.filter(o => !o.flag);
                    if (sectionRows.length === 0) return null;'''

app = app.replace(old_section_map, new_section_map)

with open('src/App.jsx', 'w') as f:
    f.write(app)

checks = [
    ('Format toggles', 'outputFormat' in app),
    ('Flagged toggle', 'showFlagged' in app),
    ('formatForOutput fn', 'function formatForOutput' in app),
    ('Other excluded', 'key === "Other"' in app),
]
for label, result in checks:
    print(f'{"OK" if result else "FAIL"} {label}')

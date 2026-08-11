with open('src/App.jsx.backup') as f:
    app = f.read()

# 1. Add LINK_DROPPER_URL
app = app.replace(
    'const PRIVATE_KEY =',
    'const LINK_DROPPER_URL = "https://script.google.com/macros/s/AKfycbwclZ54wqPLcGvztf18EgGl-Xk3r277bkwCHg-GA5YxP9HcFhUgMkPdF3Rs-V1AeCPUaA/exec";\nconst PRIVATE_KEY ='
)

# 2. Add filter arrays
app = app.replace(
    'const industries =',
    'const roleTypes = [...new Set(rows.flatMap((r) => (r["Role Type"] || "").split(",").map((s) => s.trim()).filter(Boolean)))].sort();\n  const roleTags = [...new Set(rows.flatMap((r) => (r["Role Tag"] || "").split(",").map((s) => s.trim()).filter(Boolean)))].sort();\n  const locations = [...new Set(rows.map((r) => r["Location"]).filter(Boolean))].sort();\n  const dates = [...new Set(rows.map((r) => r["Date"]).filter(Boolean))].sort();\n  const industries ='
)

# 3. Update filters state
app = app.replace(
    'const [filters, setFilters] = useState({ industry: [], type: [] });',
    'const [filters, setFilters] = useState({ industry: [], type: [], roleType: [], roleTag: [], metcalf: [], location: [], date: [] });'
)

# 4. Add Link Dropper state
app = app.replace(
    '  const chatEndRef = useRef(null);',
    '  const chatEndRef = useRef(null);\n  const [ldForm, setLdForm] = useState({ newsletter: [], resourceType: \'\', url: \'\', removalDate: \'\', emailAddress: \'\' });\n  const [ldSubmitting, setLdSubmitting] = useState(false);\n  const [ldResult, setLdResult] = useState(null);'
)

# 5. Update filter logic
app = app.replace(
    'if (filters.type.length > 0) {\n      filtered = filtered.filter((r) =>\n        filters.type.includes(r["Resource Type [External Search]"])\n      );\n    }\n    setNewsletterOutput(filtered.map(formatNewsletterRow));',
    'if (filters.type.length > 0)\n      filtered = filtered.filter((r) => filters.type.includes(r["Resource Type [External Search]"]));\n    if (filters.industry.length > 0)\n      filtered = filtered.filter((r) => filters.industry.some((ind) => (r["Industry"] || "").includes(ind)));\n    if (filters.roleType.length > 0)\n      filtered = filtered.filter((r) => filters.roleType.some((rt) => (r["Role Type"] || "").includes(rt)));\n    if (filters.roleTag.length > 0)\n      filtered = filtered.filter((r) => filters.roleTag.some((tag) => (r["Role Tag"] || "").includes(tag)));\n    if (filters.metcalf.length > 0)\n      filtered = filtered.filter((r) => filters.metcalf.includes(r["Metcalf?"]));\n    if (filters.location.length > 0)\n      filtered = filtered.filter((r) => filters.location.includes(r["Location"]));\n    if (filters.date.length > 0)\n      filtered = filtered.filter((r) => filters.date.includes(r["Date"]));\n    setNewsletterOutput(filtered.map(formatNewsletterRow));'
)

# 6. Update sidebar
old_sidebar = '''              <div style={styles.sidebarLabel}>Filter by Industry</div>
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
            </>'''

new_sidebar = '''              <div style={styles.sidebarLabel}>Industry</div>
              <div style={styles.filterGroup}>
                {industries.map((ind) => (
                  <button key={ind} style={styles.filterChip(filters.industry.includes(ind))} onClick={() => toggleFilter("industry", ind)}>{ind}</button>
                ))}
              </div>
              <div style={styles.sidebarLabel}>Role Type</div>
              <div style={styles.filterGroup}>
                {roleTypes.map((rt) => (
                  <button key={rt} style={styles.filterChip(filters.roleType.includes(rt))} onClick={() => toggleFilter("roleType", rt)}>{rt}</button>
                ))}
              </div>
              <div style={styles.sidebarLabel}>Role Tag</div>
              <div style={styles.filterGroup}>
                {roleTags.map((tag) => (
                  <button key={tag} style={styles.filterChip(filters.roleTag.includes(tag))} onClick={() => toggleFilter("roleTag", tag)}>{tag}</button>
                ))}
              </div>
              <div style={styles.sidebarLabel}>Metcalf Eligible</div>
              <div style={styles.filterGroup}>
                {["TRUE", "FALSE"].map((val) => (
                  <button key={val} style={styles.filterChip(filters.metcalf.includes(val))} onClick={() => toggleFilter("metcalf", val)}>{val === "TRUE" ? "Metcalf Eligible" : "Not Metcalf"}</button>
                ))}
              </div>
              <div style={styles.sidebarLabel}>Location</div>
              <div style={styles.filterGroup}>
                {locations.map((loc) => (
                  <button key={loc} style={styles.filterChip(filters.location.includes(loc))} onClick={() => toggleFilter("location", loc)}>{loc}</button>
                ))}
              </div>
              <div style={styles.sidebarLabel}>Date</div>
              <div style={styles.filterGroup}>
                {dates.map((d) => (
                  <button key={d} style={styles.filterChip(filters.date.includes(d))} onClick={() => toggleFilter("date", d)}>{d}</button>
                ))}
              </div>
            </>'''

app = app.replace(old_sidebar, new_sidebar)

# 7. Update card display
old_card = '                              <div style={styles.cardOneliner}>{row["One-liner"]}</div>\n                              {flag && row["Failure Message"] && ('
new_card = '''                              <div style={{fontSize:"12px",color:"#5a6070",marginBottom:"6px",display:"flex",flexWrap:"wrap",gap:"8px",alignItems:"center"}}>
                                {row["Location"] && <span>{row["Location"]}</span>}
                                {row["Role Tag"] && <span style={{color:"#8a8f9e"}}>· {row["Role Tag"]}</span>}
                                {row["Metcalf?"] === "TRUE" && (
                                  <span style={{fontSize:"10px",fontWeight:"700",padding:"2px 7px",borderRadius:"4px",background:"rgba(46,204,113,0.15)",color:"#2ecc71",border:"1px solid rgba(46,204,113,0.3)"}}>Metcalf Eligible</span>
                                )}
                              </div>
                              <div style={styles.cardOneliner}>{row["One-liner"]}</div>
                              {row["Date"] && (
                                <div style={{fontSize:"11px",color:"#5a6070",marginTop:"6px"}}>{row["Date"]}</div>
                              )}
                              {flag && row["Failure Message"] && ('''
app = app.replace(old_card, new_card)

# 8. Update cardMeta
old_meta = '                              <div style={styles.cardMeta}>\n                                {[row["Employer/Host"], row["Location"], row["Date"]].filter(Boolean).join(" · ")}\n                              </div>'
new_meta = '                              <div style={styles.cardMeta}>{row["Employer/Host"]}</div>'
app = app.replace(old_meta, new_meta)

# 9. Add Link Dropper tab button
app = app.replace(
    '<button style={styles.modeBtn(mode === "advising")} onClick={() => setMode("advising")}>Advising Email</button>',
    '<button style={styles.modeBtn(mode === "advising")} onClick={() => setMode("advising")}>Advising Email</button>\n        <button style={styles.modeBtn(mode === "linkdropper")} onClick={() => setMode("linkdropper")}>Link Dropper</button>'
)

# 10. Add handlers before "if (loading)"
link_dropper_code = '''  const newsletterOptions = ["AI, Tech, and Entrepreneurship", "Science & Research", "Healthcare & Global Health", "None / Hold"];
  const resourceTypeOptions = ["Internship- Summer", "Internship- Academic Year", "Full Time Role", "Event", "Program", "Cool Tools & Resources", "Chatbot Prompt", "Career Advisors", "Other"];

  const toggleNewsletter = (val) => {
    setLdForm((prev) => {
      if (val === "None / Hold") return { ...prev, newsletter: ["None / Hold"] };
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
      const res = await fetch(LINK_DROPPER_URL, {
        method: "POST",
        body: JSON.stringify({
          newsletter: ldForm.newsletter.join(", "),
          resourceType: ldForm.resourceType,
          url: ldForm.url,
          removalDate: ldForm.removalDate,
          emailAddress: ldForm.emailAddress,
        }),
      });
      const data = await res.json();
      const urlOk = ldForm.url.startsWith("http");
      setLdResult({ success: data.success, urlOk, error: data.error });
      if (data.success) setLdForm({ newsletter: [], resourceType: \'\', url: \'\', removalDate: \'\', emailAddress: \'\' });
    } catch (err) {
      setLdResult({ success: false, urlOk: false, error: err.message });
    } finally {
      setLdSubmitting(false);
    }
  };

'''
app = app.replace('  if (loading) {', link_dropper_code + '  if (loading) {')

# 11. Add Link Dropper UI
link_dropper_ui = '''          {mode === "linkdropper" && (
            <div style={styles.outputArea}>
              <div style={{maxWidth:"560px"}}>
                <div style={{fontSize:"13px",color:"#5a6070",marginBottom:"20px",lineHeight:"1.6"}}>Submit a new resource to the Innovation Hub. Required fields are marked *.</div>
                <div style={{marginBottom:"16px"}}>
                  <div style={styles.sidebarLabel}>Include in Newsletter *</div>
                  <div style={{display:"flex",flexDirection:"column",gap:"6px",marginTop:"6px"}}>
                    {newsletterOptions.map((opt) => (
                      <label key={opt} style={{display:"flex",alignItems:"center",gap:"8px",cursor:"pointer",fontSize:"13px",color:ldForm.newsletter.includes(opt)?"#e8623a":"#8a8f9e"}}>
                        <input type="checkbox" checked={ldForm.newsletter.includes(opt)} onChange={() => toggleNewsletter(opt)} disabled={(opt !== "None / Hold" && ldForm.newsletter.includes("None / Hold")) || (opt === "None / Hold" && ldForm.newsletter.length > 0 && !ldForm.newsletter.includes("None / Hold"))} style={{accentColor:"#c84b31"}} />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>
                <div style={{marginBottom:"16px"}}>
                  <div style={styles.sidebarLabel}>Resource Type *</div>
                  <select value={ldForm.resourceType} onChange={(e) => { setLdForm((p) => ({...p, resourceType: e.target.value})); setLdResult(null); }} style={{width:"100%",marginTop:"6px",padding:"8px 10px",background:"#1a1d26",border:"1px solid #1e2330",borderRadius:"6px",color:ldForm.resourceType?"#e8e6e0":"#5a6070",fontSize:"13px",outline:"none"}}>
                    <option value="">Select a resource type...</option>
                    {resourceTypeOptions.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div style={{marginBottom:"16px"}}>
                  <div style={styles.sidebarLabel}>URL or Contact Info *</div>
                  <input type="text" value={ldForm.url} onChange={(e) => { setLdForm((p) => ({...p, url: e.target.value})); setLdResult(null); }} placeholder="https://..." style={{width:"100%",marginTop:"6px",padding:"8px 10px",background:"#1a1d26",border:"1px solid #1e2330",borderRadius:"6px",color:"#e8e6e0",fontSize:"13px",outline:"none",boxSizing:"border-box"}} />
                </div>
                <div style={{marginBottom:"16px"}}>
                  <div style={styles.sidebarLabel}>Removal Date (optional)</div>
                  <input type="date" value={ldForm.removalDate} onChange={(e) => setLdForm((p) => ({...p, removalDate: e.target.value}))} style={{marginTop:"6px",padding:"8px 10px",background:"#1a1d26",border:"1px solid #1e2330",borderRadius:"6px",color:"#e8e6e0",fontSize:"13px",outline:"none"}} />
                </div>
                <div style={{marginBottom:"24px"}}>
                  <div style={styles.sidebarLabel}>Your Email *</div>
                  <input type="email" value={ldForm.emailAddress} onChange={(e) => { setLdForm((p) => ({...p, emailAddress: e.target.value})); setLdResult(null); }} placeholder="cnetid@uchicago.edu" style={{width:"100%",marginTop:"6px",padding:"8px 10px",background:"#1a1d26",border:"1px solid #1e2330",borderRadius:"6px",color:"#e8e6e0",fontSize:"13px",outline:"none",boxSizing:"border-box"}} />
                </div>
                <button onClick={handleLdSubmit} disabled={ldSubmitting} style={{padding:"10px 24px",background:ldSubmitting?"#2a2d3a":"#c84b31",color:ldSubmitting?"#5a6070":"#fff",border:"none",borderRadius:"8px",fontSize:"13px",fontWeight:"600",cursor:ldSubmitting?"not-allowed":"pointer"}}>
                  {ldSubmitting ? "Submitting\u2026" : "Submit Resource"}
                </button>
                {ldResult && ldResult.success && (
                  <div style={{marginTop:"16px",padding:"12px 14px",background:"rgba(46,204,113,0.1)",border:"1px solid rgba(46,204,113,0.3)",borderRadius:"8px",fontSize:"13px",color:"#2ecc71"}}>
                    \u2713 Resource submitted successfully.
                  </div>
                )}
                {ldResult && !ldResult.success && !ldResult.urlOk && (
                  <div style={{marginTop:"16px",padding:"12px 14px",background:"rgba(230,180,50,0.08)",border:"1px solid rgba(230,180,50,0.3)",borderRadius:"8px",fontSize:"13px",color:"#e6b432",lineHeight:"1.6"}}>
                    \u26a0 Submission received but flagged for review.<br/>
                    Paste the direct URL to the resource. Only ONE URL, starting with http.<br/>
                    If no webpage exists, provide contact information or a brief description of how students can access the resource.<br/>
                    Non-URL entries will need to pass human review before showing up in the Database. If urgent, flag for Lucy/Sandy.
                  </div>
                )}
                {ldResult && !ldResult.success && ldResult.urlOk && (
                  <div style={{marginTop:"16px",padding:"12px 14px",background:"rgba(200,75,49,0.08)",border:"1px solid rgba(200,75,49,0.3)",borderRadius:"8px",fontSize:"13px",color:"#e8623a"}}>
                    \u2717 Submission failed: {ldResult.error}
                  </div>
                )}
              </div>
            </div>
          )}

'''
app = app.replace('          {mode === "advising" && (', link_dropper_ui + '          {mode === "advising" && (')

with open('src/App.jsx', 'w') as f:
    f.write(app)

checks = [
    ('Key present', 'BEGIN PRIVATE KEY' in app),
    ('Link Dropper URL', 'LINK_DROPPER_URL' in app),
    ('Link Dropper tab', app.count('linkdropper') >= 2),
    ('Filter arrays', 'const roleTypes' in app),
    ('Date filter', 'const dates' in app),
    ('Metcalf badge', 'Metcalf Eligible' in app),
    ('ldForm state', app.count('const [ldForm') == 1),
    ('handleLdSubmit', 'handleLdSubmit' in app),
]
for label, result in checks:
    print(f'{"OK" if result else "FAIL"} {label}')

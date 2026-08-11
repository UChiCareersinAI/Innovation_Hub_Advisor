with open('src/App.jsx') as f:
    app = f.read()

# Add Web App URL constant after PRIVATE_KEY line
app = app.replace(
    'const PRIVATE_KEY =',
    'const LINK_DROPPER_URL = "https://script.google.com/macros/s/AKfycbwclZ54wqPLcGvztf18EgGl-Xk3r277bkwCHg-GA5YxP9HcFhUgMkPdF3Rs-V1AeCPUaA/exec";\nconst PRIVATE_KEY ='
)

# Add Link Dropper tab button
app = app.replace(
    '<button style={styles.modeBtn(mode === "advising")} onClick={() => setMode("advising")}>Advising Email</button>',
    '<button style={styles.modeBtn(mode === "advising")} onClick={() => setMode("advising")}>Advising Email</button>\n        <button style={styles.modeBtn(mode === "linkdropper")} onClick={() => setMode("linkdropper")}>Link Dropper</button>'
)

# Add Link Dropper state
app = app.replace(
    "  const [copied, setCopied] = useState(false);",
    """  const [copied, setCopied] = useState(false);
  const [ldForm, setLdForm] = useState({ newsletter: [], resourceType: '', url: '', removalDate: '', emailAddress: '' });
  const [ldSubmitting, setLdSubmitting] = useState(false);
  const [ldResult, setLdResult] = useState(null);"""
)

# Add Link Dropper submit handler before return statement
app = app.replace(
    '  if (loading) {',
    """  const newsletterOptions = ["AI, Tech, and Entrepreneurship", "Science & Research", "Healthcare & Global Health", "None / Hold"];
  const resourceTypeOptions = ["Internship- Summer", "Internship- Academic Year", "Full Time Role", "Event", "Program", "Cool Tools & Resources", "Chatbot Prompt", "Career Advisors", "Other"];

  const toggleNewsletter = (val) => {
    setLdForm((prev) => {
      if (val === "None / Hold") return { ...prev, newsletter: ["None / Hold"] };
      const without = prev.newsletter.filter((v) => v !== "None / Hold");
      return {
        ...prev,
        newsletter: without.includes(val) ? without.filter((v) => v !== val) : [...without, val]
      };
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
      if (data.success) setLdForm({ newsletter: [], resourceType: '', url: '', removalDate: '', emailAddress: '' });
    } catch (err) {
      setLdResult({ success: false, urlOk: false, error: err.message });
    } finally {
      setLdSubmitting(false);
    }
  };

  if (loading) {"""
)

# Add Link Dropper UI panel before closing div of main content
app = app.replace(
    "          {mode === \"advising\" && (",
    """          {mode === "linkdropper" && (
            <div style={styles.outputArea}>
              <div style={{maxWidth:"560px"}}>
                <div style={{fontSize:"13px",color:"#5a6070",marginBottom:"20px",lineHeight:"1.6"}}>
                  Submit a new resource to the Innovation Hub. Required fields are marked *.
                </div>

                <div style={{marginBottom:"16px"}}>
                  <div style={styles.sidebarLabel}>Include in Newsletter *</div>
                  <div style={{display:"flex",flexDirection:"column",gap:"6px",marginTop:"6px"}}>
                    {newsletterOptions.map((opt) => (
                      <label key={opt} style={{display:"flex",alignItems:"center",gap:"8px",cursor:"pointer",fontSize:"13px",color: ldForm.newsletter.includes(opt) ? "#e8623a" : "#8a8f9e"}}>
                        <input
                          type="checkbox"
                          checked={ldForm.newsletter.includes(opt)}
                          onChange={() => toggleNewsletter(opt)}
                          disabled={opt !== "None / Hold" && ldForm.newsletter.includes("None / Hold") || opt === "None / Hold" && ldForm.newsletter.length > 0 && !ldForm.newsletter.includes("None / Hold")}
                          style={{accentColor:"#c84b31"}}
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>

                <div style={{marginBottom:"16px"}}>
                  <div style={styles.sidebarLabel}>Resource Type *</div>
                  <select
                    value={ldForm.resourceType}
                    onChange={(e) => { setLdForm((p) => ({...p, resourceType: e.target.value})); setLdResult(null); }}
                    style={{width:"100%",marginTop:"6px",padding:"8px 10px",background:"#1a1d26",border:"1px solid #1e2330",borderRadius:"6px",color: ldForm.resourceType ? "#e8e6e0" : "#5a6070",fontSize:"13px",outline:"none"}}
                  >
                    <option value="">Select a resource type...</option>
                    {resourceTypeOptions.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div style={{marginBottom:"16px"}}>
                  <div style={styles.sidebarLabel}>URL or Contact Info *</div>
                  <input
                    type="text"
                    value={ldForm.url}
                    onChange={(e) => { setLdForm((p) => ({...p, url: e.target.value})); setLdResult(null); }}
                    placeholder="https://..."
                    style={{width:"100%",marginTop:"6px",padding:"8px 10px",background:"#1a1d26",border:"1px solid #1e2330",borderRadius:"6px",color:"#e8e6e0",fontSize:"13px",outline:"none",boxSizing:"border-box"}}
                  />
                </div>

                <div style={{marginBottom:"16px"}}>
                  <div style={styles.sidebarLabel}>Removal Date (optional)</div>
                  <input
                    type="date"
                    value={ldForm.removalDate}
                    onChange={(e) => setLdForm((p) => ({...p, removalDate: e.target.value}))}
                    style={{marginTop:"6px",padding:"8px 10px",background:"#1a1d26",border:"1px solid #1e2330",borderRadius:"6px",color:"#e8e6e0",fontSize:"13px",outline:"none"}}
                  />
                </div>

                <div style={{marginBottom:"24px"}}>
                  <div style={styles.sidebarLabel}>Your Email *</div>
                  <input
                    type="email"
                    value={ldForm.emailAddress}
                    onChange={(e) => { setLdForm((p) => ({...p, emailAddress: e.target.value})); setLdResult(null); }}
                    placeholder="cnetid@uchicago.edu"
                    style={{width:"100%",marginTop:"6px",padding:"8px 10px",background:"#1a1d26",border:"1px solid #1e2330",borderRadius:"6px",color:"#e8e6e0",fontSize:"13px",outline:"none",boxSizing:"border-box"}}
                  />
                </div>

                <button
                  onClick={handleLdSubmit}
                  disabled={ldSubmitting}
                  style={{padding:"10px 24px",background:ldSubmitting?"#2a2d3a":"#c84b31",color:ldSubmitting?"#5a6070":"#fff",border:"none",borderRadius:"8px",fontSize:"13px",fontWeight:"600",cursor:ldSubmitting?"not-allowed":"pointer"}}
                >
                  {ldSubmitting ? "Submitting…" : "Submit Resource"}
                </button>

                {ldResult && ldResult.success && (
                  <div style={{marginTop:"16px",padding:"12px 14px",background:"rgba(46,204,113,0.1)",border:"1px solid rgba(46,204,113,0.3)",borderRadius:"8px",fontSize:"13px",color:"#2ecc71"}}>
                    ✓ Resource submitted successfully.
                  </div>
                )}

                {ldResult && !ldResult.success && !ldResult.urlOk && (
                  <div style={{marginTop:"16px",padding:"12px 14px",background:"rgba(230,180,50,0.08)",border:"1px solid rgba(230,180,50,0.3)",borderRadius:"8px",fontSize:"13px",color:"#e6b432",lineHeight:"1.6"}}>
                    ⚠ Submission received but flagged for review.<br/>
                    Paste the direct URL to the resource. Only ONE URL, starting with http.<br/>
                    If no webpage exists, provide contact information or a brief description of how students can access the resource.<br/>
                    Non-URL entries will need to pass human review before showing up in the Database. If urgent, flag for Lucy/Sandy.
                  </div>
                )}

                {ldResult && !ldResult.success && ldResult.urlOk && (
                  <div style={{marginTop:"16px",padding:"12px 14px",background:"rgba(200,75,49,0.08)",border:"1px solid rgba(200,75,49,0.3)",borderRadius:"8px",fontSize:"13px",color:"#e8623a"}}>
                    ✗ Submission failed: {ldResult.error}
                  </div>
                )}
              </div>
            </div>
          )}

          {mode === "advising" && ("""
)

with open('src/App.jsx', 'w') as f:
    f.write(app)

print('Link Dropper tab added:', 'linkdropper' in app)
print('Web App URL added:', 'LINK_DROPPER_URL' in app)

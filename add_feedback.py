with open('src/App.jsx') as f:
    app = f.read()

# 1. Add Feedback tab button
app = app.replace(
    '''        <button style={styles.modeBtn(mode === "linkdropper")} onClick={() => setMode("linkdropper")}>
          Link Dropper
        </button>''',
    '''        <button style={styles.modeBtn(mode === "linkdropper")} onClick={() => setMode("linkdropper")}>
          Link Dropper
        </button>
        <button style={styles.modeBtn(mode === "feedback")} onClick={() => setMode("feedback")}>
          Feedback
        </button>'''
)

# 2. Add feedback form state
app = app.replace(
    '  const [ldForm, setLdForm]',
    '  const [fbForm, setFbForm] = useState({ email: "", feedbackType: "", description: "" });\n  const [fbSubmitting, setFbSubmitting] = useState(false);\n  const [fbResult, setFbResult] = useState(null);\n  const [ldForm, setLdForm]'
)

# 3. Add feedback submit handler before "if (loading)"
feedback_handler = '''  const handleFbSubmit = async () => {
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

'''

app = app.replace('  if (loading) {', feedback_handler + '  if (loading) {')

# 4. Hide sidebar for feedback mode
app = app.replace(
    'display: mode === "linkdropper" ? "none" : "block"',
    'display: (mode === "linkdropper" || mode === "feedback") ? "none" : "block"'
)

# 5. Add Feedback UI panel before advising mode
feedback_ui = '''          {mode === "feedback" && (
            <div style={{flex:1,overflowY:"auto",padding:"40px",display:"flex",justifyContent:"center"}}>
              <div style={{maxWidth:"560px",width:"100%"}}>
                <div style={{fontSize:"20px",fontWeight:"700",color:"#000",marginBottom:"6px",fontFamily:"Gotham, Helvetica, Arial, sans-serif"}}>Share Feedback</div>
                <div style={{fontSize:"13px",color:"#737373",marginBottom:"28px",lineHeight:"1.6"}}>
                  Help us improve the Innovation Hub Advisor Tool. All feedback goes directly to the team.
                </div>

                <div style={{marginBottom:"16px"}}>
                  <div style={styles.sidebarLabel}>Your Email</div>
                  <input
                    type="email"
                    value={fbForm.email}
                    onChange={(e) => { setFbForm(p => ({...p, email: e.target.value})); setFbResult(null); }}
                    placeholder="cnetid@uchicago.edu"
                    style={{width:"100%",marginTop:"6px",padding:"8px 10px",background:"#F9F9F9",border:"1px solid #D9D9D9",borderRadius:"6px",color:"#000",fontSize:"13px",outline:"none",boxSizing:"border-box"}}
                  />
                </div>

                <div style={{marginBottom:"16px"}}>
                  <div style={styles.sidebarLabel}>Feedback Type *</div>
                  <div style={{display:"flex",flexDirection:"column",gap:"6px",marginTop:"6px"}}>
                    {["Feedback on Current Features/Functions", "Feature Request", "General"].map((opt) => (
                      <label key={opt} style={{display:"flex",alignItems:"center",gap:"8px",cursor:"pointer",fontSize:"13px",color:fbForm.feedbackType===opt?"#800000":"#737373"}}>
                        <input
                          type="radio"
                          name="feedbackType"
                          value={opt}
                          checked={fbForm.feedbackType === opt}
                          onChange={() => { setFbForm(p => ({...p, feedbackType: opt})); setFbResult(null); }}
                          style={{accentColor:"#800000"}}
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>

                <div style={{marginBottom:"24px"}}>
                  <div style={styles.sidebarLabel}>Description *</div>
                  <textarea
                    value={fbForm.description}
                    onChange={(e) => { setFbForm(p => ({...p, description: e.target.value})); setFbResult(null); }}
                    placeholder="Describe the issue, suggestion, or feedback in as much detail as helpful..."
                    rows={6}
                    style={{width:"100%",marginTop:"6px",padding:"10px 12px",background:"#F9F9F9",border:"1px solid #D9D9D9",borderRadius:"6px",color:"#000",fontSize:"13px",outline:"none",boxSizing:"border-box",resize:"vertical",fontFamily:"Gotham, Helvetica, Arial, sans-serif",lineHeight:"1.6"}}
                  />
                </div>

                <button
                  onClick={handleFbSubmit}
                  disabled={fbSubmitting || !fbForm.feedbackType || !fbForm.description}
                  style={{padding:"10px 24px",background:(fbSubmitting||!fbForm.feedbackType||!fbForm.description)?"#D9D9D9":"#800000",color:(fbSubmitting||!fbForm.feedbackType||!fbForm.description)?"#737373":"#fff",border:"none",borderRadius:"8px",fontSize:"13px",fontWeight:"600",cursor:(fbSubmitting||!fbForm.feedbackType||!fbForm.description)?"not-allowed":"pointer"}}
                >
                  {fbSubmitting ? "Submitting…" : "Submit Feedback"}
                </button>

                {fbResult && fbResult.success && (
                  <div style={{marginTop:"16px",padding:"12px 14px",background:"rgba(128,0,0,0.05)",border:"1px solid rgba(128,0,0,0.2)",borderRadius:"8px",fontSize:"13px",color:"#800000"}}>
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

'''

app = app.replace('          {mode === "advising" && (', feedback_ui + '          {mode === "advising" && (')

with open('src/App.jsx', 'w') as f:
    f.write(app)

checks = [
    ('Feedback tab button', 'mode === "feedback"' in app),
    ('Feedback state', 'fbForm' in app),
    ('Feedback handler', 'handleFbSubmit' in app),
    ('Feedback UI', 'Share Feedback' in app),
    ('Sidebar hidden', '"feedback") ? "none"' in app),
]
for label, result in checks:
    print(f'{"OK" if result else "FAIL"} {label}')

with open('src/App.jsx') as f:
    app = f.read()

# Remove any existing feedback UI blocks first
while '          {mode === "feedback" && (' in app:
    start = app.find('          {mode === "feedback" && (')
    # Find the closing of this block - look for next mode check or end of content div
    end_markers = ['          {mode === "newsletter"', '          {mode === "advising"', '          {mode === "linkdropper"']
    end = len(app)
    for em in end_markers:
        idx = app.find(em, start + 1)
        if idx > 0 and idx < end:
            end = idx
    app = app[:start] + app[end:]

# Now add feedback UI in the right place - before advising mode inside content div
feedback_ui = '''          {mode === "feedback" && (
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
                  {fbSubmitting ? "Submitting\u2026" : "Submit Feedback"}
                </button>
                {fbResult && fbResult.success && (
                  <div style={{marginTop:"16px",padding:"12px 14px",background:"rgba(46,204,113,0.1)",border:"1px solid rgba(46,204,113,0.3)",borderRadius:"8px",fontSize:"13px",color:"#27ae60"}}>
                    \u2713 Feedback submitted. Thank you!
                  </div>
                )}
                {fbResult && !fbResult.success && (
                  <div style={{marginTop:"16px",padding:"12px 14px",background:"rgba(200,0,0,0.05)",border:"1px solid rgba(200,0,0,0.2)",borderRadius:"8px",fontSize:"13px",color:"#800000"}}>
                    \u2717 Submission failed: {fbResult.error}
                  </div>
                )}
              </div>
            </div>
          )}

'''

# Insert before advising mode
app = app.replace('          {mode === "advising" && (', feedback_ui + '          {mode === "advising" && (')

with open('src/App.jsx', 'w') as f:
    f.write(app)

count = app.count('{mode === "feedback"')
print(f'Feedback blocks: {count}')
print('Using buttons instead of radio:', 'feedbackType===opt' in app)

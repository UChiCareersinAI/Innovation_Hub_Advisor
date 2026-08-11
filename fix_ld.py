with open('src/App.jsx') as f:
    app = f.read()

# Fix None/Hold toggle - allow unchecking
old_toggle = '''  const toggleNewsletter = (val) => {
    setLdForm((prev) => {
      if (val === "None / Hold") return { ...prev, newsletter: ["None / Hold"] };
      const without = prev.newsletter.filter((v) => v !== "None / Hold");
      return { ...prev, newsletter: without.includes(val) ? without.filter((v) => v !== val) : [...without, val] };
    });
    setLdResult(null);
  };'''

new_toggle = '''  const toggleNewsletter = (val) => {
    setLdForm((prev) => {
      if (val === "None / Hold") {
        if (prev.newsletter.includes("None / Hold")) return { ...prev, newsletter: [] };
        return { ...prev, newsletter: ["None / Hold"] };
      }
      const without = prev.newsletter.filter((v) => v !== "None / Hold");
      return { ...prev, newsletter: without.includes(val) ? without.filter((v) => v !== val) : [...without, val] };
    });
    setLdResult(null);
  };'''

app = app.replace(old_toggle, new_toggle)

# Fix warning box styling - solid yellow, black text, right-aligned body
old_warn = '''                {ldResult && !ldResult.success && !ldResult.urlOk && (
                  <div style={{marginTop:"16px",padding:"12px 14px",background:"rgba(230,180,50,0.08)",border:"1px solid rgba(230,180,50,0.3)",borderRadius:"8px",fontSize:"13px",color:"#e6b432",lineHeight:"1.6"}}>
                    \u26a0 Submission received but flagged for review.<br/>
                    Paste the direct URL to the resource. Only ONE URL, starting with http.<br/>
                    If no webpage exists, provide contact information or a brief description of how students can access the resource.<br/>
                    Non-URL entries will need to pass human review before showing up in the Database. If urgent, flag for Lucy/Sandy.
                  </div>
                )}'''

new_warn = '''                {ldResult && !ldResult.success && !ldResult.urlOk && (
                  <div style={{marginTop:"16px",padding:"16px",background:"#f5c518",border:"1px solid #d4a800",borderRadius:"8px",fontSize:"13px",color:"#000",lineHeight:"1.7",fontFamily:"Gotham, 'Gotham SSm', 'Helvetica Neue', Arial, sans-serif"}}>
                    <div style={{textAlign:"center",fontWeight:"700",marginBottom:"10px",fontSize:"14px"}}>\u26a0 Submission received but flagged for review.</div>
                    <div style={{textAlign:"right"}}>Paste the direct URL to the resource. Only ONE URL, starting with http.</div>
                    <div style={{textAlign:"right",marginTop:"6px"}}>If no webpage exists, provide contact information or a brief description of how students can access the resource.</div>
                    <div style={{textAlign:"right",marginTop:"6px"}}>Non-URL entries will need to pass human review before showing up in the Database. If urgent, flag for Lucy/Sandy.</div>
                  </div>
                )}'''

app = app.replace(old_warn, new_warn)

with open('src/App.jsx', 'w') as f:
    f.write(app)

print('Toggle fixed:', 'if (prev.newsletter.includes("None / Hold"))' in app)
print('Warning styled:', '#f5c518' in app)

with open('src/App.jsx') as f:
    app = f.read()

old = '''                {ldResult && !ldResult.success && !ldResult.urlOk && (
                  <div style={{marginTop:"16px",padding:"16px",background:"#f5c518",border:"1px solid #d4a800",borderRadius:"8px",fontSize:"13px",color:"#000",lineHeight:"1.7",fontFamily:"Gotham, 'Gotham SSm', 'Helvetica Neue', Arial, sans-serif"}}>
                    <div style={{textAlign:"center",fontWeight:"700",marginBottom:"10px",fontSize:"14px"}}>\u26a0 Submission received but flagged for review.</div>
                    <div style={{textAlign:"right"}}>Paste the direct URL to the resource. Only ONE URL, starting with http.</div>
                    <div style={{textAlign:"right",marginTop:"6px"}}>If no webpage exists, provide contact information or a brief description of how students can access the resource.</div>
                    <div style={{textAlign:"right",marginTop:"6px"}}>Non-URL entries will need to pass human review before showing up in the Database. If urgent, flag for Lucy/Sandy.</div>
                  </div>
                )}
                {ldResult && !ldResult.success && !ldResult.urlOk && (
                  <div style={{marginTop:"16px",padding:"16px",background:"#f5c518",border:"1px solid #d4a800",borderRadius:"8px",fontSize:"13px",color:"#000",lineHeight:"1.7",fontFamily:"Gotham, 'Gotham SSm', 'Helvetica Neue', Arial, sans-serif"}}>
                    <div style={{textAlign:"center",fontWeight:"700",marginBottom:"10px",fontSize:"14px"}}>\u26a0 Submission received but flagged for review.</div>
                    <div style={{textAlign:"right"}}>Paste the direct URL to the resource. Only ONE URL, starting with http.</div>
                    <div style={{textAlign:"right",marginTop:"6px"}}>If no webpage exists, provide contact information or a brief description of how students can access the resource.</div>
                    <div style={{textAlign:"right",marginTop:"6px"}}>Non-URL entries will need to pass human review before showing up in the Database. If urgent, flag for Lucy/Sandy.</div>
                  </div>
                )}'''

new = '''                {ldResult && !ldResult.success && !ldResult.urlOk && (
                  <div style={{marginTop:"16px",padding:"16px",background:"#f5c518",border:"1px solid #d4a800",borderRadius:"8px",fontSize:"13px",color:"#000",lineHeight:"1.7",fontFamily:"Gotham, 'Gotham SSm', 'Helvetica Neue', Arial, sans-serif"}}>
                    <div style={{textAlign:"center",fontWeight:"700",marginBottom:"10px",fontSize:"14px"}}>\u26a0 Submission received but flagged for review.</div>
                    <div style={{textAlign:"right"}}>Paste the direct URL to the resource. Only ONE URL, starting with http.</div>
                    <div style={{textAlign:"right",marginTop:"6px"}}>If no webpage exists, provide contact information or a brief description of how students can access the resource.</div>
                    <div style={{textAlign:"right",marginTop:"6px"}}>Non-URL entries will need to pass human review before showing up in the Database. If urgent, flag for Lucy/Sandy.</div>
                  </div>
                )}'''

app = app.replace(old, new)

with open('src/App.jsx', 'w') as f:
    f.write(app)

print('Dupes removed:', app.count('f5c518'))

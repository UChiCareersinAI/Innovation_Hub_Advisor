with open('src/App.jsx') as f:
    app = f.read()

old_card = '                              <div style={styles.cardOneliner}>{row["One-liner"]}</div>\n                              {flag && row["Failure Message"] && ('
new_card = '                              {row["Role Tag"] && (\n                                <div style={{fontSize:"11px",color:"#8a8f9e",marginBottom:"4px"}}>\n                                  <span style={{color:"#5a6070",fontWeight:"600"}}>Role Tag: </span>{row["Role Tag"]}\n                                </div>\n                              )}\n                              {row["Metcalf?"] === "TRUE" && (\n                                <span style={{display:"inline-block",fontSize:"10px",fontWeight:"700",padding:"2px 7px",borderRadius:"4px",background:"rgba(46,204,113,0.15)",color:"#2ecc71",border:"1px solid rgba(46,204,113,0.3)",marginBottom:"6px"}}>Metcalf Eligible</span>\n                              )}\n                              <div style={styles.cardOneliner}>{row["One-liner"]}</div>\n                              {row["Date"] && (\n                                <div style={{fontSize:"11px",color:"#5a6070",marginTop:"6px"}}>Apply by: {row["Date"]}</div>\n                              )}\n                              {flag && row["Failure Message"] && ('

app = app.replace(old_card, new_card)

with open('src/App.jsx', 'w') as f:
    f.write(app)

print('Role Tag on card:', 'Role Tag:' in app)
print('Apply by on card:', 'Apply by:' in app)

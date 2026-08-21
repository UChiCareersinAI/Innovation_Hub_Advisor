with open('src/App.jsx') as f:
    app = f.read()

old_card = '''                              {row["Role Tag"] && (
                                <div style={{fontSize:"11px",color:"#8a8f9e",marginBottom:"4px"}}>
                                  <span style={{color:"#5a6070",fontWeight:"600"}}>Role Tag: </span>{row["Role Tag"]}
                                </div>
                              )}
                              {row["Metcalf?"] === "TRUE" && (
                                <span style={{display:"inline-block",fontSize:"10px",fontWeight:"700",padding:"2px 7px",borderRadius:"4px",background:"rgba(46,204,113,0.15)",color:"#2ecc71",border:"1px solid rgba(46,204,113,0.3)",marginBottom:"6px"}}>Metcalf Eligible</span>
                              )}
                              <div style={styles.cardOneliner}>{row["One-liner"]}</div>
                              {row["Date"] && (
                                <div style={{fontSize:"11px",color:"#5a6070",marginTop:"6px"}}>Apply by: {row["Date"]}</div>
                              )}'''

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
                              )}'''

app = app.replace(old_card, new_card)

# Also update cardMeta to show Title | Employer/Host only (remove location and date from old meta line)
old_meta = '                              <div style={styles.cardMeta}>\n                                {[row["Employer/Host"], row["Location"], row["Date"]].filter(Boolean).join(" · ")}\n                              </div>'
new_meta = '                              <div style={styles.cardMeta}>{row["Employer/Host"]}</div>'

app = app.replace(old_meta, new_meta)

with open('src/App.jsx', 'w') as f:
    f.write(app)

print('Updated:', 'Metcalf Eligible' in app and 'cardOneliner' in app)

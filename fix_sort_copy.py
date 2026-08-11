with open('src/App.jsx') as f:
    app = f.read()

# 1. Update formatNewsletterRow output to include sort fields
# 2. Sort newsletterOutput within each section after filtering
# Add sort logic after setNewsletterOutput line

old_set = '    setNewsletterOutput(filtered.map(formatNewsletterRow));'
new_set = '''    const formatted = filtered.map(formatNewsletterRow);
    // Sort within each resource type: Metcalf TRUE first, then soonest removal date, then title
    formatted.sort((a, b) => {
      // Same resource type grouping is handled by sectionLabels rendering
      const aMetcalf = a.row["Metcalf?"] === "TRUE" ? 0 : 1;
      const bMetcalf = b.row["Metcalf?"] === "TRUE" ? 0 : 1;
      if (aMetcalf !== bMetcalf) return aMetcalf - bMetcalf;
      const aDate = new Date(a.row["Removal Date [Internal]"] || "9999-12-31");
      const bDate = new Date(b.row["Removal Date [Internal]"] || "9999-12-31");
      if (aDate - bDate !== 0) return aDate - bDate;
      return (a.row["Title"] || "").localeCompare(b.row["Title"] || "");
    });
    setNewsletterOutput(formatted);'''

app = app.replace(old_set, new_set)

# 3. Add per-section copy button
old_section_header = '''                        <div style={styles.sectionHeader}>{label} ({sectionRows.length})</div>'''
new_section_header = '''                        <div style={{...styles.sectionHeader, display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                          <span>{label} ({sectionRows.length})</span>
                          <button onClick={() => {
                            const text = sectionRows.map(({formatted, flag, row}) => {
                              let out = formatted;
                              if (flag) out = `[${flag.toUpperCase()}] ${out}\\n  ⚠ ${row["Failure Message"]}`;
                              return out;
                            }).join("\\n\\n");
                            navigator.clipboard.writeText(text);
                          }} style={{fontSize:"10px",padding:"2px 8px",background:"#800000",color:"#fff",border:"none",borderRadius:"4px",cursor:"pointer",fontWeight:"600",flexShrink:0}}>Copy</button>
                        </div>'''

app = app.replace(old_section_header, new_section_header)

with open('src/App.jsx', 'w') as f:
    f.write(app)

print('Sort added:', 'aMetcalf' in app)
print('Section copy added:', 'navigator.clipboard' in app)

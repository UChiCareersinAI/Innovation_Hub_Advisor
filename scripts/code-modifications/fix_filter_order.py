with open('src/App.jsx') as f:
    app = f.read()

# Update filters state to add removalDateFrom and removalDateTo, remove removalDate
app = app.replace(
    'const [filters, setFilters] = useState({ industry: [], type: [], roleType: [], roleTag: [], metcalf: [], newsletterType: [], removalDate: [] });',
    'const [filters, setFilters] = useState({ industry: [], type: [], roleType: [], roleTag: [], metcalf: [], newsletterType: [], removalDateFrom: "", removalDateTo: "" });'
)

# Update clearAll
app = app.replace(
    'const clearAll = () => setFilters({ industry: [], type: [], roleType: [], roleTag: [], metcalf: [], newsletterType: [], removalDate: [] });',
    'const clearAll = () => setFilters({ industry: [], type: [], roleType: [], roleTag: [], metcalf: [], newsletterType: [], removalDateFrom: "", removalDateTo: "" });'
)

# Update filter logic - replace removalDate filter with range filter
app = app.replace(
    '    if (filters.removalDate.length > 0)\n      filtered = filtered.filter((r) => filters.removalDate.includes(r["Removal Date [Internal]"]));',
    '    if (filters.removalDateFrom || filters.removalDateTo) {\n      filtered = filtered.filter((r) => {\n        const rd = r["Removal Date [Internal]"];\n        if (!rd) return true;\n        const d = new Date(rd);\n        if (isNaN(d)) return true;\n        if (filters.removalDateFrom && d < new Date(filters.removalDateFrom)) return false;\n        if (filters.removalDateTo && d > new Date(filters.removalDateTo)) return false;\n        return true;\n      });\n    }'
)

# Update activeFilterCount to handle string fields
app = app.replace(
    'const activeFilterCount = Object.values(filters).flat().length;',
    'const activeFilterCount = Object.entries(filters).reduce((n, [k, v]) => n + (Array.isArray(v) ? v.length : v ? 1 : 0), 0);'
)

# Replace entire sidebar filter section with new order
old_filters = '''              <div style={styles.sidebarLabel}>Resource Type</div>
              <div style={styles.filterGroup}>
                {resourceTypes.map((t) => (
                  <button key={t} style={styles.filterChip(filters.type.includes(t))} onClick={() => toggleFilter("type", t)}>{t}</button>
                ))}
              </div>
              <div style={styles.sidebarLabel}>Industry</div>
              <div style={styles.filterGroup}>
                {industries.map((ind) => (
                  <button key={ind} style={styles.filterChip(filters.industry.includes(ind))} onClick={() => toggleFilter("industry", ind)}>{ind}</button>
                ))}
              </div>
              <div style={styles.sidebarLabel}>Newsletter Type <em style={{fontWeight:"400",fontSize:"9px"}}>Optional</em></div>
              <div style={styles.filterGroup}>
                {["AI, Tech, and Entrepreneurship", "Science & Research", "Healthcare & Global Health"].map((nt) => (
                  <button key={nt} style={styles.filterChip(filters.newsletterType.includes(nt))} onClick={() => toggleFilter("newsletterType", nt)}>{nt}</button>
                ))}
              </div>
              <div style={styles.sidebarLabel}>Role Type <em style={{fontWeight:"400",fontSize:"9px"}}>Optional</em></div>
              <div style={styles.filterGroup}>
                {roleTypes.map((rt) => (
                  <button key={rt} style={styles.filterChip(filters.roleType.includes(rt))} onClick={() => toggleFilter("roleType", rt)}>{rt}</button>
                ))}
              </div>
              <div style={styles.sidebarLabel}>Role Tag <em style={{fontWeight:"400",fontSize:"9px"}}>Optional</em></div>
              <div style={styles.filterGroup}>
                {roleTags.map((tag) => (
                  <button key={tag} style={styles.filterChip(filters.roleTag.includes(tag))} onClick={() => toggleFilter("roleTag", tag)}>{tag}</button>
                ))}
              </div>
              <div style={styles.sidebarLabel}>Metcalf Eligible <em style={{fontWeight:"400",fontSize:"9px"}}>Optional</em></div>
              <div style={styles.filterGroup}>
                {["TRUE", "FALSE"].map((val) => (
                  <button key={val} style={styles.filterChip(filters.metcalf.includes(val))} onClick={() => toggleFilter("metcalf", val)}>{val === "TRUE" ? "Metcalf Eligible" : "Not Metcalf"}</button>
                ))}
              </div>
              <div style={styles.sidebarLabel}>Removal Date</div>
              <div style={styles.filterGroup}>
                {removalDates.map((d) => (
                  <button key={d} style={styles.filterChip(filters.removalDate.includes(d))} onClick={() => toggleFilter("removalDate", d)}>{d}</button>
                ))}
              </div>'''

new_filters = '''              <div style={styles.sidebarLabel}>Newsletter Type <em style={{fontWeight:"400",fontSize:"9px"}}>Optional</em></div>
              <div style={styles.filterGroup}>
                {["AI, Tech, and Entrepreneurship", "Science & Research", "Healthcare & Global Health"].map((nt) => (
                  <button key={nt} style={styles.filterChip(filters.newsletterType.includes(nt))} onClick={() => toggleFilter("newsletterType", nt)}>{nt}</button>
                ))}
              </div>
              <div style={styles.sidebarLabel}>Resource Type</div>
              <div style={styles.filterGroup}>
                {resourceTypes.map((t) => (
                  <button key={t} style={styles.filterChip(filters.type.includes(t))} onClick={() => toggleFilter("type", t)}>{t}</button>
                ))}
              </div>
              <div style={styles.sidebarLabel}>Metcalf Eligible <em style={{fontWeight:"400",fontSize:"9px"}}>Optional</em></div>
              <div style={styles.filterGroup}>
                {["TRUE", "FALSE"].map((val) => (
                  <button key={val} style={styles.filterChip(filters.metcalf.includes(val))} onClick={() => toggleFilter("metcalf", val)}>{val === "TRUE" ? "Metcalf Eligible" : "Not Metcalf"}</button>
                ))}
              </div>
              <div style={styles.sidebarLabel}>Active Between <em style={{fontWeight:"400",fontSize:"9px"}}>Optional</em></div>
              <div style={{display:"flex",flexDirection:"column",gap:"6px",marginTop:"6px",marginBottom:"8px"}}>
                <div style={{fontSize:"10px",color:"#737373"}}>From</div>
                <input type="date" value={filters.removalDateFrom} onChange={(e) => setFilters(p => ({...p, removalDateFrom: e.target.value}))} style={{padding:"5px 8px",border:"1px solid #D9D9D9",borderRadius:"6px",fontSize:"12px",color:"#000",background:"#F9F9F9",outline:"none",width:"100%",boxSizing:"border-box"}} />
                <div style={{fontSize:"10px",color:"#737373"}}>To</div>
                <input type="date" value={filters.removalDateTo} onChange={(e) => setFilters(p => ({...p, removalDateTo: e.target.value}))} style={{padding:"5px 8px",border:"1px solid #D9D9D9",borderRadius:"6px",fontSize:"12px",color:"#000",background:"#F9F9F9",outline:"none",width:"100%",boxSizing:"border-box"}} />
              </div>
              <div style={styles.sidebarLabel}>Role Tag <em style={{fontWeight:"400",fontSize:"9px"}}>Optional</em></div>
              <div style={styles.filterGroup}>
                {roleTags.map((tag) => (
                  <button key={tag} style={styles.filterChip(filters.roleTag.includes(tag))} onClick={() => toggleFilter("roleTag", tag)}>{tag}</button>
                ))}
              </div>
              <div style={styles.sidebarLabel}>Role Type <em style={{fontWeight:"400",fontSize:"9px"}}>Optional</em></div>
              <div style={styles.filterGroup}>
                {roleTypes.map((rt) => (
                  <button key={rt} style={styles.filterChip(filters.roleType.includes(rt))} onClick={() => toggleFilter("roleType", rt)}>{rt}</button>
                ))}
              </div>'''

app = app.replace(old_filters, new_filters)

with open('src/App.jsx', 'w') as f:
    f.write(app)

checks = [
    ('New order', 'Newsletter Type' in app and 'Active Between' in app),
    ('Date range filter', 'removalDateFrom' in app),
    ('clearAll updated', 'removalDateFrom: ""' in app),
]
for label, result in checks:
    print(f'{"OK" if result else "FAIL"} {label}')

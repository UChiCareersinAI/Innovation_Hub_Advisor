with open('src/App.jsx') as f:
    app = f.read()

# 1. Replace dates array with removalDates
app = app.replace(
    'const dates = [...new Set(rows.map((r) => r["Date"]).filter(Boolean))].sort();',
    'const removalDates = [...new Set(rows.map((r) => r["Removal Date [Internal]"]).filter(Boolean))].sort();'
)

# 2. Update filter state - replace date with removalDate, remove location
app = app.replace(
    'const [filters, setFilters] = useState({ industry: [], type: [], roleType: [], roleTag: [], metcalf: [], location: [], date: [] });',
    'const [filters, setFilters] = useState({ industry: [], type: [], roleType: [], roleTag: [], metcalf: [], newsletterType: [], removalDate: [] });'
)

# 3. Update clearAll
app = app.replace(
    'setFilters({ industry: [], type: [], roleType: [], roleTag: [], metcalf: [], location: [], date: [] });',
    'setFilters({ industry: [], type: [], roleType: [], roleTag: [], metcalf: [], newsletterType: [], removalDate: [] });'
)

# 4. Update filter logic - replace location and date filters
app = app.replace(
    '    if (filters.location.length > 0)\n      filtered = filtered.filter((r) => filters.location.includes(r["Location"]));\n    if (filters.date.length > 0)\n      filtered = filtered.filter((r) => filters.date.includes(r["Date"]));',
    '    if (filters.newsletterType.length > 0)\n      filtered = filtered.filter((r) => filters.newsletterType.some((nt) => (r["Newsletter Type"] || "").includes(nt)));\n    if (filters.removalDate.length > 0)\n      filtered = filtered.filter((r) => filters.removalDate.includes(r["Removal Date [Internal]"]));'
)

# 5. Update sidebar - replace old Location and Date sections with new ones, add Optional tags, add Newsletter Type
old_sidebar_end = '''              <div style={styles.sidebarLabel}>Metcalf Eligible</div>
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
              </div>'''

new_sidebar_end = '''              <div style={styles.sidebarLabel}>Newsletter Type <em style={{fontWeight:"400",fontSize:"9px"}}>Optional</em></div>
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

app = app.replace(old_sidebar_end, new_sidebar_end)

# 6. Move Role Type and Role Tag to after Newsletter Type in sidebar
# (already done in new_sidebar_end above - they come after Newsletter Type)

with open('src/App.jsx', 'w') as f:
    f.write(app)

checks = [
    ('removalDates array', 'const removalDates' in app),
    ('newsletterType filter', 'newsletterType' in app),
    ('Optional tags', 'Optional' in app),
    ('Location removed', 'filters.location' not in app),
    ('Date filter removed', 'filters.date' not in app),
]
for label, result in checks:
    print(f'{"OK" if result else "FAIL"} {label}')

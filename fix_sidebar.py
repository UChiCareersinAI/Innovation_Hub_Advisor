with open('src/App.jsx') as f:
    app = f.read()

old_sidebar = '''        <div style={{...styles.sidebar, display: mode === "linkdropper" ? "none" : "block"}}>
          {mode === "advising" && ('''

new_sidebar = '''        <div style={{...styles.sidebar, display: mode === "linkdropper" ? "none" : "block"}}>
          {mode === "newsletter" && (
            <>
              {activeFilterCount > 0 && (
                <button style={styles.clearBtn} onClick={clearAll}>
                  Clear all filters ({activeFilterCount})
                </button>
              )}
              <div style={styles.sidebarLabel}>Resource Type</div>
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
              <div style={styles.sidebarLabel}>Role Type</div>
              <div style={styles.filterGroup}>
                {roleTypes.map((rt) => (
                  <button key={rt} style={styles.filterChip(filters.roleType.includes(rt))} onClick={() => toggleFilter("roleType", rt)}>{rt}</button>
                ))}
              </div>
              <div style={styles.sidebarLabel}>Role Tag</div>
              <div style={styles.filterGroup}>
                {roleTags.map((tag) => (
                  <button key={tag} style={styles.filterChip(filters.roleTag.includes(tag))} onClick={() => toggleFilter("roleTag", tag)}>{tag}</button>
                ))}
              </div>
              <div style={styles.sidebarLabel}>Metcalf Eligible</div>
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
              </div>
            </>
          )}
          {mode === "advising" && ('''

app = app.replace(old_sidebar, new_sidebar)

with open('src/App.jsx', 'w') as f:
    f.write(app)

print('Sidebar restored:', 'Resource Type' in app and 'roleTypes' in app)

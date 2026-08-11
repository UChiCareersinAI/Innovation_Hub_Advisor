with open('src/App.jsx') as f:
    app = f.read()

old = '              <div style={styles.sidebarLabel}>Location</div>\n              <div style={styles.filterGroup}>\n                {locations.map((loc) => (\n                  <button key={loc} style={styles.filterChip(filters.location.includes(loc))} onClick={() => toggleFilter("location", loc)}>{loc}</button>\n                ))}\n              </div>\n            </>'
new = '              <div style={styles.sidebarLabel}>Location</div>\n              <div style={styles.filterGroup}>\n                {locations.map((loc) => (\n                  <button key={loc} style={styles.filterChip(filters.location.includes(loc))} onClick={() => toggleFilter("location", loc)}>{loc}</button>\n                ))}\n              </div>\n              <div style={styles.sidebarLabel}>Date</div>\n              <div style={styles.filterGroup}>\n                {dates.map((d) => (\n                  <button key={d} style={styles.filterChip(filters.date.includes(d))} onClick={() => toggleFilter("date", d)}>{d}</button>\n                ))}\n              </div>\n            </>'

app = app.replace(old, new)

with open('src/App.jsx', 'w') as f:
    f.write(app)

print('Date sidebar added:', 'sidebarLabel}>Date' in app)

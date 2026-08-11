with open('src/App.jsx') as f:
    app = f.read()

# Remove the old Role Type and Role Tag sections (without Optional tags)
old_role_sections = '''              <div style={styles.sidebarLabel}>Role Type</div>
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
              <div style={styles.sidebarLabel}>Newsletter Type'''

new_role_sections = '''              <div style={styles.sidebarLabel}>Newsletter Type'''

app = app.replace(old_role_sections, new_role_sections)

with open('src/App.jsx', 'w') as f:
    f.write(app)

import re
count = len(re.findall(r'sidebarLabel}>Role Type', app))
print('Role Type count:', count)
print('Role Tag count:', len(re.findall(r'sidebarLabel}>Role Tag', app)))

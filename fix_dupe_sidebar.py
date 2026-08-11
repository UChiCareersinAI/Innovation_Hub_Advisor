with open('src/App.jsx') as f:
    app = f.read()

# Find and remove the old filter block in the main content area
old_block = '''          {mode === "newsletter" && (
            <>
              <div style={styles.sidebarLabel}>Filter by Type</div>
              <div style={styles.filterGroup}>
                {resourceTypes.map((t) => (
                  <button
                    key={t}
                    style={styles.filterChip(filters.type.includes(t))}
                    onClick={() => toggleFilter("type", t)}
                  >
                    {t}
                  </button>
                ))}
              </div>'''

# Find where this block ends - it ends with </>
start = app.find(old_block)
if start > 0:
    # Find the closing </> after this block
    end = app.find('            </>', start) + len('            </>')
    # Also consume the following newline
    if app[end:end+1] == '\n':
        end += 1
    app = app[:start] + app[end:]
    print('Removed duplicate. roleTypes count:', app.count('roleTypes.map'))
else:
    print('Block not found')

with open('src/App.jsx', 'w') as f:
    f.write(app)

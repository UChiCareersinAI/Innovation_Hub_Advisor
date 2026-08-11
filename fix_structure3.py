with open('src/App.jsx') as f:
    app = f.read()

# Remove all linkdropper UI blocks first
while app.count('{mode === "linkdropper" && (') > 1:
    second = app.find('{mode === "linkdropper" && (', app.find('{mode === "linkdropper" && (') + 1)
    end = app.find('\n          {mode === ', second + 1)
    app = app[:second] + app[end+1:]

# Now find the single remaining block
ld_start = app.find('          {mode === "linkdropper" && (')
content_start = app.find('<div style={styles.content}>')

print('LD at:', ld_start, '| Content at:', content_start)

if ld_start < content_start:
    # LD block is before content div - need to move it
    ld_end = app.find('          {mode === "newsletter" && (')
    if ld_end < 0:
        ld_end = app.find('          {mode === "advising" && (')
    ld_block = app[ld_start:ld_end]
    app = app[:ld_start] + app[ld_end:]
    # Now insert after content div opens
    insert_after = app.find('<div style={styles.content}>') + len('<div style={styles.content}>')
    app = app[:insert_after] + '\n          ' + ld_block.strip() + '\n' + app[insert_after:]
    print('Moved successfully')

with open('src/App.jsx', 'w') as f:
    f.write(app)

print('LD now at:', app.find('{mode === "linkdropper" && ('))
print('Content at:', app.find('<div style={styles.content}>'))

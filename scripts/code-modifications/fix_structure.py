with open('src/App.jsx') as f:
    app = f.read()

# Find and remove Link Dropper block from current position
ld_start = app.find('          {mode === "linkdropper" && (')
ld_end = app.find('          {mode === "newsletter" && (', ld_start)

if ld_start > 0 and ld_end > 0:
    ld_block = app[ld_start:ld_end]
    app = app[:ld_start] + app[ld_end:]
    
    # Insert it inside styles.content, before newsletter block
    insert_point = app.find('          {mode === "newsletter" && (')
    app = app[:insert_point] + ld_block + app[insert_point:]
    print('Moved. linkdropper occurrences:', app.count('mode === "linkdropper"'))
else:
    print('Could not find blocks')

with open('src/App.jsx', 'w') as f:
    f.write(app)

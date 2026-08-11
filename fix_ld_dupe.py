with open('src/App.jsx') as f:
    app = f.read()

# Find both occurrences of the Link Dropper UI block
marker = '{mode === "linkdropper" && ('
first = app.find(marker)
second = app.find(marker, first + 1)

if second > 0:
    # Find the end of the second block - it ends just before {mode === "advising"
    end_marker = '{mode === "advising" && ('
    end = app.find(end_marker, second)
    # Remove from second linkdropper block to just before advising block
    app = app[:second] + app[end:]
    print('Removed duplicate. Submit Resource count:', app.count('Submit Resource'))
else:
    print('No duplicate found')

with open('src/App.jsx', 'w') as f:
    f.write(app)

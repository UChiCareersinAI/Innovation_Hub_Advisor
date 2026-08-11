with open('src/App.jsx') as f:
    app = f.read()

marker = '          {mode === "feedback" && ('
first = app.find(marker)
second = app.find(marker, first + 1)

if second > 0:
    # Find end of second block
    end_marker = '          {mode === "advising" && ('
    end = app.find(end_marker, second)
    if end > 0:
        app = app[:second] + app[end:]
        print('Removed duplicate. feedback count:', app.count(marker))
    else:
        print('Could not find end marker')
else:
    print('No duplicate found')

with open('src/App.jsx', 'w') as f:
    f.write(app)

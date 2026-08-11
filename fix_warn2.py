with open('src/App.jsx') as f:
    app = f.read()

# Count occurrences
count = app.count('f5c518')
print('Before:', count)

# Find and remove second occurrence
first = app.find('f5c518')
second = app.find('f5c518', first + 1)

if second > 0:
    # Find the start of the second warning block
    block_start = app.rfind('{ldResult && !ldResult.success && !ldResult.urlOk', 0, second)
    # Find the end of the second warning block
    block_end = app.find(')}', second) + 2
    app = app[:block_start] + app[block_end:]

with open('src/App.jsx', 'w') as f:
    f.write(app)

print('After:', app.count('f5c518'))

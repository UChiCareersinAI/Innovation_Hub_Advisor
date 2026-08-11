import json
with open('key.json') as f:
    key = json.load(f)['private_key'].replace('\n', '\\n')
with open('src/App.jsx') as f:
    app = f.read()
app = app.replace('const industries =', 'const dates = [...new Set(rows.map((r) => r["Date"]).filter(Boolean))].sort();\n  const industries =')
with open('src/App.jsx', 'w') as f:
    f.write(app)
print('Date filter added:', 'const dates' in app)

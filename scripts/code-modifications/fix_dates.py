with open('src/App.jsx') as f:
    app = f.read()

# Remove duplicate dates declaration
fixed = app.replace(
    'const dates = [...new Set(rows.map((r) => r["Date"]).filter(Boolean))].sort();\n  const dates = [...new Set(rows.map((r) => r["Date"]).filter(Boolean))].sort();',
    'const dates = [...new Set(rows.map((r) => r["Date"]).filter(Boolean))].sort();'
)

with open('src/App.jsx', 'w') as f:
    f.write(fixed)

print('Fixed:', fixed.count('const dates') == 1)

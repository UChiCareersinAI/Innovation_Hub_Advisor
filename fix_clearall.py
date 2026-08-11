with open('src/App.jsx') as f:
    app = f.read()

app = app.replace(
    'const activeFilterCount = Object.values(filters).flat().length;',
    'const activeFilterCount = Object.values(filters).flat().length;\n  const clearAll = () => setFilters({ industry: [], type: [], roleType: [], roleTag: [], metcalf: [], newsletterType: [], removalDate: [] });'
)

with open('src/App.jsx', 'w') as f:
    f.write(app)

print('Fixed:', 'const clearAll' in app)

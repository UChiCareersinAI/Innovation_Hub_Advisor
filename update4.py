with open('src/App.jsx') as f:
    app = f.read()

app = app.replace(
    'const [filters, setFilters] = useState({ industry: [], type: [], roleType: [], roleTag: [], metcalf: [], location: [] });',
    'const [filters, setFilters] = useState({ industry: [], type: [], roleType: [], roleTag: [], metcalf: [], location: [], date: [] });'
)

app = app.replace(
    'setFilters({ industry: [], type: [], roleType: [], roleTag: [], metcalf: [], location: [] });',
    'setFilters({ industry: [], type: [], roleType: [], roleTag: [], metcalf: [], location: [], date: [] });'
)

app = app.replace(
    'if (filters.location.length > 0)\n      filtered = filtered.filter((r) => filters.location.includes(r["Location"]));\n    setNewsletterOutput',
    'if (filters.location.length > 0)\n      filtered = filtered.filter((r) => filters.location.includes(r["Location"]));\n    if (filters.date.length > 0)\n      filtered = filtered.filter((r) => filters.date.includes(r["Date"]));\n    setNewsletterOutput'
)

with open('src/App.jsx', 'w') as f:
    f.write(app)

print('Date state:', 'date: []' in app)
print('Date filter logic:', 'filters.date.length' in app)

with open('src/App.jsx') as f:
    app = f.read()

old = '    if (filters.type.length > 0) {\n      filtered = filtered.filter((r) =>\n        filters.type.includes(r["Resource Type [External Search]"])\n      );\n    }\n    setNewsletterOutput(filtered.map(formatNewsletterRow));'

new = '    if (filters.type.length > 0)\n      filtered = filtered.filter((r) => filters.type.includes(r["Resource Type [External Search]"]));\n    if (filters.industry.length > 0)\n      filtered = filtered.filter((r) => filters.industry.some((ind) => (r["Industry"] || "").includes(ind)));\n    if (filters.roleType.length > 0)\n      filtered = filtered.filter((r) => filters.roleType.some((rt) => (r["Role Type"] || "").includes(rt)));\n    if (filters.roleTag.length > 0)\n      filtered = filtered.filter((r) => filters.roleTag.some((tag) => (r["Role Tag"] || "").includes(tag)));\n    if (filters.metcalf.length > 0)\n      filtered = filtered.filter((r) => filters.metcalf.includes(r["Metcalf?"]));\n    if (filters.location.length > 0)\n      filtered = filtered.filter((r) => filters.location.includes(r["Location"]));\n    if (filters.date.length > 0)\n      filtered = filtered.filter((r) => filters.date.includes(r["Date"]));\n    setNewsletterOutput(filtered.map(formatNewsletterRow));'

app = app.replace(old, new)

with open('src/App.jsx', 'w') as f:
    f.write(app)

print('All filters:', 'filters.date.length' in app and 'filters.metcalf.length' in app)

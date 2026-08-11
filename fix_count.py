with open('src/App.jsx') as f:
    app = f.read()

# Add activeFilterCount before the newsletter options
app = app.replace(
    'const newsletterOptions =',
    'const activeFilterCount = Object.values(filters).flat().length;\n  const newsletterOptions ='
)

with open('src/App.jsx', 'w') as f:
    f.write(app)

print('Fixed:', 'activeFilterCount' in app)

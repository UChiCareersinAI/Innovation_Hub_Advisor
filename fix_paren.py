with open('src/App.jsx') as f:
    app = f.read()

app = app.replace(
    '          )}\n          )}\n          {mode === "newsletter"',
    '          )}\n          {mode === "newsletter"'
)

with open('src/App.jsx', 'w') as f:
    f.write(app)

print('Fixed:', app.count('          )}\n          )}') == 0)

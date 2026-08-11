with open('src/App.jsx') as f:
    app = f.read()

app = app.replace(
    '<div style={styles.sidebar}>',
    '<div style={{...styles.sidebar, display: mode === "linkdropper" ? "none" : "block"}}>'
)

with open('src/App.jsx', 'w') as f:
    f.write(app)

print('Sidebar hidden:', 'linkdropper' in app and 'display: mode' in app)

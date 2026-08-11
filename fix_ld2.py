with open('src/App.jsx') as f:
    app = f.read()

# Fix text alignment in warning box
app = app.replace(
    '<div style={{textAlign:"right"}}>Paste the direct URL',
    '<div style={{textAlign:"left"}}>Paste the direct URL'
)
app = app.replace(
    '<div style={{textAlign:"right",marginTop:"6px"}}>If no webpage',
    '<div style={{textAlign:"left",marginTop:"6px"}}>If no webpage'
)
app = app.replace(
    '<div style={{textAlign:"right",marginTop:"6px"}}>Non-URL entries',
    '<div style={{textAlign:"left",marginTop:"6px"}}>Non-URL entries'
)

# Fix Link Dropper to be full width - wrap in full-width container
app = app.replace(
    '          {mode === "linkdropper" && (\n            <div style={styles.outputArea}>',
    '          {mode === "linkdropper" && (\n            <div style={{flex:1,overflowY:"auto",padding:"40px",display:"flex",justifyContent:"center"}}>'
)

with open('src/App.jsx', 'w') as f:
    f.write(app)

print('Left aligned:', 'textAlign:"left"}}>Paste' in app)
print('Full width:', 'justifyContent:"center"' in app)

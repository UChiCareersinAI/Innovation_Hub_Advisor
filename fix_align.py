with open('src/App.jsx') as f:
    app = f.read()

app = app.replace(
    '<div style={{flex:1,fontSize:"13px",lineHeight:"1.6"}} dangerouslySetInnerHTML',
    '<div style={{flex:1,fontSize:"13px",lineHeight:"1.6",textAlign:"left"}} dangerouslySetInnerHTML'
)

with open('src/App.jsx', 'w') as f:
    f.write(app)

print('Fixed:', 'textAlign:"left"' in app)

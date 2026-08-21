with open('src/App.jsx') as f:
    app = f.read()

app = app.replace(
    'background:"rgba(128,0,0,0.05)",border:"1px solid rgba(128,0,0,0.2)",borderRadius:"8px",fontSize:"13px",color:"#800000"',
    'background:"rgba(46,204,113,0.1)",border:"1px solid rgba(46,204,113,0.3)",borderRadius:"8px",fontSize:"13px",color:"#27ae60"'
)

with open('src/App.jsx', 'w') as f:
    f.write(app)

print('Fixed:', '#27ae60' in app)

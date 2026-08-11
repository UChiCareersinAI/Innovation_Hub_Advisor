with open('src/App.jsx') as f:
    app = f.read()

app = app.replace(
    'style={{display:"flex",alignItems:"center",gap:"8px",cursor:"pointer",fontSize:"13px",color:fbForm.feedbackType===opt?"#800000":"#737373"}}',
    'style={{display:"flex",alignItems:"center",gap:"8px",cursor:"pointer",fontSize:"13px",color:fbForm.feedbackType===opt?"#800000":"#737373",userSelect:"none",pointerEvents:"auto"}}'
)

with open('src/App.jsx', 'w') as f:
    f.write(app)

print('Fixed:', 'pointerEvents:"auto"' in app)

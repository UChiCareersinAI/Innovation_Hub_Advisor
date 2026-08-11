with open('src/App.jsx') as f:
    app = f.read()

# Fix duplicate LINK_DROPPER_URL
url_line = 'const LINK_DROPPER_URL = "https://script.google.com/macros/s/AKfycbwclZ54wqPLcGvztf18EgGl-Xk3r277bkwCHg-GA5YxP9HcFhUgMkPdF3Rs-V1AeCPUaA/exec";\n'
while app.count(url_line) > 1:
    app = app.replace(url_line + url_line, url_line)

# Fix duplicate ldForm state
dupe_state = """  const [ldForm, setLdForm] = useState({ newsletter: [], resourceType: '', url: '', removalDate: '', emailAddress: '' });
  const [ldSubmitting, setLdSubmitting] = useState(false);
  const [ldResult, setLdResult] = useState(null);
  const [ldForm, setLdForm] = useState({ newsletter: [], resourceType: '', url: '', removalDate: '', emailAddress: '' });
  const [ldSubmitting, setLdSubmitting] = useState(false);
  const [ldResult, setLdResult] = useState(null);"""

single_state = """  const [ldForm, setLdForm] = useState({ newsletter: [], resourceType: '', url: '', removalDate: '', emailAddress: '' });
  const [ldSubmitting, setLdSubmitting] = useState(false);
  const [ldResult, setLdResult] = useState(null);"""

app = app.replace(dupe_state, single_state)

# Fix duplicate Link Dropper tab button
dupe_btn = """        <button style={styles.modeBtn(mode === "linkdropper")} onClick={() => setMode("linkdropper")}>Link Dropper</button>
        <button style={styles.modeBtn(mode === "linkdropper")} onClick={() => setMode("linkdropper")}>Link Dropper</button>"""
single_btn = """        <button style={styles.modeBtn(mode === "linkdropper")} onClick={() => setMode("linkdropper")}>Link Dropper</button>"""
app = app.replace(dupe_btn, single_btn)

with open('src/App.jsx', 'w') as f:
    f.write(app)

print('LINK_DROPPER_URL count:', app.count('const LINK_DROPPER_URL'))
print('ldForm count:', app.count('const [ldForm'))
print('Link Dropper btn count:', app.count('mode === "linkdropper"'))

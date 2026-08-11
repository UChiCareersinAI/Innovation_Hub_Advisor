with open('src/App.jsx') as f:
    app = f.read()

old = '''        <button style={styles.modeBtn(mode === "advising")} onClick={() => setMode("advising")}>
          Advising Email
        </button>
      </div>'''

new = '''        <button style={styles.modeBtn(mode === "advising")} onClick={() => setMode("advising")}>
          Advising Email
        </button>
        <button style={styles.modeBtn(mode === "linkdropper")} onClick={() => setMode("linkdropper")}>
          Link Dropper
        </button>
      </div>'''

app = app.replace(old, new)

with open('src/App.jsx', 'w') as f:
    f.write(app)

print('Tab added:', 'linkdropper' in app)

with open('src/App.jsx') as f:
    app = f.read()

old = '''                  {Object.entries(sectionLabels).map(([key, label]) => {
                    const sectionRows = newsletterOutput.filter(
                      (o) => o.row["Resource Type [External Search]"] === key
                    );
                    if (sectionRows.length === 0) return null;'''

new = '''                  {Object.entries(sectionLabels).map(([key, label]) => {
                    if (key === "Other") return null;
                    let sectionRows = newsletterOutput.filter(
                      (o) => o.row["Resource Type [External Search]"] === key
                    );
                    if (!showFlagged) sectionRows = sectionRows.filter(o => !o.flag);
                    if (sectionRows.length === 0) return null;'''

app = app.replace(old, new)

with open('src/App.jsx', 'w') as f:
    f.write(app)

print('Fixed:', 'key === "Other"' in app)

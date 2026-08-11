with open('src/App.jsx') as f:
    app = f.read()

# Fix section copy buttons to use formatForOutput
old_section_copy = '''                          <button onClick={() => {
                            const text = sectionRows.map(({formatted, flag, row}) => {
                              let out = formatted;
                              if (flag) out = `[${flag.toUpperCase()}] ${out}\\n  ⚠ ${row["Failure Message"]}`;
                              return out;
                            }).join("\\n\\n");
                            navigator.clipboard.writeText(text);
                          }}'''

new_section_copy = '''                          <button onClick={() => {
                            const text = sectionRows.map(({flag, row}) => {
                              if (row["Resource Type [External Search]"] === "Other") return null;
                              const out = formatForOutput(row, outputFormat);
                              if (!out) return null;
                              if (flag && showFlagged) return `[${flag.toUpperCase()}] ${out}\\n  ⚠ ${row["Failure Message"]}`;
                              return out;
                            }).filter(Boolean).join("\\n\\n");
                            navigator.clipboard.writeText(text);
                          }}'''

app = app.replace(old_section_copy, new_section_copy)

with open('src/App.jsx', 'w') as f:
    f.write(app)

print('Section copy fixed:', 'formatForOutput(row, outputFormat)' in app)

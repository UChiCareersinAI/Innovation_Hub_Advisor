with open('src/App.jsx') as f:
    app = f.read()

# Add quality filter to newsletterOutput useEffect
old_filter = "    let filtered = rows.filter((r) =>\n      r[\"Newsletter this week?\"] === \"TRUE\" ||\n      r[\"Newsletter this week?\"] === \"true\" ||\n      r[\"Newsletter this week?\"] === \"1\"\n    );"

new_filter = """    let filtered = rows.filter((r) =>
      r["Newsletter this week?"] === "TRUE" ||
      r["Newsletter this week?"] === "true" ||
      r["Newsletter this week?"] === "1"
    );
    // Filter out rows with no valid URL and no title
    filtered = filtered.filter((r) => {
      const url = r["URL"] || "";
      const title = r["Title"] || "";
      if (!url.startsWith("http") && (!title || title === "Untitled")) return false;
      return true;
    });"""

app = app.replace(old_filter, new_filter)

with open('src/App.jsx', 'w') as f:
    f.write(app)

print('Fixed:', 'startsWith("http")' in app)

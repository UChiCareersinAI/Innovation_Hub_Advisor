with open('src/App.jsx') as f:
    app = f.read()

# Find Link Dropper block inside sidebar (around line 710)
sidebar_ld_start = app.find('          {mode === "linkdropper" && (')
sidebar_ld_end = app.find('          {mode === "advising" && (')

if sidebar_ld_start > 0 and sidebar_ld_end > 0 and sidebar_ld_start < sidebar_ld_end:
    ld_block = app[sidebar_ld_start:sidebar_ld_end]
    # Remove from sidebar
    app = app[:sidebar_ld_start] + app[sidebar_ld_end:]
    # Insert before newsletter block inside content div
    insert_point = app.find('          {mode === "newsletter" && (')
    app = app[:insert_point] + ld_block + app[insert_point:]
    print('Fixed. Line positions:')
    for term in ['linkdropper', 'styles.content', 'mode === "newsletter"']:
        idx = app.find(term)
        print(f'  {term}: char {idx}')
else:
    print('Block not found or wrong order')

with open('src/App.jsx', 'w') as f:
    f.write(app)

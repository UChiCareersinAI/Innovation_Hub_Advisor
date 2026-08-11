with open('src/App.jsx') as f:
    lines = f.readlines()

# Remove duplicate state lines (454-459 are lines 453-458 in 0-index, keep first set)
# Remove lines 456-458 (0-indexed: 456,457,458) which are the duplicates
output = []
skip_next = 0
seen_ldForm = False
seen_handleLd = False

for i, line in enumerate(lines):
    lineno = i + 1
    # Remove duplicate state declarations (lines 457-459)
    if lineno in [457, 458, 459]:
        continue
    # Remove duplicate handleLdSubmit function (lines 660-end of that function)
    # Find where second handleLdSubmit starts
    if lineno >= 660 and 'if (ldSubmitting) return;' in line and seen_handleLd:
        skip_next = 50  # skip enough lines to clear the duplicate function
    if skip_next > 0 and lineno >= 660:
        skip_next -= 1
        continue
    if 'if (ldSubmitting) return;' in line:
        seen_handleLd = True
    output.append(line)

with open('src/App.jsx', 'w') as f:
    f.writelines(output)

with open('src/App.jsx') as f:
    app = f.read()
print('ldForm count:', app.count('const [ldForm'))
print('handleLd count:', app.count('if (ldSubmitting) return;'))

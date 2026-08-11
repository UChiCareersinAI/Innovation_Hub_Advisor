with open('src/App.jsx') as f:
    lines = f.readlines()

# Find and remove the duplicate )} - it's the one right before {mode === "newsletter"
for i in range(len(lines)-1):
    if lines[i].strip() == ')}' and lines[i+1].strip() == ')}' and '{mode === "newsletter"' in lines[i+2]:
        lines.pop(i)
        break

with open('src/App.jsx', 'w') as f:
    f.writelines(lines)

print('Done')

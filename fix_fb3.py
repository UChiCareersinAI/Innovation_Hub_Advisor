with open('src/App.jsx') as f:
    lines = f.readlines()

# Find line 901 (0-indexed: 900) and remove until next mode block
start = 900  # 0-indexed
end = start
for i in range(start, min(start + 300, len(lines))):
    if i > start and '{mode === "advising"' in lines[i]:
        end = i
        break

print(f'Removing lines {start+1} to {end}')
lines = lines[:start] + lines[end:]

with open('src/App.jsx', 'w') as f:
    f.writelines(lines)

import re
count = len(re.findall(r'{mode === "feedback"', open('src/App.jsx').read()))
print(f'Feedback blocks remaining: {count}')

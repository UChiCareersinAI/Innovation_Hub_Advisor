with open('src/App.jsx') as f:
    app = f.read()

for var in ['roleTypes', 'roleTags', 'locations', 'dates']:
    line = f'const {var} = '
    parts = app.split(line)
    if len(parts) > 2:
        # Keep first occurrence, remove second
        app = parts[0] + line + line.join(parts[1:]).replace(line, '', 1)

with open('src/App.jsx', 'w') as f:
    f.write(app)

import re
for var in ['roleTypes', 'roleTags', 'locations', 'dates']:
    count = len(re.findall(f'const {var} =', app))
    print(f'{var}: {count}')

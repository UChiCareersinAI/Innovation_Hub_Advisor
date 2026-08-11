with open('src/App.jsx') as f:
    app = f.read()

replacements = [
    # App background
    ('"#0f1117"', '"#FFFFFF"'),
    # Sidebar background
    ('"#0d0f14"', '"#F5F5F5"'),
    # Card background (normal)
    ('"#13161f"', '"#FFFFFF"'),
    # Input/textarea background
    ('"#1a1d26"', '"#F9F9F9"'),
    # Primary accent (orange-red -> Maroon)
    ('"#c84b31"', '"#800000"'),
    ('"#e8623a"', '"#800000"'),
    # Border colors
    ('"#1e2330"', '"#D9D9D9"'),
    # Primary text
    ('"#e8e6e0"', '"#000000"'),
    # Secondary text
    ('"#8a8f9e"', '"#737373"'),
    ('"#5a6070"', '"#737373"'),
    # Muted text
    ('"#3a3f50"', '"#A6A6A6"'),
    # Dark background elements
    ('"#2a2d3a"', '"#D9D9D9"'),
    # WARN color - keep Goldenrod but ensure black text context
    # FAIL badge - use Brick
    ('rgba(200,75,49,0.2)', 'rgba(128,0,0,0.1)'),
    ('rgba(200,75,49,0.3)', 'rgba(128,0,0,0.3)'),
    ('rgba(200,75,49,0.4)', 'rgba(128,0,0,0.4)'),
    ('rgba(200,75,49,0.06)', 'rgba(128,0,0,0.04)'),
    ('"#e8623a"', '"#800000"'),
    # Chat bubbles
    ('background: role === "user" ? "#c84b31"', 'background: role === "user" ? "#800000"'),
    ('background: role === "user" ? "#800000"', 'background: role === "user" ? "#800000"'),
    # Font family
    ("'Inter', -apple-system, sans-serif", "'Gotham', 'Gotham SSm', 'Helvetica Neue', Helvetica, Arial, sans-serif"),
    # Active filter chip text color
    ('color: active ? "#e8623a"', 'color: active ? "#800000"'),
    ('color: active ? "#800000"', 'color: active ? "#800000"'),
    # Mode button active color
    ('"2px solid #c84b31"', '"2px solid #800000"'),
    ('"2px solid #800000"', '"2px solid #800000"'),
    # Send button
    ('background: loading ? "#2a2d3a"', 'background: loading ? "#D9D9D9"'),
    ('color: loading ? "#5a6070"', 'color: loading ? "#737373"'),
]

for old, new in replacements:
    app = app.replace(old, new)

# Fix logo gradient
app = app.replace(
    '"linear-gradient(135deg, #c84b31, #e8623a)"',
    '"#800000"'
)

# Fix status bar dot for flagged
app = app.replace(
    'styles.dot("#e6b432")', 
    'styles.dot("#EAAA00")'
)

with open('src/App.jsx', 'w') as f:
    f.write(app)

print('Maroon instances:', app.count('#800000'))
print('Font updated:', 'Gotham' in app)
print('White background:', '#FFFFFF' in app)

with open('src/App.jsx') as f:
    app = f.read()

# Remove any center alignment from card styles
app = app.replace('textAlign: "center"', 'textAlign: "left"')

with open('src/App.jsx', 'w') as f:
    f.write(app)

print('Done')

with open('src/App.jsx') as f:
    app = f.read()

app = app.replace(
    '                              )}\n                          );\n                        })}',
    '                              )}\n                            </div>\n                          );\n                        })}'
)

with open('src/App.jsx', 'w') as f:
    f.write(app)

print('Done')

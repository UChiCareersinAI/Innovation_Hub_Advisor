with open('src/App.jsx') as f:
    lines = f.readlines()

# Find the start line (cardHeader div) and end line (before </div></div>)
start = None
end = None
for i, line in enumerate(lines):
    if 'styles.cardHeader' in line and start is None:
        start = i
    if start and "row[\"Failure Message\"] && (" in line:
        # Find the closing of this block
        for j in range(i, i+5):
            if '</div>' in lines[j] and 'cardFlag' not in lines[j]:
                end = j + 1
                break
        break

new_card = '''                              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"8px"}}>
                                <div style={{flex:1,fontSize:"13px",lineHeight:"1.6"}} dangerouslySetInnerHTML={{__html: (() => {
                                  const type = row["Resource Type [External Search]"] || "";
                                  const title = row["Title"] || "Untitled";
                                  const url = row["URL"] || "";
                                  const employer = row["Employer/Host"] || "";
                                  const location = row["Location"] || "";
                                  const date = row["Date"] || "";
                                  const oneliner = row["One-liner"] || "";
                                  const link = (text, href) => href ? `<a href="${href}" target="_blank" style="color:#800000">${text}</a>` : text;
                                  const bold = (text) => `<b>${text}</b>`;
                                  const italic = (text) => `<i>${text}</i>`;
                                  const pipe = " | ";
                                  if (outputFormat === "html") {
                                    if (["Full Time Role","Internship- Summer","Internship- Academic Year","Program"].includes(type)) {
                                      const parts = [bold(link(employer,url)), bold(title), location?italic(location):null, date].filter(Boolean);
                                      return parts.join(pipe);
                                    }
                                    if (type === "Career Advisors") return [bold(title), employer, italic(link("Schedule a conversation!",url))].filter(Boolean).join(pipe);
                                    if (type === "Cool Tools & Resources") return [bold(link(title,url)), oneliner].filter(Boolean).join(pipe);
                                    if (type === "Event") { const parts = [bold(link(title,url)), location||null, date||null, oneliner||null].filter(Boolean); return `<div style="text-align:center">${parts.join(pipe)}</div>`; }
                                    if (type === "Chatbot Prompt") return `<div style="text-align:center">${oneliner}</div>`;
                                    return bold(link(title,url));
                                  } else {
                                    const plainLink = (t,h) => h?`${t} (${h})`:t;
                                    if (["Full Time Role","Internship- Summer","Internship- Academic Year","Program"].includes(type)) return [plainLink(employer.toUpperCase(),url), title.toUpperCase(), location, date].filter(Boolean).join(" | ");
                                    if (type === "Career Advisors") return [title.toUpperCase(), employer, `Schedule a conversation! (${url})`].filter(Boolean).join(" | ");
                                    if (type === "Cool Tools & Resources") return [plainLink(title.toUpperCase(),url), oneliner].filter(Boolean).join(" | ");
                                    if (type === "Event") return [plainLink(title.toUpperCase(),url), location, date, oneliner].filter(Boolean).join(" | ");
                                    if (type === "Chatbot Prompt") return oneliner;
                                    return title;
                                  }
                                })()}} />
                                {flag && <span style={{...styles.flagBadge(flag),marginLeft:"12px",flexShrink:0}}>{flag.toUpperCase()}</span>}
                              </div>
                              {flag && row["Failure Message"] && (
                                <div style={styles.cardFlag}>{row["Failure Message"]}</div>
                              )}
'''

print(f'Replacing lines {start} to {end}')
lines = lines[:start] + [new_card] + lines[end:]

with open('src/App.jsx', 'w') as f:
    f.writelines(lines)

print('Done. dangerouslySetInnerHTML in file:', 'dangerouslySetInnerHTML' in open('src/App.jsx').read())

with open('src/App.jsx') as f:
    lines = f.readlines()

new_fn = '''  const copyNewsletter = () => {
    const sectionOrder = [
      ["Full Time Role", "Full-Time Roles"],
      ["Internship- Summer", "Summer Internships"],
      ["Internship- Academic Year", "Academic Year Internships"],
      ["Event", "Events"],
      ["Program", "Programs"],
      ["Cool Tools & Resources", "Tools & Resources"],
      ["Chatbot Prompt", "Chatbot Prompts"],
      ["Career Advisors", "Career Advisors"],
    ];
    const sections = [];
    for (const [key, label] of sectionOrder) {
      let sectionRows = newsletterOutput.filter(o => o.row["Resource Type [External Search]"] === key);
      if (!showFlagged) sectionRows = sectionRows.filter(o => !o.flag);
      if (sectionRows.length === 0) continue;
      const lines = sectionRows.map(({ row, flag }) => {
        const out = formatForOutput(row, outputFormat);
        if (!out) return null;
        if (flag && showFlagged) return `[${flag.toUpperCase()}] ${out}\\n  \\u26a0 ${row["Failure Message"]}`;
        return out;
      }).filter(Boolean);
      if (lines.length === 0) continue;
      sections.push(label + "\\n\\n" + lines.join("\\n\\n"));
    }
    const text = sections.join("\\n\\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
'''

# Find start and end of copyNewsletter function (lines 674-688 in 1-indexed = 673-687 in 0-indexed)
start = 673  # 0-indexed line 674
end = 688    # 0-indexed line 689 (the }; line + 1)

# Find the actual end by looking for };
for i in range(start, min(start+30, len(lines))):
    if lines[i].strip() == '};':
        end = i + 1
        break

lines = lines[:start] + [new_fn] + lines[end:]

with open('src/App.jsx', 'w') as f:
    f.writelines(lines)

print('Done. sectionOrder in file:', 'sectionOrder' in open('src/App.jsx').read())

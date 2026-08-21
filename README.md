# Innovation Hub Advisor Tool

Internal advising and newsletter support tool for UChicago Career Advancement's Careers in Artificial Intelligence team.

- **Live Site:** https://uchicareersinai.github.io/Innovation_Hub_Advisor/
- **Repository:** https://github.com/uchicareersinai/Innovation_Hub_Advisor
- **Primary Data Source:** The `Innovation Hub` tab in the team's Google Sheet

## High-Level Overview

The Innovation Hub Advisor Tool is a React website deployed through GitHub Pages. It helps advising teams use resources stored in the Innovation Hub Google Sheet.

The tool includes:

- **Newsletter:** Filters resources selected for the newsletter and formats them for Mailchimp.
- **Advising:** Matches resources with a student's interests and advising-session notes.
- **Link Dropper:** Submits new opportunities and resources to the team's intake process.
- **Feedback:** Collects user feedback and feature requests.

The Google Sheet is the main source of data. Google Forms and Google Apps Script support Link Dropper submissions and resource processing.

## Setup Instructions

### Run Locally

Install Git, Node.js, and npm. Then run:

```bash
git clone https://github.com/uchicareersinai/Innovation_Hub_Advisor.git
cd Innovation_Hub_Advisor
npm install
npm run dev
```

Vite will provide a local URL, usually `http://localhost:5173`.

### Build and Deploy

Test the production build:

```bash
npm run build
npm run preview
```

Deploy the site to GitHub Pages:

```bash
npm run deploy
```

The GitHub Pages base path is configured in `vite.config.js`.

> This is a public static website. Do not store API keys, service-account private keys, student information, or other sensitive data in the React code, backup files, `dist/`, or Git history. Authenticated requests should be handled through an approved backend service.

## Big Files and What They Do

| File | Description |
| --- | --- |
| `src/App.jsx` | The main application file. It contains the newsletter, advising, Link Dropper, feedback, Google Sheet integration, filtering, formatting, and most of the interface. Start here when making changes to the tool. |
| `dist/` | The generated production website created by `npm run build`. Do not edit it directly. |
| `package.json` | Lists project dependencies and commands for running, building, and deploying the site. |
| `vite.config.js` | Configures Vite and the GitHub Pages URL path. |
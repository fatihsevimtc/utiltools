# UtilTools

A collection of 100+ free, privacy-first browser utilities — no account, no server, no data leaving your device.

🌐 **Live site:** [utiltools.org](https://utiltools.org)

---

## What's inside

| Category | Tools |
|---|---|
| 📝 Text | Word counter, case converter, lorem ipsum, diff checker, and more |
| 🛠️ Developer | JSON / XML / YAML formatters, JWT decoder, regex tester, SQL formatter, and more |
| ⚡ Generators | UUID, hash, QR code, password, avatar, and more |
| 🔢 Math & Numbers | BMI, loan, compound interest, binary calc, and more |
| 📅 Time & Date | Age calculator, countdown, pomodoro, timezone converter, and more |
| 🖼️ Images & Files | Image resizer, EXIF viewer, Base64 ↔ image, favicon generator, and more |
| 🎨 Design & CSS | Gradient, box-shadow, border-radius, flexbox, grid generator, and more |
| 🤖 AI Tools | AI model comparison, token counter, system prompt builder, and more |

Everything runs in the browser. No backend. No analytics. No cookies.

---

## Tech stack

- **React 19** + **Vite 8**
- **react-router-dom v7** for client-side routing
- Hosted on **Cloudflare Pages**

---

## Getting started

### Prerequisites

- Node.js 18+
- npm (or your preferred package manager)

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/fatihsevimtc/utiltools.git
cd utiltools

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Then edit .env and fill in your own values (see below)

# 4. Start the dev server
npm run dev
```

### Environment variables

Copy `.env.example` to `.env` and provide your own values:

| Variable | Description |
|---|---|
| `VITE_WEB3FORMS_KEY` | Used by the "Suggest a tool" form. Get a free key at [web3forms.com](https://web3forms.com) — enter your email, they send it instantly. Without this, the suggest form will show a setup warning and submissions won't go anywhere. |

> The app is fully functional without the env variable — only the suggestion form requires it.
>
> **Cloudflare Pages:** set variables under Settings → Environment variables in your Pages project dashboard.

---

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for the full guide.

Quick version:

1. Fork the repo and create a branch: `git checkout -b feat/my-new-tool`
2. Add your tool in `src/pages/tools/MyTool.jsx`
3. Register the route in `src/App.jsx`
4. Add it to the tool list in `src/pages/Home.jsx`
5. Add the page title entry in `src/components/Layout.jsx`
6. Open a pull request — describe what the tool does and why it belongs here

---

## Running locally

```bash
npm run dev       # start dev server at http://localhost:5173
npm run build     # production build → dist/
npm run preview   # preview the production build locally
npm run lint      # run ESLint
```

---

## License

MIT — see [LICENSE](LICENSE) for details.

# Contributing to UtilTools

Thanks for taking the time to contribute! This document covers everything you need to know to get a tool or fix merged.

---

## Ground rules

- All tools must run **100% in the browser** — no external API calls that send user data to a server.
- Keep dependencies minimal. The project intentionally has a tiny `node_modules`. Check if the browser already provides what you need (e.g., `crypto.subtle` for hashing) before adding a package.
- One tool per PR keeps review fast.
- Match the existing code style (no TypeScript, functional components, inline styles for layout, CSS variables for theming).

---

## Adding a new tool

### 1. Create the tool page

Add `src/pages/tools/MyToolName.jsx`. Use an existing tool as a reference — `src/pages/tools/WordCounter.jsx` is a good simple example.

The basic shape:

```jsx
import BackBar from '../../components/BackBar'

export default function MyToolName() {
  // all logic goes here — no server calls

  return (
    <div style={{ maxWidth: 640 }}>
      <BackBar />
      <h1>My Tool Name</h1>
      <p style={{ color: 'var(--muted)', margin: '0.5rem 0 1.5rem' }}>
        One-sentence description of what this tool does.
      </p>

      {/* tool UI */}
    </div>
  )
}
```

### 2. Register the route in `src/App.jsx`

Import your component and add a `<Route>`:

```jsx
import MyToolName from './pages/tools/MyToolName'

// inside <Routes>:
<Route path="/tools/my-tool-name" element={<MyToolName />} />
```

Use kebab-case for the path.

### 3. Add it to the home page (`src/pages/Home.jsx`)

Pick the right category object in `CATEGORIES` and add an entry:

```js
{ icon: '🔧', name: 'My Tool Name', desc: 'One-line description.', path: '/tools/my-tool-name' },
```

Use a relevant emoji for the icon. Keep the description under ~60 characters.

### 4. Add the page title (`src/components/Layout.jsx`)

Add a line to the `TOOL_NAMES` map:

```js
'/tools/my-tool-name': 'My Tool Name',
```

### 5. Open a pull request

- Title format: `feat: add [Tool Name]`
- Describe what the tool does and what input/output it handles
- Screenshots are appreciated but not required

---

## Bug fixes and improvements

- For bug fixes, reference the issue number in the PR description if one exists.
- For improvements to existing tools, explain what changed and why.

---

## Reporting issues

Open a GitHub issue with:
- What you expected to happen
- What actually happened
- Steps to reproduce (browser, OS, input used)

---

## Code style

- No TypeScript — plain JSX throughout.
- Functional components only.
- Avoid adding new npm dependencies unless genuinely necessary.
- Use CSS variables (`var(--accent)`, `var(--muted)`, `var(--bg)`, etc.) for colors — don't hardcode hex values.
- Keep each tool self-contained in its own file.

---

## Questions?

Open a discussion or issue on GitHub. Happy to help.

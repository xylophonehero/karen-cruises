# Karen Cruise Schedule

A React + TypeScript + Vite application for displaying cruise schedules and itineraries.

## Environment Variables

This app uses an environment variable to specify which schedule JSON file to load at build time:

- `VITE_SCHEDULES_FILE` - **REQUIRED** - Path to schedule JSON file (relative to `src/data/`)
  - Format: `schedule-XXX.json` (e.g., `schedule-karen.json`, `schedule-john.json`)
  - **Build will fail if this is not set**
- Itineraries are always loaded from the static file: `itineraries.json`

### Setting Environment Variables

#### Option 1: Using `.env` file (Recommended)

Create a `.env` file in the project root:

```bash
VITE_SCHEDULES_FILE=schedule-karen.json
```

#### Option 2: CLI (Unix/Mac/Linux)

```bash
VITE_SCHEDULES_FILE=schedule-john.json pnpm build
```

#### Option 3: CLI (Cross-platform with cross-env)

First install cross-env:

```bash
pnpm add -D cross-env
```

Then use it:

```bash
cross-env VITE_SCHEDULES_FILE=schedule-john.json pnpm build
```

#### Option 4: Using Vite modes

Create `.env.production`, `.env.staging`, etc. files, then:

```bash
pnpm build --mode production  # Uses .env.production
pnpm build --mode staging     # Uses .env.staging
```

**Note:** Environment variables are resolved at BUILD TIME. You must rebuild after changing them.

## Development

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    "react-x": reactX,
    "react-dom": reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs["recommended-typescript"].rules,
    ...reactDom.configs.recommended.rules,
  },
});
```

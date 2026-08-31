# Survey Campaign Builder

A polished, production-quality **Survey Campaign Builder** built with React, TypeScript, Vite, and Tailwind CSS. Design survey campaigns with a live mobile preview that updates instantly — no save button, no refresh.

Created as the **AppVersal Frontend Intern Assignment 02**.

---

## Features

### Content Page
- **Introduction** — title & description, plus a dynamic count of survey questions
- **Questions** — dynamically add / remove unlimited question sections
  - Question title & description
  - Minimum 2 options per question; add and delete options (unlimited)
  - **Additional Comments** toggle per question
- **Logic** — add conditions that redirect to another question or the Thank You page based on a selected option (mock implementation)
- **Submit** — customizable button text
- **Thank You Page**
  - Enable / disable toggle
  - **Media upload** (PNG / JPG / JPEG / GIF / Lottie) with instant local preview
  - Title, description, CTA button text, and redirect dropdown/URL

### Styling Page
Full real-time control over every visual aspect:

**Appearance**
- Background color
- Corner radii (Top Left / Top Right / Bottom Left / Bottom Right)
- Delay
- Backdrop color & opacity

**Question Title**
- Color, font family, size, weight
- Bold / Italic / Underline
- Alignment & margins

**Subtitle**
- Color, font, size, weight, style, alignment, margins

**Option List**
- Radio style / checkbox style
- Filled option & alternative (grid) layout
- Option height, bullet spacing, option spacing, corner radius

**Selected / Unselected Option**
- Border color, text color, background color, border width
- Font, size, weight, style, alignment

**Additional Comment**
- Border color, text color, background color, border width
- Font, size, weight, style, alignment

**CTA Button**
- Full width, border, text, background
- Font, size, style, height, width, border width
- Four corner radius controls, alignment, margins

**Cross Button**
- Enable / disable
- Multiple predefined styles + custom cross icon upload
- Cross color, fill color, stroke color, size, margins

**Thank You**
- Title styling, subtitle styling, image styling, and button styling

### Live Mobile Preview
- Realistic mobile phone preview on the right side
- **Every** content and styling change updates the preview immediately — no save or refresh
- Supports dynamic questions, dynamic options, additional comments, CTA button, cross button, Thank You page, uploaded media, and all styling changes

---

## Tech Stack

| Layer     | Technology                       |
| --------- | -------------------------------- |
| Framework | React 18                         |
| Language  | TypeScript                       |
| Build     | Vite 5                           |
| Styling   | Tailwind CSS 3                   |
| Icons     | Lucide React                     |
| State     | React Context + useReducer       |

---

## Folder Structure

```
.
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── common/            # Reusable controls, inputs, style controls, sections
│   │   ├── content/           # Introduction, Question, Option, Logic, Thank You editors
│   │   ├── preview/           # MobilePreview
│   │   ├── styling/           # StylingEditor, TextStyleControls
│   │   ├── ContentEditor.tsx
│   │   └── Sidebar.tsx
│   ├── context/               # SurveyContext + useReducer
│   ├── data/                  # defaultSurvey, uid/clamp helpers
│   ├── hooks/                 # useCollapsibleGroups
│   ├── types/                 # TypeScript interfaces
│   ├── utils/                 # color helpers
│   ├── App.tsx
│   └── main.tsx
├── .gitignore
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.ts
```

---

## Architecture

All survey state lives in a single **React Context** (`src/context/SurveyContext.tsx`) driven by a **`useReducer`** reducer. Every editor dispatches typed actions that mutate the survey object. Because the live mobile preview subscribes to the same context, every change is reflected immediately.

Core TypeScript interfaces (`src/types/index.ts`):

- `Survey`
- `Question`
- `Option`
- `ConditionalLogic`
- `ThankYouPage`
- `Styling`

The UI is composed of reusable components (inputs, toggles, sliders, color pickers, editors) for a clean, production-quality codebase.

---

## Installation

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9

```bash
# 1. Clone the repository
git clone https://github.com/afzal63063/survey-campaign-builder.git
cd survey-campaign-builder

# 2. Install dependencies
npm install
```

---

## Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Scripts

| Command            | Description                        |
| ------------------ | ---------------------------------- |
| `npm run dev`      | Start the Vite dev server          |
| `npm run build`    | Type-check + production build      |
| `npm run preview`  | Preview the production build       |
| `npm run lint`     | Run TypeScript type checking       |

---

## Build

```bash
# Type-check + production build
npm run build

# Preview the production build locally
npm run preview
```

---

## GitHub

Repository: [https://github.com/afzal63063/survey-campaign-builder.git](https://github.com/afzal63063/survey-campaign-builder.git)

```bash
git init
git add .
git commit -m "feat: survey campaign builder"
git branch -M main
git remote add origin https://github.com/afzal63063/survey-campaign-builder.git
git push -u origin main
```

---

## Deployment

The frontend builds to a static `dist/` folder and can be deployed to any static host.

### Vercel

```bash
npm run build
```

Deploy the repository root and set the build command to `npm run build` with output directory `dist`.

### Netlify

```bash
npm run build
```

Deploy the `dist/` directory or connect the repo with build command `npm run build`.

### GitHub Pages

Push to `main`, then deploy the `dist/` folder using GitHub Actions or any static hosting.

---

## Links

- **GitHub Repository:** *(add your repository URL here)*
- **Live Demo:** *(add your deployed URL here)*

---

## License

Created as an assignment submission for the **AppVersal Frontend Intern Assignment 02**.

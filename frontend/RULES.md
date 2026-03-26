# Project Constraints and Coding Rules

## Core Stack Requirements
- MUST use **React + TypeScript**
- MUST use **shadcn/ui components**
- MUST use **TailwindCSS ONLY (no inline styles, no CSS files)**
- MUST use **TanStack Router**
- MUST use **TanStack Query for all async data fetching**
- MUST use **Zustand for global state management**
- MUST use **strict typing (NO `any` allowed under any circumstance)**

---

## Routing Rules (CRITICAL)
- Route files MUST:
  - ONLY handle routing logic
  - ONLY import components
  - NEVER define JSX components inside route files
- Follow TanStack Router patterns strictly

---

## Folder Structure (MANDATORY)

src/
  routes/
    home.tsx
  content/
    home/
      hero.tsx
      problem.tsx
      solution.tsx
      architecture.tsx
      features.tsx
      impact.tsx
      market.tsx
      roadmap.tsx
      cta.tsx
      footer.tsx

---

## Component Architecture Rules

- Each section of a page MUST:
  - Be its own file
  - Be placed inside `/content/<page-name>/`
- Example:
  - Home page → `/content/home/hero.tsx`, `/content/home/cta.tsx`

- Route file MUST:
  - Import all sections
  - Compose them into the page
  - NOT define UI logic inline

---

## Styling Rules

- MUST use Tailwind utility classes
- MUST NOT use:
  - inline styles (`style={{}}`)
  - custom CSS files
- MUST keep SAME color scheme as provided template
- MUST maintain consistent spacing and layout scale

---

## State Management

- Use Zustand ONLY for:
  - global UI state
  - shared app state
- DO NOT misuse Zustand for server data

---

## Data Fetching

- Use TanStack Query ONLY
- MUST:
  - use proper query keys
  - handle loading and error states
- NO fetch/axios outside TanStack Query

---

## Type Safety

- All:
  - props
  - API responses
  - state
  MUST be fully typed

- NEVER use:
  - `any`
  - implicit types
  - untyped props

---

## Code Quality Rules

- Components MUST be:
  - small
  - reusable
  - clearly named

- Avoid:
  - monolithic components
  - duplicated logic

---

## Functional Requirement

- The app MUST:
  - compile without errors
  - render all sections correctly
  - have working routing
  - have at least one working query example
  - have one Zustand store properly used

---

## Output Expectations

- Code must be:
  - production-ready
  - consistent
  - complete (no placeholders that break execution)

- If something is uncertain:
  - choose a working implementation over a theoretical one

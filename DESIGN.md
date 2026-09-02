# Portfolio Design Specification & System Prompt

**Source Reference:** [brittanychiang.com](https://brittanychiang.com/)  
**Role:** Senior Frontend Engineer & UI/UX Designer  
**Objective:** Design and build a clean, modern, accessible single-page developer/designer portfolio inspired by Brittany Chiang's portfolio site.

---

## 1. Layout & Architecture
- **Desktop (Dual-Column Sticky Layout):**
  - **Left Column (Fixed / Sticky):**
    - Width: ~40–45% of container (`lg:w-1/2` or `lg:w-[48%]`).
    - Stays pinned to the top of the viewport (`h-screen sticky top-0 flex flex-col justify-between py-24`).
    - Structure:
      - Top: Identity block (Name, Title, Short bio/pitch).
      - Middle: Section anchor navigation (`About`, `Experience`, `Projects`, `Writing`) with active horizontal indicator lines.
      - Bottom: Social links with icons (GitHub, LinkedIn, CodePen, Instagram, Goodreads).
  - **Right Column (Scrollable Content):**
    - Width: ~55–60% of container (`lg:w-1/2` or `lg:w-[52%]`).
    - Natural document scroll (`py-24 space-y-24` or `space-y-36`).
    - Contains all main content sections: About, Experience, Projects, Writing/Articles, and Colophon/Footer.
- **Mobile / Small Screens (Single-Column Linear Flow):**
  - Stacks into a standard vertical flow.
  - Header & identity appear at the top (`pt-12 pb-8`).
  - Navigation links can be collapsed or represented as sticky section headers as the user scrolls.
- **Max-Width Container:**
  - Centered: `max-w-screen-xl mx-auto px-6 md:px-12 lg:px-24`.

---

## 2. Color Palette & Visual Style
- **Theme:** Minimalist, sophisticated deep slate dark mode.
  - **Base Canvas / Background:** Slate Navy / Deep Midnight (`#0f172a` / Tailwind `slate-900` or `#0a192f`).
  - **Primary Text / Headings:** Bright Slate / Off-White (`#e2e8f0` / `slate-200` or `#f8fafc`).
  - **Secondary / Body Text:** Muted Slate (`#94a3b8` / `slate-400` or `#64748b`).
  - **Accent / Interactive Highlight:** Vibrant Teal / Mint Cyan (`#5eead4` / `teal-300` or `#64ffda`). Used for active navigation indicators, hover states, link highlights, and tag text.
  - **Interactive Card Surface:** Translucent slate with subtle hover border (`rgba(148, 163, 184, 0.05)` or `bg-slate-800/50`).
  - **Pill / Badge Background:** Muted teal tint (`rgba(94, 234, 212, 0.1)` / `bg-teal-400/10`).
  - **Pill / Badge Text:** Vibrant Teal (`#5eead4` / `text-teal-300`).

---

## 3. Typography & Hierarchy
- **Primary Typeface:** Clean, geometric/humanist sans-serif (`Inter`, `-apple-system`, `BlinkMacSystemFont`, `sans-serif`).
- **Hierarchy:**
  - **Name / Hero Heading:** Bold, tight tracking, 44px–48px (`font-bold tracking-tight text-4xl sm:text-5xl text-slate-200`).
  - **Job Title / Specialization:** Medium weight, 18px–20px (`text-lg sm:text-xl font-medium text-slate-200 mt-3`).
  - **Tagline / Short Pitch:** Body text, relaxed leading, max-width ~300px (`text-slate-400 mt-4 max-w-xs leading-normal`).
  - **Nav Item Labels:** Small uppercase tracking (`text-xs font-bold uppercase tracking-widest text-slate-500 group-hover:text-slate-200`).
  - **Card / Role Titles:** Semi-bold, medium size (`text-base font-medium leading-snug text-slate-200 group-hover:text-teal-300 transition-colors`).
  - **Date Range Column:** Small uppercase muted label (`text-xs font-semibold uppercase tracking-wide text-slate-500`).
  - **Tech Stack Badges:** Extra small pill tags (`text-xs font-medium px-3 py-1 rounded-full bg-teal-400/10 text-teal-300`).

---

## 4. Key Interactive Micro-Interactions
1. **Radial Cursor Spotlight (Background Effect):**
   - Subtle radial gradient following the mouse pointer across the desktop viewport:
     ```css
     background: radial-gradient(600px at {x}px {y}px, rgba(29, 78, 216, 0.15), transparent 80%);
     ```
   - Rendered via a fixed overlay with `pointer-events-none`.
2. **Expanding Navigation Indicators:**
   - Nav items display a horizontal line before the label:
     - Inactive: Short line (`w-8 h-px bg-slate-600 transition-all duration-200 group-hover:w-16 group-hover:bg-slate-200`).
     - Active / Scrolled-into-view: Expanded bright line (`w-16 h-px bg-slate-200 text-slate-200 font-bold`).
3. **Card Group Hover & Parent Dimming:**
   - Each project or experience entry sits inside a relative card container.
   - On hover, the container gains a subtle background highlight: `hover:bg-slate-800/50 hover:shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)] hover:drop-shadow-lg rounded-lg p-4 -inset-x-4 -inset-y-4`.
   - Card title link features an outward arrow (`↗`) translating diagonally: `group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform`.
   - Optional polish: Hovering one item dims neighboring entries (`group-hover/list:opacity-50 hover:!opacity-100`).

---

## 5. Content Blueprint
- **Header (Left Pane):**
  - Name, Title, and Mission statement.
  - Anchor links: `#about`, `#experience`, `#projects`, `#writing`.
  - Social media icons / links.
- **About Section:**
  - Concise personal statement covering engineering philosophy, design systems focus, accessibility advocacy, and personal interests.
- **Experience Section:**
  - Chronological timeline items:
    - Timeframe (e.g., `2024 — Present`)
    - Role title & company link
    - Summary of responsibilities and achievements
    - Tech stack pill tags (`JavaScript`, `TypeScript`, `React`, etc.)
- **Projects Section:**
  - Highlighting key products, open-source work, themes, or courses.
  - Project title with link, description, metrics (e.g., `100k+ installs`), and tech pills.
- **Writing / Publications Section:**
  - List of articles with year and external publication links.
- **Colophon / Footer:**
  - Technical acknowledgments: tools used (Figma, VS Code, Next.js, Tailwind CSS, Vercel, Inter typeface).

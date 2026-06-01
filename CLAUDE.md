# CLAUDE.md

Project context for Claude Code. Read this before making changes.

## What this project is

An interactive 3D PC-builder web app (final faculty project). The user enters a
budget and a purpose (school / work / gaming), and the app generates an optimal,
compatible PC configuration and renders it as an assembled 3D PC in the browser.
Each component can also be inspected and swapped individually like this: when user clicks on, for example, the cpu cooler, little floating window appears with 2-3 more coolers in the same category like that one with only their name and price as data. If user selects other cooler from that list, 3d scene is updated with that cooler.

**Theme requirements this project must satisfy:**
- 3D PC assembly using Three.js
- Three purposes: school, work, gaming
- Budget-driven configuration
- Configurations generated via the ChatGPT API
- Component data sourced from online stores (served via our own API — "Option A")
- Each component individually viewable and customizable

## Tech stack

- Frontend: React + React Three Fiber (Three.js) + @react-three/drei
- 3D models: glTF/GLB, authored in Blender
- Backend / data / storage: Supabase (Postgres + Storage bucket for models)
- LLM: ChatGPT API, used as a constrained "part picker" (see below)
- Build tooling: Vite (env vars are VITE_-prefixed)

## Core architectural decisions (do not silently change these)

### 1. Constrained-LLM part selection (IMPORTANT)
The LLM must NOT freely invent parts. The pipeline is:
1. A deterministic **compatibility engine** filters the catalog down to a
   shortlist of compatible, in-budget candidate parts per slot.
2. That shortlist (real catalog IDs only) is sent to the ChatGPT API.
3. ChatGPT selects the optimal combination from the shortlist and may weigh
   tradeoffs (e.g. GPU vs CPU spend for gaming).
4. The chosen build is validated again, then rendered.

Rationale: satisfies "configurations generated via ChatGPT API" while
preventing hallucinated parts that have no 3D model. The LLM must be given
genuine choice (several candidates per slot), not a single pre-decided option.
The LLM may also generate a friendly natural-language explanation of the build —
that part is optional and must never block rendering if the API call fails.

### 2. Mount-point positioning (IMPORTANT)
Components are **position-agnostic**. They do not know where they go.
- Each **case** defines named mount points (anchors) with position + rotation
  for each slot: motherboard, gpu, cpu, ram[], psu, cooler, fans[].
- The same component (e.g. a GPU) lands at different coordinates in an ATX vs
  mATX case because the case's anchor differs — the model never changes.
- A generic Assembler component reads `caseData.mounts[slot]` and places each
  selected part there.
- Never hardcode component positions in the model files or in component data.
  Positions live ONLY in case mount data.

### 3. State architecture
- Build state is the single source of truth and stores only IDs:
  `{ caseId, parts: { gpu, cpu, motherboard, ram:[], psu, cooler, fans:[] } }`
- Mount points, dimensions, prices, and model URLs are LOOKED UP from the
  catalog — never duplicated into build state.
- Compatibility is a set of PURE functions, reusable both during selection and
  during validation, so the two can never disagree. Ideally runnable
  server-side too.
- Changing the case is the only action that can invalidate existing parts, so
  it must re-validate every currently-selected part and drop incompatible ones.

### 4. Loading strategy
- On page load: render ONE default PC only. Do not load all 35 component models.
- When a build is returned, render only those components' models.
- Preload returned model URLs with `useGLTF.preload(url)` as soon as the build
  response arrives, before the reveal, to hide load time.

## Blender / 3D model conventions

- Scene units: Metric, Unit Scale 0.001, Length = Millimeters. 1 unit = 1mm.
- Every component: apply scale (`Ctrl+A → Scale`) so exported scale is 1.0.
  Never compensate scale in Three.js — fix it in Blender.
- Origin convention: components use their real mounting point as origin
  (e.g. GPU origin at the PCIe bracket contact). Case origin at bottom-center.
- Export: glTF Binary (.glb), +Y Up checked (Blender is Z-up, Three.js is Y-up).
  Keep the +Y Up setting consistent across ALL files.
- Enable Draco compression on export to keep files small.
- Per-component model files should be small (target 1–2MB). The full assembled
  PC must be optimized; a 70MB combined model is unacceptable for web.
- File naming: `Slot_Name_DimsLxHxW.glb` e.g. `Case_NZXT_H5_Flow_464x215x424.glb`.

## Supabase

- `components` table columns:
  id (uuid), slot (text), name, brand, model_url (path in storage bucket),
  price (numeric),
  specs (jsonb — length, socket, tdp, height, etc.).
- Storage bucket `models` is PUBLIC (model files are not sensitive; public CDN
  URLs make Three.js loading fast/cacheable). Never put secrets in it.
- Component catalog is publicly readable (RLS select policy `using (true)`).
- Future: a private, RLS-protected `builds` table keyed to the user for
  saved configurations. Run the same compatibility check before persisting.
- Store data approach ("Option A"): component records carry real store links,
  images, and prices manually curated from Croatian retailers. Our own backend
  endpoint serving this counts as the store-data API. A single live third-party
  product API call may be added later only if the mentor requires a literal
  external API (undecided — do not build a fragile live scraper).

## Env vars (never commit; keep in .claudeignore)

- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY
- (server-only, never in frontend) OPENAI_API_KEY for the ChatGPT calls

## Conventions / guardrails for Claude Code

- Don't expose the OpenAI key or selection logic in the browser bundle — run
  LLM calls and ideally part selection server-side (Supabase edge function or
  a small backend).
- Keep compatibility logic as pure, testable functions.
- Explain non-obvious changes briefly; this is a learning + defense project, so
  prefer clarity over cleverness.
- Don't enable destructive auto-edits without review.

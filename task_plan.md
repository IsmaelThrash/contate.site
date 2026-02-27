# Task Plan: Contate.site Mapping & Evolution

## Goal
Map out the current architecture of `contate.site`, propose architectural improvements (Architect), and suggest a UI/UX transformation (Designer).

## Context
- **Project**: `contate.site`
- **Stack**: React, Vite, Tailwind, PocketBase.
- **Purpose**: Digital business card / Link-in-bio platform.

## Phases

### Phase 1: Strategist Research & Planning [in_progress]
- [x] Analyze current codebase structure.
- [x] Analyze data schema (PocketBase migrations).
- [ ] Research competitor features (Linktree, Bento.me, etc.).
- [ ] Define strategic goals for the product.

### Phase 2: Architect's Mapping [pending]
- [ ] Create a Mermaid diagram of the current data model.
- [ ] Propose backend improvements (Caching, more collections, webhooks).
- [ ] Define API contracts/patterns for future features.

### Phase 3: Designer's Proposal [pending]
- [ ] Analyze current UI components.
- [ ] Propose a new "Premium" look (Glassmorphism, Bento-style).
- [ ] Map out UX improvements (Onboarding, link management).

### Phase 4: Final Synthesis [pending]
- [ ] Create a unified implementation roadmap.
- [ ] Present findings to the user.

## 🚀 Deployment Strategy (Opção A: Híbrida)
- **Frontend**: Hostinger Shared Hosting (`public_html`).
- **Backend (API)**: Pockethost.io (ou similar).
- **Environment**: Use `VITE_POCKETBASE_URL` during build to point to the remote instance.

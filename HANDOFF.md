# Handoff Notes

## Repo

- Workspace: `C:\Users\keato\coding\chicken-mvp2-searching-style-cursor-`
- Vercel Root Directory: `chicken-mvp`
- App URL local dev: `http://localhost:5173/`

## Current Work Summary

### Data corrections

- Applied step 1 official-value fixes:
  - BHC franchise fee to `1,100만`
  - Kyochon franchise fee to `676.5만`
  - Kyochon deposit to `100만`
  - BBQ official burden to `9,078.9만`
  - Puradak franchise fee summary to `1,100만`
- Applied step 2 profit estimate moderation:
  - BHC profit values changed from `280만` range to `100~150만`
  - BBQ profit values changed from `340만` range to `140~170만`
  - Related BHC/BBQ profit tags and hub chart values adjusted
- Step 3 is intentionally not done:
  - Do not yet replace awareness/revisit/closure-rate style card meanings.

### Gemini API structure

- Gemini is now routed through a Vercel serverless function:
  - `chicken-mvp/api/gemini-cost.js`
- Vercel environment variable:
  - `GEMINI_API_KEY`
- Do not set `VITE_GEMINI_API_KEY` in Vercel.
- Browser calls:
  - `/api/gemini-cost`
- Serverless function calls:
  - Gemini API with `process.env.GEMINI_API_KEY`

### Local testing fallback

- `npm run dev` cannot run Vercel serverless functions.
- A local-only fallback was added for Vite dev:
  - `chicken-mvp/.env.local`
  - `VITE_GEMINI_API_KEY=...`
- This fallback only runs under `import.meta.env.DEV`.
- `.env.local` must not be committed.

### Gemini cost UI behavior

- Serverless response now returns:
  - `costText`
  - `totalManwon`
- Big cost number uses `costText`.
- Initial cost composition chart uses `totalManwon`.
- Composition amounts are proportionally allocated from existing item ratios.
- Last item absorbs rounding difference, so displayed item totals match the Gemini total at 만원 unit.
- Amounts count up after Gemini response.
- Loading state shows `구성 계산 중...` with skeleton bars.
- Removed visible `Gemini` wording from UI.
- Current label line:
  - left: `초기비용 구성`
  - right: `공정위 기반 실시간 추정값이에요`

## Important Files Changed

- `chicken-mvp/src/App.jsx`
- `chicken-mvp/src/components/Card.jsx`
- `chicken-mvp/src/index.css`
- `chicken-mvp/api/gemini-cost.js`
- `chicken-mvp/.env.example`

## Local-Only / Do Not Commit

- `chicken-mvp/.env.local`

## User-Added Reference File

- `codex-expanded-change-list-with-sources-v2.md`
- It is a reference instruction/source document.
- Decide separately whether to commit it.

## Verification Done

- `npm.cmd run build` passed after latest code changes.
- Production bundle was checked earlier to avoid exposing:
  - `VITE_GEMINI_API_KEY`
  - `key=undefined`
  - `AIza`
  - direct `generativelanguage.googleapis.com` in `dist`

## Recommended Next Steps

1. Review UI in Cursor.
2. Keep API/calculation/env logic unchanged unless explicitly needed.
3. Commit code changes, excluding `.env.local`.
4. Push and let Vercel redeploy.
5. On deployed site, verify Network shows `/api/gemini-cost`, not direct Gemini API URL.

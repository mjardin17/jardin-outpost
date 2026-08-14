# Recovery provenance — 2026-08-14

These 4 files (`Scanner.tsx`, `ProgressRing.tsx`, `LossVault.tsx`, `visionClient.ts`)
were reconstructed from a local Claude Code session transcript dated 2026-06-28.
They were written to disk by that session but never committed — `git log --all`
shows zero history for this directory before this recovery — and the working
files themselves were gone by the time this audit ran (August), so this is a
transcript-based reconstruction, not a copy of an existing file.

Verified before adding:
- `tsc --noEmit` passes with these files in the tree.
- Their one internal dependency, `getStoredKey`/`ProviderId` from
  `@/components/council/modelClients`, exists and exports what's expected.
- No secrets or hardcoded API keys — `visionClient.ts` pulls keys via
  `getStoredKey()` from the user's own stored config at call time.

**Not wired in anywhere.** No route imports `Scanner`, `ProgressRing`, or
`LossVault`, and `projects.ts` has no entry for a `/aurafit` page (only an
unrelated example comment mentioning the name). This is a self-contained,
apparently-finished "AuraFit" nutrition/fitness widget — photo-based meal
scanning against Gemini/OpenAI vision, calorie/macro estimate, progress
rings, and a streak-stake ("LossVault") gamification component — with no
page assembling them together. Confirm intent before building a route
around it.

# Anime Sticker Biz — project status

*Read this first in any new chat to pick up where things left off. Full prompt details live in `prompts/shonen-pack.md`. In-progress/untested prompt currently being iterated on lives in `prompts/current-test.md` — check it for anything mid-testing that hasn't locked yet.*

## The product

AI-generated anime-style sticker packs made from a customer's selfie. **Generic anime archetypes/demographics — not franchise characters** (deliberately avoids all copyright risk; earlier explored Demon Slayer/GTA/DBZ/Naruto themes, dropped all of them after research showed major publishers — Shueisha, Rockstar/Take-Two — are actively pursuing AI-content enforcement as of Oct 2025).

**Structure — PIVOTED (2026-07-16):** launching with **one general-appeal anime sticker pack** first — broadly likeable, everyday-use anime style, not shonen-specific. The 4-archetype plan (shonen/shojo/seinen/josei) is parked for post-launch, not abandoned. Content lives in `prompts/shonen-pack.md` (filename is legacy/inaccurate now — it's the general pack). Dynamism baseline: expressive linework + manga FX (motion arcs, emphasis lines, blush, sweat drops) used where the pose calls for it.

**MVP scope — locked (2026-07-16):** building a real, working demo for a mentor call **next Friday**. Details:
- **10 stickers total** for the MVP pack (not the full 18) — build/test the **first 5 locked ones first**, wire up the automation around those, then add the remaining 5.
- **Price: $5/pack**, decided for MVP purposes (not a final long-term pricing decision).
- **PNG delivery only** — no native keyboard sticker packs. Landing page/delivery copy must explicitly tell users: **"save to camera roll, send like a photo"** (see [[project_mvp_delivery_ux]] memory) — this is a **browser-only digital product, no app store app, ever.**
- **Automation for the MVP is deliberately minimal**, not the full production pipeline (see "MVP automation plan" below) — enough for testers (mentor + friends) to feel a real flow, not a fully hardened system.

**Pricing beyond MVP:** the $4-5/pack + "4 for $15" bundle questions from the earlier 4-archetype plan are unresolved/deprioritized — see [[project_pricing_locked]] memory.

**Channel:** TikTok, quick-buy impulse positioning (not aspirational branding), for eventual real launch — not relevant to the MVP demo itself.

## MVP automation plan (building now, target: this Friday)

Stack: **n8n Cloud** (workflow automation) + **Stripe** (test mode, dummy payment link) + a simple static landing page. Both accounts are being created from zero by the user (not something Claude can do — account creation is off-limits).

Deliberately simplified vs. the full production spec ([[project_automation_qa_pipeline_spec]]):
- **One generation per sticker at medium quality** — no n=6 draft-and-pick, no automated QA/defect-check pass. Accept variance as a fine trade-off for a demo, not for paying customers.
- **No background removal step** — plain background PNGs for now, not transparent cutouts. The real fix (ML segmentation) is real build time not available this week.
- **No head-tilt/crop auto-correction** — known issues, not fixed for MVP.
- **Flow:** landing page → Stripe test-mode Payment Link (dummy, no real charge) → redirect to an n8n Form Trigger (selfie upload + gender choice + email) → n8n calls the OpenAI API per sticker → emails the resulting PNGs back.

**Next concrete steps (in order):**
1. User creates Stripe account (test mode) and n8n Cloud account — not yet done as of 2026-07-16.
2. Build the n8n workflow (Form Trigger → OpenAI calls for the first 5 locked stickers → email delivery).
3. Set up the Stripe test-mode Payment Link ($5 dummy product, redirect to the n8n form).
4. Build a simple static landing page (example stickers + link to the Payment Link) — likely hosted free on GitHub Pages/Netlify given this repo's already on GitHub.
5. Test end to end with the first 5 stickers, then add the remaining 5 once the flow works.

## Tech pipeline (confirmed working, for actual generation)

- **GPT Image 1.5**, `images/edit` endpoint, `input_fidelity="high"`
- **No seed/reproducibility control exists** on this API — same prompt gives different quality each run, confirmed by testing repeatedly
- **Full production fix (post-MVP):** generate several drafts at `quality="low"` ($0.009 ea) → pick the best → re-render only the winner at `quality="medium"` ($0.034). Cost ~$0.07/sticker. **Not used for the MVP** — MVP generates once at medium quality directly, per the simplified automation plan above.
- **`background="transparent"` API param bug, confirmed by testing:** it punches holes through light-colored foreground elements (e.g. white/light-blue tear streaks) that are close in color to the background, not just the actual background — verified by downloading the actual PNG, not just checking the playground preview. Full fix (post-MVP): generate on a plain solid background, then run background removal separately using semantic/ML segmentation (e.g. rembg), not naive color-key. MVP just skips transparency entirely for now.

## Prompt rules, hard-won through testing

See the **QUALITY CORE** block in `prompts/shonen-pack.md` for the full reusable rule set (skin tone, hair color/texture fidelity, nose/lip/teeth rendering, outline/no-halo, bald/balding handling). Headline lessons:

1. **Every pose must state hand/body position explicitly** — otherwise the model copies whatever gesture (or head angle) was in the reference selfie
2. **Two crop modes:** head-only extreme close-up for reaction stickers; full-body for standing/action poses. Full-body needs very explicit "don't crop the feet, zoom out further than feels necessary" language — and even then, cropping the feet is a **known unresolved issue** (see below), same category as head tilt.
3. **Skin tone bias (fixed):** model defaults toward lighter skin, picks up lighting highlights as "true" tone. Fixed via explicit sampling/anti-lightening rules.
4. **Hair color AND texture fidelity (fixed):** model would substitute a "nicer"/more common anime hair color (e.g. black→auburn) or texture — both now have explicit STRICT RULEs and are on the QA checklist.
5. **Gender transforms need explicit comparative language, both directions:** adjectives alone ("feminine hairstyle") aren't enough against a strongly-gendered reference photo — needed concrete comparative pushes (narrower/broader jaw, longer/shorter hair vs. the reference) for both masculine and feminine transforms.
6. **Recurring rendering defects** (nose/lip shine, teeth rendering black, stray tear placement, halo/rim-light around the head, limb-length asymmetry, pose-critical expression elements silently dropping to neutral) — all documented with fixes in QUALITY CORE and mirrored in the QA checklist spec.

**Known unresolved issues (confirmed model-behavior variance, not prompt-wording gaps — stop re-wording, they need programmatic fixes eventually):**
- **Head tilt** on close-up stickers — real fix is a post-processing de-skew step (eye-line detection + auto-rotate), not yet built.
- **Full-body crop cutting off feet** — same category, real fix is a bounding-box detect + pad/re-crop step, not yet built.
- **Relative sticker size across composition modes** (head-only vs. full-body) will look inconsistent side by side — needs a fill-ratio normalization step post-generation, exact ratios still TBD.

**Status: 5 of the planned 10-for-MVP stickers are locked, masculine + feminine:**
1. Crying-laughing (explosive tears)
2. Theatrical overwhelmed crying (matched to the classic 😭 emoji)
3. Smug/cheerful wink + thumbs-up
4. Kneeling comedic apology (hands clasped, emphasis lines, blush, sweat drops)
5. Apology-suit dogeza bow ("Japanese apology businessman" meme, face mostly hidden, identity carried by hair/skin/build)

5 more needed to hit the MVP's 10. Full remaining 18-sticker list (for eventual full pack, beyond MVP) is in `prompts/shonen-pack.md`.

## Other locked decisions

- Gender: customer picks masculine / feminine / both, no extra charge, comical copy TBD
- Quality-over-margin is a standing user preference — don't default to cutting corners when margin is thin (this is *why* the full pipeline has draft-and-pick QA; the MVP is a deliberate, temporary, scoped-down exception for demo purposes, not a reversal of that preference)
- Pack clothing baseline (for full/partial-body stickers): clean light-blue button-up (no tie), black pants, plain sneakers — "professional but casual." Exception: apology/bow stickers use a dark business suit (the "apology businessman" meme look).
- Not yet built (post-MVP): real landing page beyond the MVP static one, real Stripe webhook integration, full n8n automation (draft-and-QA-check, background removal, de-skew, R2 storage, Resend email)

## Subagents built (in `~/.claude/agents/`, usable in any project)

- **northstar** — impact/priority-setting, run at the start of new ideas
- **stack-scout** — tech-stack research, full-scenario cost/free-tier checks
- **copyright-scout** — IP/copyright risk research
- **foresight** — business trajectory/leverage-point analysis
- **inclusivity-check** — explicit-invoke only, advisory only, never auto-runs

## Build-in-public

`BUILD_LOG.md` has milestone entries + "post angle" notes for X posts, kept separate from this working-status file. `build-log-images/` is ready for screenshots (not yet populated — Claude can't extract images from chat directly, user needs to save them manually).

## Repo

`github.com/code-mango7/anime-sticker-biz` — pushed and live. Push pattern: `git add . && git commit -m "..." && git push`

## n8n workflow — first 5 stickers, built and working end-to-end (2026-07-19)

Stripe (sandbox/test mode) and n8n Cloud (`dorianb.app.n8n.cloud`) accounts created. Full pipeline built and confirmed working with a real test submission → real email delivery:

1. **Form Trigger** ("On form submission") — Selfie (file), Email, Style (dropdown: Masculine/Feminine/Both)
2. **Code node** ("Build sticker jobs") — explodes the submission into 5 or 10 jobs (one per sticker × selected gender(s)), each carrying its full locked prompt text. Source: [n8n/build-sticker-jobs.js](n8n/build-sticker-jobs.js)
3. **HTTP Request** — calls OpenAI `images/edits` per job. Settings are locked in [n8n/locked-settings.md](n8n/locked-settings.md) — **model must be `gpt-image-1.5`, not `gpt-image-1`** (confirmed by direct comparison that the plain `gpt-image-1` model produces noticeably worse/flatter output — this bit us once already, see [.claude/skills/verify-automation-settings/](.claude/skills/verify-automation-settings/) which now guards against it)
4. **Code node** ("Decode data to binary") — converts the API's base64 response into a real PNG file per item
5. **Code node** ("Combine attachments") — merges the 5-10 separate items back into one item with all stickers as separate binary properties, so one email can carry all of them. Source: [n8n/merge-attachments.js](n8n/merge-attachments.js)
6. **Send an Email** (SMTP) — delivers all attached PNGs to the customer's submitted email, with the locked "save to camera roll, send like a photo" copy

**Known rough edges, not yet fixed:**
- No draft-and-pick — each sticker is a single generation, so quality varies run to run (confirmed: same prompt/settings can produce a great result or a crude one). Manual re-run/pick is the fallback for the mentor demo.
- Sender is currently a personal Gmail account (not mangomanaudio@gmail.com) — fine for demo, should be fixed before real launch.
- Background comes back plain/opaque, no transparency (expected, matches MVP plan).
- **Cross-sticker identity consistency (masc/fem transform), not fixed:** each sticker currently re-derives the gender-swapped look independently from the original selfie, so the "fem" (or "masc") version can look like a visibly different person from one sticker to the next — the model reinvents hairstyle/jaw/proportions fresh every generation with nothing anchoring it. Planned fix (not built): generate one clean reference image per gender first, then generate every sticker as an edit *of that reference* instead of the original selfie — gives the model a much smaller job ("change pose," not "reinvent the whole stylized identity") and should hold consistency much better. Real pipeline change (one more HTTP Request + Code node ahead of the per-sticker loop, one extra generation per gender per order, ~$0.03–0.19). Untested assumption: whether a head-shot reference holds up as input for full-body stickers (dogeza bow) — verify once built.

## Stripe test-mode Payment Link — created (2026-07-19)

Product "Anime Sticker Pack," US$5.00, one-time. After-payment redirect set to the n8n workflow's **Production** form URL (`https://dorianb.app.n8n.cloud/form/...`, not `/form-test/`). The n8n workflow has been **activated/published** so the Production URL is actually live, not just the Test URL used during building.

Full flow now wired end to end: Stripe Payment Link → (pay, test mode) → redirect to n8n form → selfie/email/style submission → sticker generation → email delivery.

## Next step

**Immediate:** build the simple static landing page (example stickers + the Payment Link), likely hosted free on GitHub Pages/Netlify. Then do one full real run-through (pay → form → email) to confirm the whole chain works end to end before the mentor call. Target: Friday 2026-07-24.

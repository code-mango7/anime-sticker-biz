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

**Scope decision (2026-07-23): staying at 5 stickers for the mentor demo, not pushing to 10.** Keeping the demo focused over adding more content — stickers #7/#11/#13/#17 and the cross-sticker identity consistency fix are deferred post-demo, not abandoned. Full remaining 18-sticker list (for eventual full pack, beyond MVP) is in `prompts/shonen-pack.md`.

**New QUALITY CORE item queued (2026-07-25): add an explicit age-representation rule.** The 2026-07-21 inclusivity review already flagged this — "age bias has no anti-bias rule (skin tone does)" — logged then as not urgent. Promoting it to the active next-steps list now: add a STRICT RULE on apparent age to the QUALITY CORE block (same pattern as the existing skin-tone rule — identify the person's actual apparent age from the photo and preserve it, don't skew younger/older toward a generic anime default). Needs writing + testing before it's added to `prompts/shonen-pack.md` and propagated into `n8n/build-sticker-jobs.js`, same rollout pattern as the makeup/accessories fixes.

## Other locked decisions

- Gender: customer picks masculine / feminine / both, no extra charge, comical copy TBD
- Quality-over-margin is a standing user preference — don't default to cutting corners when margin is thin (this is *why* the full pipeline has draft-and-pick QA; the MVP is a deliberate, temporary, scoped-down exception for demo purposes, not a reversal of that preference)
- Pack clothing baseline (for full/partial-body stickers): clean light-blue button-up (no tie), black pants, plain sneakers — "professional but casual." Exception: apology/bow stickers use a dark business suit (the "apology businessman" meme look).
- Not yet built (post-MVP): real landing page beyond the MVP static one, real Stripe webhook integration, full n8n automation (draft-and-QA-check, background removal, de-skew, R2 storage, Resend email)
- Not yet built (post-MVP): replace n8n's built-in Form Trigger UI (user finds it clunky) with a custom-designed HTML form (matching landing page theme) that POSTs to an n8n **Webhook** node instead — more branding control, but real build time (file upload handling, validation, error states) replacing something already tested end-to-end. Noted 2026-07-22, deliberately deferred past the Friday demo.

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

## Landing page — built and live (2026-07-21)

`docs/index.html` (repo root's `docs/` folder, required by GitHub Pages' branch-deploy). Black/yellow theme, 3 real before/after selfie→sticker pairs (flanking hero text on desktop, horizontal scroll strip on mobile), $5 price card, 3-step how-it-works, trust badges including masc/fem/both callout, browser-only delivery copy. Payment Link wired into the CTA button. Repo made public to unlock free GitHub Pages hosting (checked first: no secrets in repo history, all credentials were entered directly into n8n/Stripe's own UIs, never written to a file).

**Live at:** `https://code-mango7.github.io/anime-sticker-biz/`

## n8n form styling — done (2026-07-21)

Black/yellow theme applied via Custom Form Styling (dark inputs, yellow focus glow, gradient submit + file-picker button), n8n attribution removed, completion message rewritten ("stickers being prepared" copy, no more generic default).

## Inclusivity review — done, findings logged (2026-07-21)

Ran the `inclusivity-check` subagent against prompts + landing page. Actioned: dropped "slimmer build" from sticker #5's feminine variant (only body-size language in the pack, now noted in shonen-pack.md to watch for later). Logged for later, not urgent: age bias has no anti-bias rule (skin tone does), dogeza sticker's cultural-gesture framing is a judgment call, mobility aids only matter for the 2 full-body stickers.

## Neutral gender option — locked (2026-07-21)

Tested on a non-binary reference photo, confirmed working. No masc/fem push at all — preserves the photo's actual jaw/brow/chin/hair-length, no gendered feature adjustments. Locked into `prompts/shonen-pack.md` as sticker #1's third variant, and into the canonical QUALITY CORE block (`neutral` gender-substitution option added alongside masculine/feminine).

Same pass also fixed two related gaps, now in the canonical QUALITY CORE block:
- **Makeup**: was being dropped inconsistently (no rule governed it before — same shape as the skin-tone/age bias pattern). Now explicitly preserved if present in the photo.
- **Accessories**: changed from blanket omission to selective inclusion — glasses, hats/head coverings, and face-level piercings (nose, eyebrow) now render; earrings and anything neck-down still don't. Hats specifically skip the bald/hair-guessing logic entirely (renders the hat, doesn't infer what's underneath — this was also the fix for the "bald person wearing a hat for insecurity" UX concern raised earlier).

**Not yet propagated to the 5 already-locked masc/fem stickers** — those still have the old blanket "omit accessories" line and no makeup rule. Tracked as task #6.

**DECIDED (2026-07-23): masc/fem removed, neutral-only for the MVP.** Driven by real first-user feedback (masc/fem/both dropdown felt like unnecessary friction) plus the quality hypothesis flagged 2026-07-22 (pushing ambiguous features toward a binary look reads as cheaper). All 5 locked stickers rewritten as single neutral-only prompts in [n8n/build-sticker-jobs.js](n8n/build-sticker-jobs.js) — no more masculine/feminine keys, no Style-based branching, always exactly 5 stickers per order. This also fixed the accessories bug below (same root cause, one fix). masc/fem 4-archetype plan stays parked for post-launch per the original pivot note, not deleted.

**Still needed in the n8n UI itself (not yet done as of 2026-07-23):**
1. Paste the updated [n8n/build-sticker-jobs.js](n8n/build-sticker-jobs.js) into the "Build sticker jobs" Code node (replaces the old masc/fem-branching version).
2. Remove the **Style** field from the Form Trigger — no more masculine/feminine/both choice, selfie-only submission.
3. Re-test end to end once both changes are in.

**Bug found 2026-07-22, root cause confirmed:** first real user's glasses didn't render despite the prompt saying accessories are included. Root cause: `build-sticker-jobs.js` still had the **old** blanket "omit accessories" line and no makeup rule — the 2026-07-21 QUALITY CORE fixes (task #6) were made in `prompts/shonen-pack.md` but never propagated into the actual n8n code node. Fixed by the neutral-only rewrite above, which rebuilds every sticker prompt on the current QUALITY CORE block — **task #6 is now done.**

**Risk flag:** only sticker #1 (crying-laughing)'s neutral prompt was individually tested (`prompts/neutral-gender-test.md`, locked 2026-07-21). Stickers #2-5's neutral prompts were constructed 2026-07-23 by mechanically applying that same proven substitution pattern to their existing masculine versions — not independently retested yet. Worth a quick spot-check pass before the mentor demo if there's time, but not blocking.

## Sticker #6 — locked and confirmed, neutral only (2026-07-21/22)

Sweatdrop + bashful embarrassed laugh (😅). Went through several expression-wording rounds (see shonen-pack.md for the full history) before landing on: eyes closed in soft arcs, mouth open in a bashful laugh, clear blush as the key embarrassment marker, one oversized sweat drop (sized up and retested good 2026-07-22). Also surfaced and fixed a real terminology bug: "head tilt" was conflating two different things — sideways roll (fine, not worth fighting) vs. facing direction (turned to a 3/4 angle, the actual problem). Facing-direction fix didn't hold after two targeted attempts — logged as a known model-bias issue in shonen-pack.md, mitigated via form copy (task #5) rather than more prompt rounds. Known bugs, both added to the QA-checklist spec ([[project_automation_qa_pipeline_spec]]) rather than chased further in the prompt: an earring rendered once despite the omit-earrings rule (unconfirmed as a pattern), and an intermittent duplicate sweat drop (confirmed intermittent — a retest came back clean).

**Done. Next: sticker #7.**

**Not yet done:** add `neutral` to the live n8n form's Style dropdown (still masc/fem/both only) — part of task #5, which is intentionally sequenced after prompt testing, not before.

## Next step

**Immediate:** test sticker #6 (sweatdrop/forced smile) and the neutral-gender-test variant, both ready and waiting in `prompts/` — including the new accessory/hat handling in both. Results decide real open questions (does the third gender option actually work well enough to ship? does accessory inclusion render cleanly?), so **lock these first**.

**Then:** write the n8n form copy informed by what the tests actually showed — optimal-selfie guidance (lighting, angle, clarity, example images), the accessory disclaimer line (drafted: *"Wearing glasses, a hat, or facial piercings? They'll be included — just know results can be a little less predictable around those spots."*, may need adjusting based on real results), and the Style dropdown update (only add the third option if it tested well). See task #5 — reordered to come after testing, not before.

**After that:** remaining sticker poses (#7, #11, #13, #17 picked) and the masc/fem cross-sticker consistency fix. Target: Friday 2026-07-24.

## Mentor demo — done, went well (2026-07-23/24)

Full flow demoed and tested with real users (friends + mentor). Landing page copy cleaned up (masc/fem badge removed, sticker count corrected to 5 everywhere, parental-permission footer line added — see git history). Ran `/qa-only` against the live landing page: found and fixed one real bug (stale "10 stickers" text in the pricing card), one finding retracted as a false positive (mobile carousel — tested fine on a second browser, was a screenshot-timing artifact of the QA tool itself, not a real bug).

`LAUNCH_CHECKLIST.md` created and is now the canonical punch list for everything needed before a real (non-demo) launch — legal/compliance, infra migration (ordered 6-step list), known rendering issues, cost estimate by scale, open product decisions. Check it before assuming something is "done."

## V2 architecture — in progress (started 2026-07-25)

Mentor reviewed the working demo and sketched the next-level architecture: WebApp → Payment Gateway → Form → n8n, with a **database (Neon, decided)** and **object storage (R2/B2/Drive, not yet decided)** added alongside. Full plan and schema in [[project_v2_architecture_plan]] memory. User is new to databases/system design — being walked through this **gradually, in plain language** (see [[feedback_simple_gradual_teaching]] memory) — don't skip ahead to advanced concepts without teaching the layer underneath first.

**Done so far:**
1. Neon account created, project `anime-sticker-biz` created (region: AWS Europe Frankfurt, free tier). `orders` table created — schema in [[project_v2_architecture_plan]] memory, now includes `form_email` (added 2026-07-30, see below).
2. **Stripe webhook workflow, fully working end-to-end:** separate n8n workflow, **Stripe Trigger** node (`checkout.session.completed`, Stripe secret API key credential — handles signature verification internally, safer than a plain Webhook node) → Postgres **Insert** node creating the first order row on payment success. Confirmed correct with real payments: `user_id`/`email`/`stripe_payment_id` mapped from the Stripe event, `payment_tried`/`payment_successful` fixed `true`.
3. **Correlation problem solved:** payment happens before the form, so both events need to update the *same* row. Solution: Stripe Payment Link's redirect URL carries `?session_id={CHECKOUT_SESSION_ID}`; the n8n Form Trigger has a **Hidden Field** named `session_id` to capture it; the Form workflow's Postgres node runs as an **Update** (matched on `user_id` = the session ID), not an Insert. Confirmed working with real data.
4. **Object storage (Cloudflare R2), built and working (2026-07-30):** bucket created, S3-compatible credential added to n8n (R2 has no dedicated node but speaks the S3 API). Selfie upload wired into the Form workflow (between Form Trigger and the Postgres Update), storing the file under a `{{session_id}}-selfie.jpg` key. **Bucket kept private** — only the internal file key is stored in `input_image_url`, not a public link, to avoid contradicting the landing page's "we don't store your photo" claim (selfies are more sensitive than output stickers).
5. **`form_email` column added (2026-07-30):** the Stripe checkout email and the form's typed-in email are two independent inputs that can differ, and actual delivery uses the form's — both are now tracked separately. Confirmed working.
6. **Four real bugs hit and fixed today (2026-07-29/30)** — full detail in [[project_v2_architecture_plan]] memory, headline lessons since they'll recur:
   - Never map a `SERIAL`/auto-increment primary key (`id`) by hand in an Insert *or* Update — causes silent/loud collisions.
   - `$json` doesn't carry through a node whose own output replaces the item's data (e.g. after the S3 upload node) — reference the original node explicitly by name instead: `{{$('On form submission').item.json.fieldName}}`.
   - **"Map Each Column Manually" force-includes every listed column in the real SQL statement, even ones left blank** — this silently reset `payment_tried`/`payment_successful` back to `false` on every form submission until the unused fields were fully removed (not just left empty) from the Update node. No error was thrown (unlike the `id` bug) because booleans have no unique constraint to catch it.
   - The n8n workflow list's **"Published" badge can be stale** — don't trust it when debugging "why isn't my fix live," open the workflow directly to verify.
7. **Confirmed correct end-to-end (2026-07-30):** payment → Insert → selfie upload to R2 → form Update (image key + both emails stored, payment fields no longer clobbered) → verified in Neon. Full lifecycle through "form filled + selfie stored" is trustworthy now.

**Decided, not yet built:** output stickers should **also** be uploaded to R2 (same private-key pattern as the selfie), not just emailed and forgotten.

**Output-sticker upload + final lifecycle Update — done, confirmed end-to-end (2026-07-30):** parallel branch off "Decode data to view images node" — one path continues to "Combine attachments" → "Send an Email" as before, the other goes to a dead-end S3 Upload node uploading each sticker to R2 under a deterministic `{sessionId}-{stickerId}.png` key (same bucket/credential as the selfie). A new Postgres Update node after "Send an Email" sets `output_image_url` (comma-joined key list, built in `n8n/merge-attachments.js`), `generation_finished = true`, `email_sent = true`, matched on `user_id = sessionId`. Verified: email arrived with 5 attachments, 5 files landed in R2, the Neon row updated correctly. `error_message` deliberately not wired yet — no failure-branch handling exists.

**Three more real bugs hit and fixed today, same recurring pattern (a node's own output replacing the item's json/binary, breaking anything downstream that assumed passthrough):**
- `n8n/build-sticker-jobs.js` was reading the selfie binary + email/session_id from `$input.first()`, but the S3 selfie-upload node three steps upstream already wipes both — fixed by referencing `$('On form submission').first()` directly instead.
- The Postgres Update's match value referenced plain `$json.sessionId`, but "Send an Email" (one node upstream) also replaces the item entirely — fixed by referencing `$('Combine attachments - Code Node').first().json` explicitly.
- **"Decode data to view images node"** (Code node between HTTP Request and Combine Attachments, not previously saved to the repo) only forwarded `stickerName`/`email` in its manually-rebuilt json — missing `stickerId`/`sessionId` entirely, which is why R2 keys and the final Update both silently got `undefined`. Also found and removed a **dead leftover**: it still referenced `.gender` from Build Sticker Jobs, a field that hasn't existed since the 2026-07-23 neutral-only pivot removed the Style/gender field — quietly evaluating to `undefined` in sticker filenames ever since, never cleaned up during that pivot. Now saved to the repo as [n8n/decode-data-to-binary.js](n8n/decode-data-to-binary.js).

**Full order lifecycle is now trustworthy end to end:** payment → form fill + selfie stored → generation → stickers uploaded to R2 + emailed → final Update. This closes out the immediate V2 build goal from 2026-07-25.

**Known gap, not fixed:** the R2 sticker-upload branch has no error handling — a silently failed upload still results in the final Update recording success, since the R2 key is computed deterministically rather than read back from the upload's response. Logged in [LAUNCH_CHECKLIST.md](LAUNCH_CHECKLIST.md) under infra-migration item #4.

**Error-handling gap closed (2026-07-30):** added a "Check upload errors" Code node (`n8n/check-upload-errors.js`) on the R2 sticker-upload branch (with "On Error: Continue" enabled on the upload node itself, so a failed upload becomes data instead of crashing the run), then a **Merge node** (Combine by Position) joining that branch back with "Combine attachments" before the final Update — so `error_message` now genuinely reflects upload failures instead of always being blank. Confirmed working end-to-end: ran clean, `error_message` came back empty as expected since nothing failed.

**Single-attachment email — built and confirmed working (2026-07-31):** switched from 5 raw attachments to inline `<img>` tags in the email body, pointing at a new **public** R2 bucket (separate from the private selfie bucket — selfie privacy untouched). Hit and fixed one real bug: the R2 API token was scoped to only the original bucket, so all 5 uploads failed with "Forbidden" — caught immediately by the error-handling work from earlier the same day (`error_message` showed it directly), fixed by widening the token's bucket scope. Confirmed working: clean email, 5 stickers visible inline, each individually saveable via long-press or Gmail's download button.

**Final pack size decided: 20 stickers (2026-07-31)**, superseding the earlier "deferred, not abandoned" status. This surfaced a real scaling problem: long-pressing 20+ individual images doesn't work as UX (5 is fine, confirmed). Decided approach: a **save-all gallery page** — one link in the email, a simple static page (no backend needed, reads the already-public R2 URLs), with a "Save All" button using the Web Share API to hand every image to the phone's native share sheet in one tap → saves individually to the camera roll, no zip/unzip. Full writeup in [LAUNCH_CHECKLIST.md](LAUNCH_CHECKLIST.md)'s open decisions section. Not started.

**Recommended next, in order (revised 2026-07-31):**
1. ~~Error handling (Merge node)~~ — done.
2. ~~Single-attachment email~~ — done.
3. Check n8n's actual concurrent-execution limit + add a query that flags a stuck order (paid but never finished) — cheap, still open.
4. Build the save-all gallery page — now unblocked since pack size is decided.
5. Write + test the remaining ~15 sticker prompts to reach 20 — separate content work, can happen alongside #4.
6. Bundle later, together: real backend + direct-to-storage form upload (browser uploads straight to R2, n8n only ever handles a storage key) + Redis-backed retry queue. Biggest lift, still volume-gated.

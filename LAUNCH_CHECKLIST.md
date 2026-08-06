# Launch readiness checklist

*Everything flagged as "not yet built," "known issue," or "open decision" across this project, consolidated in one place. Not urgent for the Friday mentor demo — this is the punch list for turning the MVP into a real, live, paying-customer product. Update this as items get resolved or new gaps are found; don't let it go stale.*

## Legal / compliance — do before real launch, not optional

- [ ] **Real privacy policy.** Footer currently has one line ("we don't store your photo"). Needs a real policy page, and that claim needs to actually be verified true across the whole pipeline (see below).
- [ ] **Verify the "we don't store your photo" claim is actually true.** Check: does OpenAI retain the image API-side, does n8n keep it in execution logs/history, does it sit in a Gmail "Sent" folder indefinitely? Don't just assume the claim is accurate — confirm it.
- [ ] **Terms of Service.** None exists yet.
- [ ] **Minors' data handling.** Landing page now has a parental-permission disclaimer (2026-07-23) — this is an honest MVP stopgap, **not verified/compliant parental consent**. Real compliance (COPPA, if any users are under 13) needs an actual consent-capture mechanism, not just text a minor can click past. Get real legal input before scaling.
- [ ] **IP/copyright re-check before wider launch.** Standing rule is generic anime archetypes only, no franchise references — re-confirm this holds as new stickers/packs get added.
- [ ] **Likeness/consent for the selfies used as landing page examples.** The 3 before/after pairs on the landing page are real people's photos — using someone's likeness in marketing material generally needs their explicit permission (a "model release"), not just the fact that they were a willing tester. Flagged 2026-07-25, legal mechanics not yet researched — don't assume "they knew we were building this" counts as consent to use their photo as a public marketing example. Get real legal input, or swap to photos with clear documented consent (or synthetic/stock ones) before wider launch.

## Payments & core infra — blocking for a real (non-test-mode) launch

- [x] **Stripe webhook wired up (2026-07-25)** — n8n's Stripe Trigger node, listening for `checkout.session.completed`, writes a row to the `orders` table on successful payment. Still in test mode (Stripe account itself), and only the success event is handled — see failed-payment tracking below.
- [ ] **Standardize timestamp timezone handling.** `created_at` (Postgres's own `now()` default) stores in UTC; `updated_at` (set via n8n's `{{$now}}` expression) reflects local time instead — the two columns show timestamps 2 hours apart for the same real moment (confirmed 2026-07-30, Switzerland/CEST). Not incorrect data, just inconsistent labeling between the two systems — pick one convention (recommend: always store UTC, convert only for display) and apply it everywhere before this becomes confusing at real scale.
- [ ] **Track failed/declined payments, not just successful ones.** Right now only `checkout.session.completed` is wired up — a failed or abandoned checkout leaves zero record anywhere. Matters for two reasons: (1) debugging a "I tried to pay and nothing happened" complaint — no way today to tell a declined card apart from your own system silently breaking, (2) spotting a real problem early (currency issues, unsupported card types) before it's lost revenue you don't know about. Fix: also listen for Stripe's failed-payment event(s) and log `payment_tried=true, payment_successful=false`. Flagged 2026-07-25.
- [ ] **Stripe: move off test mode** once the above is solid.
- [ ] **Automated QA / defect-check pass** — today, a bad generation gets manually re-run. Doesn't scale past a handful of orders/day.

## Infra migration — what needs to change, in order

*The concrete sequence for moving off the demo stack. Each item maps to a line in the cost table below — nothing here is unpriced.*

1. [ ] **Swap Gmail → transactional email service** (Resend/Postmark/SES). Gmail caps around 500 sends/day and will just start silently failing past that. → priced as **"Transactional email service"** in the cost table.
2. [ ] **Upgrade OpenAI rate-limit tier + add request queuing/backoff.** More orders means hitting rate limits, not just paying more — need actual queuing/retry logic, not just a bigger quota. → priced inside **"AI generation"** (variable cost) and **"Backend / compute"** (the queuing logic itself).
3. [ ] **Move core generation off n8n's low tier into a real backend/queue** — n8n becomes glue (still fine for the form/trigger layer), not the engine running thousands of generations a day. → priced as **"Backend / compute"** in the cost table.
4. [ ] **Add a job queue so failed orders retry automatically**, no human needed. Distinct from #3 — this is about reliability (a failed generation recovers itself), not just throughput. → same **"Backend / compute"** line, same infra, different job.
   - [ ] **Known gap (2026-07-30):** the R2 sticker-upload branch (parallel to the email-send branch, added when order lifecycle tracking was built) has no error handling — if an upload silently fails, the Postgres Update still writes `output_image_url`/`generation_finished`/`email_sent` as if it succeeded, since the key is computed deterministically rather than read back from S3's response. Real fix needs a Merge node joining both branches back together so failures can be checked before the Update runs — not built yet, deliberately deferred as more setup than the happy-path scope needed that day.
5. [ ] **Add object storage (R2/S3) + a lightweight orders database.** Storage replaces emailing raw attachments as the source of truth; the database is what makes refunds/debugging/order-tracking possible at all. → priced as **"Object storage"** and **"Database"** in the cost table.
6. [ ] **Basic error-rate dashboard/alerting** — so a spike in failed generations or bounced emails gets noticed immediately instead of surfacing as an angry customer email. → priced as **"Monitoring/logging"** in the cost table.

## Known rendering/quality issues — not blocking demo, matter for real customers

- [ ] **Identity-preserving detail sweep — drafted 2026-08-02, not yet propagated to production.** Found during the Together.ai quality test: an unclear tattoo got approximated/invented rather than rendered faithfully — a real trust risk (garbled guess at something personally meaningful is worse than most other rendering misses). Rather than patch just that, did a full audit and added STRICT RULEs to `prompts/shonen-pack.md`'s QUALITY CORE block for the whole category at once: tattoos, eye color, apparent age (closes an older flagged gap), scars/birthmarks/vitiligo, medical devices/prosthetics, and body build (full-body stickers). **Still needs:** propagating these into `n8n/build-sticker-jobs.js` (the actual production code) and testing against real reference photos with each of these traits before this is actually fixed live, not just documented.

- [ ] **Head tilt / facing-direction bias** — confirmed model behavior, not a prompt-wording gap. Real fix is a post-processing de-skew step, not built.
- [ ] **Full-body crop cutting off feet** — same category, needs a bounding-box detect + pad/re-crop step, not built.
- [ ] **Relative sticker size inconsistency** between head-only and full-body stickers — needs a fill-ratio normalization step, not built.
- [ ] **Cross-sticker identity consistency** — each sticker currently re-derives the look independently from the raw selfie, so a pack can look like slightly different people sticker to sticker. Fix: generate one reference image per order first, then generate every sticker as an edit of that reference.
- [ ] Minor intermittent bugs logged but not chased: earring rendered once despite omit rule (unconfirmed pattern), occasional duplicate sweat drop (confirmed intermittent, not consistent).

## Scale-readiness — only matters once volume actually grows, see mentor scaling notes

*Items 1-6 above cover the core infra migration. What's left is scale-specific, not "replace the demo stack" work:*

- [ ] Autoscaling generation workers (Tier 3 / ~100k-orders-a-month territory — the queue from item #3/#4 above needs to scale its worker count, not just exist)
- [ ] Real customer support / dispute / refund process — a tool cost is in the cost table, but the human time behind it isn't a line item, it's a hiring/ops decision

## Cost estimate by scale

*Rough numbers, not quotes — real pricing shifts and you should re-check before committing to a vendor. Assumes $5/pack, 5 stickers/order, roughly maps to the "what breaks as we grow" scaling notes above: Tier 2 ≈ the 100k-user milestone, Tier 3 ≈ the 1M-user milestone, read as sustained monthly volume rather than lifetime total.*

### Variable cost per order (the real cost driver — scales linearly with volume)

| Item | Cost/order | Notes |
|---|---|---|
| AI generation (MVP-style, 1 gen/sticker × 5) | ~$0.17 | `medium` quality, no draft-and-pick |
| AI generation (production QA, draft-and-pick × 5) | ~$0.35 | Once the automated QA pass exists — see [[project_automation_qa_pipeline_spec]] |
| Transactional email w/ attachments | ~$0.001 | Negligible even at volume (SES-tier pricing) |
| Stripe processing fee | ~$0.445 | 2.9% + $0.30, standard rate — real, easy to forget in margin math |
| **Total variable cost/order** | **~$0.62 (MVP-gen) to ~$0.80 (QA-gen)** | On a $5 sale: **~84-88% gross margin** before any fixed infra cost |

### Fixed infra cost per month, by tier

| Item | Now (demo) | Tier 2 (~10k orders/mo) | Tier 3 (~100k orders/mo) |
|---|---|---|---|
| Backend / compute | $0 (n8n free tier) | $25-100/mo (small server/serverless) | $500-2,000/mo (autoscaling workers) |
| Database | $0 (none) | ~$25/mo (managed Postgres) | $100-300/mo |
| Transactional email service | $0 (personal Gmail — breaks past ~500/day) | $20-40/mo | $100-300/mo |
| Object storage (R2/S3) | $0 (email attachments) | $5-15/mo | $50-150/mo |
| Customer support tooling | $0 | $0-50/mo | $200-500/mo (tool only — a human's time is a separate, bigger cost) |
| Monitoring/logging | $0 | included above | $50-100/mo |
| **Total fixed infra** | **~$0** | **~$150-300/mo** | **~$1,000-3,500/mo** |

### Combined monthly total, for a sense of scale

| Tier | Variable cost (orders × ~$0.70 avg) | + Fixed infra | ≈ Total/mo | Revenue (orders × $5) |
|---|---|---|---|---|
| Now (~30 orders/mo) | ~$21 | ~$0 | ~$21 | ~$150 |
| Tier 2 (~10,000 orders/mo) | ~$7,000 | ~$150-300 | **~$7,200-7,300** | ~$50,000 |
| Tier 3 (~100,000 orders/mo) | ~$70,000 | ~$1,000-3,500 | **~$71,000-73,500** | ~$500,000 |

**The honest takeaway:** infra/tooling cost is almost a rounding error next to two things that scale linearly with volume — AI generation cost and Stripe's payment processing fee. Fixed infra only becomes worth optimizing after generation cost and payment fees are already accounted for in the price point.

## Open product/business decisions — not blocking, but unresolved

- [ ] **Pricing beyond the $5 MVP price** — still TBD, not a final decision.
- [x] **Final pack size decided: 20 stickers (2026-07-31).** Stickers #7/#11/#13/#17 already picked from the earlier 18-sticker list; more picks + prompts still needed to reach 20. See [PROJECT_STATUS.md](PROJECT_STATUS.md) for the delivery-UX consequence this triggered (single-attachment email doesn't scale to 20 items, motivated the save-all gallery page below).
- [ ] **4-archetype pack plan** (shonen/shojo/seinen/josei) — parked pre-MVP-pivot, not resurrected yet.
- [ ] Custom-branded form UI replacing n8n's built-in Form Trigger — noted 2026-07-22, deferred.
- [ ] **Save-all gallery page (2026-07-31).** At 20 stickers, long-pressing each one individually in the email doesn't scale (fine at 5, confirmed working). Plan: one link in the email → a simple hosted page (static, no backend needed — reads the already-public R2 image URLs) → a "Save All" button using the Web Share API (`navigator.share` with multiple files) to hand all images to the phone's native share sheet in one tap, saving each individually to the camera roll — no zip, no unzip. Only works on a real webpage (email clients can't run JS), and needs a "long-press to save" fallback line for older/unsupported browsers. Not started. See [[project_v2_architecture_plan]] for full reasoning.

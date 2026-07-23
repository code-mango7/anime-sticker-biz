# Launch readiness checklist

*Everything flagged as "not yet built," "known issue," or "open decision" across this project, consolidated in one place. Not urgent for the Friday mentor demo — this is the punch list for turning the MVP into a real, live, paying-customer product. Update this as items get resolved or new gaps are found; don't let it go stale.*

## Legal / compliance — do before real launch, not optional

- [ ] **Real privacy policy.** Footer currently has one line ("we don't store your photo"). Needs a real policy page, and that claim needs to actually be verified true across the whole pipeline (see below).
- [ ] **Verify the "we don't store your photo" claim is actually true.** Check: does OpenAI retain the image API-side, does n8n keep it in execution logs/history, does it sit in a Gmail "Sent" folder indefinitely? Don't just assume the claim is accurate — confirm it.
- [ ] **Terms of Service.** None exists yet.
- [ ] **Minors' data handling.** Landing page now has a parental-permission disclaimer (2026-07-23) — this is an honest MVP stopgap, **not verified/compliant parental consent**. Real compliance (COPPA, if any users are under 13) needs an actual consent-capture mechanism, not just text a minor can click past. Get real legal input before scaling.
- [ ] **IP/copyright re-check before wider launch.** Standing rule is generic anime archetypes only, no franchise references — re-confirm this holds as new stickers/packs get added.

## Payments & core infra — blocking for a real (non-test-mode) launch

- [ ] **Stripe: move off test mode**, wire up a real webhook (currently just a redirect link after payment, not a verified payment-confirmed trigger).
- [ ] **Replace personal Gmail SMTP** with a real transactional email service (Resend/SES) — Gmail caps around 500 sends/day and will just start failing past that.
- [ ] **Add a database** — no order tracking today, so no way to debug a failed order, prove a payment happened, or issue a refund.
- [ ] **Automated QA / defect-check pass** — today, a bad generation gets manually re-run. Doesn't scale past a handful of orders/day.

## Known rendering/quality issues — not blocking demo, matter for real customers

- [ ] **Head tilt / facing-direction bias** — confirmed model behavior, not a prompt-wording gap. Real fix is a post-processing de-skew step, not built.
- [ ] **Full-body crop cutting off feet** — same category, needs a bounding-box detect + pad/re-crop step, not built.
- [ ] **Relative sticker size inconsistency** between head-only and full-body stickers — needs a fill-ratio normalization step, not built.
- [ ] **Cross-sticker identity consistency** — each sticker currently re-derives the look independently from the raw selfie, so a pack can look like slightly different people sticker to sticker. Fix: generate one reference image per order first, then generate every sticker as an edit of that reference.
- [ ] Minor intermittent bugs logged but not chased: earring rendered once despite omit rule (unconfirmed pattern), occasional duplicate sweat drop (confirmed intermittent, not consistent).

## Scale-readiness — only matters once volume actually grows, see mentor scaling notes

- [ ] n8n itself becomes the bottleneck — real backend + job queue eventually replaces it
- [ ] Object storage (R2/S3) for images instead of emailing attachments
- [ ] Autoscaling generation workers
- [ ] Real customer support / dispute / refund process
- [ ] OpenAI API rate-tier + real cost/budget tracking

## Open product/business decisions — not blocking, but unresolved

- [ ] **Pricing beyond the $5 MVP price** — still TBD, not a final decision.
- [ ] **Pack expansion beyond 5 stickers** — deliberately deferred post-demo (2026-07-23), not abandoned. Stickers #7/#11/#13/#17 already picked, prompts not yet written.
- [ ] **4-archetype pack plan** (shonen/shojo/seinen/josei) — parked pre-MVP-pivot, not resurrected yet.
- [ ] Custom-branded form UI replacing n8n's built-in Form Trigger — noted 2026-07-22, deferred.

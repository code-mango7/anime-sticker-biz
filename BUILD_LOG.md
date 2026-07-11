# Build-in-public log

Running log of real milestones/decisions/bugs from building the anime sticker pack product, kept as raw material for build-in-public posts (X, etc). Each entry has the actual beat plus a short "post angle" note. Pull from here rather than re-summarizing the whole project from scratch each time.

Not a polished narrative — write the actual posts separately, from these beats.

---

**1. The pivot: generic anime archetypes, not franchise characters**
Decided to build the sticker packs around 4 broad anime demographics — shonen, shojo, seinen, josei — instead of a specific franchise (Demon Slayer, GTA, etc). Each pack gets its own art-style modifier (bold/dynamic for shonen, soft/dreamy for shojo, and so on) instead of borrowing a specific show's aesthetic.
*Post angle: "why we're not doing a [franchise] sticker pack" — the IP-risk reasoning, or just the creative constraint of designing 4 distinct art styles from scratch.*

**2. Picking the tech: GPT Image 1.5 + a likeness-preservation setting**
Landed on OpenAI's `images/edit` endpoint with `input_fidelity="high"` as the actual lever for keeping a selfie recognizable through the anime transform — tested and ruled out multi-angle reference photos as a likeness booster (no measurable improvement, costs more).
*Post angle: "the one API setting that actually matters for likeness" — a specific, useful technical nugget.*

**3. Discovering there's no seed — and turning that into a cost strategy**
Found out this image API has zero reproducibility control: identical prompt, different quality every single run. Instead of fighting it, built a draft-and-pick pipeline — generate several cheap low-quality drafts, pick the best, only pay for one full-quality render of the winner. Turned an API limitation into a deliberate cost structure (~$0.07/sticker).
*Post angle: "turning an AI API's biggest flaw into our cost model" — good "here's how you actually build with imperfect AI tools" content.*

**4. The respectful-representation research pass**
Before writing a single prompt, did research (Pixar/SIGGRAPH lighting papers, the Monk Skin Tone Scale, natural hair texture libraries) specifically to avoid the well-documented AI failure modes: lightening dark skin, flattening non-straight hair into a generic "afro," over-correcting facial features toward a narrower default. Built explicit rules against all three before testing began.
*Post angle: "we did research before writing prompts, here's why" — signals care, differentiates from a "just vibes" AI product.*

**5. Sticker #1: the marathon of tiny defects**
The first sticker (crying-laughing) took many rounds to lock — each fix exposing the next bug: a highlight dot that kept reappearing on the nose, teeth rendering black instead of white, tear droplets scattered outside where they belonged, a stray glow/halo traced around the whole head, hair shine that looked cheap until the light source was made consistent, feminization not reading strongly enough on a male-to-female swap. Every one of these is invisible until you actually look closely at a sticker-sized image.
*Post angle: this is the richest thread — "20 rounds of feedback to fix a crying emoji" or a single-bug deep dive (the nose highlight one is a great standalone post: "why does every AI anime face have a shiny dot on its nose").*

**6. Building a reusable core so the next 17 stickers don't repeat the fight**
Once the recurring defects were solved, split the prompt into a locked "quality core" block (skin tone, nose/lip/teeth, hair rendering, head angle, crop) reused verbatim across every sticker, so testing sticker #2 onward only means writing the pose-specific sentence — not re-litigating the same bugs.
*Post angle: "how we made sticker #2 10x faster than sticker #1" — a process/learning post.*

**7. Designing a QA pipeline with zero human review, on purpose**
Since the production pipeline (Stripe → generate → store → email) will run fully automated post-launch with nobody checking orders by hand, designed an automated defect-check step: generate multiple drafts, run them through a cheap vision-classification pass against a defect checklist, auto-promote the best, auto-degrade gracefully if none pass — no queue, no blocking, no person in the loop ever.
*Post angle: "designing an AI product pipeline that has to be right with zero humans watching" — resonates with other AI-product builders.*

**8. Catching a transparent-background API bug via the actual downloaded file, not the preview**
The OpenAI playground's preview made tear streaks look like they'd vanished when `background="transparent"` was set — turned out the API was punching real transparency holes through light-colored foreground details (the white/light-blue tears), not just the intended background. Confirmed by downloading and checking the actual file rather than trusting the preview. Fix: generate on a solid background, do background removal as a separate, smarter (ML-segmentation-based) step.
*Post angle: "don't trust the preview, check the actual file" — a good specific "gotcha" post for anyone building on these APIs.*

**9. Gender choice as a first-class, free option**
Customers pick masculine, feminine, or both at no extra charge — never inferred from the selfie. Also surfaced its own bug during testing: the feminine transform not reading as feminine enough on some reference photos, fixed with more explicit (not just adjective-based) jaw/brow language.
*Post angle: inclusive-by-default product decision, or the specific "how do you prompt an AI to reliably gender-swap a face" problem.*

**10. Where things stand now**
Sticker #1 (crying-laughing) fully locked, masculine + feminine. Sticker #2 (a second crying variant, matched to the classic loudly-crying emoji) in progress. 16 more to go before the shonen pack is done, then 3 more packs (shojo, seinen, josei) to build out.
*Post angle: a "progress update" post — useful as a running series marker ("sticker 1/18 done").*

---

*Update this file as new milestones/decisions/bugs happen — add an entry with a post angle, don't rewrite the whole log each time.*

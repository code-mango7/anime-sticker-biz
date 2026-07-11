# Anime Sticker Biz — project status

*Read this first in any new chat to pick up where things left off. Full prompt details live in `prompts/shonen-pack.md`.*

## The product

AI-generated anime-style sticker packs made from a customer's selfie. **Generic anime archetypes/demographics — not franchise characters** (deliberately avoids all copyright risk; earlier explored Demon Slayer/GTA/DBZ/Naruto themes, dropped all of them after research showed major publishers — Shueisha, Rockstar/Take-Two — are actively pursuing AI-content enforcement as of Oct 2025).

**Structure:** 4 packs by anime demographic — shonen, shojo, seinen, josei — each with its own art-style modifier. Shonen pack has 18 stickers planned (list in prompts file), built around emojis people already send constantly (crying-laughing, heart-eyes, fire, etc.) so stickers get reused, not just admired once.

**Pricing:** $4/pack was locked during an earlier franchise-pack exploration — **not yet explicitly reconfirmed** for the current archetype-pack structure. Revisit before launch.

**Channel:** TikTok, quick-buy impulse positioning (not aspirational branding). Delivery is plain PNG paste/share — not native keyboard sticker packs (those need a real iOS/WhatsApp app; Telegram bot API is the one easy native option, parked for later).

## Tech pipeline (confirmed working)

- **GPT Image 1.5**, `images/edit` endpoint, `input_fidelity="high"`
- **No seed/reproducibility control exists** on this API — same prompt gives different quality each run, confirmed by testing
- **Fix:** generate 4 drafts at `quality="low"` ($0.009 ea) → pick the best → re-render only the winner at `quality="medium"` ($0.034)
- Cost: ~$0.07/sticker → ~$1.68/18-sticker pack → **~58% margin at $4** (all-medium drafts would be ~28%; all-high would lose money)
- **`background="transparent"` API param bug, confirmed by testing:** it punches holes through light-colored foreground elements (e.g. white/light-blue tear streaks) that are close in color to the background, not just the actual background — verified by downloading the actual PNG, not just checking the playground preview. **Fix:** generate on a plain solid background instead (drop `background="transparent"` from the API call), then run background removal as a separate post-processing step using **semantic/ML segmentation** (e.g. rembg or similar), not naive color-key/chroma removal — color-key would have the same problem of eating near-white foreground details. This step slots into the pipeline after the medium re-render, before upload to R2 (see [[project_automation_qa_pipeline_spec]]).

## Prompt rules, hard-won through testing

1. **Every pose must state hand/body position explicitly** — otherwise the model copies whatever gesture was in the reference selfie
2. **Reaction/comedy stickers need a tight face/shoulders crop, no arms** — full-body attempts came out distorted
3. **Accessories (hats/glasses) handled in-prompt** — told to omit/reinterpret, never asked at upload (friction)
4. **Skin tone bias (important, real bug, fixed):** the model defaults toward lighter skin, especially picking up lighting highlights/glare as the "true" tone instead of the actual base color. Fix: explicit rule to sample from evenly-lit midtone areas, ignore highlights, and never lighten dark skin for a "cleaner" look
5. **Hair for very short/buzzed reference photos:** don't literally copy the exact cut — identify texture *category* (straight/wavy/curly/coily) and design a full, realized hairstyle from that category instead
6. **Feminine-transform variant:** fully removes beard/mustache/goatee (confirmed preference — "should be fully feminine")
7. **Respectful-depiction research findings to keep baking in:** hue-shift shadows/highlights instead of just darkening/lightening; preserve actual hair texture (don't default to generic "afro"); preserve real nose/lip/eye proportions at the *same* stylization ratio for every ethnicity — don't scale exaggeration up or down by perceived race. Monk Skin Tone Scale is a good objective reference for QA spot-checks.

**Status: sticker #1 (crying-laughing) is fully locked, masculine + feminine, with all fixes applied. 17 of 18 stickers still need testing.**

## Other locked decisions

- Gender: customer picks masculine / feminine / both, no extra charge, comical copy TBD
- Quality-over-margin is a standing user preference — don't default to cutting corners when margin is thin
- Not yet built: real landing page (only a mockup exists), Stripe checkout, n8n automation (Stripe webhook → generate → store on R2 → email via Resend)

## Subagents built (in `~/.claude/agents/`, usable in any project)

- **northstar** — impact/priority-setting, run at the start of new ideas
- **stack-scout** — tech-stack research, full-scenario cost/free-tier checks
- **copyright-scout** — IP/copyright risk research
- **foresight** — business trajectory/leverage-point analysis
- **inclusivity-check** — explicit-invoke only, advisory only, never auto-runs

## Repo

`github.com/code-mango7/anime-sticker-biz` — pushed and live. Push pattern: `git add . && git commit -m "..." && git push`

## Next step

Test sticker #2 (ghost/spirit leaving body) through the locked pipeline, then continue down the list in `prompts/shonen-pack.md`. Once the pack is fully tested, move to the real landing page + automation build.

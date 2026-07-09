# Shonen pack — prompt reference

**API setting for likeness:** always pass `input_fidelity="high"` on the images/edit call — confirmed as OpenAI's actual mechanism for preserving facial identity, unlike submitting multiple reference photos (tested/researched: no evidence multi-angle input improves likeness, and it costs more per generation). Stick to one clear, well-lit, front-facing selfie in onboarding.

**Respectful depiction rules — standing, apply to every prompt/every pack:**
- Skin tone: sample from a shadow-neutral midtone area of the face, never a bright highlight/glare. When shading, shift shadows/highlights via hue (warm reds/oranges or cool blues within the same family), not just brightness — flattening dark skin toward gray/black or lightening it toward a "clean" default are both defects, same severity as any other likeness failure.
- Hair: detect the actual texture category from the photo (straight / wavy / curly / coily, including tight coils) — never default non-straight hair to one generic "afro" shape. If the photo shows locs, braids, twists, or a fade, render that specific structure, not a substitute. Build volume as a shaped, layered mass appropriate to the texture, not a flattened 2D shape sized like straight hair.
- Facial features: preserve the person's actual nose, lip, and eye proportions at the same degree of anime stylization used for every other ethnicity — don't apply a heavier "correction" toward a narrower default, and don't over-exaggerate either. Fidelity to the specific photo, not a race-based formula in either direction.
- QA check: treat skin tone drift, hair texture drift, or facial proportion drift as defects on the same level as a likeness failure — not a lower-priority polish item.
(Source: Pixar/SIGGRAPH *Soul* lighting research, A.M. Darke's Open Source Afro Hair Library, Cedric Hohnstadt's ethnic character design writing, Monk Skin Tone Scale — see conversation for full citations.)

**Accessories in the selfie:** don't ask customers to remove hats/glasses before upload (adds friction). Instead, every prompt tells the model to skip literal accessories and exaggerate the real facial features instead — see updated base template.

**Consistency fix (confirmed no seed/reproducibility control exists on this API):** generate n=4 candidates per sticker per order, auto-validate (or manually pick during testing), deliver the best one. Same prompt does NOT reliably give the same quality every run — this is expected API behavior, not a prompt problem.

**Locked cost approach: low-quality drafts, one final render.** Generate the 4 candidates at `quality="low"` ($0.009/image) to pick the winner, then re-render only that winner at `quality="medium"` ($0.034/image). Per sticker: 4×$0.009 + 1×$0.034 = ~$0.07. Per 18-sticker pack: ~$1.26 raw cost + Stripe fee ≈ $1.68 total → margin ~$2.32 on $4 (~58%). Chosen over all-medium drafts (~28% margin) and all-high (loses money).

**Two composition modes (confirmed by testing):**
- **Reaction/comedy stickers** (crying, sweatdrop, ghost-leaving-body, nosebleed, pleading, glistening eyes) → tight close-up, head and shoulders only, no arms/hands, simple bold linework. Full-body attempt on sticker #1 came out distorted/low quality — cropping tight fixed the composition problem.
- **Action/power stickers** (sword, power-up, sports) → full-body dynamic pose is fine, already tested and worked well.

Reusable formula for this pack and future packs (shojo, seinen, josei). Each pack swaps the STYLE_MODIFIER; GENDER_STYLE is picked by the customer at purchase, never assumed from the selfie.

## Base template

Transform the person in this photo into the following style, keeping their actual facial features, eyes, smile, and skin tone clearly recognizable — the final image must look unmistakably like the same person, just illustrated. Preserve the specific shape of their nose, jawline, and expression above all else. Do not copy the hand gesture, pose, or body position from the reference photo — use only the hand/body position described below. Anime art style, [STYLE_MODIFIER], rendered in a [GENDER_STYLE] anime style, dramatic ink linework, cel-shaded coloring. [POSE — must explicitly describe both face/expression AND exact hand/body position]. Clothing is plain with no text, letters, or logos of any kind. No text, no logos, no watermarks anywhere in the image. Output as a clean sticker: transparent background, bold outline, square, high resolution.

**Rule:** every [POSE] must state what the hands/arms are doing, not just the face — otherwise the model defaults to copying the reference photo's gesture (confirmed issue: sticker #1 test kept the peace sign from the reference selfie).

## Pack style modifiers (swap per pack)

- **Shonen:** bold and dynamic, spiky angular hair, sharp confident linework, bright saturated colors
- **Shojo:** soft and dreamy, rounded gentle features, sparkling large eyes, pastel color accents
- **Seinen:** realistic proportions, gritty mature linework, muted grounded color palette
- **Josei:** elegant refined linework, sophisticated realistic style, soft mature tones

## Gender style options (customer picks, not inferred)

- `masculine`
- `feminine`

Customer selects this at purchase/upload — the AI never assumes from the selfie's apparent presentation.

## Shonen pack — 18 stickers

| # | Emoji ref | Pose |
|---|---|---|
| 1 | 😂/😭 | Crying-laughing, tears shooting out |
| 2 | 💀 | Ghost/spirit leaving body, eyes rolled back |
| 3 | 🔥 | Blazing aura behind a smug thumbs-up |
| 4 | 🙏 | Dramatic bow, sparkles background |
| 5 | 👍/👏 | Fist-bump/clap with impact lines |
| 6 | 😅 | Sweatdrop + forced smile |
| 7 | 🥹 | Glistening eyes, single tear, hand on chest |
| 8 | ❤️/🥰 | Heart-eyes, hands forming a heart |
| 9 | 😍 | Swooning, starry heart-shaped eyes |
| 10 | 😊 | Soft blush, warm gentle smile |
| 11 | 😘 | Flirty wink, blowing a kiss |
| 12 | 😁 | Huge excited grin, fist pump |
| 13 | 🎉 | Confetti explosion, celebration pose |
| 14 | 🫶 | Hands forming a heart at chest |
| 15 | 💕 | Shy blush, floating hearts around face |
| 16 | ✨ | Confident wink + sparkle effect |
| 17 | (anime-iconic, no direct emoji) | Nosebleed shock — eyes wide, blood shooting from nose, flustered |
| 18 | 🙏 (please variant) | Pleading pose — hands clasped near chin, eyes shut, pretty-please face, single sweat drop |

## Full ready-to-paste prompts (shonen, masculine example)

**1. Crying-laughing — LOCKED (confirmed best result, run at n=4)**
Transform the person in this photo into anime style, keeping their facial structure, skin tone, hair texture, and overall identity clearly recognizable — but completely REPLACE their facial expression with the one described here. Ignore the expression in the photo entirely. The new expression is the crying-laughing emoji brought to life: head perfectly straight and facing forward, not tilted, eyes squeezed tightly shut drawn as upward-curved arcs, huge wide-open laughing mouth showing the top row of teeth, eyebrows raised high. Exaggerate the tears comedically: two big cartoonish fountains of tears bursting sideways from the corners of both eyes like little geysers, oversized teardrops flying outward with comic motion, way too many tears for one face. The mood is loud hysterical joy, exactly like the crying-laughing emoji. If the person is wearing accessories such as hats, glasses, or jewelry, omit them. Close-up crop: head and shoulders only, no arms or hands. Simple bold clean linework, soft flat cel-shaded coloring, minimal detail. No text, no logos, no watermarks. Output as a clean sticker: transparent background, bold outline, square, high resolution.

**1b. Crying-laughing — feminine variant, LOCKED**
Transform the person in this photo into anime style. Keep their facial structure and overall identity clearly recognizable as the same person. STRICT RULE on hair: preserve their exact natural hair texture and color — if the hair is curly, coily, or wavy, keep that exact texture, do not straighten it or replace it with generic anime hair. Completely REPLACE only their facial expression with the one described here — ignore the expression in the photo. Render them with a playfully exaggerated feminine anime look: softer rounder face shape, long fluttery eyelashes visible even with closed eyes, delicate features, and their own natural hair texture styled longer and fuller within that same texture — like a comedic gender-swapped anime version of the person. The expression is the crying-laughing emoji brought to life: head perfectly straight and facing forward, not tilted, eyes squeezed tightly shut drawn as upward-curved arcs, huge wide-open laughing mouth showing the top row of teeth, eyebrows raised high. Exaggerate the tears comedically: two big cartoonish fountains of tears bursting sideways from the corners of both eyes like little geysers, oversized teardrops flying outward with comic motion, way too many tears for one face. The mood is loud hysterical joy. If the person is wearing accessories such as hats, glasses, or jewelry, omit them. Close-up crop: head and shoulders only, no arms or hands. Simple bold clean linework, soft flat cel-shaded coloring, minimal detail. STRICT RULE, applies to every color decision in this image: whatever skin tone appears on the person's face in the reference photo, the cel-shading and coloring must reproduce that exact same tone — not a stylized or warmed approximation. If the photo shows a light-to-medium brown complexion, the final colored skin must match that same light-to-medium brown, not a darker or lighter substitute. No text, no logos, no watermarks. Output as a clean sticker: transparent background, bold outline, square, high resolution.

Note: the skin-tone STRICT RULE wording (generic, works for any tone) is confirmed working — this is the version to use as the base for all remaining stickers going forward, masculine and feminine alike. Only ran clean once at time of locking — worth a couple more spot-checks during the full pack test pass, not yet verified across a large sample.

**2. Ghost/spirit leaving body**
Transform the person in this photo into the following style, keeping their actual facial features, eyes, smile, and skin tone clearly recognizable — the final image must look unmistakably like the same person, just illustrated. Preserve the specific shape of their nose, jawline, and expression above all else. Do not copy the hand gesture, pose, or body position from the reference photo — use only the hand/body position described below. Anime art style, bold and dynamic, spiky angular hair, sharp confident linework, bright saturated colors, rendered in a masculine anime style, dramatic ink linework, cel-shaded coloring. Eyes rolled back, mouth open in shock, arms hanging limply at the sides, a faint ghostly spirit floating up out of the top of the head with a peaceful expression. Clothing is plain with no text, letters, or logos of any kind. No text, no logos, no watermarks anywhere in the image. Output as a clean sticker: transparent background, bold outline, square, high resolution.

(Remaining 16 follow the same formula — swap only the [POSE] sentence per the table above. Write each out fresh when testing so the pose description stays specific.)

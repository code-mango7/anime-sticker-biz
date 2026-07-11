# Build log image organization

Originals were left in place (untouched, unrenamed). This file records which
originals were **copied** into which subfolder, matching them to BUILD_LOG.md
entries. Subfolders with 0 files mean no screenshot in this batch matched that
entry closely enough — see notes below.

## 00-source-selfies (1 file)
- `20260621_092900.jpg` — real selfie of a person smiling, teeth visible, dated
  June 21 (well before any Jul 6+ Playground work). Looks like a general-purpose
  source/test selfie predating the documented sessions, not tied to one entry.

## 01-pivot-to-archetypes (0 files)
No screenshot matches this entry — it's a strategic/naming decision, not a
generation result. Left empty as anticipated in the task brief.

## 02-input-fidelity-setting (2 files)
- `OpenAI Playground 2026-07-06 at 06.07.39.png`
- `OpenAI Playground 2026-07-06 at 06.10.26.png`
  Rationale: the two earliest Playground screenshots in the whole set (Jul 6,
  a day before the sticker #1 marathon starts Jul 7). Both show the *same*
  shonen swordfighter character (identical purple cap, face, outfit) generated
  ~3 minutes apart — consistent with a likeness/fidelity consistency test
  rather than the sticker #1 crying/laughing work.

## 03-no-seed-draft-pipeline (0 files)
No dedicated screenshots found — the "no seed / draft-and-pick" behavior is
really the same underlying phenomenon visible across all the repeated
crying-laughing attempts filed under entry 5. No image stood out as
specifically illustrating the draft-pipeline concept on its own.

## 04-representation-research (3 files)
- `ethnic-selfie-reference-1.jpeg`, `ethnic-selfie-reference-2.jpeg`,
  `ethnic-selfie-reference-3.jpeg` — real selfies of men with a range of skin
  tones and hair textures (dark skin/low fade, brown skin/wavy, curly hair).
  Match the entry's "before writing prompts, researched skin tone & hair
  texture" research pass.

## 05-sticker1-defects (37 files) — the big bucket, as expected
- `anime-crying-reference-1.jpeg`, `anime-crying-reference-2.jpeg`,
  `anime-lauging-crying-reference.jpg` — the anime reference stills used to
  brief the crying-laughing sticker pose.
- 34 `OpenAI Playground *.png` screenshots spanning Jul 7 02:23 through
  Jul 10 19:20 — every visible defect from the log entry shows up across this
  set: a recurring nose highlight dot (e.g. `00.18.38`, `03.22.06`,
  `00.09.42`, `00.04.02`), a stray halo/glow ring around the head (`02.49.27`,
  `02.53.18`, `23.51.01`, most of the Jul 7 batch), tear droplets scattered
  outside the intended tracks (`02.57.14`, `03.09.29`), a feminine variant
  test (`03.37.04`), and systematic testing across skin tones/hair textures
  (curly, coily, locs) through Jul 8-9. `2026-07-10 at 19.20.44.png` (a
  laugh-cry dark-skin variant) is the last one before the session shifts to
  the distinct "quiet crying" sticker #2 pose, so it's grouped here rather
  than with entry 6.

## 06-reusable-quality-core (9 files)
- `OpenAI Playground 2026-07-10 at 19.40.44.png` through `20.07.37.png` (9
  files). This is a visibly different pose from entry 5 — a single quiet
  "crying" face (mouth open, tears streaming) rather than the laugh-cry
  expression — generated in one tight ~30-minute session with far fewer
  visible defects (one residual nose-dot instance early on, then clean).
  Matches the entry's description of sticker #2 going faster once the
  reusable prompt core was locked. The last image in the set
  (`20.02.46.png`) even shows the finished white-outline sticker cutout look.

## 07-automated-qa-pipeline (0 files)
No screenshot found showing a vision-classification/defect-checklist tool —
none of the 60 files resemble an automated QA UI. Left empty as anticipated.

## 08-transparent-bg-bug (0 files)
Looked specifically for checkerboard transparency patterns or preview-vs-
downloaded-file comparisons per the task brief's description of this bug —
none of the 60 images show a checkerboard/transparency artifact. All
generations in this set use solid or gradient backgrounds. No file matched
this entry.

## 09-gender-choice (5 files)
- `woman-selfie-reference-1.jpeg`, `-2.jpeg`, `-3.jpeg` — real selfies of
  women with varied skin tones/hair (redhead, dark-skin straight hair,
  light-skin wavy), dated Jul 9 18:35.
- `OpenAI Playground 2026-07-09 at 18.39.02.png` and `18.42.29.png` — a
  masculine-presenting sticker with reddish wavy hair generated minutes after
  the woman-selfie-reference files (18:35), hair color closely echoing
  `woman-selfie-reference-1`. Read as a masculine-transform test run
  alongside the feminine reference photos — fits the entry's "masculine,
  feminine, or both" gender-choice testing.

## 10-current-progress (2 files)
- `big tears crying emoji.jpeg` — the classic "loudly crying" emoji reference
  that sticker #2 is matched to per the log.
- `OpenAI Playground 2026-07-11 at 02.43.17.png` — the single most recent
  screenshot in the entire folder (Jul 11, after all other sessions), showing
  a clean crying sticker with no visible defects. Best candidate for "where
  things stand now."

## unsorted (1 file) — catch-all, flagged as genuinely ambiguous
- ` reference-couch-watching tv.webp` — a generic stock/clipart illustration
  of a person on a couch watching TV, dated Feb 4 2025 (older than every
  other file by over a year, predating the whole documented project). It
  isn't a selfie and doesn't match the visual content of any of the 10 log
  entries (no anime style, no crying/laughing, no sticker framing). Kept out
  of 00-source-selfies since it's not a real face/selfie either — genuinely
  unclear what it was for.

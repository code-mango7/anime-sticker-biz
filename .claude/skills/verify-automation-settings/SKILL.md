---
name: verify-automation-settings
description: Checklist for entering or reviewing API call parameters (model name, quality, size, fidelity, endpoint, etc.) in this project's n8n workflow or any other automation config. Use this whenever configuring, checking, fixing, or debugging an n8n node that calls an external AI/API service, or when adding/changing any sticker-generation setting — even if the user doesn't say "settings" explicitly (e.g. "the images look wrong," "check the HTTP node," "why is quality off"). Do NOT rely on memory for these values, even if you configured them yourself minutes ago in the same conversation — that's exactly how the gpt-image-1 vs gpt-image-1.5 mismatch happened.
---

# Verify automation settings

A past mistake in this project: a model name was typed from memory into an n8n
HTTP Request node (`gpt-image-1` instead of the locked `gpt-image-1.5`), and it
went undetected for several test cycles because nobody re-checked it against
the written record. This skill exists to make that specific class of mistake
structurally harder, not just to be more careful next time.

The fix isn't "try harder to remember" — it's "never trust memory for these
values in the first place." Treat `n8n/locked-settings.md` as the only valid
source, every time, no exceptions for values that feel obvious or recently
confirmed.

## Before entering or checking any setting

1. Read `n8n/locked-settings.md` in full.
2. For each field you're about to touch (model, quality, size, input_fidelity,
   endpoint, background, etc.), state the locked value and cite that it came
   from this file — not from memory, not from "what we used last time."

## After configuring

3. Read the actual live value back from the tool (n8n node panel, API config,
   etc.) — don't assume it saved correctly just because you entered it.
4. Diff every field, one by one, against `n8n/locked-settings.md`. Call out
   each match explicitly, not just the mismatches — a silent pass is easy to
   fake by skimming.
5. If anything doesn't match: stop and flag it to the user before saying the
   task is done. Do not "fix" a mismatch by updating `locked-settings.md` to
   match whatever's live — the file is the source of truth; the live config
   is what has to change, unless the user explicitly says they're changing
   the locked decision (in which case update the file first, then the tool).

## If a setting isn't in the file yet

If you're configuring something `locked-settings.md` doesn't cover, don't
guess and don't silently invent a value. Ask the user what it should be,
then add it to the file with a brief reason — so the next check has
something real to check against.

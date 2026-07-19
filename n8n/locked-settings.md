# Locked automation settings — single source of truth

These are the exact values the n8n workflow's OpenAI HTTP Request node must use.
If a value here doesn't match what's actually configured in n8n, the n8n config is wrong — fix n8n, not this file (unless the user explicitly changes a locked decision, in which case update here first).

| Setting | Value | Why |
|---|---|---|
| `model` | `gpt-image-1.5` | The model actually used/approved during Playground testing. `gpt-image-1` (no `.5`) is a different, weaker model — confirmed by direct comparison 2026-07-19. |
| `quality` | `medium` | Matches Playground testing setting. MVP does not do draft-and-pick (see PROJECT_STATUS.md). |
| `input_fidelity` | `high` | Confirmed as OpenAI's actual mechanism for preserving facial identity (see prompts/shonen-pack.md). |
| `size` | `1024x1024` | Square, sticker-appropriate. |
| `background` | *(not set — defaults to `opaque`)* | MVP deliberately skips transparency (see PROJECT_STATUS.md — `background=transparent` has a confirmed rendering bug). |
| Endpoint | `https://api.openai.com/v1/images/edits` | Not `/generations` — this is an image *edit* call (selfie in, styled sticker out). |

Last confirmed working: 2026-07-19, `gpt-image-1.5` + `quality=medium` + `input_fidelity=high` produced matching quality to the locked Playground stickers.

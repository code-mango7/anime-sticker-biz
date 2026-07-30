// n8n Code node — "Combine attachments"
// Mode: Run Once for All Items
// Input: one item per generated sticker (each with json.email/sessionId/stickerId/stickerName)
// Output: a single item with email + sessionId + a comma-separated list of the R2 keys
//         (kept for the orders table's output_image_url — a record of what should exist,
//         same deterministic {sessionId}-{stickerId}.png naming as the parallel S3-upload
//         branch writes to) + an HTML snippet with one <img> per sticker, pointing at the
//         public R2 bucket. No more binary/attachments — the email just links to the images.

const PUBLIC_BASE_URL = 'https://pub-8efdab5de3f640a2a3be6e7422097434.r2.dev';

const items = $input.all();

const outputImageKeys = items
  .map((item) => `${item.json.sessionId}-${item.json.stickerId}.png`)
  .join(',');

const stickerImagesHtml = items
  .map((item) => {
    const key = `${item.json.sessionId}-${item.json.stickerId}.png`;
    return `<img src="${PUBLIC_BASE_URL}/${key}" alt="${item.json.stickerName}" style="width:200px;height:200px;margin:8px;border-radius:12px;" />`;
  })
  .join('\n');

return [
  {
    json: {
      email: items[0].json.email,
      sessionId: items[0].json.sessionId,
      outputImageKeys,
      stickerImagesHtml,
    },
  },
];

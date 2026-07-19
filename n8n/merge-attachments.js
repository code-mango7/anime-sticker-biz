// n8n Code node — "Combine attachments"
// Mode: Run Once for All Items
// Input: one item per generated sticker (each with binary.sticker + json.email)
// Output: a single item with one email + all stickers as separate binary properties,
//         so the Send Email node can attach all of them in one message.

const items = $input.all();

const binary = {};
items.forEach((item, i) => {
  binary[`sticker_${i + 1}`] = item.binary.sticker;
});

return [
  {
    json: {
      email: items[0].json.email,
    },
    binary,
  },
];

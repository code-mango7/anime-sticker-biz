// n8n Code node — "Decode data to view images node"
// Mode: Run Once for Each Item
// Input: one item per sticker, the OpenAI images/edit HTTP response (json.data[0].b64_json)
//        + the original job data via explicit reference to "Build Sticker Jobs - Code Node"
//        (HTTP Request's own output replaces json/binary, same recurring pattern as elsewhere
//        in this workflow — always pull job fields from that node by name, not from $json).
// Output: one item per sticker with the decoded PNG as binary.sticker, plus the job fields
//         needed downstream (stickerId/sessionId for R2 upload + the final Postgres Update).

const b64 = $json.data[0].b64_json;
const binaryData = await this.helpers.prepareBinaryData(
  Buffer.from(b64, 'base64'),
  `${$('Build Sticker Jobs - Code Node').item.json.stickerName}.png`,
  'image/png'
);

return {
  json: {
    stickerId: $('Build Sticker Jobs - Code Node').item.json.stickerId,
    stickerName: $('Build Sticker Jobs - Code Node').item.json.stickerName,
    email: $('Build Sticker Jobs - Code Node').item.json.email,
    sessionId: $('Build Sticker Jobs - Code Node').item.json.sessionId,
  },
  binary: {
    sticker: binaryData,
  },
};

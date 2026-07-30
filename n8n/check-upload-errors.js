// n8n Code node — "Check upload errors"
// Mode: Run Once for All Items
// Input: one item per sticker, the R2 (S3) upload result. Requires "Continue On Fail"
//        enabled on the upstream "Upload a file1" node — otherwise a failed upload
//        stops the whole execution instead of producing an item we can inspect here.
//        With Continue On Fail on, a failed item's json.error holds the failure reason
//        instead of the node's normal success output.
// Output: a single summary item (hasError, errorMessage) — merged back with the
//         email branch's item downstream so the final Postgres Update can record it.

const items = $input.all();
const failed = items.filter((item) => item.json.error);

return [
  {
    json: {
      hasError: failed.length > 0,
      errorMessage:
        failed.length > 0
          ? `${failed.length}/${items.length} sticker uploads to R2 failed: ${failed
              .map((item) => item.json.error)
              .join('; ')}`
          : '',
    },
  },
];

// make.fun - Sum up 25 November's world news in one image
// Entry: a program that writes one image of the day's news (1024x1024 PNG, under 1 MiB)
import fs from 'node:fs';
import path from 'node:path';
const src = path.join(import.meta.dirname, 'news.png');
const dir = process.env.OUTPUT_DIR || '/output';
fs.mkdirSync(dir, { recursive: true });
const bytes = fs.readFileSync(src);
// The competition's entry gate: PNG, at most 1 MiB, at most 1024x1024 pixels.
if (bytes.length > 1048576) {
  throw new Error(`Image is ${bytes.length} bytes, over the 1 MiB limit`);
}
if (bytes[0] !== 0x89 || bytes[1] !== 0x50 || bytes[2] !== 0x4e || bytes[3] !== 0x47) {
  throw new Error('Image is not a PNG');
}
const width = bytes.readUInt32BE(16);
const height = bytes.readUInt32BE(20);
if (width > 1024 || height > 1024) {
  throw new Error(`Image is ${width}x${height}, over the 1024x1024 limit`);
}
const out = path.join(dir, 'entry.png');
fs.writeFileSync(out, bytes);
// Read back and confirm what was written is byte-identical to the source image.
const written = fs.readFileSync(out);
if (!written.equals(bytes)) {
  throw new Error('Written image differs from the source image');
}
console.log(`Wrote news image (${bytes.length} bytes, ${width}x${height}) to ${out}`);

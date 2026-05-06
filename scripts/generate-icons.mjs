import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

function arg(name, fallback = "") {
  const ix = process.argv.indexOf(`--${name}`);
  if (ix >= 0) return process.argv[ix + 1] ?? fallback;
  return fallback;
}

function hasFlag(name) {
  return process.argv.includes(`--${name}`);
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function hexOrDefault(hex, fallback) {
  const v = String(hex || "").trim();
  return /^#[0-9a-fA-F]{6}$/.test(v) ? v : fallback;
}

const root = path.resolve(process.cwd());
const input = arg("input", path.join(root, "assets", "centifi-logo.svg"));
const outDir = arg("outDir", path.join(root, "assets", "generated"));
const bg = hexOrDefault(arg("bg", "#6C63FF"), "#6C63FF");
const radius = Number(arg("radius", "110")) || 110;
const pad = Number(arg("pad", "0")) || 0;

const sizes = arg("sizes", "48,96,180,512,1024")
  .split(",")
  .map((s) => parseInt(s.trim(), 10))
  .filter((n) => Number.isFinite(n) && n > 0);

const writeToProjectRoot = hasFlag("writeToProjectRoot");

if (!fs.existsSync(input)) {
  console.error(`[generate-icons] Input not found: ${input}`);
  process.exit(1);
}

ensureDir(outDir);

const inputBuf = fs.readFileSync(input);
const ext = path.extname(input).toLowerCase();
const isSvg = ext === ".svg";

async function renderOne(size) {
  const tileSvg = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">` +
      `<rect width="100%" height="100%" rx="${radius}" ry="${radius}" fill="${bg}"/>` +
    `</svg>`,
  );

  const base = sharp(tileSvg);
  const mark = isSvg
    ? sharp(inputBuf).resize(size - pad * 2, size - pad * 2, { fit: "contain" }).png()
    : sharp(inputBuf).resize(size - pad * 2, size - pad * 2, { fit: "contain" }).png();

  const markBuf = await mark.toBuffer();

  const outPath = path.join(outDir, `centifi-icon-${size}.png`);
  await base
    .composite([{ input: markBuf, top: pad, left: pad }])
    .png({ quality: 100 })
    .toFile(outPath);

  return outPath;
}

async function main() {
  console.log(`[generate-icons] input=${input}`);
  console.log(`[generate-icons] outDir=${outDir}`);
  console.log(`[generate-icons] bg=${bg} radius=${radius} sizes=${sizes.join(",")}`);

  const outputs = [];
  for (const s of sizes) outputs.push(await renderOne(s));

  if (writeToProjectRoot) {
    const map = new Map(outputs.map((p) => [Number(p.match(/-(\d+)\.png$/)?.[1] ?? 0), p]));
    const copy = (size, targetName) => {
      const src = map.get(size);
      if (!src) return;
      const dst = path.join(root, "assets", targetName);
      fs.copyFileSync(src, dst);
      console.log(`[generate-icons] wrote ${dst}`);
    };
    copy(48, "favicon-48.png");
    copy(96, "favicon-96.png");
    copy(180, "apple-touch-icon.png");
  }

  console.log(`[generate-icons] done (${outputs.length} files)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});


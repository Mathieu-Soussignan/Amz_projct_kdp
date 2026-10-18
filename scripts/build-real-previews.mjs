import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const BOOKS_DIR = path.join(process.cwd(), "public", "books");

// Exact crop coordinates of the real interior coloring illustrations on each 600px Amazon back cover
const CROP_CONFIG = {
  "automne-cozy": {
    // Center circle: hot chocolate mug with marshmallows & cinnamon stick
    type: "circle",
    extract: { left: 223, top: 162, width: 155, height: 155 },
    label: "Chocolat chaud & Guimauves — Extrait officiel",
  },
  "automne-gourmand": {
    // Top-right square: drip layer cake with autumn roses
    type: "rect",
    extract: { left: 344, top: 73, width: 165, height: 165 },
    label: "Layer Cake d'Automne — Extrait officiel",
  },
  "petits-animaux-automne": {
    // Center circle: cute owl on autumn branch under the stars
    type: "circle",
    extract: { left: 224, top: 192, width: 112, height: 136 },
    label: "Chouette de la Forêt — Extrait officiel",
  },
  "noel-capybaras": {
    // Top-left square: Santa Capybara carrying toy sack
    type: "rect",
    extract: { left: 112, top: 65, width: 155, height: 165 },
    label: "Capybara Père Noël — Extrait officiel",
  },
  "noel-axolotls": {
    // Top-left square: Cozy winter Axolotl with whipped-cream hot cocoa
    type: "rect",
    extract: { left: 53, top: 109, width: 188, height: 188 },
    label: "Axolotl Chocolat Chaud — Extrait officiel",
  },
  "noel-dinosaures": {
    // Left rectangle: Cute Dinosaur with Christmas tree on its back
    type: "rect",
    extract: { left: 92, top: 182, width: 185, height: 245 },
    label: "Dinosaure Sapin de Noël — Extrait officiel",
  },
  "lolo-et-lili": {
    // Right circle: Cute Manta Ray with ocean bubbles
    type: "circle",
    extract: { left: 363, top: 237, width: 168, height: 170 },
    label: "Raie Manta de l'Océan — Extrait officiel",
  },
};

for (const [id, cfg] of Object.entries(CROP_CONFIG)) {
  const rawBackPath = path.join(BOOKS_DIR, `${id}-back-raw.jpg`);
  const out1Path = path.join(BOOKS_DIR, `${id}-1.jpg`);
  const out2Path = path.join(BOOKS_DIR, `${id}-2.jpg`);

  // Ensure <id>-2.jpg is the full official Amazon back cover
  fs.copyFileSync(rawBackPath, out2Path);

  // Extract the real interior illustration from the back cover
  const targetArtSize = 680;
  let artBuffer = await sharp(rawBackPath)
    .extract(cfg.extract)
    .resize(targetArtSize, targetArtSize, {
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    })
    .grayscale()
    .linear(1.25, -20) // Crisp clean black & white line art on pure white paper
    .sharpen({ sigma: 1.1 })
    .png()
    .toBuffer();

  if (cfg.type === "circle") {
    // Apply a clean circular mask so the outer orange/blue ring from the back cover is removed cleanly
    const r = Math.floor(targetArtSize / 2) - 18;
    const c = Math.floor(targetArtSize / 2);
    const circleMask = Buffer.from(
      `<svg width="${targetArtSize}" height="${targetArtSize}">
        <circle cx="${c}" cy="${c}" r="${r}" fill="black" />
      </svg>`
    );
    const whiteBg = await sharp({
      create: {
        width: targetArtSize,
        height: targetArtSize,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      },
    })
      .png()
      .toBuffer();

    const maskedArt = await sharp(artBuffer)
      .composite([{ input: circleMask, blend: "dest-in" }])
      .png()
      .toBuffer();

    artBuffer = await sharp(whiteBg)
      .composite([{ input: maskedArt, top: 0, left: 0 }])
      .png()
      .toBuffer();
  }

  // Place the real extracted coloring illustration onto a 900x900 warm white coloring book page
  const pageFrameSvg = Buffer.from(
    `<svg width="900" height="900" xmlns="http://www.w3.org/2000/svg">
      <rect width="900" height="900" fill="#FFFFFF"/>
      <rect x="44" y="44" width="812" height="812" rx="18" fill="none" stroke="#1E1815" stroke-width="4" stroke-opacity="0.85"/>
      <rect x="56" y="56" width="788" height="788" rx="12" fill="none" stroke="#1E1815" stroke-width="1.2" stroke-opacity="0.25"/>
      <text x="450" y="832" text-anchor="middle" font-family="Georgia, serif" font-size="18" fill="#6E6259" letter-spacing="1.5">
        BY CAROTINE • EXTRAIT D'ILLUSTRATION INTÉRIEURE
      </text>
    </svg>`
  );

  await sharp(pageFrameSvg)
    .composite([
      {
        input: artBuffer,
        top: 96,
        left: 110,
      },
    ])
    .jpeg({ quality: 95 })
    .toFile(out1Path);

  console.log(`Generated authentic interior preview for ${id}`);
}

// Celestial Alignment SVG Animation Generator
// Usage: node animate-alignment-svg.js
// Generates a sequence of SVGs showing shadow changes during alignment

const fs = require('fs');
const path = require('path');
const { generateSVG } = require('./generate-alignment-svg');

// Helper to generate shadow overlays (simple version)
function generateShadowSVG(planets, frame, totalFrames) {
  const width = 900;
  const height = 220;
  const sunX = 80;
  const sunY = height / 2;
  const sunRadius = 36;
  const planetScale = 0.012;
  const distanceScale = 220;
  let svg = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  svg += `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">\n`;
  svg += `  <rect width="100%" height="100%" fill="#0a1020"/>\n`;
  svg += `  <circle cx="${sunX}" cy="${sunY}" r="${sunRadius}" fill="gold" stroke="#fff59d" stroke-width="3"/>\n`;
  svg += `  <text x="${sunX}" y="${sunY - sunRadius - 10}" fill="white" font-size="18" text-anchor="middle">Lumorian Sun</text>\n`;

  // Animate planets moving slightly (simulate orbital motion)
  planets.forEach((planet, i) => {
    const angle = (frame / totalFrames) * Math.PI * 2 + i * 0.2;
    const px = sunX + planet.distance * distanceScale;
    const py = sunY + Math.sin(angle) * 30;
    const pr = Math.max(planet.size * planetScale, 8);
    svg += `  <circle cx="${px}" cy="${py}" r="${pr}" fill="#${(0x8888ff + i*0x2222).toString(16)}" stroke="#fff" stroke-width="2"/>\n`;
    svg += `  <text x="${px}" y="${py + pr + 18}" fill="white" font-size="15" text-anchor="middle">${planet.name}</text>\n`;
    // Draw shadow (simple: a dark arc behind the planet)
    if (i > 0) {
      svg += `  <ellipse cx="${px - pr - 18}" cy="${py}" rx="12" ry="${pr}" fill="#222" opacity="0.5"/>\n`;
    }
  });
  svg += `</svg>\n`;
  return svg;
}

// Generate animation frames
const lumoriaPlanets = [
  { name: "Mercuria", distance: 0.4, size: 4879 },
  { name: "Venusia", distance: 0.7, size: 12104 },
  { name: "Earthia", distance: 1, size: 12742 },
  { name: "Marsia", distance: 1.5, size: 6779 }
];

const totalFrames = 12;
const outDir = path.join(__dirname, 'svg', 'animation');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
for (let frame = 0; frame < totalFrames; frame++) {
  const svg = generateShadowSVG(lumoriaPlanets, frame, totalFrames);
  const outPath = path.join(outDir, `frame${String(frame).padStart(2, '0')}.svg`);
  fs.writeFileSync(outPath, svg);
}
console.log('SVG animation frames saved to', outDir);

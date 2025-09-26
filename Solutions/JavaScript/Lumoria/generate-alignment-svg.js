// Celestial Alignment SVG Generator
// Generates a static SVG of the planetary alignment for Lumoria or any custom system
// Usage: node generate-alignment-svg.js

const fs = require('fs');
const path = require('path');

function generateSVG(planets, options = {}) {
  const width = options.width || 900;
  const height = options.height || 220;
  const sunX = 80;
  const sunY = height / 2;
  const sunRadius = 36;
  const planetScale = 0.012; // scale km to px
  const distanceScale = 220; // AU to px

  let svg = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  svg += `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">\n`;
  svg += `  <rect width="100%" height="100%" fill="#0a1020"/>\n`;
  svg += `  <circle cx="${sunX}" cy="${sunY}" r="${sunRadius}" fill="gold" stroke="#fff59d" stroke-width="3"/>\n`;
  svg += `  <text x="${sunX}" y="${sunY - sunRadius - 10}" fill="white" font-size="18" text-anchor="middle">Lumorian Sun</text>\n`;

  planets.forEach((planet, i) => {
    const px = sunX + planet.distance * distanceScale;
    const py = sunY;
    const pr = Math.max(planet.size * planetScale, 8); // min radius for visibility
    svg += `  <circle cx="${px}" cy="${py}" r="${pr}" fill="#${(0x8888ff + i*0x2222).toString(16)}" stroke="#fff" stroke-width="2"/>\n`;
    svg += `  <text x="${px}" y="${py + pr + 18}" fill="white" font-size="15" text-anchor="middle">${planet.name}</text>\n`;
  });

  svg += `</svg>\n`;
  return svg;
}

// Example usage with default planets
const lumoriaPlanets = [
  { name: "Mercuria", distance: 0.4, size: 4879 },
  { name: "Venusia", distance: 0.7, size: 12104 },
  { name: "Earthia", distance: 1, size: 12742 },
  { name: "Marsia", distance: 1.5, size: 6779 }
];

const svg = generateSVG(lumoriaPlanets);
const outPath = path.join(__dirname, 'svg', 'lumoria-alignment.svg');
fs.writeFileSync(outPath, svg);
console.log('SVG alignment image saved to', outPath);

module.exports = { generateSVG };

// Star System Support Example
// Usage: node custom-star-system.js

const { generateSVG } = require('./generate-alignment-svg');
const { generateReport } = require('./generate-report');
const fs = require('fs');
const path = require('path');

// Example: Custom star system
const andromedaPlanets = [
  { name: "Zyra", distance: 0.3, size: 6000 },
  { name: "Tirion", distance: 0.8, size: 9000 },
  { name: "Vex", distance: 1.2, size: 15000 },
  { name: "Orion", distance: 2.0, size: 11000 }
];

// Generate SVG
const svg = generateSVG(andromedaPlanets, { width: 1000, height: 260 });
const svgPath = path.join(__dirname, 'svg', 'andromeda-alignment.svg');
fs.writeFileSync(svgPath, svg);
console.log('Andromeda SVG saved to', svgPath);

// Generate report
const report = generateReport(andromedaPlanets, 'Andromeda');
const reportPath = path.join(__dirname, 'andromeda-alignment-report.txt');
fs.writeFileSync(reportPath, report);
console.log('Andromeda report saved to', reportPath);

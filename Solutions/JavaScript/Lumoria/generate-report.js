// Celestial Alignment Report Generator
// Usage: node generate-report.js

const { calculateShadows } = require('./scientific-shadow');
const fs = require('fs');
const path = require('path');

function generateReport(planets, systemName = 'Lumoria') {
  const results = calculateShadows(planets);
  let report = `Celestial Alignment Report for ${systemName}\n`;
  report += '==========================================\n';
  results.forEach(r => {
    report += `Planet: ${r.name}\n`;
    report += `  Distance from star: ${r.distance} AU\n`;
    report += `  Diameter: ${r.size} km\n`;
    report += `  Shadow Type: ${r.shadowType}\n`;
    if (r.shadowing.length > 0) {
      report += `  Shadowed by: ${r.shadowing.map(s => s.name).join(', ')}\n`;
    }
    report += '\n';
  });
  return report;
}

// Example usage
const lumoriaPlanets = [
  { name: "Mercuria", distance: 0.4, size: 4879 },
  { name: "Venusia", distance: 0.7, size: 12104 },
  { name: "Earthia", distance: 1, size: 12742 },
  { name: "Marsia", distance: 1.5, size: 6779 }
];

const report = generateReport(lumoriaPlanets);
const outPath = path.join(__dirname, 'lumoria-alignment-report.txt');
fs.writeFileSync(outPath, report);
console.log('Report saved to', outPath);

module.exports = { generateReport };

/**
 * The Celestial Light Intensity System of Lumoria
 * Fantasy-themed console application for calculating planetary light intensity.
 *
 * Author: GitHub Copilot
 * Date: 2025-09-26
 *
 * Usage: node lumoria-light-intensity.js
 */

// -----------------------------
// 1. Planetary Data Definition (with User Input)
// -----------------------------
const readline = require('readline');
const defaultPlanets = [
  { name: 'Mercuria', distance: 0.4, diameter: 4879 },   // AU, km
  { name: 'Venusia',  distance: 0.7, diameter: 12104 },
  { name: 'Earthia',  distance: 1.0, diameter: 12742 },
  { name: 'Marsia',   distance: 1.5, diameter: 6779 }
];

/**
 * Prompt user for planet data. If no input, use default planets.
 * @returns {Promise<Array>} Array of planet objects
 */
function promptPlanets() {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    console.log('\n✨ Would you like to enter custom planet data? (y/N)');
    rl.question('> ', (answer) => {
      if (answer.trim().toLowerCase() !== 'y') {
        rl.close();
        return resolve(defaultPlanets);
      }
      const planets = [];
      function askPlanet(i) {
        rl.question(`\nEnter name for planet #${i+1} (or leave blank to finish): `, (name) => {
          if (!name.trim()) {
            rl.close();
            if (planets.length === 0) {
              console.log('No planets entered. Using default data.');
              return resolve(defaultPlanets);
            }
            return resolve(planets);
          }
          rl.question('  Distance from sun (AU): ', (distance) => {
            const distNum = parseFloat(distance);
            if (isNaN(distNum) || distNum <= 0) {
              console.log('  Invalid distance. Try again.');
              return askPlanet(i);
            }
            rl.question('  Diameter (km): ', (diameter) => {
              const diaNum = parseFloat(diameter);
              if (isNaN(diaNum) || diaNum <= 0) {
                console.log('  Invalid diameter. Try again.');
                return askPlanet(i);
              }
              planets.push({ name: name.trim(), distance: distNum, diameter: diaNum });
              askPlanet(i+1);
            });
          });
        });
      }
      askPlanet(0);
    });
  });
}

// -----------------------------
// 2. Shadow Rule Definitions
// -----------------------------
const ShadowType = {
  FULL:    'Full',
  PARTIAL: 'Partial',
  NONE:    'None',
  MULTI:   'None (Multiple Shadows)'
};

// -----------------------------
// 3. Light Intensity Calculation
// -----------------------------
/**
 * For each planet, determine the number of larger/smaller planets closer to the sun.
 * Apply shadow rules:
 *   - Full: At least one larger planet is closer to the sun
 *   - Partial: At least one smaller planet is closer to the sun
 *   - None: No planets closer to the sun
 *   - None (Multiple Shadows): More than one planet (any size) is closer to the sun
 * @param {Array} sortedPlanets - Planets sorted by distance from the sun
 * @returns {Array} - Array of results with shadow type for each planet
 */
function calculateLightIntensities(sortedPlanets) {
  return sortedPlanets.map((planet, idx) => {
    const closer = sortedPlanets.slice(0, idx);
    const largerCloser = closer.filter(p => p.diameter > planet.diameter);
    const smallerCloser = closer.filter(p => p.diameter < planet.diameter);
    let shadow;
    if (closer.length > 1) {
      shadow = ShadowType.MULTI;
    } else if (largerCloser.length > 0) {
      shadow = ShadowType.FULL;
    } else if (smallerCloser.length > 0) {
      shadow = ShadowType.PARTIAL;
    } else {
      shadow = ShadowType.NONE;
    }
    return {
      ...planet,
      shadow,
      closerCount: closer.length,
      largerCloserCount: largerCloser.length,
      smallerCloserCount: smallerCloser.length
    };
  });
}

// -----------------------------
// 4. Beautiful Celestial Output
// -----------------------------
function printCelestialResults(results) {
  const border = '🌌' + '═'.repeat(48) + '🌌';
  console.log('\n' + border);
  console.log('🌟  The Celestial Light Intensity of Lumoria  🌟');
  console.log(border);
  results.forEach(r => {
    console.log(`\n🪐  Planet: ${r.name}`);
    console.log(`   Distance from Sun: ${r.distance} AU`);
    console.log(`   Diameter: ${r.diameter} km`);
    console.log(`   Planets Closer: ${r.closerCount}`);
    if (r.closerCount > 0) {
      console.log(`     - Larger: ${r.largerCloserCount}, Smaller: ${r.smallerCloserCount}`);
    }
    let shadowIcon = '';
    switch (r.shadow) {
      case ShadowType.FULL: shadowIcon = '🌑'; break;
      case ShadowType.PARTIAL: shadowIcon = '🌓'; break;
      case ShadowType.NONE: shadowIcon = '🌕'; break;
      case ShadowType.MULTI: shadowIcon = '🌚'; break;
    }
    console.log(`   Light Intensity: ${shadowIcon}  ${r.shadow}`);
  });
  console.log('\n' + border + '\n');
}

// -----------------------------
// 5. Main Execution
// -----------------------------

async function main() {
  try {
    const planets = await promptPlanets();
    // Sort planets by distance from the sun (ascending)
    const sorted = [...planets].sort((a, b) => a.distance - b.distance);
    const results = calculateLightIntensities(sorted);
    printCelestialResults(results);
  } catch (err) {
    console.error('✨ Astral Error:', err.message);
  }
}

main();

// -----------------------------
// 6. Exports for Testing
// -----------------------------
module.exports = { planets, calculateLightIntensities, ShadowType };

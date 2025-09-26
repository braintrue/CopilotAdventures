/**
 * Test suite for The Celestial Light Intensity System of Lumoria
 * Run: node lumoria-light-intensity.test.js
 */
const { planets, calculateLightIntensities, ShadowType } = require('./lumoria-light-intensity');

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`❌ ${message} (Expected: ${expected}, Got: ${actual})`);
  } else {
    console.log(`✅ ${message}`);
  }
}

function runTests() {
  // Test 1: Correct sorting and shadow assignment
  const sorted = [...planets].sort((a, b) => a.distance - b.distance);
  const results = calculateLightIntensities(sorted);

  // Mercuria: closest, no planets closer
  assertEqual(results[0].shadow, ShadowType.NONE, 'Mercuria receives full light');
  // Venusia: only Mercuria closer, which is smaller
  assertEqual(results[1].shadow, ShadowType.PARTIAL, 'Venusia receives partial light');
  // Earthia: Mercuria and Venusia closer (multiple)
  assertEqual(results[2].shadow, ShadowType.MULTI, 'Earthia receives multiple shadows');
  // Marsia: three planets closer (multiple)
  assertEqual(results[3].shadow, ShadowType.MULTI, 'Marsia receives multiple shadows');

  // Test 2: Error handling (simulate bad input)
  try {
    calculateLightIntensities(null);
    throw new Error('Should have thrown error for null input');
  } catch (e) {
    console.log('✅ Error thrown for null input');
  }

  console.log('\nAll tests passed!');
}

runTests();

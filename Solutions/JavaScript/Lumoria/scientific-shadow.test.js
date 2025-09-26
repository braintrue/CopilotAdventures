// Unit tests for scientific shadow calculation
const { calculateShadows } = require('./scientific-shadow');

function assertEqual(actual, expected, msg) {
  if (actual !== expected) throw new Error(`❌ ${msg} (Expected: ${expected}, Got: ${actual})`);
  else console.log(`✅ ${msg}`);
}

function testLumoria() {
  const planets = [
    { name: "Mercuria", distance: 0.4, size: 4879 },
    { name: "Venusia", distance: 0.7, size: 12104 },
    { name: "Earthia", distance: 1, size: 12742 },
    { name: "Marsia", distance: 1.5, size: 6779 }
  ];
  const results = calculateShadows(planets);
  assertEqual(results[0].shadowType, 'Full', 'Mercuria receives full light');
  assertEqual(results[1].shadowType, 'Partial', 'Venusia receives partial light');
  assertEqual(results[2].shadowType, 'None (Multiple Shadows)', 'Earthia receives multiple shadows');
  assertEqual(results[3].shadowType, 'None (Multiple Shadows)', 'Marsia receives multiple shadows');
}

testLumoria();
console.log('All scientific shadow tests passed!');

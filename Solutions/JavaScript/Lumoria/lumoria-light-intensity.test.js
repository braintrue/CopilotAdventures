#!/usr/bin/env node

/**
 * 🧪 Unit Tests for Lumoria Light Intensity System
 * 
 * Comprehensive test suite for the enhanced Lumoria celestial alignment system.
 * Tests core functionality, edge cases, and integration between modules.
 */

// Import modules to test
const lumoriaSystem = require('./lumoria-light-intensity');

/**
 * Simple assertion helper
 */
function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`❌ ${message}
    Expected: ${expected}
    Got: ${actual}`);
  }
  console.log(`✅ ${message}`);
}

/**
 * Array assertion helper
 */
function assertArrayEqual(actual, expected, message) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`❌ ${message}
    Expected: ${JSON.stringify(expected)}
    Got: ${JSON.stringify(actual)}`);
  }
  console.log(`✅ ${message}`);
}

/**
 * Test basic shadow count calculations
 */
function testShadowCount() {
  console.log('\n🧪 Testing shadow count calculations...');
  
  const testPlanets = [
    { name: "Small", distance: 0.4, size: 4879 },
    { name: "Medium", distance: 0.7, size: 8000 },
    { name: "Large", distance: 1.0, size: 12742 },
    { name: "Smaller", distance: 1.5, size: 6000 }  // This planet should have shadows from Large
  ];
  
  // Test first planet (no shadows)
  assertEqual(lumoriaSystem.getShadowCount(testPlanets, 0), 0, 'First planet should have no shadows');
  
  // Test second planet (no larger planets in front)
  assertEqual(lumoriaSystem.getShadowCount(testPlanets, 1), 0, 'Second planet has no larger planets in front');
  
  // Test third planet (Large) - no larger planets in front (Small=4879, Medium=8000 both < Large=12742)
  assertEqual(lumoriaSystem.getShadowCount(testPlanets, 2), 0, 'Large planet should have 0 shadows (no larger planets in front)');
  
  // Test fourth planet (Smaller) - should have shadows from Medium and Large (both larger than 6000)
  const shadowCount = lumoriaSystem.getShadowCount(testPlanets, 3);
  assertEqual(shadowCount, 2, 'Smaller planet should have 2 shadows from Medium and Large planets');
  
  console.log('✅ All shadow count tests passed!');
}

/**
 * Test light intensity calculations
 */
function testLightIntensity() {
  console.log('\n🧪 Testing light intensity calculations...');
  
  const testPlanets = [
    { name: "Mercury", distance: 0.4, size: 4879 },
    { name: "Venus", distance: 0.7, size: 12104 },
    { name: "Earth", distance: 1.0, size: 12742 },
    { name: "Mars", distance: 1.5, size: 6779 }
  ];
  
  // Test first planet
  assertEqual(
    lumoriaSystem.getLightIntensity(0, 0, testPlanets, 0), 
    'Full', 
    'First planet should have full light'
  );
  
  // Test planet with no shadows but smaller planets in front
  assertEqual(
    lumoriaSystem.getLightIntensity(1, 0, testPlanets, 1), 
    'Partial', 
    'Planet with smaller planets in front should have partial light'
  );
  
  // Test planet with one shadow
  assertEqual(
    lumoriaSystem.getLightIntensity(2, 1, testPlanets, 2), 
    'None', 
    'Planet with one shadow should have no light'
  );
  
  // Test planet with multiple shadows
  assertEqual(
    lumoriaSystem.getLightIntensity(3, 2, testPlanets, 3), 
    'None (Multiple Shadows)', 
    'Planet with multiple shadows should have no light (multiple shadows)'
  );
  
  console.log('✅ All light intensity tests passed!');
}

/**
 * Test complete system calculation with default Lumoria planets
 */
function testLumoriaPlanets() {
  console.log('\n🧪 Testing complete Lumoria system...');
  
  const results = lumoriaSystem.calculateLightIntensity([...lumoriaSystem.defaultLumoriaPlanets]);
  
  // Should have 4 planets
  assertEqual(results.length, 4, 'Should have 4 planets in results');
  
  // Test specific expected results
  const mercuria = results.find(p => p.name === 'Mercuria');
  const venusia = results.find(p => p.name === 'Venusia');
  const earthia = results.find(p => p.name === 'Earthia');
  const marsia = results.find(p => p.name === 'Marsia');
  
  assertEqual(mercuria.light, 'Full', 'Mercuria should receive full light');
  assertEqual(venusia.light, 'Partial', 'Venusia should receive partial light');
  assertEqual(earthia.light, 'Partial', 'Earthia should receive partial light');
  assertEqual(marsia.light, 'None (Multiple Shadows)', 'Marsia should have multiple shadows');
  
  console.log('✅ All Lumoria system tests passed!');
}

/**
 * Test edge cases
 */
function testEdgeCases() {
  console.log('\n🧪 Testing edge cases...');
  
  // Test single planet
  const singlePlanet = [{ name: "Lonely", distance: 1.0, size: 10000 }];
  const singleResult = lumoriaSystem.calculateLightIntensity(singlePlanet);
  assertEqual(singleResult.length, 1, 'Single planet system should return one result');
  assertEqual(singleResult[0].light, 'Full', 'Single planet should have full light');
  
  // Test planets with identical sizes
  const identicalSizes = [
    { name: "Twin1", distance: 0.5, size: 10000 },
    { name: "Twin2", distance: 1.0, size: 10000 }
  ];
  const twinResults = lumoriaSystem.calculateLightIntensity(identicalSizes);
  assertEqual(twinResults[0].light, 'Full', 'First twin should have full light');
  assertEqual(twinResults[1].light, 'Partial', 'Second twin should have partial light (equal size planet in front)');
  
  // Test very small and very large planets
  const extremeSizes = [
    { name: "Tiny", distance: 0.5, size: 100 },
    { name: "Giant", distance: 1.0, size: 100000 }
  ];
  const extremeResults = lumoriaSystem.calculateLightIntensity(extremeSizes);
  assertEqual(extremeResults[0].light, 'Full', 'Tiny planet should have full light');
  assertEqual(extremeResults[1].light, 'Partial', 'Giant planet should have partial light');
  
  console.log('✅ All edge case tests passed!');
}

/**
 * Test data validation and error handling
 */
function testDataValidation() {
  console.log('\n🧪 Testing data validation...');
  
  try {
    // Test with empty array
    const emptyResult = lumoriaSystem.calculateLightIntensity([]);
    assertEqual(emptyResult.length, 0, 'Empty planet array should return empty results');
    
    // Test with valid data
    const validPlanets = [
      { name: "Test1", distance: 0.5, size: 5000 },
      { name: "Test2", distance: 1.0, size: 8000 }
    ];
    const validResult = lumoriaSystem.calculateLightIntensity(validPlanets);
    assertEqual(validResult.length, 2, 'Valid data should return correct number of results');
    
    console.log('✅ All data validation tests passed!');
  } catch (error) {
    console.log(`❌ Data validation test failed: ${error.message}`);
  }
}

/**
 * Test performance with larger datasets
 */
function testPerformance() {
  console.log('\n🧪 Testing performance with larger datasets...');
  
  // Generate 10 planets
  const largePlanetSet = [];
  for (let i = 1; i <= 10; i++) {
    largePlanetSet.push({
      name: `Planet${i}`,
      distance: i * 0.5,
      size: 5000 + (i * 1000)
    });
  }
  
  const startTime = Date.now();
  const largeResult = lumoriaSystem.calculateLightIntensity(largePlanetSet);
  const endTime = Date.now();
  
  assertEqual(largeResult.length, 10, 'Large dataset should return correct number of results');
  
  const executionTime = endTime - startTime;
  console.log(`✅ Performance test passed (${executionTime}ms for 10 planets)`);
  
  if (executionTime > 1000) {
    console.log(`⚠️ Warning: Execution time seems high (${executionTime}ms)`);
  }
}

/**
 * Test sorting behavior
 */
function testSorting() {
  console.log('\n🧪 Testing planet sorting...');
  
  const unsortedPlanets = [
    { name: "Far", distance: 2.0, size: 6000 },
    { name: "Near", distance: 0.3, size: 4000 },
    { name: "Middle", distance: 1.0, size: 8000 }
  ];
  
  const results = lumoriaSystem.calculateLightIntensity(unsortedPlanets);
  
  // Results should be sorted by distance
  assertEqual(results[0].name, 'Near', 'First result should be nearest planet');
  assertEqual(results[1].name, 'Middle', 'Second result should be middle planet');
  assertEqual(results[2].name, 'Far', 'Third result should be farthest planet');
  
  // Verify distances are in ascending order
  for (let i = 1; i < results.length; i++) {
    if (results[i].distance < results[i-1].distance) {
      throw new Error(`❌ Results not properly sorted by distance`);
    }
  }
  
  console.log('✅ All sorting tests passed!');
}

/**
 * Run all tests
 */
function runAllTests() {
  console.log('🌌 Starting Lumoria Light Intensity System Tests 🌌\n');
  
  try {
    testShadowCount();
    testLightIntensity();
    testLumoriaPlanets();
    testEdgeCases();
    testDataValidation();
    testPerformance();
    testSorting();
    
    console.log('\n🎉 All tests passed successfully! 🎉');
    console.log('✨ The Lumoria Light Intensity System is working correctly! ✨\n');
    
    return true;
  } catch (error) {
    console.error(`\n💥 Test failed: ${error.message}\n`);
    return false;
  }
}

// Export for use in other test files
module.exports = {
  assertEqual,
  assertArrayEqual,
  testShadowCount,
  testLightIntensity,
  testLumoriaPlanets,
  testEdgeCases,
  testDataValidation,
  testPerformance,
  testSorting,
  runAllTests
};

// Run tests if this file is executed directly
if (require.main === module) {
  const success = runAllTests();
  process.exit(success ? 0 : 1);
}
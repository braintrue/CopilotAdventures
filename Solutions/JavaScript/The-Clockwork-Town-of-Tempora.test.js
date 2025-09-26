// Test script for The-Clockwork-Town-of-Tempora.js
// Run: node The-Clockwork-Town-of-Tempora.test.js

const { parseTimeToMinutes, calculateMinuteDifference } = require('./The-Clockwork-Town-of-Tempora');

function assertEqual(actual, expected, message) {
    if (actual !== expected) {
        throw new Error(`Assertion failed: ${message} (expected ${expected}, got ${actual})`);
    }
}

// --- Tests for parseTimeToMinutes ---
try {
    assertEqual(parseTimeToMinutes('00:00'), 0, 'Midnight');
    assertEqual(parseTimeToMinutes('15:00'), 900, '3 PM');
    assertEqual(parseTimeToMinutes('23:59'), 1439, 'One minute before midnight');
    let errorCaught = false;
    try { parseTimeToMinutes('24:00'); } catch { errorCaught = true; }
    assertEqual(errorCaught, true, 'Invalid hour');
    errorCaught = false;
    try { parseTimeToMinutes('12:60'); } catch { errorCaught = true; }
    assertEqual(errorCaught, true, 'Invalid minute');
    errorCaught = false;
    try { parseTimeToMinutes('bad'); } catch { errorCaught = true; }
    assertEqual(errorCaught, true, 'Completely invalid');
    console.log('parseTimeToMinutes tests passed.');
} catch (err) {
    console.error(err.message);
}

// --- Tests for calculateMinuteDifference ---
try {
    assertEqual(calculateMinuteDifference('14:45', '15:00'), -15, 'Clock 1 behind');
    assertEqual(calculateMinuteDifference('15:05', '15:00'), 5, 'Clock 2 ahead');
    assertEqual(calculateMinuteDifference('15:00', '15:00'), 0, 'Clock 3 synchronized');
    assertEqual(calculateMinuteDifference('14:40', '15:00'), -20, 'Clock 4 behind');
    let result = calculateMinuteDifference('bad', '15:00');
    assertEqual(result, null, 'Invalid input returns null');
    console.log('calculateMinuteDifference tests passed.');
} catch (err) {
    console.error(err.message);
}

console.log('All tests completed.');

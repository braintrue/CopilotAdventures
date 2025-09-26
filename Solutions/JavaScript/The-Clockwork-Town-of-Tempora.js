
// The Clockwork Town of Tempora - Clock Synchronization System
// Fantasy adventure coding challenge for CopilotAdventures
//
// This script synchronizes four village clocks with the Grand Clock Tower.
// Author: GitHub Copilot (Agent Mode)
//
// Usage: node The-Clockwork-Town-of-Tempora.js

/**
 * Parses a time string in HH:MM format and returns the total minutes since midnight.
 * @param {string} timeStr - Time string in 'HH:MM' format.
 * @returns {number} Total minutes since midnight.
 * @throws {Error} If the format is invalid.
 */
function parseTimeToMinutes(timeStr) {
    const match = /^([01]?\d|2[0-3]):([0-5]\d)$/.exec(timeStr);
    if (!match) {
        throw new Error(`Invalid time format: ${timeStr}`);
    }
    const [, hour, minute] = match;
    return parseInt(hour, 10) * 60 + parseInt(minute, 10);
}

/**
 * Calculates the difference in minutes between two times.
 * @param {string} clockTime - The village clock time (HH:MM).
 * @param {string} grandClockTime - The Grand Clock Tower time (HH:MM).
 * @returns {number} Minutes difference (positive = ahead, negative = behind).
 */
function calculateMinuteDifference(clockTime, grandClockTime) {
    try {
        const clockMinutes = parseTimeToMinutes(clockTime);
        const grandMinutes = parseTimeToMinutes(grandClockTime);
        return clockMinutes - grandMinutes;
    } catch (err) {
        console.error(err.message);
        return null;
    }
}

// --- Main Adventure Logic ---
const grandClockTime = '15:00';
const villageClocks = ['14:45', '15:05', '15:00', '14:40'];

console.log('=== The Clockwork Town of Tempora ===');
console.log(`Grand Clock Tower Time: ${grandClockTime}`);
console.log('Village Clocks:');
villageClocks.forEach((clock, idx) => {
    const diff = calculateMinuteDifference(clock, grandClockTime);
    if (diff === null) {
        console.log(`  Clock ${idx + 1}: Invalid time format (${clock})`);
    } else {
        const status = diff > 0 ? 'ahead' : diff < 0 ? 'behind' : 'synchronized';
        const sign = diff > 0 ? '+' : '';
        console.log(`  Clock ${idx + 1}: ${clock} (${sign}${diff} min ${status})`);
    }
});

// --- End of Adventure ---

// For testing: Export functions if required
if (typeof module !== 'undefined') {
    module.exports = { parseTimeToMinutes, calculateMinuteDifference };
}

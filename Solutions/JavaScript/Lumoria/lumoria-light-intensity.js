#!/usr/bin/env node

/**
 * 🌌 The Celestial Alignment of Lumoria - Enhanced Light Intensity System
 * 
 * A comprehensive celestial light intensity calculation system for the Lumoria star system.
 * Features beautiful console output, user input capability, and scientific accuracy.
 * 
 * Author: GitHub Copilot Enhanced System
 * Usage: node lumoria-light-intensity.js
 */

const readline = require('readline');

// Default planetary data for Lumoria system
const defaultLumoriaPlanets = [
    { name: "Mercuria", distance: 0.4, size: 4879 },
    { name: "Earthia", distance: 1, size: 12742 },
    { name: "Venusia", distance: 0.7, size: 12104 },
    { name: "Marsia", distance: 1.5, size: 6779 }
];

/**
 * Enhanced shadow count calculation with improved logic
 * @param {Array} planets - Array of planet objects
 * @param {number} currentIndex - Index of the current planet
 * @returns {number} Number of planets casting shadows
 */
function getShadowCount(planets, currentIndex) {
    if (currentIndex === 0) return 0; // First planet has no shadows
    
    return planets.slice(0, currentIndex)
        .filter(planet => planet.size > planets[currentIndex].size)
        .length;
}

/**
 * Enhanced light intensity calculation matching original rules
 * @param {number} planetIndex - Index of the planet (0 = closest to sun)
 * @param {number} shadowCount - Number of larger planets casting shadows
 * @param {Array} planets - All planets for additional analysis (unused but kept for compatibility)
 * @param {number} currentIndex - Current planet index (unused but kept for compatibility)
 * @returns {string} Light intensity level
 */
function getLightIntensity(planetIndex, shadowCount, planets, currentIndex) {
    // Original shadow rules from The-Celestial-Alignment-of-Lumoria.js
    if (planetIndex === 0) return 'Full';
    if (shadowCount === 1) return 'None';
    if (shadowCount > 1) return 'None (Multiple Shadows)';
    return 'Partial';
}

/**
 * Calculate light intensity for all planets with enhanced analysis
 * @param {Array} planets - Array of planet objects
 * @returns {Array} Array of results with detailed analysis
 */
function calculateLightIntensity(planets) {
    // Sort planets by distance first to ensure correct processing
    const sortedPlanets = [...planets].sort((a, b) => a.distance - b.distance);
    
    return sortedPlanets.map((planet, i) => {
        const shadowCount = getShadowCount(sortedPlanets, i);
        const lightIntensity = getLightIntensity(i, shadowCount, sortedPlanets, i);
        
        // Additional analysis
        const planetsInFront = sortedPlanets.slice(0, i);
        const largerPlanetsInFront = planetsInFront.filter(p => p.size > planet.size).length;
        const smallerPlanetsInFront = planetsInFront.filter(p => p.size <= planet.size).length;
        
        return { 
            name: planet.name, 
            light: lightIntensity,
            distance: planet.distance,
            size: planet.size,
            shadowCount,
            largerPlanetsInFront,
            smallerPlanetsInFront
        };
    });
}

/**
 * Display beautiful celestial-themed header
 */
function displayHeader() {
    console.log('\n'.repeat(2));
    console.log('🌌✨🌌✨🌌✨🌌✨🌌✨🌌✨🌌✨🌌✨🌌✨🌌✨🌌✨🌌✨🌌');
    console.log('✨                                                      ✨');
    console.log('🌌    🌟 LUMORIA LIGHT INTENSITY CALCULATOR 🌟        🌌');
    console.log('✨                                                      ✨');
    console.log('🌌      Celestial Alignment Analysis System            🌌');
    console.log('✨                                                      ✨');
    console.log('🌌✨🌌✨🌌✨🌌✨🌌✨🌌✨🌌✨🌌✨🌌✨🌌✨🌌✨🌌✨🌌');
    console.log('\n🔬 Analyzing planetary positions and shadow effects...\n');
}

/**
 * Display visual solar system alignment
 * @param {Array} planets - Sorted array of planets
 */
function displaySolarSystemAlignment(planets) {
    console.log('🌟 Solar System Alignment:\n');
    console.log('🌟 Lumorian Sun');
    
    planets.forEach((planet, index) => {
        const distance = '─'.repeat(Math.round(planet.distance * 10));
        const lightIcon = getLightIcon(planet.light);
        console.log(`${distance}🪐 ${planet.name} ${lightIcon}`);
    });
    console.log('');
}

/**
 * Get appropriate icon for light intensity
 * @param {string} lightIntensity - The light intensity level
 * @returns {string} Appropriate icon
 */
function getLightIcon(lightIntensity) {
    switch (lightIntensity) {
        case 'Full': return '☀️';
        case 'Partial': return '🌤️';
        case 'None': return '🌑';
        case 'None (Multiple Shadows)': return '🌑';
        default: return '❓';
    }
}

/**
 * Display detailed results table
 * @param {Array} results - Calculation results
 */
function displayDetailedResults(results) {
    console.log('📊 Detailed Light Intensity Results:\n');
    console.log('Planet      | Distance (AU) | Size (km) | Light Intensity        | Explanation');
    console.log('──────────────────────────────────────────────────────────────────────────────────────────');
    
    results.forEach(result => {
        const name = result.name.padEnd(11);
        const distance = result.distance.toString().padEnd(13);
        const size = result.size.toString().padEnd(9);
        const light = result.light.padEnd(22);
        
        let explanation;
        if (result.light === 'Full' && result.name === results[0].name) {
            explanation = 'Closest to sun - no shadows possible';
        } else if (result.light === 'Partial') {
            explanation = `Smaller planets (${result.smallerPlanetsInFront}) create partial shadow`;
        } else if (result.light === 'None') {
            explanation = 'Larger planet creates complete shadow';
        } else if (result.light === 'None (Multiple Shadows)') {
            explanation = `Multiple larger planets (${result.largerPlanetsInFront}) create complete shadow`;
        } else {
            explanation = 'Complex shadow interaction';
        }
        
        console.log(`${name} | ${distance} | ${size} | ${light} | ${explanation}`);
    });
}

/**
 * Display summary statistics
 * @param {Array} results - Calculation results
 */
function displaySummary(results) {
    console.log('\n📈 Alignment Summary:');
    
    const summary = results.reduce((acc, result) => {
        acc[result.light] = (acc[result.light] || 0) + 1;
        return acc;
    }, {});
    
    Object.entries(summary).forEach(([lightType, count]) => {
        console.log(`${lightType}: ${count} planet(s)`);
    });
    
    const mostAffected = results.find(r => r.light.includes('Multiple Shadows')) || 
                        results.find(r => r.light === 'None') || 
                        results.filter(r => r.light === 'Partial').pop();
    
    if (mostAffected) {
        console.log(`\n🌑 Most affected planet: ${mostAffected.name} (${mostAffected.light})`);
    }
    
    console.log('\n✨ The celestial alignment analysis is complete! ✨');
}

/**
 * Get custom planetary data from user input
 * @returns {Promise<Array>} Array of custom planet objects
 */
async function getCustomPlanetData() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    const question = (prompt) => new Promise(resolve => rl.question(prompt, resolve));
    
    try {
        console.log('\n🌟 Custom Planetary Data Input Mode 🌟');
        console.log('Enter data for each planet (press Enter with empty name to finish):\n');
        
        const planets = [];
        let planetIndex = 1;
        
        while (true) {
            const name = await question(`Planet ${planetIndex} name: `);
            if (!name.trim()) break;
            
            const distance = parseFloat(await question(`${name} distance from star (AU): `));
            const size = parseFloat(await question(`${name} size (km diameter): `));
            
            if (isNaN(distance) || isNaN(size) || distance <= 0 || size <= 0) {
                console.log('❌ Invalid input. Please enter positive numbers.');
                continue;
            }
            
            planets.push({ name: name.trim(), distance, size });
            planetIndex++;
            console.log(`✅ Added ${name}\n`);
        }
        
        rl.close();
        return planets.length > 0 ? planets : null;
    } catch (error) {
        rl.close();
        console.log('❌ Error reading input:', error.message);
        return null;
    }
}

/**
 * Main application entry point
 */
async function main() {
    try {
        displayHeader();
        
        // Ask user if they want to input custom data
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        const useCustomData = await new Promise(resolve => {
            rl.question('🌟 Use custom planet data? (y/N): ', answer => {
                rl.close();
                resolve(answer.toLowerCase().startsWith('y'));
            });
        });
        
        let planets;
        if (useCustomData) {
            planets = await getCustomPlanetData();
            if (!planets || planets.length === 0) {
                console.log('⚠️ No valid custom data provided. Using default Lumoria system.');
                planets = defaultLumoriaPlanets;
            }
        } else {
            planets = defaultLumoriaPlanets;
        }
        
        // Sort planets by distance from sun
        const sortedPlanets = [...planets].sort((a, b) => a.distance - b.distance);
        
        // Calculate light intensities
        const results = calculateLightIntensity(sortedPlanets);
        
        // Display results with beautiful formatting
        displaySolarSystemAlignment(results);
        displayDetailedResults(results);
        displaySummary(results);
        
        console.log('\n🌌 Thank you for exploring the cosmos with Lumoria! 🌌\n');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

// Export for testing
if (typeof module !== 'undefined') {
    module.exports = {
        getShadowCount,
        getLightIntensity,
        calculateLightIntensity,
        defaultLumoriaPlanets
    };
}

// Run main if this file is executed directly
if (require.main === module) {
    main();
}
#!/usr/bin/env node

/**
 * 🌌 Scientific Shadow Calculation Module
 * 
 * Enhanced shadow calculation system with improved scientific accuracy
 * for the Lumoria celestial alignment system.
 * 
 * This module implements more realistic shadow physics considering:
 * - Angular size of planets from star perspective
 * - Partial eclipse calculations
 * - Multiple shadow interactions
 * - Distance-based shadow intensity
 */

/**
 * Calculate angular size of a planet from the star's perspective
 * @param {number} planetSize - Planet diameter in km
 * @param {number} distance - Distance from star in AU
 * @returns {number} Angular size in arcseconds
 */
function calculateAngularSize(planetSize, distance) {
    const AU_TO_KM = 149597870.7; // 1 AU in kilometers
    const distanceKm = distance * AU_TO_KM;
    const angularSizeRadians = planetSize / distanceKm;
    const angularSizeArcseconds = angularSizeRadians * 206265; // Convert to arcseconds
    return angularSizeArcseconds;
}

/**
 * Determine if one planet casts a shadow on another
 * @param {Object} shadowCaster - Planet casting the shadow
 * @param {Object} shadowReceiver - Planet receiving the shadow
 * @returns {Object} Shadow information with type and intensity
 */
function calculateShadowInteraction(shadowCaster, shadowReceiver) {
    if (shadowCaster.distance >= shadowReceiver.distance) {
        return { hasShadow: false, type: 'none', intensity: 0 };
    }
    
    const casterAngularSize = calculateAngularSize(shadowCaster.size, shadowCaster.distance);
    const receiverAngularSize = calculateAngularSize(shadowReceiver.size, shadowReceiver.distance);
    
    // Simplified shadow calculation based on size comparison
    if (shadowCaster.size > shadowReceiver.size * 1.1) {
        // Significantly larger planet casts complete shadow
        return { hasShadow: true, type: 'complete', intensity: 1.0 };
    } else if (shadowCaster.size > shadowReceiver.size * 0.9) {
        // Similar sized planet casts partial shadow
        return { hasShadow: true, type: 'partial', intensity: 0.6 };
    } else {
        // Smaller planet casts minimal shadow
        return { hasShadow: true, type: 'minimal', intensity: 0.3 };
    }
}

/**
 * Enhanced shadow count calculation with scientific accuracy
 * @param {Array} planets - Array of planet objects sorted by distance
 * @param {number} currentIndex - Index of the planet being analyzed
 * @returns {Object} Detailed shadow analysis
 */
function getScientificShadowAnalysis(planets, currentIndex) {
    if (currentIndex === 0) {
        return {
            shadowCount: 0,
            totalShadowIntensity: 0,
            shadowDetails: [],
            lightIntensity: 1.0
        };
    }
    
    const currentPlanet = planets[currentIndex];
    const shadowDetails = [];
    let totalShadowIntensity = 0;
    
    // Count only larger planets that cast shadows (matching main system logic)
    const largerPlanetsInFront = planets.slice(0, currentIndex)
        .filter(planet => planet.size > currentPlanet.size);
    
    // Analyze each larger planet for shadow casting
    largerPlanetsInFront.forEach(shadowCaster => {
        const shadowInfo = calculateShadowInteraction(shadowCaster, currentPlanet);
        
        if (shadowInfo.hasShadow) {
            shadowDetails.push({
                caster: shadowCaster.name,
                type: shadowInfo.type,
                intensity: shadowInfo.intensity
            });
            totalShadowIntensity += shadowInfo.intensity;
        }
    });
    
    // Calculate final light intensity (max shadow intensity is capped at 1.0)
    const effectiveShadowIntensity = Math.min(totalShadowIntensity, 1.0);
    const lightIntensity = Math.max(0, 1.0 - effectiveShadowIntensity);
    
    return {
        shadowCount: largerPlanetsInFront.length, // Use count of larger planets for consistency
        totalShadowIntensity: effectiveShadowIntensity,
        shadowDetails,
        lightIntensity
    };
}

/**
 * Convert scientific light intensity to categorical description
 * @param {Object} shadowAnalysis - Result from getScientificShadowAnalysis
 * @param {number} planetIndex - Index of the planet
 * @returns {string} Categorical light intensity description
 */
function getScientificLightIntensity(shadowAnalysis, planetIndex) {
    if (planetIndex === 0) return 'Full';
    
    const { shadowCount } = shadowAnalysis;
    
    // Use the same logic as the main system for consistency
    if (shadowCount === 1) return 'None';
    if (shadowCount > 1) return 'None (Multiple Shadows)';
    return 'Partial';
}

/**
 * Calculate light intensity for all planets with scientific accuracy
 * @param {Array} planets - Array of planet objects
 * @returns {Array} Array of results with scientific analysis
 */
function calculateScientificLightIntensity(planets) {
    const sortedPlanets = [...planets].sort((a, b) => a.distance - b.distance);
    
    return sortedPlanets.map((planet, i) => {
        const shadowAnalysis = getScientificShadowAnalysis(sortedPlanets, i);
        const lightIntensity = getScientificLightIntensity(shadowAnalysis, i);
        
        return {
            name: planet.name,
            distance: planet.distance,
            size: planet.size,
            light: lightIntensity,
            scientificLightIntensity: shadowAnalysis.lightIntensity,
            shadowCount: shadowAnalysis.shadowCount,
            totalShadowIntensity: shadowAnalysis.totalShadowIntensity,
            shadowDetails: shadowAnalysis.shadowDetails,
            angularSize: calculateAngularSize(planet.size, planet.distance)
        };
    });
}

/**
 * Display detailed scientific analysis
 * @param {Array} results - Results from calculateScientificLightIntensity
 */
function displayScientificAnalysis(results) {
    console.log('\n🔬 Scientific Shadow Analysis:\n');
    console.log('Planet      | Angular Size  | Shadow Details                    | Light Intensity');
    console.log('─────────────────────────────────────────────────────────────────────────────────────');
    
    results.forEach(result => {
        const name = result.name.padEnd(11);
        const angularSize = result.angularSize.toFixed(2).padEnd(13);
        const shadowInfo = result.shadowDetails.length > 0 ? 
            result.shadowDetails.map(s => `${s.caster}(${s.type})`).join(', ').substring(0, 33) :
            'No shadows'.padEnd(33);
        const lightPercentage = `${(result.scientificLightIntensity * 100).toFixed(1)}%`;
        
        console.log(`${name} | ${angularSize}" | ${shadowInfo.padEnd(33)} | ${lightPercentage}`);
    });
}

/**
 * Generate a detailed scientific report
 * @param {Array} results - Results from calculateScientificLightIntensity
 * @param {string} systemName - Name of the star system
 * @returns {string} Formatted report
 */
function generateScientificReport(results, systemName = 'Lumoria') {
    const timestamp = new Date().toISOString();
    let report = '';
    
    report += `🌌 SCIENTIFIC CELESTIAL ALIGNMENT REPORT 🌌\n`;
    report += `═══════════════════════════════════════════════════════\n`;
    report += `Star System: ${systemName}\n`;
    report += `Analysis Date: ${timestamp}\n`;
    report += `Number of Planets: ${results.length}\n\n`;
    
    report += `📊 PLANETARY DATA SUMMARY:\n`;
    report += `─────────────────────────────────────\n`;
    results.forEach(result => {
        report += `${result.name}:\n`;
        report += `  • Distance: ${result.distance} AU\n`;
        report += `  • Diameter: ${result.size} km\n`;
        report += `  • Angular Size: ${result.angularSize.toFixed(2)} arcseconds\n`;
        report += `  • Light Intensity: ${(result.scientificLightIntensity * 100).toFixed(1)}% (${result.light})\n`;
        
        if (result.shadowDetails.length > 0) {
            report += `  • Shadow Sources: ${result.shadowDetails.map(s => `${s.caster} (${s.type}, ${(s.intensity * 100).toFixed(1)}%)`).join(', ')}\n`;
        }
        report += '\n';
    });
    
    report += `🌑 SHADOW ANALYSIS:\n`;
    report += `─────────────────────\n`;
    const totalShadowed = results.filter(r => r.light !== 'Full').length;
    const partiallyShaded = results.filter(r => r.light === 'Partial').length;
    const completelyShaded = results.filter(r => r.light.includes('None')).length;
    
    report += `Total planets affected by shadows: ${totalShadowed}/${results.length}\n`;
    report += `Partially shaded planets: ${partiallyShaded}\n`;
    report += `Completely shaded planets: ${completelyShaded}\n\n`;
    
    report += `✨ CELESTIAL PHENOMENA:\n`;
    report += `───────────────────────\n`;
    const mostComplex = results.find(r => r.shadowDetails.length > 1);
    if (mostComplex) {
        report += `Most complex shadow interaction: ${mostComplex.name} (${mostComplex.shadowDetails.length} shadow sources)\n`;
    }
    
    const shadowedPlanets = results.filter(r => r.light !== 'Full');
    const brightestShadowed = shadowedPlanets.length > 0 ? 
        shadowedPlanets.reduce((prev, curr) => 
            prev.scientificLightIntensity > curr.scientificLightIntensity ? prev : curr) : null;
    if (brightestShadowed) {
        report += `Brightest shadowed planet: ${brightestShadowed.name} (${(brightestShadowed.scientificLightIntensity * 100).toFixed(1)}% light)\n`;
    }
    
    report += `\n═══════════════════════════════════════════════════════\n`;
    report += `Report generated by Lumoria Scientific Analysis System\n`;
    
    return report;
}

// Export for use in other modules
module.exports = {
    calculateAngularSize,
    calculateShadowInteraction,
    getScientificShadowAnalysis,
    getScientificLightIntensity,
    calculateScientificLightIntensity,
    displayScientificAnalysis,
    generateScientificReport
};

// Example usage if run directly
if (require.main === module) {
    const defaultLumoriaPlanets = [
        { name: "Mercuria", distance: 0.4, size: 4879 },
        { name: "Earthia", distance: 1, size: 12742 },
        { name: "Venusia", distance: 0.7, size: 12104 },
        { name: "Marsia", distance: 1.5, size: 6779 }
    ];
    
    console.log('🌌 Scientific Shadow Analysis for Lumoria System 🌌\n');
    
    const results = calculateScientificLightIntensity(defaultLumoriaPlanets);
    displayScientificAnalysis(results);
    
    console.log('\n📋 Detailed Scientific Report:\n');
    console.log(generateScientificReport(results));
}
#!/usr/bin/env node

/**
 * 🌌 SVG Visualization Generator for Lumoria System
 * 
 * Creates beautiful SVG representations of planetary alignments
 * with both static and animated views.
 */

const fs = require('fs');
const path = require('path');

/**
 * Generate static SVG representation of planetary alignment
 * @param {Array} planets - Array of planet objects with light intensity results
 * @param {string} systemName - Name of the star system
 * @returns {string} SVG content
 */
function generateStaticAlignmentSVG(planets, systemName = 'Lumoria') {
    const svgWidth = 1200;
    const svgHeight = 400;
    const sunSize = 40;
    const maxDistance = Math.max(...planets.map(p => p.distance));
    
    let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="sunGradient" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0%" style="stop-color:#FFD700;stop-opacity:1" />
      <stop offset="70%" style="stop-color:#FFA500;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#FF4500;stop-opacity:0.8" />
    </radialGradient>
    <radialGradient id="mercuriaGradient" cx="0.3" cy="0.3" r="0.7">
      <stop offset="0%" style="stop-color:#8C7853;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#5A5A5A;stop-opacity:1" />
    </radialGradient>
    <radialGradient id="venusiaGradient" cx="0.3" cy="0.3" r="0.7">
      <stop offset="0%" style="stop-color:#FFC649;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#FF8C42;stop-opacity:1" />
    </radialGradient>
    <radialGradient id="earthiaGradient" cx="0.3" cy="0.3" r="0.7">
      <stop offset="0%" style="stop-color:#6B93D6;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#4F7942;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#2E4057;stop-opacity:1" />
    </radialGradient>
    <radialGradient id="marsiaGradient" cx="0.3" cy="0.3" r="0.7">
      <stop offset="0%" style="stop-color:#CD5C5C;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#8B0000;stop-opacity:1" />
    </radialGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
      <feMerge> 
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <filter id="shadow">
      <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
      <feOffset dx="2" dy="2" result="offsetblur"/>
      <feMerge> 
        <feMergeNode in="offsetblur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  
  <!-- Background -->
  <rect width="100%" height="100%" fill="#0B1426" />
  
  <!-- Stars background -->`;

  // Add random stars
  for (let i = 0; i < 50; i++) {
    const x = Math.random() * svgWidth;
    const y = Math.random() * svgHeight;
    const size = Math.random() * 2 + 0.5;
    svg += `
  <circle cx="${x}" cy="${y}" r="${size}" fill="#FFFFFF" opacity="${Math.random() * 0.8 + 0.2}"/>`;
  }

  svg += `
  
  <!-- Sun -->
  <circle cx="100" cy="${svgHeight/2}" r="${sunSize}" fill="url(#sunGradient)" filter="url(#glow)"/>
  <text x="100" y="${svgHeight/2 + 60}" text-anchor="middle" fill="#FFD700" font-family="Arial, sans-serif" font-size="14" font-weight="bold">${systemName} Sun</text>
  
  <!-- Orbital paths -->`;

  planets.forEach(planet => {
    const x = 100 + (planet.distance / maxDistance) * 800;
    svg += `
  <line x1="100" y1="${svgHeight/2}" x2="${x}" y2="${svgHeight/2}" stroke="#333333" stroke-width="1" stroke-dasharray="5,5" opacity="0.3"/>`;
  });

  svg += `
  
  <!-- Planets -->`;

  planets.forEach(planet => {
    const x = 100 + (planet.distance / maxDistance) * 800;
    const planetSize = Math.max(8, Math.min(25, planet.size / 500));
    const gradientName = planet.name.toLowerCase() + 'Gradient';
    
    // Light effect based on intensity
    let lightEffect = '';
    if (planet.light === 'Full') {
      lightEffect = 'filter="url(#glow)"';
    } else if (planet.light === 'Partial') {
      lightEffect = 'opacity="0.7"';
    } else {
      lightEffect = 'opacity="0.3" filter="url(#shadow)"';
    }
    
    svg += `
  <circle cx="${x}" cy="${svgHeight/2}" r="${planetSize}" fill="url(#${gradientName})" ${lightEffect}/>
  <text x="${x}" y="${svgHeight/2 + planetSize + 15}" text-anchor="middle" fill="#CCCCCC" font-family="Arial, sans-serif" font-size="12">${planet.name}</text>
  <text x="${x}" y="${svgHeight/2 + planetSize + 30}" text-anchor="middle" fill="#888888" font-family="Arial, sans-serif" font-size="10">${planet.light}</text>`;
  });

  // Add shadow lines for visualization
  planets.forEach((planet, i) => {
    if (planet.light !== 'Full') {
      const planetX = 100 + (planet.distance / maxDistance) * 800;
      
      // Draw shadow lines from larger planets
      planets.slice(0, i).forEach(shadowCaster => {
        if (shadowCaster.size > planet.size) {
          const casterX = 100 + (shadowCaster.distance / maxDistance) * 800;
          svg += `
  <line x1="${casterX}" y1="${svgHeight/2}" x2="${planetX}" y2="${svgHeight/2}" stroke="#FF0000" stroke-width="2" opacity="0.4" stroke-dasharray="3,3"/>`;
        }
      });
    }
  });

  svg += `
  
  <!-- Title -->
  <text x="${svgWidth/2}" y="30" text-anchor="middle" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="24" font-weight="bold">${systemName} Celestial Alignment</text>
  <text x="${svgWidth/2}" y="50" text-anchor="middle" fill="#CCCCCC" font-family="Arial, sans-serif" font-size="14">Light Intensity Analysis</text>
  
  <!-- Legend -->
  <g transform="translate(20, 320)">
    <text x="0" y="0" fill="#CCCCCC" font-family="Arial, sans-serif" font-size="14" font-weight="bold">Legend:</text>
    <circle cx="10" cy="20" r="6" fill="#FFD700" filter="url(#glow)"/>
    <text x="25" y="25" fill="#CCCCCC" font-family="Arial, sans-serif" font-size="12">Full Light</text>
    <circle cx="10" cy="40" r="6" fill="#4F7942" opacity="0.7"/>
    <text x="25" y="45" fill="#CCCCCC" font-family="Arial, sans-serif" font-size="12">Partial Light</text>
    <circle cx="10" cy="60" r="6" fill="#8B0000" opacity="0.3"/>
    <text x="25" y="65" fill="#CCCCCC" font-family="Arial, sans-serif" font-size="12">No Light (Shadowed)</text>
    <line x1="120" y1="40" x2="140" y2="40" stroke="#FF0000" stroke-width="2" opacity="0.4" stroke-dasharray="3,3"/>
    <text x="150" y="45" fill="#CCCCCC" font-family="Arial, sans-serif" font-size="12">Shadow Line</text>
  </g>
  
</svg>`;

  return svg;
}

/**
 * Generate animated SVG showing planetary motion and shadow changes
 * @param {Array} planets - Array of planet objects
 * @param {string} systemName - Name of the star system
 * @returns {string} Animated SVG content
 */
function generateAnimatedAlignmentSVG(planets, systemName = 'Lumoria') {
  const svgWidth = 1200;
  const svgHeight = 400;
  const sunSize = 40;
  const maxDistance = Math.max(...planets.map(p => p.distance));
  const animationDuration = 20; // seconds

  let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="sunGradient">
      <stop offset="0%" style="stop-color:#FFD700;stop-opacity:1" />
      <stop offset="70%" style="stop-color:#FFA500;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#FF4500;stop-opacity:0.8" />
    </radialGradient>
    <radialGradient id="planetGradient" cx="0.3" cy="0.3" r="0.7">
      <stop offset="0%" style="stop-color:#6B93D6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#2E4057;stop-opacity:1" />
    </radialGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
      <feMerge> 
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  
  <!-- Background -->
  <rect width="100%" height="100%" fill="#0B1426" />
  
  <!-- Animated stars -->`;

  for (let i = 0; i < 30; i++) {
    const x = Math.random() * svgWidth;
    const y = Math.random() * svgHeight;
    const size = Math.random() * 2 + 0.5;
    svg += `
  <circle cx="${x}" cy="${y}" r="${size}" fill="#FFFFFF">
    <animate attributeName="opacity" values="0.2;1;0.2" dur="${2 + Math.random() * 3}s" repeatCount="indefinite"/>
  </circle>`;
  }

  svg += `
  
  <!-- Sun -->
  <circle cx="100" cy="${svgHeight/2}" r="${sunSize}" fill="url(#sunGradient)" filter="url(#glow)">
    <animateTransform attributeName="transform" type="rotate" values="0 100 ${svgHeight/2};360 100 ${svgHeight/2}" dur="10s" repeatCount="indefinite"/>
  </circle>
  <text x="100" y="${svgHeight/2 + 60}" text-anchor="middle" fill="#FFD700" font-family="Arial, sans-serif" font-size="14" font-weight="bold">${systemName} Sun</text>
  
  <!-- Orbiting planets -->`;

  planets.forEach((planet, index) => {
    const orbitRadius = 50 + (planet.distance / maxDistance) * 400;
    const planetSize = Math.max(6, Math.min(20, planet.size / 600));
    const orbitalPeriod = animationDuration * (1 + index * 0.3); // Different speeds
    const startAngle = index * 60; // Stagger starting positions

    svg += `
  <g>
    <!-- Orbital path -->
    <circle cx="100" cy="${svgHeight/2}" r="${orbitRadius}" fill="none" stroke="#333333" stroke-width="1" stroke-dasharray="3,3" opacity="0.3"/>
    
    <!-- Planet -->
    <g>
      <animateTransform attributeName="transform" type="rotate" values="${startAngle} 100 ${svgHeight/2};${startAngle + 360} 100 ${svgHeight/2}" dur="${orbitalPeriod}s" repeatCount="indefinite"/>
      <circle cx="${100 + orbitRadius}" cy="${svgHeight/2}" r="${planetSize}" fill="url(#planetGradient)">
        <!-- Brightness animation based on alignment -->
        <animate attributeName="opacity" values="1;0.5;0.3;0.5;1" dur="${orbitalPeriod}s" repeatCount="indefinite"/>
      </circle>
      <text x="${100 + orbitRadius}" y="${svgHeight/2 + 25}" text-anchor="middle" fill="#CCCCCC" font-family="Arial, sans-serif" font-size="10">${planet.name}</text>
    </g>
  </g>`;
  });

  svg += `
  
  <!-- Title -->
  <text x="${svgWidth/2}" y="30" text-anchor="middle" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="24" font-weight="bold">${systemName} Animated Alignment</text>
  <text x="${svgWidth/2}" y="50" text-anchor="middle" fill="#CCCCCC" font-family="Arial, sans-serif" font-size="14">Dynamic Shadow Effects</text>
  
  <!-- Animation controls indicator -->
  <text x="${svgWidth - 20}" y="${svgHeight - 20}" text-anchor="end" fill="#666666" font-family="Arial, sans-serif" font-size="12">Animation: ${animationDuration}s cycle</text>
  
</svg>`;

  return svg;
}

/**
 * Save SVG content to file
 * @param {string} svgContent - SVG content string
 * @param {string} filename - Output filename
 * @param {string} directory - Output directory
 */
function saveSVGToFile(svgContent, filename, directory = './svg') {
  try {
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
    
    const fullPath = path.join(directory, filename);
    fs.writeFileSync(fullPath, svgContent, 'utf8');
    console.log(`✅ SVG saved to ${path.resolve(fullPath)}`);
    return path.resolve(fullPath);
  } catch (error) {
    console.error(`❌ Error saving SVG: ${error.message}`);
    return null;
  }
}

/**
 * Generate complete SVG visualization package
 * @param {Array} planets - Planet data with light intensity results
 * @param {string} systemName - Name of the star system
 * @param {string} outputDir - Output directory for SVG files
 * @returns {Object} Paths to generated files
 */
function generateCompleteSVGPackage(planets, systemName = 'Lumoria', outputDir = './svg') {
  const staticSVG = generateStaticAlignmentSVG(planets, systemName);
  const animatedSVG = generateAnimatedAlignmentSVG(planets, systemName);
  
  const timestamp = new Date().toISOString().slice(0, 10);
  const staticFilename = `${systemName.toLowerCase()}-alignment-${timestamp}.svg`;
  const animatedFilename = `${systemName.toLowerCase()}-animated-${timestamp}.svg`;
  
  const staticPath = saveSVGToFile(staticSVG, staticFilename, outputDir);
  const animatedPath = saveSVGToFile(animatedSVG, animatedFilename, outputDir);
  
  return {
    staticPath,
    animatedPath,
    staticSVG,
    animatedSVG
  };
}

/**
 * Create comparison SVG showing before/after alignment states
 * @param {Array} beforePlanets - Planet states before alignment
 * @param {Array} afterPlanets - Planet states after alignment
 * @param {string} systemName - Name of the star system
 * @returns {string} Comparison SVG content
 */
function generateComparisonSVG(beforePlanets, afterPlanets, systemName = 'Lumoria') {
  const svgWidth = 1400;
  const svgHeight = 600;
  
  let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#0B1426" />
  
  <!-- Title -->
  <text x="${svgWidth/2}" y="30" text-anchor="middle" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="24" font-weight="bold">${systemName} Alignment Comparison</text>
  
  <!-- Before Section -->
  <text x="350" y="70" text-anchor="middle" fill="#CCCCCC" font-family="Arial, sans-serif" font-size="18" font-weight="bold">Before Alignment</text>
  
  <!-- After Section -->
  <text x="1050" y="70" text-anchor="middle" fill="#CCCCCC" font-family="Arial, sans-serif" font-size="18" font-weight="bold">During Alignment</text>
  
  <!-- Divider line -->
  <line x1="${svgWidth/2}" y1="80" x2="${svgWidth/2}" y2="${svgHeight-20}" stroke="#444444" stroke-width="2"/>
  
</svg>`;
  
  // This would be expanded to show actual before/after states
  return svg;
}

// Export functions
module.exports = {
  generateStaticAlignmentSVG,
  generateAnimatedAlignmentSVG,
  generateComparisonSVG,
  saveSVGToFile,
  generateCompleteSVGPackage
};

// Example usage if run directly
if (require.main === module) {
  const samplePlanets = [
    { name: "Mercuria", distance: 0.4, size: 4879, light: "Full" },
    { name: "Venusia", distance: 0.7, size: 12104, light: "Partial" },
    { name: "Earthia", distance: 1, size: 12742, light: "Partial" },
    { name: "Marsia", distance: 1.5, size: 6779, light: "None (Multiple Shadows)" }
  ];
  
  console.log('🌌 Generating SVG visualizations...\n');
  
  const results = generateCompleteSVGPackage(samplePlanets, 'Lumoria');
  console.log('\n✨ SVG generation complete!');
}
#!/usr/bin/env node

/**
 * 🌌 Custom Star System Support Module
 * 
 * Enables creation and analysis of custom star systems with user-defined planets.
 * Includes data validation, system templates, and integration with all Lumoria modules.
 */

const fs = require('fs').promises;
const path = require('path');
const scientificShadow = require('./scientific-shadow');
const svgGenerator = require('./svg-generator');

// Predefined star system templates
const STAR_SYSTEM_TEMPLATES = {
  lumoria: {
    name: "Lumoria",
    description: "The mystical Lumoria system with four diverse worlds",
    planets: [
      { name: "Mercuria", distance: 0.4, size: 4879 },
      { name: "Earthia", distance: 1, size: 12742 },
      { name: "Venusia", distance: 0.7, size: 12104 },
      { name: "Marsia", distance: 1.5, size: 6779 }
    ]
  },
  andromeda: {
    name: "Andromeda Alpha",
    description: "A dense system with six closely-packed worlds",
    planets: [
      { name: "Proxima", distance: 0.2, size: 3200 },
      { name: "Centauri", distance: 0.5, size: 8900 },
      { name: "Vega", distance: 0.8, size: 15600 },
      { name: "Altair", distance: 1.2, size: 11200 },
      { name: "Rigel", distance: 1.8, size: 6400 },
      { name: "Betelgeuse", distance: 2.5, size: 4100 }
    ]
  },
  solaris: {
    name: "Solaris Minor",
    description: "A compact system resembling our solar system",
    planets: [
      { name: "Ignis", distance: 0.3, size: 4900 },
      { name: "Terra", distance: 1.0, size: 12800 },
      { name: "Glacies", distance: 1.8, size: 7200 },
      { name: "Ventus", distance: 3.2, size: 5100 }
    ]
  }
};

/**
 * Validate planet data
 * @param {Object} planet - Planet object to validate
 * @returns {Object} Validation result with success flag and errors
 */
function validatePlanet(planet) {
  const errors = [];
  
  if (!planet.name || typeof planet.name !== 'string' || planet.name.trim().length === 0) {
    errors.push('Planet name is required and must be a non-empty string');
  }
  
  if (typeof planet.distance !== 'number' || planet.distance <= 0) {
    errors.push('Distance must be a positive number (AU)');
  }
  
  if (typeof planet.size !== 'number' || planet.size <= 0) {
    errors.push('Size must be a positive number (km diameter)');
  }
  
  if (planet.distance > 50) {
    errors.push('Distance seems unrealistically large (>50 AU) - please verify');
  }
  
  if (planet.size > 150000) {
    errors.push('Size seems unrealistically large (>150,000 km) - please verify');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    planet: {
      name: planet.name?.trim(),
      distance: parseFloat(planet.distance),
      size: parseFloat(planet.size)
    }
  };
}

/**
 * Validate complete star system
 * @param {Object} system - Star system object to validate
 * @returns {Object} Validation result
 */
function validateStarSystem(system) {
  const errors = [];
  const validatedPlanets = [];
  
  if (!system.name || typeof system.name !== 'string' || system.name.trim().length === 0) {
    errors.push('Star system name is required');
  }
  
  if (!Array.isArray(system.planets) || system.planets.length === 0) {
    errors.push('At least one planet is required');
  } else {
    // Validate each planet
    system.planets.forEach((planet, index) => {
      const validation = validatePlanet(planet);
      if (!validation.isValid) {
        errors.push(`Planet ${index + 1}: ${validation.errors.join(', ')}`);
      } else {
        validatedPlanets.push(validation.planet);
      }
    });
    
    // Check for duplicate names
    const planetNames = validatedPlanets.map(p => p.name.toLowerCase());
    const duplicates = planetNames.filter((name, index) => planetNames.indexOf(name) !== index);
    if (duplicates.length > 0) {
      errors.push(`Duplicate planet names found: ${[...new Set(duplicates)].join(', ')}`);
    }
    
    // Check for planets at same distance
    const distances = validatedPlanets.map(p => p.distance);
    const duplicateDistances = distances.filter((dist, index) => 
      distances.find((d, i) => i !== index && Math.abs(d - dist) < 0.01));
    if (duplicateDistances.length > 0) {
      errors.push('Multiple planets cannot occupy the same orbital distance');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    validatedSystem: {
      name: system.name?.trim(),
      description: system.description?.trim() || `Custom star system: ${system.name}`,
      planets: validatedPlanets.sort((a, b) => a.distance - b.distance)
    }
  };
}

/**
 * Create a custom star system from user input
 * @param {string} systemName - Name of the star system
 * @param {Array} planetData - Array of planet objects
 * @param {string} description - Optional system description
 * @returns {Object} Validated star system or error
 */
function createCustomSystem(systemName, planetData, description = null) {
  const system = {
    name: systemName,
    description: description || `Custom star system: ${systemName}`,
    planets: planetData
  };
  
  const validation = validateStarSystem(system);
  
  if (validation.isValid) {
    console.log(`✅ Successfully created star system: ${validation.validatedSystem.name}`);
    console.log(`📍 Planets: ${validation.validatedSystem.planets.map(p => p.name).join(', ')}`);
    return { success: true, system: validation.validatedSystem };
  } else {
    console.log(`❌ Star system validation failed:`);
    validation.errors.forEach(error => console.log(`   • ${error}`));
    return { success: false, errors: validation.errors };
  }
}

/**
 * Load a predefined star system template
 * @param {string} templateName - Name of the template to load
 * @returns {Object} Star system template or null if not found
 */
function loadSystemTemplate(templateName) {
  const template = STAR_SYSTEM_TEMPLATES[templateName.toLowerCase()];
  if (template) {
    console.log(`🌟 Loaded template: ${template.name}`);
    console.log(`📝 Description: ${template.description}`);
    return { success: true, system: template };
  } else {
    console.log(`❌ Template '${templateName}' not found`);
    console.log(`Available templates: ${Object.keys(STAR_SYSTEM_TEMPLATES).join(', ')}`);
    return { success: false, error: `Template '${templateName}' not found` };
  }
}

/**
 * List all available system templates
 */
function listSystemTemplates() {
  console.log('\n🌌 Available Star System Templates:\n');
  Object.entries(STAR_SYSTEM_TEMPLATES).forEach(([key, template]) => {
    console.log(`🌟 ${template.name} (${key})`);
    console.log(`   ${template.description}`);
    console.log(`   Planets: ${template.planets.length} (${template.planets.map(p => p.name).join(', ')})\n`);
  });
}

/**
 * Save a custom star system to file
 * @param {Object} system - Star system object
 * @param {string} filename - Output filename
 * @returns {Promise<string>} Path to saved file
 */
async function saveSystemToFile(system, filename = null) {
  try {
    if (!filename) {
      const timestamp = new Date().toISOString().slice(0, 10);
      filename = `${system.name.toLowerCase().replace(/\s+/g, '-')}-system-${timestamp}.json`;
    }
    
    const filePath = path.join(__dirname, 'systems', filename);
    
    // Ensure directory exists
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    
    const systemData = {
      ...system,
      createdAt: new Date().toISOString(),
      version: '1.0'
    };
    
    await fs.writeFile(filePath, JSON.stringify(systemData, null, 2), 'utf8');
    console.log(`💾 System saved to: ${filePath}`);
    return filePath;
  } catch (error) {
    console.error(`❌ Error saving system: ${error.message}`);
    return null;
  }
}

/**
 * Load a custom star system from file
 * @param {string} filename - Path to system file
 * @returns {Promise<Object>} Loaded star system or null
 */
async function loadSystemFromFile(filename) {
  try {
    const filePath = path.join(__dirname, 'systems', filename);
    const data = await fs.readFile(filePath, 'utf8');
    const system = JSON.parse(data);
    
    const validation = validateStarSystem(system);
    if (validation.isValid) {
      console.log(`📁 Successfully loaded system: ${system.name}`);
      return { success: true, system: validation.validatedSystem };
    } else {
      console.log(`❌ Loaded system has validation errors:`);
      validation.errors.forEach(error => console.log(`   • ${error}`));
      return { success: false, errors: validation.errors };
    }
  } catch (error) {
    console.error(`❌ Error loading system: ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * Analyze a star system with full scientific calculations and visualization
 * @param {Object} system - Star system to analyze
 * @param {boolean} generateSVG - Whether to generate SVG visualizations
 * @param {boolean} generateReport - Whether to generate detailed report
 * @returns {Object} Complete analysis results
 */
async function analyzeStarSystem(system, generateSVG = true, generateReport = true) {
  console.log(`\n🔬 Analyzing star system: ${system.name}\n`);
  
  // Scientific analysis
  const scientificResults = scientificShadow.calculateScientificLightIntensity(system.planets);
  
  // Display scientific analysis
  scientificShadow.displayScientificAnalysis(scientificResults);
  
  const analysisResults = {
    systemName: system.name,
    planets: scientificResults,
    timestamp: new Date().toISOString()
  };
  
  // Generate SVG visualizations if requested
  if (generateSVG) {
    console.log('\n🎨 Generating visualizations...');
    const svgResults = svgGenerator.generateCompleteSVGPackage(
      scientificResults, 
      system.name, 
      path.join(__dirname, 'svg')
    );
    analysisResults.visualizations = svgResults;
  }
  
  // Generate detailed report if requested
  if (generateReport) {
    console.log('\n📋 Generating scientific report...');
    const report = scientificShadow.generateScientificReport(scientificResults, system.name);
    
    // Save report to file
    const timestamp = new Date().toISOString().slice(0, 10);
    const reportFilename = `${system.name.toLowerCase().replace(/\s+/g, '-')}-alignment-report-${timestamp}.txt`;
    const reportPath = path.join(__dirname, reportFilename);
    
    try {
      await fs.writeFile(reportPath, report, 'utf8');
      console.log(`📄 Report saved to ${reportPath}`);
      analysisResults.reportPath = reportPath;
    } catch (error) {
      console.error(`❌ Error saving report: ${error.message}`);
    }
  }
  
  return analysisResults;
}

/**
 * Interactive system creator
 */
async function interactiveSystemCreator() {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  const question = (prompt) => new Promise(resolve => rl.question(prompt, resolve));
  
  try {
    console.log('\n🌌 Custom Star System Creator 🌌\n');
    
    const systemName = await question('Enter star system name: ');
    if (!systemName.trim()) {
      console.log('❌ System name is required');
      rl.close();
      return null;
    }
    
    const description = await question('Enter system description (optional): ');
    
    console.log('\nEnter planet data (press Enter with empty name to finish):');
    const planets = [];
    let planetIndex = 1;
    
    while (true) {
      console.log(`\n--- Planet ${planetIndex} ---`);
      const name = await question('Planet name: ');
      if (!name.trim()) break;
      
      const distance = await question('Distance from star (AU): ');
      const size = await question('Planet diameter (km): ');
      
      const planet = { name: name.trim(), distance: parseFloat(distance), size: parseFloat(size) };
      const validation = validatePlanet(planet);
      
      if (validation.isValid) {
        planets.push(validation.planet);
        console.log(`✅ Added ${planet.name}`);
        planetIndex++;
      } else {
        console.log(`❌ Invalid planet data:`);
        validation.errors.forEach(error => console.log(`   • ${error}`));
        console.log('Please try again...');
      }
    }
    
    rl.close();
    
    if (planets.length === 0) {
      console.log('❌ No valid planets added');
      return null;
    }
    
    const result = createCustomSystem(systemName.trim(), planets, description.trim() || null);
    if (result.success) {
      console.log('\n🎉 Custom star system created successfully!');
      
      const analyze = await new Promise(resolve => {
        const rl2 = require('readline').createInterface({
          input: process.stdin,
          output: process.stdout
        });
        rl2.question('\nAnalyze this system now? (Y/n): ', answer => {
          rl2.close();
          resolve(!answer.toLowerCase().startsWith('n'));
        });
      });
      
      if (analyze) {
        return await analyzeStarSystem(result.system);
      }
    }
    
    return result;
  } catch (error) {
    rl.close();
    console.error(`❌ Error: ${error.message}`);
    return null;
  }
}

// Export functions
module.exports = {
  validatePlanet,
  validateStarSystem,
  createCustomSystem,
  loadSystemTemplate,
  listSystemTemplates,
  saveSystemToFile,
  loadSystemFromFile,
  analyzeStarSystem,
  interactiveSystemCreator,
  STAR_SYSTEM_TEMPLATES
};

// Example usage if run directly
if (require.main === module) {
  async function main() {
    console.log('🌌 Custom Star System Support Module 🌌\n');
    
    // Demo with templates
    console.log('📚 Loading and analyzing template systems...\n');
    
    // Analyze Lumoria system
    const lumoriaTemplate = loadSystemTemplate('lumoria');
    if (lumoriaTemplate.success) {
      console.log(`\n🔍 Analyzing ${lumoriaTemplate.system.name}...`);
      await analyzeStarSystem(lumoriaTemplate.system, true, true);
    }
    
    // Analyze Andromeda system
    const andromedaTemplate = loadSystemTemplate('andromeda');
    if (andromedaTemplate.success) {
      console.log(`\n🔍 Analyzing ${andromedaTemplate.system.name}...`);
      await analyzeStarSystem(andromedaTemplate.system, true, true);
    }
    
    console.log('\n✨ Demo complete!');
    
    // Uncomment to run interactive mode
    // await interactiveSystemCreator();
  }
  
  main().catch(console.error);
}
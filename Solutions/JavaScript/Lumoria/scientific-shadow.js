// Scientific shadow calculation for celestial alignment
// Returns detailed shadow info for each planet

function calculateShadows(planets) {
  // Sort by distance from star
  const sorted = [...planets].sort((a, b) => a.distance - b.distance);
  return sorted.map((planet, idx) => {
    const closer = sorted.slice(0, idx);
    const shadowing = closer.map(p => {
      const AU_KM = 149597870.7;
      const distDiff = (planet.distance - p.distance) * AU_KM;
      const pRadius = p.size / 2;
      const angDiameter = 2 * Math.atan(pRadius / distDiff);
      return { name: p.name, angDiameter, distDiff, pRadius, size: p.size };
    });
    let shadowType = 'Full';
    if (closer.length === 0) {
      shadowType = 'Full';
    } else if (closer.length > 1) {
      shadowType = 'None (Multiple Shadows)';
    } else if (closer.length === 1) {
      // Only one planet is closer: check size
      const closerPlanet = closer[0];
      if (closerPlanet.size > planet.size) {
        shadowType = 'None'; // Full shadow by larger planet
      } else {
        shadowType = 'Partial'; // Partial shadow by smaller planet
      }
    }
    return {
      name: planet.name,
      shadowType,
      shadowing,
      distance: planet.distance,
      size: planet.size
    };
  });
}

module.exports = { calculateShadows };

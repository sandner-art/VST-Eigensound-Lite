/**
 * Calculates the vertices of a regular polygon.
 * @param sides - The number of sides of the polygon.
 * @param radius - The distance from the center to each vertex.
 * @param centerX - The x-coordinate of the center.
 * @param centerY - The y-coordinate of the center.
 * @returns An array of Point objects representing the vertices.
 */
export const getPolygonVertices = (sides, radius, centerX, centerY) => {
  const points = [];
  const angleStep = (2 * Math.PI) / sides;
  
  for (let i = 0; i < sides; i++) {
    // Start from the top point
    const angle = i * angleStep - Math.PI / 2;
    points.push({
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    });
  }
  return points;
};

/**
 * Reorders vertices of a regular polygon to form a star polygon path.
 * @param vertices - The array of vertices for the regular polygon.
 * @param sides - The number of sides.
 * @returns A new array of Point objects reordered for a star path.
 */
export const reorderVerticesForStar = (vertices, sides) => {
    // Meaningful stars can be drawn for shapes with 5 or more sides.
    if (sides < 5) return vertices;
    
    const starVertices = [];
    // A common method for creating a single-stroke star polygon (n-gram)
    const skip = sides % 2 === 0 ? sides / 2 - 1 : Math.floor(sides / 2);

    if (skip < 2) return vertices; // Avoid degenerate shapes

    let index = 0;
    const visited = new Set();
    for (let i = 0; i < sides; i++) {
        if(visited.has(index)) break; // Avoid incomplete loops for certain side/skip combos
        visited.add(index);
        starVertices.push(vertices[index]);
        index = (index + skip) % sides;
    }
    return starVertices.length === sides ? starVertices : vertices;
};


/**
 * Calculates the total length of a path defined by a series of points.
 * @param vertices - An array of Point objects.
 * @returns The total length of the path.
 */
export const getPathLength = (vertices) => {
  let length = 0;
  for (let i = 0; i < vertices.length; i++) {
    const p1 = vertices[i];
    const p2 = vertices[(i + 1) % vertices.length];
    length += Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  }
  return length;
};

/**
 * Finds the coordinates of a point at a specific distance along a path.
 * @param vertices - The vertices of the path.
 * @param distance - The distance from the start of the path.
 * @returns The Point on the path.
 */
export const getPointOnPath = (vertices, distance) => {
  if (vertices.length === 0) return { x: 0, y: 0 };
  if (distance < 0) distance = 0;

  let traveledDistance = 0;
  for (let i = 0; i < vertices.length; i++) {
    const p1 = vertices[i];
    const p2 = vertices[(i + 1) % vertices.length];
    const segmentLength = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));

    if (traveledDistance + segmentLength >= distance) {
      const remainingDistance = distance - traveledDistance;
      const fraction = segmentLength === 0 ? 0 : remainingDistance / segmentLength;
      return {
        x: p1.x + (p2.x - p1.x) * fraction,
        y: p1.y + (p2.y - p1.y) * fraction,
      };
    }
    traveledDistance += segmentLength;
  }
  
  // Fallback to the last vertex if distance exceeds total length
  return vertices[vertices.length - 1];
};

/**
 * Converts an array of vertices into an SVG path data string.
 * @param vertices - An array of Point objects.
 * @returns An SVG path data string.
 */
export const verticesToPathData = (vertices) => {
  if (vertices.length === 0) return '';
  const pathParts = vertices.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`);
  return `${pathParts.join(' ')} Z`;
};

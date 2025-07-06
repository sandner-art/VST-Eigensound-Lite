// js/vendor/math-wrapper.js

// Import the entire math.js library from the CDN.
// This uses a special type of import for libraries that don't have a default export.
import * as math from 'https://cdnjs.cloudflare.com/ajax/libs/mathjs/11.11.2/math.min.js';

// Now, export the 'math' object so our other modules can import it directly.
export default math;
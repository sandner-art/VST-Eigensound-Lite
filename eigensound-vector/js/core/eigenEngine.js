// --- EigenEngine Module ---
// A pure-math module responsible for performing eigen-decomposition.

import math from '../vendor/math-wrapper.js'; // <-- ADD THIS LINE

export class EigenEngine {
    // ... rest of the file is the same as before ...
    constructor() {
        console.log("EigenEngine ready.");
        this.lastResult = null;
    }

    /**
     * Calculates the eigenvalues and eigenvectors of a given matrix.
     * @param {object} matrix - A math.js matrix object.
     * @returns {object|null} An object { values, vectors } or null on error.
     */
    calculate(matrix) {
        try {
            // This is the core mathematical operation of the entire application.
            const eigensystem = math.eigs(matrix);
            
            this.lastResult = {
                values: eigensystem.values.toArray(),   // Array of eigenvalues
                vectors: eigensystem.vectors.toArray(), // Array of eigenvectors (as columns)
            };
            return this.lastResult;
        } catch (error) {
            console.error("Eigen-decomposition failed:", error);
            // This can happen if the algorithm doesn't converge.
            return null;
        }
    }
}
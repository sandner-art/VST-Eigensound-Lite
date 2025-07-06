// --- SystemMatrix Module ---
// Manages the state and manipulation of the Hamiltonian matrix 'H'.

import math from '../vendor/math-wrapper.js'; // <-- ADD THIS LINE

export class SystemMatrix {
    // ... rest of the file is the same as before ...
    constructor(size) {
        this.size = size;
        this.matrix = null; // This will hold the math.js matrix object
        this.isHermitian = true;
        this.initialize();
    }

    initialize() {
        // Create an identity matrix as a safe default
        this.loadDiagonal();
        console.log("SystemMatrix initialized.");
    }

    set(i, j, value) {
        // Sets a value in the matrix.
        // 'value' should be a complex number: math.complex(real, imag)
        const complexValue = math.complex(value.re, value.im);
        this.matrix.set([i, j], complexValue);

        if (this.isHermitian) {
            // Enforce H_ji = conjugate(H_ij)
            if (i !== j) {
                this.matrix.set([j, i], math.conj(complexValue));
            }
        }
    }
    
    get(i, j) {
        // Gets a value from the matrix.
        return this.matrix.get([i, j]);
    }

    getMatrix() {
        // Returns the underlying math.js matrix object.
        return this.matrix;
    }
    
    setHermitian(isHermitian) {
        this.isHermitian = isHermitian;
        if (isHermitian) {
            // Force the current matrix to become Hermitian
            const newMatrix = math.clone(this.matrix);
            for (let i = 0; i < this.size; i++) {
                for (let j = i; j < this.size; j++) {
                    if (i === j) {
                        // Diagonal elements must be real for a Hermitian matrix
                        const val = newMatrix.get([i, i]);
                        newMatrix.set([i, i], math.complex(val.re, 0));
                    } else {
                        const val = newMatrix.get([i, j]);
                        newMatrix.set([j, i], math.conj(val));
                    }
                }
            }
            this.matrix = newMatrix;
        }
    }

    // --- Preset Loaders ---
    loadDiagonal() {
        console.log("Loading Diagonal preset...");
        const arr = Array.from({ length: this.size }, (_, i) => math.complex(0, (i + 1) * 2));
        this.matrix = math.diag(arr);
    }

    loadTridiagonal() {
        console.log("Loading Tridiagonal preset...");
        this.matrix = math.zeros(this.size, this.size, 'dense');
        for (let i = 0; i < this.size; i++) {
            this.set(i, i, math.complex(0, (i + 1) * 2.5)); // Main diagonal (frequency)
            if (i < this.size - 1) {
                const coupling = math.complex(0.5, 0); // Real coupling
                this.set(i, i + 1, coupling);
                // No need to set (i+1, i) if hermitian enforcement is on
            }
        }
        if(this.isHermitian) this.setHermitian(true); // Ensure it's correct after building
    }

    loadCirculant() {
        console.log("Loading Circulant preset...");
        this.loadTridiagonal();
        // Add the wrap-around connection for the ring
        const coupling = math.complex(0.5, 0);
        this.set(0, this.size - 1, coupling);
    }
}
// --- SystemMatrix Module ---
// Manages the state and manipulation of the Hamiltonian matrix 'H'.

import math from '../vendor/math-wrapper.js';

export class SystemMatrix {
    constructor(size) {
        this.size = size;
        this.matrix = null; // This will hold the math.js matrix object
        this.isHermitian = true;
        this.initialize();
    }

    initialize() {
        this.loadDiagonal(); // Start with a simple, stable diagonal matrix
        console.log("SystemMatrix initialized.");
    }

    set(i, j, value) {
        const complexValue = math.complex(value.re, value.im);
        this.matrix.set([i, j], complexValue);

        if (this.isHermitian && i !== j) {
            this.matrix.set([j, i], math.conj(complexValue));
        }
    }
    
    get(i, j) {
        return this.matrix.get([i, j]);
    }

    getMatrix() {
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
                        const val = newMatrix.get([i, i]);
                        if (val.im !== 0) {
                           newMatrix.set([i, i], math.complex(val.re, 0));
                        }
                    } else {
                        const val = newMatrix.get([i, j]);
                        newMatrix.set([j, i], math.conj(val));
                    }
                }
            }
            this.matrix = newMatrix;
        }
    }

    loadDiagonal() {
        console.log("Loading Diagonal preset...");
        const arr = Array.from({ length: this.size }, (_, i) => math.complex(-0.1, (i + 1) * 1.5));
        this.matrix = math.diag(arr);
        if (this.isHermitian) this.setHermitian(true);
    }

    loadTridiagonal() {
        console.log("Loading Tridiagonal preset...");
        this.matrix = math.zeros(this.size, this.size, 'dense');
        for (let i = 0; i < this.size; i++) {
            this.matrix.set([i, i], math.complex(-0.1, (i + 1) * 1.5));
            if (i < this.size - 1) {
                const coupling = math.complex(0.5, 0);
                this.matrix.set([i, i + 1], coupling);
            }
        }
        if (this.isHermitian) this.setHermitian(true);
    }

    loadCirculant() {
        console.log("Loading Circulant preset...");
        this.loadTridiagonal();
        const coupling = math.complex(0.5, 0);
        this.matrix.set([0, this.size - 1], coupling);
        if (this.isHermitian) this.setHermitian(true);
    }
}
// --- UIController Module ---
// Main UI orchestrator. Manages all sub-views and user event handling.

import { MatrixView } from './matrixView.js';
import { AnalysisView } from './analysisView.js';
// The problematic import of AudioView has been removed.

export class UIController {
    constructor(systemMatrix, eigenEngine, audioEngine) {
        this.systemMatrix = systemMatrix;
        this.eigenEngine = eigenEngine;
        this.audioEngine = audioEngine;
        this.selectedCell = { i: 0, j: 0 };

        // Instantiate all the view-specific controller modules
        this.matrixView = new MatrixView(
            document.getElementById('matrix-container'),
            this.handleMatrixSelection.bind(this)
        );
        this.analysisView = new AnalysisView(
            document.getElementById('eigenvalue-plot-container'),
            document.getElementById('eigenvector-viewer-container')
        );
        // this.audioView = new AudioView(document.getElementById('audio-visualizer-container')); // This remains commented out for future use.

        console.log("UIController initialized.");
    }

    initialize() {
        console.log("Initializing UI events and views...");
        // Ensure audio is initialized on first user interaction
        document.body.addEventListener('click', () => this.audioEngine.initializeAudio(), { once: true });
        
        this.setupEventListeners();
        this.triggerFullUpdate(); // Initial calculation
    }

    setupEventListeners() {
        document.getElementById('excite-button').addEventListener('click', () => {
            // A simple excitation vector (excites all modes somewhat equally)
            const excitationVector = Array(this.systemMatrix.size).fill(1);
            this.audioEngine.excite(excitationVector);
        });
        
        // Preset buttons
        document.getElementById('preset-diagonal').addEventListener('click', () => {
            this.systemMatrix.loadDiagonal();
            this.triggerFullUpdate();
        });
        document.getElementById('preset-tridiagonal').addEventListener('click', () => {
            this.systemMatrix.loadTridiagonal();
            this.triggerFullUpdate();
        });
        document.getElementById('preset-circulant').addEventListener('click', () => {
            this.systemMatrix.loadCirculant();
            this.triggerFullUpdate();
        });
        
        document.getElementById('enforce-hermitian').addEventListener('change', (e) => {
            this.systemMatrix.setHermitian(e.target.checked);
            this.triggerFullUpdate();
        });
    }

    /**
     * This is the main callback function passed to the MatrixView.
     * It gets called whenever the user clicks on a cell in the matrix grid.
     */
    handleMatrixSelection(i, j) {
        this.selectedCell = { i, j };
        this.matrixView.selectCell(i, j);
        
        // Simple interaction: click to increase coupling/damping
        const currentVal = this.systemMatrix.get(i, j);
        
        if (i === j) { // Diagonal: affect damping (real part)
            this.systemMatrix.set(i, j, { re: currentVal.re - 0.05, im: currentVal.im });
        } else { // Off-diagonal: affect coupling (real part)
            this.systemMatrix.set(i, j, { re: currentVal.re + 0.1, im: currentVal.im });
        }
        this.triggerFullUpdate();
    }

    /**
     * A central function to re-calculate and re-draw everything.
     */
    triggerFullUpdate() {
        const H = this.systemMatrix.getMatrix();
        
        // Update the matrix view with fresh data first (reflects any changes from presets/toggles)
        this.matrixView.render(H);
        this.matrixView.selectCell(this.selectedCell.i, this.selectedCell.j);

        const eigensystem = this.eigenEngine.calculate(H);

        if (eigensystem) {
            this.analysisView.update(eigensystem);
            this.audioEngine.updateEigensystem(eigensystem);
        } else {
            this.analysisView.showError();
        }
    }
}
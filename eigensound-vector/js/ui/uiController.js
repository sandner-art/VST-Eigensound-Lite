// --- UIController Module ---
// Main UI orchestrator. Manages all sub-views and user event handling.

import { MatrixView } from './matrixView.js';
import { AnalysisView } from './analysisView.js';

export class UIController {
    constructor(systemMatrix, eigenEngine, audioEngine) {
        this.systemMatrix = systemMatrix;
        this.eigenEngine = eigenEngine;
        this.audioEngine = audioEngine;
        this.selectedCell = { i: 0, j: 0 };

        this.matrixView = new MatrixView(
            document.getElementById('matrix-container'),
            this.handleMatrixSelection.bind(this)
        );
        this.analysisView = new AnalysisView(
            document.getElementById('eigenvalue-plot-container'),
            document.getElementById('eigenvector-viewer-container')
        );
        console.log("UIController initialized.");
    }

    initialize() {
        console.log("Initializing UI events and views...");
        document.body.addEventListener('click', () => this.audioEngine.initializeAudio(), { once: true });
        
        this.setupEventListeners();
        this.triggerFullUpdate();
    }

    setupEventListeners() {
        document.getElementById('excite-button').addEventListener('click', () => {
            const excitationVector = Array(this.systemMatrix.size).fill(1);
            this.audioEngine.excite(excitationVector);
        });
        
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

    handleMatrixSelection(i, j) {
        this.selectedCell = { i, j };
        const currentVal = this.systemMatrix.get(i, j);
        
        if (i === j) { // Diagonal: affect damping (real part)
            this.systemMatrix.set(i, j, { re: currentVal.re - 0.05, im: currentVal.im });
        } else { // Off-diagonal: affect coupling (real part)
            this.systemMatrix.set(i, j, { re: currentVal.re + 0.1, im: currentVal.im });
        }
        this.triggerFullUpdate();
    }

    triggerFullUpdate() {
        const H = this.systemMatrix.getMatrix();
        
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
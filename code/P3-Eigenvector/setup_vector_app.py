import os

# --- Configuration ---
APP_ROOT_DIR = "eigensound-vector"

# --- File Structure Definition ---
# { "path/to/file.ext": """File content""" }
file_structure = {
    f"{APP_ROOT_DIR}/index.html": """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>eigensound | vector v0.0.1</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <header>
        <h1>eigensound | vector</h1>
        <p>An interactive laboratory for Eigen-Sonification.</p>
    </header>

    <main class="app-container">
        <!-- Panel 1: System Forge -->
        <section id="system-forge" class="panel">
            <h2>1. The System Forge (Define H)</h2>
            <div id="matrix-container" class="visualization-container">
                <!-- Interactive Matrix Grid will be generated here -->
            </div>
            <div class="controls">
                <h3>Matrix Presets</h3>
                <button id="preset-diagonal">Diagonal</button>
                <button id="preset-tridiagonal">Tridiagonal</button>
                <button id="preset-circulant">Circulant</button>
                <label><input type="checkbox" id="enforce-hermitian" checked> Enforce Hermitian</label>
            </div>
        </section>

        <!-- Panel 2: Eigen-Analyzer -->
        <section id="eigen-analyzer" class="panel">
            <h2>2. The Eigen-Analyzer (Analyze H)</h2>
            <div id="eigenvalue-plot-container" class="visualization-container">
                <!-- Complex Eigenvalue Plot will be drawn here -->
            </div>
            <div id="eigenvector-viewer-container" class="visualization-container">
                <!-- Eigenvector "Mode Shape" will be shown here -->
            </div>
        </section>

        <!-- Panel 3: Audition Stage -->
        <section id="audition-stage" class="panel">
            <h2>3. The Audition Stage (Hear the Result)</h2>
            <div class="controls">
                <button id="mode-synth">Synthesizer</button>
                <button id="mode-effect">Eigen-Filter</button>
                <button id="mic-toggle">Enable Mic</button>
            </div>
            <div id="audio-visualizer-container" class="visualization-container">
                <!-- Spectrogram / Dual Spectrum will be drawn here -->
            </div>
            <div class="controls">
                <button id="excite-button">EXCITE</button>
                <label>Dry/Wet <input type="range" id="dry-wet-slider" min="0" max="1" step="0.01" value="0.5"></label>
            </div>
        </section>
    </main>

    <!-- External Libraries -->
    <script src="js/vendor/math.min.js"></script>

    <!-- Main Application Logic -->
    <script type="module" src="js/main.js"></script>
</body>
</html>
""",

    f"{APP_ROOT_DIR}/css/style.css": """/* --- Global Styles --- */
body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    background-color: #1a1a2e;
    color: #e0e0e0;
    margin: 0;
    padding: 1rem;
}

header {
    text-align: center;
    margin-bottom: 2rem;
}

header h1 {
    color: #00d4ff;
}

/* --- Layout --- */
.app-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 1.5rem;
    max-width: 1400px;
    margin: 0 auto;
}

.panel {
    background-color: #16213e;
    border: 1px solid #0f3460;
    border-radius: 8px;
    padding: 1rem;
}

.panel h2 {
    margin-top: 0;
    color: #e94560;
    font-size: 1.2rem;
    border-bottom: 1px solid #0f3460;
    padding-bottom: 0.5rem;
}

.visualization-container {
    background-color: #0c1323;
    min-height: 200px;
    margin: 1rem 0;
    border-radius: 4px;
    /* Placeholder style */
    display: flex;
    align-items: center;
    justify-content: center;
    color: #535353;
}

.controls {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    align-items: center;
}

/* Add more specific styles for matrix, plots, etc. here */
""",

    f"{APP_ROOT_DIR}/js/main.js": """// --- eigensound|vector v0.0.1 ---
// Main application entry point.

import { UIController } from './ui/uiController.js';
import { SystemMatrix } from './core/systemMatrix.js';
import { EigenEngine } from './core/eigenEngine.js';
import { AudioEngine } from './core/audioEngine.js';

// This is the primary orchestrator of the application.
// It initializes all the core modules and the UI controller that connects them.

document.addEventListener('DOMContentLoaded', () => {
    console.log("Initializing eigensound|vector...");

    // 1. Initialize Core Components
    const systemMatrix = new SystemMatrix(8); // Start with an 8x8 matrix
    const eigenEngine = new EigenEngine();
    const audioEngine = new AudioEngine();

    // 2. Initialize the Main UI Controller
    // The UI Controller will manage all user interactions and updates between modules.
    const ui = new UIController(systemMatrix, eigenEngine, audioEngine);

    // 3. Start the application by initializing the UI
    ui.initialize();

    console.log("eigensound|vector initialized successfully.");
    // Expose modules to the console for easy debugging
    window.esv = { systemMatrix, eigenEngine, audioEngine, ui };
});
""",

    f"{APP_ROOT_DIR}/js/core/systemMatrix.js": """// --- SystemMatrix Module ---
// Manages the state and manipulation of the Hamiltonian matrix 'H'.

export class SystemMatrix {
    constructor(size) {
        this.size = size;
        this.matrix = null; // This will hold the math.js matrix object
        this.isHermitian = true;
        this.initialize();
    }

    initialize() {
        // Create an identity matrix as a safe default
        this.matrix = math.identity(this.size, 'dense');
        console.log("SystemMatrix initialized.");
    }

    set(i, j, value) {
        // Sets a value in the matrix.
        // If isHermitian is true, it should also set the conjugate transpose.
        // 'value' should be a complex number: math.complex(real, imag)
        // TODO: Implement setter logic
    }
    
    get(i, j) {
        // Gets a value from the matrix.
        // TODO: Implement getter logic
    }

    getMatrix() {
        // Returns the underlying math.js matrix object.
        return this.matrix;
    }

    // --- Preset Loaders ---
    loadDiagonal() {
        console.log("Loading Diagonal preset...");
        // TODO: Implement logic to create a diagonal matrix
    }

    loadTridiagonal() {
        console.log("Loading Tridiagonal preset...");
        // TODO: Implement logic to create a tridiagonal matrix
    }

    loadCirculant() {
        console.log("Loading Circulant preset...");
        // TODO: Implement logic to create a circulant matrix
    }
}
""",

    f"{APP_ROOT_DIR}/js/core/eigenEngine.js": """// --- EigenEngine Module ---
// A pure-math module responsible for performing eigen-decomposition.

export class EigenEngine {
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
        console.log("Performing eigen-decomposition...");
        try {
            // This is the core mathematical operation of the entire application.
            const eigensystem = math.eigs(matrix);
            
            // The result needs to be structured for easier use.
            // math.eigs returns values as a flat array and vectors as an array of column vectors.
            this.lastResult = {
                values: eigensystem.values,   // Array of eigenvalues
                vectors: eigensystem.vectors, // Array of eigenvectors
            };
            return this.lastResult;
        } catch (error) {
            console.error("Eigen-decomposition failed:", error);
            // This can happen if the matrix is singular or has other issues.
            // The UI should gracefully handle this failure.
            return null;
        }
    }
}
""",

    f"{APP_ROOT_DIR}/js/core/audioEngine.js": """// --- AudioEngine Module ---
// Manages all Web Audio API interactions, synthesis, and effects.

export class AudioEngine {
    constructor() {
        this.audioContext = null;
        this.masterGain = null;
        this.currentEigensystem = null; // Will be populated with { values, vectors }
        console.log("AudioEngine initialized.");
    }

    // --- Core Audio Setup ---
    async initializeAudio() {
        // TODO: Create AudioContext, master gain, etc.
        // This can be adapted from the previous eigensound app version.
        console.log("Audio context initialized by user gesture.");
    }

    // --- Synthesizer Mode ---
    excite(excitationVector) {
        if (!this.audioContext || !this.currentEigensystem) {
            console.warn("Audio not ready or no eigensystem to play.");
            return;
        }
        console.log("Exciting system with vector:", excitationVector);
        // TODO: 
        // 1. Project excitationVector onto the eigenvectors to get initial amplitudes.
        // 2. For each mode, create an OscillatorNode and GainNode.
        // 3. Set oscillator frequency based on the imaginary part of the eigenvalue.
        // 4. Set gain envelope decay based on the real part of the eigenvalue.
    }

    // --- Effect Mode ---
    startProcessing() {
        // TODO: Set up ScriptProcessorNode or AudioWorklet for real-time effects.
    }

    stopProcessing() {
        // TODO: Disconnect the processor.
    }

    // --- System Updates ---
    updateEigensystem(eigensystem) {
        this.currentEigensystem = eigensystem;
        console.log("AudioEngine received updated eigensystem.");
        // If in effect mode, this should update the filter's properties.
    }
}
""",

    f"{APP_ROOT_DIR}/js/ui/uiController.js": """// --- UIController Module ---
// Main UI orchestrator. Manages all sub-views and user event handling.

import { MatrixView } from './matrixView.js';
import { AnalysisView } from './analysisView.js';
import { AudioView } from './audioView.js';

export class UIController {
    constructor(systemMatrix, eigenEngine, audioEngine) {
        this.systemMatrix = systemMatrix;
        this.eigenEngine = eigenEngine;
        this.audioEngine = audioEngine;

        // Instantiate all the view-specific controller modules
        this.matrixView = new MatrixView(
            document.getElementById('matrix-container'),
            this.handleMatrixUpdate.bind(this)
        );
        this.analysisView = new AnalysisView(
            document.getElementById('eigenvalue-plot-container'),
            document.getElementById('eigenvector-viewer-container')
        );
        this.audioView = new AudioView(
            document.getElementById('audio-visualizer-container')
        );

        console.log("UIController initialized.");
    }

    initialize() {
        console.log("Initializing UI events and views...");
        this.matrixView.render(this.systemMatrix.getMatrix());
        this.setupEventListeners();
        this.triggerFullUpdate(); // Initial calculation
    }

    setupEventListeners() {
        // TODO: Add listeners for preset buttons, mode switches, etc.
        document.getElementById('excite-button').addEventListener('click', () => {
            // For now, excite with a simple vector (e.g., [1, 1, ...])
            const excitationVector = math.ones(this.systemMatrix.size);
            this.audioEngine.excite(excitationVector);
        });
    }

    /**
     * This is the main callback function passed to the MatrixView.
     * It gets called whenever the user changes a value in the matrix grid.
     */
    handleMatrixUpdate(i, j, value) {
        this.systemMatrix.set(i, j, value);
        this.triggerFullUpdate();
    }

    /**
     * A central function to re-calculate and re-draw everything.
     */
    triggerFullUpdate() {
        const H = this.systemMatrix.getMatrix();
        const eigensystem = this.eigenEngine.calculate(H);

        if (eigensystem) {
            this.analysisView.update(eigensystem);
            this.audioEngine.updateEigensystem(eigensystem);
        } else {
            // Handle calculation failure gracefully in the UI
            this.analysisView.showError();
        }
    }
}
""",

    f"{APP_ROOT_DIR}/js/ui/matrixView.js": """// --- MatrixView Module ---
// Responsible for rendering and handling interactions with the H-matrix grid.

export class MatrixView {
    constructor(container, onUpdateCallback) {
        this.container = container;
        this.onUpdate = onUpdateCallback; // This function will be called with (i, j, value)
        console.log("MatrixView initialized.");
    }

    render(matrix) {
        // TODO: 
        // 1. Clear the container.
        // 2. Create an HTML table or a grid of divs representing the matrix.
        // 3. Color-code cells based on their value (heatmap).
        // 4. Add click listeners to each cell to enable editing.
        this.container.innerHTML = `<p>Matrix View (size: ${matrix.size()[0]}x${matrix.size()[1]})</p>`; // Placeholder
    }
}
""",

    f"{APP_ROOT_DIR}/js/ui/analysisView.js": """// --- AnalysisView Module ---
// Responsible for all visualizations in Panel 2 (eigen-analyzer).

export class AnalysisView {
    constructor(plotContainer, vectorContainer) {
        this.plotContainer = plotContainer;
        this.vectorContainer = vectorContainer;
        // TODO: Set up canvas elements inside these containers.
        console.log("AnalysisView initialized.");
    }

    update(eigensystem) {
        // This is the main update function, called when a new eigensystem is calculated.
        console.log("Updating analysis view with new eigensystem.");
        this.drawEigenvaluePlot(eigensystem.values);
        this.drawEigenvectorViewer(eigensystem.vectors); // e.g., show the first one by default
    }

    drawEigenvaluePlot(values) {
        // TODO: 
        // 1. Draw the complex plane (real/imaginary axes).
        // 2. Plot each eigenvalue as a dot on the plane.
        // 3. Add hover interactions to link to the eigenvector viewer.
        this.plotContainer.innerHTML = `<p>Eigenvalue Plot (${values.length} values)</p>`; // Placeholder
    }

    drawEigenvectorViewer(vectors) {
        // TODO: Draw a bar chart of the components of a selected eigenvector.
        this.vectorContainer.innerHTML = `<p>Eigenvector Viewer</p>`; // Placeholder
    }

    showError() {
        // TODO: Display a user-friendly message when eigen-decomposition fails.
        this.plotContainer.innerHTML = `<p style="color: red;">Error: Could not compute eigensystem.</p>`;
    }
}
""",

    f"{APP_ROOT_DIR}/js/ui/audioView.js": """// --- AudioView Module ---
// Responsible for audio visualizations in Panel 3 (spectrogram, etc.).

export class AudioView {
    constructor(container) {
        this.container = container;
        // TODO: Set up a canvas for real-time rendering.
        console.log("AudioView initialized.");
    }

    update(audioData) {
        // TODO: This method will be called continuously via requestAnimationFrame
        // to draw the real-time spectrum or spectrogram.
    }

    setMode(mode) {
        // Switch between 'synthesizer' (spectrogram) and 'effect' (dual-spectrum) views.
        console.log(`AudioView mode set to: ${mode}`);
        if (mode === 'synthesizer') {
            this.container.innerHTML = `<p>Live Spectrogram</p>`; // Placeholder
        } else {
            this.container.innerHTML = `<p>Dual Spectrum Analyzer (Input/Output)</p>`; // Placeholder
        }
    }
}
""",

    # We need a placeholder for the math.js library.
    # In a real scenario, you would download this file and place it here.
    f"{APP_ROOT_DIR}/js/vendor/math.min.js": """/**
 * math.js
 * https://mathjs.org
 *
 * This is a placeholder file. Please download the latest version of math.js
 * from its official website and place it here.
 * This library is required for matrix operations and eigen-decomposition.
 */
console.warn("This is a placeholder for math.js. Please download the actual library.");
"""
}

# --- Script Logic ---
def create_project_structure():
    """Creates the directories and files for the project."""
    print(f"Creating project structure in ./{APP_ROOT_DIR}/")

    # Create the root application directory
    if not os.path.exists(APP_ROOT_DIR):
        os.makedirs(APP_ROOT_DIR)

    # Create all files and necessary subdirectories
    for file_path, content in file_structure.items():
        # Ensure the directory for the file exists
        dir_name = os.path.dirname(file_path)
        if not os.path.exists(dir_name):
            os.makedirs(dir_name)
        
        # Write the file content
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  Created: {file_path}")

    print("\nProject structure created successfully!")
    print(f"Next steps:")
    print(f"1. Download math.js from https://mathjs.org/download.html and replace the placeholder at:")
    print(f"   {APP_ROOT_DIR}/js/vendor/math.min.js")
    print(f"2. Open {APP_ROOT_DIR}/index.html in your browser to see the basic app shell.")
    print(f"3. Start implementing the 'TODO' sections in the JavaScript files.")

if __name__ == "__main__":
    create_project_structure()
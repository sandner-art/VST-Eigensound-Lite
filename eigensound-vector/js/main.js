// --- eigensound|vector v0.0.1 ---
// Main application entry point.

import { UIController } from './ui/uiController.js';
import { SystemMatrix } from './core/systemMatrix.js';
import { EigenEngine } from './core/eigenEngine.js';
import { AudioEngine } from './core/audioEngine.js';

// This is the primary orchestrator of the application.
// It initializes all the core modules and the UI controller that connects them.

document.addEventListener('DOMContentLoaded', () => {
    console.log("Initializing eigensound|vector...");

    try {
        // 1. Initialize Core Components
        const matrixSize = 6; // Start with a 6x6 matrix for performance
        const systemMatrix = new SystemMatrix(matrixSize);
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

    } catch (error) {
        console.error("Fatal error during initialization:", error);
        document.body.innerHTML = `<h1 style="color:red">Error Initializing Application</h1><p>Please check the console for details. Ensure math.js is loaded correctly.</p>`;
    }
});
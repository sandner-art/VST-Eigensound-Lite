The app is skeleton of refactoring.

### Recommended Modular Software Design for `eigensound|vector`

Here is a practical, professional file structure that is ideal for this project and works seamlessly on GitHub Pages.

#### **Project Directory Structure:**

```
eigensound-vector/
├── index.html              // The main HTML page (the "shell" of the app)
├── css/
│   └── style.css           // All CSS styles
└── js/
    ├── main.js             // The main entry point, initializes everything
    ├── core/
    │   ├── audioEngine.js  // Manages Web Audio API, oscillators, effects
    │   ├── systemMatrix.js // Class to manage the H matrix, presets, and updates
    │   └── eigenEngine.js  // Performs the math.eigs() calculation, manages results
    ├── ui/
    │   ├── uiController.js // Main UI class, orchestrates all UI modules
    │   ├── matrixView.js   // Code for drawing and interacting with the H-matrix grid
    │   ├── analysisView.js // Code for drawing the eigenvalue plot, etc.
    │   └── audioView.js    // Code for the spectrogram and spectrum analyzers
    └── vendor/
        └── math.min.js     // The external math.js library
```

1. run eigensound-vector> python -m http.server
2. browser http://localhost:8000/

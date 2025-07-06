Feature list for `eigensound|vector v0.0.1`.

### Opinion and Strategic Value

Your proposal is spot on. Creating a focused "lab" version of the app has several key benefits:

1.  **Clarity of Purpose:** `eigensound|gr/qm v0.3.0` is an *artistic application* of a concept. `eigensound|vector v0.0.1` will be an *interactive explanation* of the concept itself. This distinction is crucial. It directly supports the paper's thesis without the distraction of unrelated physics parameters.
2.  **Directly Illustrates the Paper:** You can literally embed a link to this app in your paper (or a QR code in a print version) and say, "To interactively experience the concept of modal quantization discussed in Section 4.2, please see our companion app." This is a massive value-add.
3.  **Testbed for Future Research:** As you noted, it becomes your personal R&D platform. Before committing to a complex implementation in a professional tool (like a VST or Max/MSP external), you can rapidly prototype and validate new ideas for Eigen-Filtering or synthesis in this web environment.
4.  **Educational Tool:** This app could become a fantastic educational resource for students of DSP, physics, and computer music, demonstrating abstract linear algebra concepts in an intuitive, auditory way.

### Suggestions and Core Design Philosophy for `eigensound|vector`

The design should be clean, didactic, and focused. Think less like a musical instrument and more like an **interactive diagram from a textbook.** The user isn't just a "player"; they are an "experimenter."

*   **Focus on the Matrix:** The central UI element should not be a bank of sliders for abstract physics. It should be a direct visualization of the Hamiltonian matrix, `H`. The user should be able to "paint" values into this matrix and immediately hear the consequences.
*   **Clear Separation of Concepts:** The UI should be divided into distinct modules that mirror the sections of your paper:
    1.  **The System (Define `H`)**: A module for constructing the system matrix.
    2.  **The Eigensystem (Analyze `H`)**: A module that visualizes the resulting eigenvalues and eigenvectors.
    3.  **The Sound (Synthesize/Process)**: A module for auditioning the system as a synthesizer or an audio effect.
*   **Prioritize Visualization:** Every number should have a corresponding visual representation. The eigenvalues should be plotted on a complex plane, the eigenvectors should be shown as bar graphs, and the matrix should be a color-coded heat map.

---

### Proposed Feature Set for `eigensound|vector v0.0.1`

This feature set is designed to be achievable for a `v0.0.1` while directly supporting every major claim in your paper.

#### **Module 1: The System Matrix (`H`) Editor**

*   **UI:** An interactive, clickable `n x n` grid (e.g., 8x8 to start).
*   **Functionality:**
    *   **Matrix Editor:** Users can click on any cell `H_ij` and enter a value (or use a slider). This directly manipulates the system.
    *   **Heatmap Visualization:** The grid cells are color-coded by value, giving an instant visual sense of the matrix structure.
    *   **Matrix Presets:** Buttons to load canonical matrices:
        *   **"Diagonal" (Decoupled):** All off-diagonal terms are zero. *Illustrates pure, independent modes.*
        *   **"Tridiagonal" (Nearest-Neighbor Coupling):** Only the main diagonal and the diagonals just above/below it have values. *Models a simple 1D chain of oscillators.*
        *   **"Circulant" (Ring Coupling):** A matrix representing a ring of oscillators. *Illustrates periodic boundary conditions.*
        *   **"Symmetric/Hermitian" Toggle:** A switch to enforce `H_ij = H_ji`, guaranteeing real eigenvalues and stable modes (as per the Spectral Theorem).

#### **Module 2: The Eigensystem Analyzer**

This module is **read-only** and updates in real-time as the user edits the `H` matrix.

*   **UI:** Three linked visualizations.
*   **Visualizations:**
    1.  **Eigenvalue Plot:** A 2D plot of the complex plane. Each eigenvalue `E_i` is plotted as a point.
        *   **X-axis (Real part):** Corresponds to damping/growth. The user can see which modes will decay or explode.
        *   **Y-axis (Imaginary part):** Corresponds to frequency. The user can see the resulting spectrum.
    2.  **Eigenvector Display:** A set of bar graphs. When the user hovers over an eigenvalue on the plot, the corresponding eigenvector `ψ_i` is displayed as a bar graph, showing the "shape" of that specific mode.
    3.  **Frequency Spectrum:** A simple bar graph showing the frequencies (from the imaginary parts of the eigenvalues) on a linear or logarithmic scale. This directly visualizes the "notes" the instrument will play.


#### **Module 3: The Sonification Engine (Synthesizer & Effect) (Continued)**

*   **Mode 2: Eigen-Filter (Audio Effect) (Continued)**
    *   **Controls (Continued):**
        *   **"Modal Quantization" Slider (0% to 100%):** This is the control for the "Eigen-Lock" effect. At 0%, all modes are preserved based on their projection strength. As the slider increases, it progressively zeroes out the coefficients (`c_i`) of the weakest modes, forcing the sound's energy into the system's most dominant resonant pathways. At 100%, only the single strongest mode might remain, "crystallizing" any input into a pure tone.
        *   **"Spectral Shift" Knob:** A simple control that adds a constant imaginary value to all eigenvalues (`E_i → E_i + jΔω`), acting as a global frequency shift on the processed sound. This demonstrates a simple transformation in the eigen-basis.
    *   **Visualization:** A real-time display showing the input spectrum and the output (reconstructed) spectrum side-by-side, making the filtering effect immediately visible.

#### **Overall Architecture and Tech Stack**

*   **Core Logic:** JavaScript.
*   **Numerical Computation:** Use a lightweight, fast linear algebra library that can be included in the browser. `math.js` is a good candidate as it has a robust `math.eigs()` function for finding eigenvalues and eigenvectors. For better performance with larger matrices in the future, `ndarray` or a custom WebAssembly (WASM) module would be the next step.
*   **Audio:** Standard Web Audio API. The synthesizer will be a bank of `OscillatorNode` and `GainNode` objects. The effect will use a `ScriptProcessorNode` or `AudioWorklet` for the real-time analysis-transformation-synthesis loop.
*   **Visualization:** A simple canvas library like `p5.js` or even plain HTML5 Canvas API would be sufficient for the visualizations.

### How `eigensound|vector` Directly Supports and Strengthens Your Paper

By building this app, you create a powerful feedback loop between your research and its demonstration.

1.  **Illustrates Formalism (Section 2):**
    *   When you discuss the `H` matrix, readers can see and manipulate it in Module 1.
    *   When you explain eigenvalues defining frequency/stability, readers can see the Eigenvalue Plot in Module 2 update instantly as they change a matrix value, and then hear the result.
    *   When you explain eigenvectors defining mode shapes, readers can hover over an eigenvalue and see the corresponding bar graph.

2.  **Demonstrates Implementation Strategies (Section 3):**
    *   You can have a "Simplified (`eigensound|gr/qm`)" mode in the app that disables the matrix editor and just uses a few sliders that apply heuristic modifiers. This allows a direct A/B comparison between the two methods discussed in your paper. The user can *hear* the difference in fidelity.

3.  **Proves the Novelty of Eigen-Filtering (Section 4):**
    *   The Eigen-Filter module is a direct, interactive proof-of-concept for the most novel part of your paper. A reviewer can turn on their microphone, speak into it, and hear their voice transformed into the "sound of a circulant matrix." This is far more persuasive than a written description. The "Modal Quantization" slider provides a tangible, playable demonstration of a completely new audio effect.

4.  **Validates Artistic & Scientific Claims (Section 5):**
    *   **For Artists:** A musician can experiment with the app and immediately understand the new vocabulary. They can feel the difference between changing a diagonal term (tuning a mode) versus an off-diagonal term (coupling modes).
    *   **For Scientists:** A user can load the "Tridiagonal" matrix preset, representing a simple physical chain. They can then break one of the coupling links (set a `H_ij` to 0) and instantly hear how the sound splits into two independent systems. This is an intuitive demonstration of system decomposition that is difficult to grasp from equations alone.

In summary, `eigensound|vector` is not a distraction from the paper; it is the **central piece of evidence.** It transforms your theoretical framework into a living, breathing entity that anyone can explore, making your research more credible, impactful, and memorable. It is the perfect companion for your work.

---

The key to a great UI/UX for `eigensound|vector` is to create a tight, intuitive feedback loop between **Action (modifying the system)**, **Analysis (seeing the consequence)**, and **Audition (hearing the result)**. The user should feel like they are directly manipulating the fabric of the sound.

Here are my suggestions for visualization modes, designed to be powerful, clear, and integrated into a cohesive user experience.

---

### Suggested UI/UX and Visualization Modes for `eigensound|vector`

We'll design the layout around three main, interconnected panels that represent the **Cause → Effect → Perception** workflow.

#### **Panel 1: The System Forge (The "Cause")**

This is where the user defines the system `H`. The goal is direct, tactile control.

*   **Primary View: The Interactive Matrix**
    *   **Visualization:** A large, `n x n` grid (e.g., 8x8). Each cell `H_ij` is a clickable element.
    *   **Interaction:** Clicking a cell selects it. A "Cell Inspector" panel appears, showing sliders for the **Real** and **Imaginary** parts of that matrix element. As the user moves the sliders, the matrix cell's color and the entire system's sound/analysis update in real-time.
    *   **Color-Coding (Heatmap):**
        *   **Brightness/Luminosity:** Represents the **magnitude** of the complex number in the cell. Bright cells are strong interactions; dark cells are weak.
        *   **Hue:** Represents the **phase/angle** of the complex number. This gives a visual fingerprint of the matrix. For example, a purely real matrix (like a simple mass-spring system) would be all one color, while a system with complex phase relationships (like a quantum system with a magnetic field) would show a rainbow of hues.

*   **Secondary View: The Abstract Parameter Editor**
    *   **Visualization:** A small set of high-level sliders, like in `eigensound|gr/qm`.
    *   **Functionality:** Instead of directly modifying the sound, these sliders would **procedurally generate the `H` matrix**. For example:
        *   **"Coupling Strength" Slider:** Scales all off-diagonal elements.
        *   **"Self-Energy" Slider:** Scales all diagonal elements.
        *   **"Randomness" Slider:** Adds a small amount of random noise to every matrix element.
    *   **Benefit:** This bridges the gap between the concrete matrix and abstract concepts. The user can move the "Coupling" slider and watch the off-diagonal cells in the matrix grid light up in response.

#### **Panel 2: The Eigen-Analyzer (The "Effect")**

This panel is the formal heart of the app. It's a read-only dashboard that shows the direct mathematical consequences of the user's actions in Panel 1.

*   **Primary View: The Complex Eigenvalue Plane**
    *   **Visualization:** A 2D plot with a horizontal **Real axis (`α`)** and a vertical **Imaginary axis (`ω`)**. A vertical line is drawn at `Re(z) = 0`.
    *   **Information Conveyed:**
        *   **Frequency:** The `y`-position (`ω`) of each eigenvalue dot directly corresponds to a resonant frequency. The user can literally see the spectrum.
        *   **Stability:** The `x`-position (`α`) shows the mode's stability.
            *   Dots to the **left** of the center line (`α < 0`) are **stable, decaying modes**. The further left, the faster they decay (higher damping).
            *   Dots to the **right** (`α > 0`) are **unstable, exploding modes**.
            *   Dots **on the line** (`α = 0`) are **perfectly sustained, pure tones**.
    *   **Interaction:** Hovering the mouse over an eigenvalue dot highlights it and links to the other visualizations in this panel.

*   **Secondary View: The Eigenvector "Mode Shape" Viewer**
    *   **Visualization:** A bar graph that shows the components of a single eigenvector.
    *   **Functionality:** This view is linked to the Eigenvalue Plot. When the user hoovers over an eigenvalue `E_i`, this plot instantly displays the corresponding eigenvector `ψ_i`. This answers the question: "What is the 'shape' of the vibration at this specific frequency?"

*   **Tertiary View: The "Gantt Chart" of Decay**
    *   **Visualization:** This is an innovative idea. It's a horizontal bar chart where each bar corresponds to a mode. The **length** of the bar is proportional to the mode's half-life (i.e., `1 / |α|`).
    *   **Functionality:** This gives an immediate, intuitive sense of the sound's "ADSR" envelope. A sound with a few very long bars and many short bars will have a sharp "attack" (as the short-lived modes decay) followed by a long, simple "sustain" (from the stable modes). A sound where all bars are roughly the same length will fade out uniformly.

#### **Panel 3: The Audition Stage (The "Perception")**

This is where the user hears and sees the final output. It re-uses the best components from `v0.3.0` but reframes them.

*   **Mode Switch: [ Synthesizer | Eigen-Filter ]**
*   **The Synthesizer View:**
    *   **Control:** A large "EXCITE" button.
    *   **Visualization:** A real-time **Spectrogram** or **Waterfall Plot**. This is crucial. When the user clicks "EXCITE," they will see bright lines appear at the frequencies corresponding to the eigenvalues in Panel 2. They will then see the lines for unstable modes fade out quickly, while the stable modes persist. **This visualization directly connects the Eigenvalue Plot to the resulting sound over time.**
*   **The Eigen-Filter View:**
    *   **Control:** A "Mic Input" toggle and a "Dry/Wet" slider.
    *   **Visualization:** A **dual real-time spectrum analyzer**. It shows two spectrums overlaid:
        1.  The **input** signal (from mic/file) in a neutral color (e.g., grey).
        2.  The **output** signal (after being processed by the eigen-filter) in a bright color (e.g., blue).
    *   **Benefit:** The user can speak into their mic and instantly see how their voice's spectrum is being "forced" into the shape of the system's eigenspectrum. They can see peaks in their voice get suppressed if they don't align with an eigenvalue, and see new peaks emerge where the system has strong resonances.

### Mockup of the UI Layout

```
+-------------------------------------------------+--------------------------------------+
|            PANEL 1: THE SYSTEM FORGE            |      PANEL 2: THE EIGEN-ANALYZER       |
| +---------------------------------------------+ | +----------------------------------+ |
| |                                             | | |       Complex Eigenvalue Plot      | |
| |        INTERACTIVE H-MATRIX (8x8)           | | |                                    | |
| |           (Color-coded heatmap)             | | | (Dots representing E_i)            | |
| |                                             | | |                                    | |
| +---------------------------------------------+ | +----------------------------------+ |
| | [Matrix Presets: Diagonal, Tridiag, etc.]   | | |      Eigenvector Viewer      | | |
| +---------------------------------------------+ | |  (Bar graph of selected ψ_i)   | | |
| | Abstract Sliders: [Coupling] [Randomness]   | | +----------------------------------+ |
| +---------------------------------------------+ | |      Decay "Gantt Chart"       | | |
| | Cell Inspector: H_ij = [Re] + j[Im]         | | |  (Bars showing mode lifetime)  | | |
| +---------------------------------------------+ | +----------------------------------+ |
+-------------------------------------------------+--------------------------------------+
|                      PANEL 3: THE AUDITION STAGE                                       |
|  [ SYNTHESIZER | EIGEN-FILTER ]  [Dry/Wet] [Modal Quantization] [Mic On/Off]            |
| +------------------------------------------------------------------------------------+ |
| |                                                                                    | |
| |                  Live Spectrogram / Dual Spectrum Analyzer                         | |
| |                                                                                    | |
| +------------------------------------------------------------------------------------+ |
|                                   [ EXCITE BUTTON ]                                    |
+--------------------------------------------------------------------------------------+
```

This design provides a clear, logical flow from high-level control to low-level mathematics, to analytical visualization, and finally to perceptual feedback. It's a complete interactive laboratory for exploring the paper's core ideas.
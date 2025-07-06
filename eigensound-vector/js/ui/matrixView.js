// --- MatrixView Module ---
// Responsible for rendering and handling interactions with the H-matrix grid.

export class MatrixView {
    constructor(container, onSelectionCallback) {
        this.container = container;
        this.onSelection = onSelectionCallback;
        this.size = 0;
        console.log("MatrixView initialized.");
    }

    render(matrix) {
        const size = matrix.size()[0];
        if (size !== this.size) {
            this.size = size;
            this.container.innerHTML = '';
            this.container.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
            this.container.style.gridTemplateRows = `repeat(${size}, 1fr)`;

            for (let i = 0; i < size; i++) {
                for (let j = 0; j < size; j++) {
                    const cell = document.createElement('div');
                    cell.className = 'matrix-cell';
                    cell.dataset.i = i;
                    cell.dataset.j = j;
                    cell.addEventListener('click', () => this.onSelection(i, j));
                    this.container.appendChild(cell);
                }
            }
        }
        this.updateValues(matrix);
    }
    
    updateValues(matrix) {
        let maxMag = 0;
        matrix.forEach(value => {
            const mag = math.abs(value);
            if (mag > maxMag) maxMag = mag;
        });

        const cells = this.container.children;
        for (const cell of cells) {
            const i = parseInt(cell.dataset.i);
            const j = parseInt(cell.dataset.j);
            const value = matrix.get([i, j]);
            const mag = math.abs(value);
            
            const brightness = maxMag > 0 ? (mag / maxMag) * 100 : 0;
            const hue = (math.arg(value) + Math.PI) / (2 * Math.PI) * 360; // Map phase to hue
            
            cell.style.backgroundColor = `hsl(${hue}, 80%, ${20 + brightness * 0.4}%)`;
            cell.title = `H[${i},${j}] = ${value.re.toFixed(2)} + ${value.im.toFixed(2)}j`;
        }
    }

    selectCell(i, j) {
        const cells = this.container.children;
        for (const cell of cells) {
            cell.classList.remove('selected');
            if (parseInt(cell.dataset.i) === i && parseInt(cell.dataset.j) === j) {
                cell.classList.add('selected');
            }
        }
    }
}
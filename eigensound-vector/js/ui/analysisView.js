// --- AnalysisView Module ---
// Responsible for all visualizations in Panel 2 (eigen-analyzer).

export class AnalysisView {
    constructor(plotContainer, vectorContainer) {
        this.plotContainer = plotContainer;
        this.vectorContainer = vectorContainer;
        
        this.plotCanvas = document.createElement('canvas');
        this.plotContainer.appendChild(this.plotCanvas);
        this.plotCtx = this.plotCanvas.getContext('2d');

        this.vectorCanvas = document.createElement('canvas');
        this.vectorContainer.appendChild(this.vectorCanvas);
        this.vectorCtx = this.vectorCanvas.getContext('2d');
        
        this.resizeObserver = new ResizeObserver(() => this.resize());
        this.resizeObserver.observe(this.plotContainer);
        this.resizeObserver.observe(this.vectorContainer);

        this.lastEigensystem = null;
        this.hoveredIndex = -1;

        this.plotCanvas.addEventListener('mousemove', e => this.handleMouseMove(e));

        console.log("AnalysisView initialized.");
    }

    resize() {
        this.plotCanvas.width = this.plotContainer.clientWidth;
        this.plotCanvas.height = this.plotContainer.clientHeight;
        this.vectorCanvas.width = this.vectorContainer.clientWidth;
        this.vectorCanvas.height = this.vectorContainer.clientHeight;
        if(this.lastEigensystem) this.update(this.lastEigensystem); // Redraw on resize
    }

    update(eigensystem) {
        this.lastEigensystem = eigensystem;
        this.draw();
    }
    
    draw() {
        if (!this.lastEigensystem) return;
        this.drawEigenvaluePlot();
        this.drawEigenvectorViewer(this.hoveredIndex);
    }

    drawEigenvaluePlot() {
        const ctx = this.plotCtx;
        const { width, height } = this.plotCanvas;
        const values = this.lastEigensystem.values;

        // Find data bounds for scaling
        let maxIm = 1, maxRe = 1;
        values.forEach(v => {
            if (Math.abs(v.im) > maxIm) maxIm = Math.abs(v.im);
            if (Math.abs(v.re) > maxRe) maxRe = Math.abs(v.re);
        });

        // Clear and draw background
        ctx.fillStyle = '#0c1323';
        ctx.fillRect(0, 0, width, height);
        ctx.strokeStyle = '#2a3a5e';
        ctx.lineWidth = 1;

        // Draw axes
        const originX = width / 2;
        const originY = height / 2;
        ctx.beginPath();
        ctx.moveTo(0, originY);
        ctx.lineTo(width, originY); // Real axis (Damping)
        ctx.moveTo(originX, 0);
        ctx.lineTo(originX, height); // Imaginary axis (Frequency)
        ctx.stroke();

        // Plot eigenvalues
        for (let i = 0; i < values.length; i++) {
            const v = values[i];
            const x = originX + (v.re / maxRe) * (originX * 0.9);
            const y = originY - (v.im / maxIm) * (originY * 0.9);
            
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, 2 * Math.PI);
            ctx.fillStyle = i === this.hoveredIndex ? '#f9a826' : '#00d4ff';
            ctx.fill();
        }
    }

    drawEigenvectorViewer(index) {
        const ctx = this.vectorCtx;
        const { width, height } = this.vectorCanvas;
        const vectors = this.lastEigensystem.vectors;

        ctx.fillStyle = '#0c1323';
        ctx.fillRect(0, 0, width, height);

        if (index < 0 || index >= vectors.length) {
            ctx.fillStyle = '#555';
            ctx.textAlign = 'center';
            ctx.fillText("Hover over an eigenvalue to see its mode shape", width / 2, height / 2);
            return;
        }

        const vector = vectors.map(row => row[index]); // Get the column vector
        const barWidth = width / vector.length;
        
        let maxMag = 0;
        vector.forEach(v => {
            const mag = math.abs(v);
            if(mag > maxMag) maxMag = mag;
        });

        for(let i=0; i<vector.length; i++) {
            const val = vector[i];
            const mag = math.abs(val);
            const barHeight = maxMag > 0 ? (mag / maxMag) * (height * 0.9) : 0;
            const hue = (math.arg(val) + Math.PI) / (2 * Math.PI) * 360;

            ctx.fillStyle = `hsl(${hue}, 80%, 60%)`;
            ctx.fillRect(i * barWidth, height - barHeight, barWidth * 0.8, barHeight);
        }
    }
    
    handleMouseMove(e) {
        if (!this.lastEigensystem) return;

        const rect = this.plotCanvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const values = this.lastEigensystem.values;
        let maxIm = 1, maxRe = 1;
        values.forEach(v => {
            if (Math.abs(v.im) > maxIm) maxIm = Math.abs(v.im);
            if (Math.abs(v.re) > maxRe) maxRe = Math.abs(v.re);
        });

        const originX = this.plotCanvas.width / 2;
        const originY = this.plotCanvas.height / 2;
        
        let foundIndex = -1;
        let min_dist = 10 * 10; // 10px radius

        for (let i = 0; i < values.length; i++) {
            const v = values[i];
            const x = originX + (v.re / maxRe) * (originX * 0.9);
            const y = originY - (v.im / maxIm) * (originY * 0.9);
            const dist_sq = (mouseX - x)**2 + (mouseY - y)**2;
            if(dist_sq < min_dist){
                min_dist = dist_sq;
                foundIndex = i;
            }
        }

        if(foundIndex !== this.hoveredIndex){
            this.hoveredIndex = foundIndex;
            this.draw();
        }
    }

    showError() {
        const ctx = this.plotCtx;
        const { width, height } = this.plotCanvas;
        ctx.fillStyle = '#0c1323';
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = '#e94560';
        ctx.textAlign = 'center';
        ctx.fillText("Error: Could not compute eigensystem.", width / 2, height / 2);
    }
}
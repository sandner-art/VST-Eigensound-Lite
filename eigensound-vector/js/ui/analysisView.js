// --- AnalysisView Module ---
// Responsible for all visualizations in Panel 2 (eigen-analyzer).

import math from '../vendor/math-wrapper.js';

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
        this.plotCanvas.addEventListener('mouseleave', () => {
            if (this.hoveredIndex !== -1) {
                this.hoveredIndex = -1;
                this.draw();
            }
        });

        console.log("AnalysisView initialized.");
    }

    resize() {
        this.plotCanvas.width = this.plotContainer.clientWidth;
        this.plotCanvas.height = this.plotContainer.clientHeight;
        this.vectorCanvas.width = this.vectorContainer.clientWidth;
        this.vectorCanvas.height = this.vectorContainer.clientHeight;
        if(this.lastEigensystem) this.update(this.lastEigensystem);
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

        let maxIm = 1, maxRe = 1;
        values.forEach(v => {
            const val = math.complex(v);
            if (Math.abs(val.im) > maxIm) maxIm = Math.abs(val.im);
            if (Math.abs(val.re) > maxRe) maxRe = Math.abs(val.re);
        });

        ctx.fillStyle = '#0c1323';
        ctx.fillRect(0, 0, width, height);
        ctx.strokeStyle = '#2a3a5e';
        ctx.lineWidth = 1;

        const originX = width / 2;
        const originY = height / 2;
        ctx.beginPath();
        ctx.moveTo(0, originY); ctx.lineTo(width, originY);
        ctx.moveTo(originX, 0); ctx.lineTo(originX, height);
        ctx.stroke();

        ctx.font = "10px sans-serif";
        ctx.fillStyle = "#555";
        ctx.textAlign = "left";
        ctx.fillText("Frequency (Im)", originX + 5, 12);
        ctx.textAlign = "right";
        ctx.fillText("Damping (Re)", width - 5, originY - 5);


        for (let i = 0; i < values.length; i++) {
            const v = math.complex(values[i]);
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
        
        ctx.fillStyle = '#0c1323';
        ctx.fillRect(0, 0, width, height);

        if (!this.lastEigensystem || index < 0 || index >= this.lastEigensystem.vectors.length) {
            ctx.fillStyle = '#555';
            ctx.textAlign = 'center';
            ctx.font = '12px sans-serif';
            ctx.fillText("Hover over an eigenvalue to see its mode shape", width / 2, height / 2);
            return;
        }
        
        // --- THIS IS THE CRITICAL FIX ---
        // Eigenvectors from math.eigs are the COLUMNS of the returned matrix.
        // We need to extract the column corresponding to the index.
        const vector = this.lastEigensystem.vectors.map(row => row[index]);
        // --- END OF FIX ---
        
        const barWidth = width / vector.length;
        
        let maxMag = 0;
        vector.forEach(v => {
            const mag = math.abs(v);
            if(mag > maxMag) maxMag = mag;
        });

        for(let i=0; i<vector.length; i++) {
            const val = math.complex(vector[i]);
            const mag = math.abs(val);
            const barHeight = maxMag > 0 ? (mag / maxMag) * (height * 0.95) : 0;
            const hue = (math.arg(val) + Math.PI) / (2 * Math.PI) * 360;

            ctx.fillStyle = `hsl(${hue}, 80%, 60%)`;
            ctx.fillRect(i * barWidth + barWidth * 0.1, height - barHeight, barWidth * 0.8, barHeight);
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
            const val = math.complex(v);
            if (Math.abs(val.im) > maxIm) maxIm = Math.abs(val.im);
            if (Math.abs(val.re) > maxRe) maxRe = Math.abs(val.re);
        });

        const originX = this.plotCanvas.width / 2;
        const originY = this.plotCanvas.height / 2;
        
        let foundIndex = -1;
        let min_dist_sq = 10 * 10;

        for (let i = 0; i < values.length; i++) {
            const v = math.complex(values[i]);
            const x = originX + (v.re / maxRe) * (originX * 0.9);
            const y = originY - (v.im / maxIm) * (originY * 0.9);
            const dist_sq = (mouseX - x)**2 + (mouseY - y)**2;
            if(dist_sq < min_dist_sq){
                min_dist_sq = dist_sq;
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
        ctx.font = '12px sans-serif';
        ctx.fillText("Error: Could not compute eigensystem.", width / 2, height / 2);
        
        const vecCtx = this.vectorCtx;
        vecCtx.fillStyle = '#0c1323';
        vecCtx.fillRect(0, 0, vecCtx.canvas.width, vecCtx.canvas.height);
    }
}
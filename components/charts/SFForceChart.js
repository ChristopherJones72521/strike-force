class SFForceChart extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._data = null;
        this._activeMetric = 'max';
        this.chart = null;
        this._options = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)',
                        borderColor: 'transparent'
                    },
                    border: {
                        display: false
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.6)',
                        font: {
                            size: 10
                        },
                        padding: 8
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    border: {
                        display: false
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.6)',
                        font: {
                            size: 10
                        },
                        padding: 8
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(20, 20, 20, 0.9)',
                    titleColor: 'rgba(255, 255, 255, 0.8)',
                    bodyColor: 'rgba(255, 255, 255, 0.8)',
                    padding: 10,
                    cornerRadius: 6,
                    displayColors: false
                }
            },
            elements: {
                line: {
                    tension: 0.4
                },
                point: {
                    radius: 4,
                    hoverRadius: 6
                }
            },
            layout: {
                padding: {
                    left: 0,
                    right: 0,
                    top: 8,
                    bottom: 8
                }
            }
        };
    }

    connectedCallback() {
        // Set initial style
        this.render();
        
        // Listen for toggle changes
        this.addEventListener('metric-change', (e) => {
            this._activeMetric = e.detail.metric;
            this.updateChart();
        });
        
        // Initialize the chart
        window.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => this.setupChart(), 100);
        });
        
        // Set a fallback timer in case the DOMContentLoaded event already fired
        setTimeout(() => {
            if (!this.chart) {
                this.setupChart();
            }
        }, 500);
    }

    set data(value) {
        this._data = value;
        this.updateChart();
    }

    get data() {
        return this._data;
    }

    render() {
        const style = `
            :host {
                display: block;
                width: 100%;
                height: 100%;
            }
            .chart-container {
                width: 100%;
                height: 100%;
                position: relative;
                padding: 0;
            }
            canvas {
                width: 100% !important;
                max-width: 100%;
                height: 100% !important;
                max-height: 100%;
            }
        `;

        this.shadowRoot.innerHTML = `
            <style>${style}</style>
            <div class="chart-container">
                <canvas></canvas>
            </div>
        `;
    }

    getDefaultChartData() {
        // Default sample data
        const timestamps = [
            '2025-03-20T10:00:00', 
            '2025-03-21T11:30:00', 
            '2025-03-22T15:45:00', 
            '2025-03-23T14:15:00', 
            '2025-03-24T09:30:00',
            '2025-03-25T16:20:00',
            '2025-03-26T12:10:00',
            '2025-03-27T08:45:00'
        ];
        
        const maxValues = [12.3, 13.7, 11.9, 14.7, 13.2, 12.8, 14.2, 14.0];
        const avgValues = [8.3, 9.1, 7.9, 8.7, 8.0, 8.5, 8.3, 8.4];
        
        // Create formatted dates for display
        const formattedDates = timestamps.map(ts => {
            const date = new Date(ts);
            return `${date.getMonth()+1}/${date.getDate()}`;
        });
        
        return {
            labels: formattedDates,
            datasets: [{
                label: 'Max Force',
                data: maxValues,
                borderColor: '#2979FF',
                backgroundColor: 'rgba(41, 121, 255, 0.2)',
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6,
                fill: true
            }, {
                label: 'Avg Force',
                data: avgValues,
                borderColor: '#4CAF50',
                backgroundColor: 'rgba(76, 175, 80, 0.2)',
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6,
                fill: true,
                hidden: true
            }]
        };
    }

    setupChart() {
        const chartEl = this.shadowRoot.querySelector('canvas');
        const ctx = chartEl.getContext('2d');
        
        // Destroy existing chart if it exists
        if (this.chart) {
            this.chart.destroy();
        }
        
        // Use provided data or default if none available
        const chartData = this._data || this.getDefaultChartData();
        
        // Create the chart
        this.chart = new Chart(ctx, {
            type: 'line',
            data: chartData,
            options: this._options
        });
    }
    
    updateChart() {
        if (!this.chart) {
            return this.setupChart();
        }
        
        // Use provided data or default if none available
        const chartData = this._data || this.getDefaultChartData();
        
        // Update chart data
        this.chart.data = chartData;
        this.chart.update();
    }
    
    setActiveDataset(index) {
        if (!this.chart) return;
        
        // Hide all datasets
        this.chart.data.datasets.forEach((dataset, i) => {
            this.chart.setDatasetVisibility(i, i === index);
        });
        
        // Update the chart
        this.chart.update();
    }
    
    updateChartData(data) {
        this._data = data;
        this.updateChart();
    }
}

customElements.define('sf-force-chart', SFForceChart);

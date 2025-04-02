// Session Graphs Module
class SessionGraphs {
    constructor() {
        this.graphs = new Map();
        this.defaultOptions = {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 250
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.5)',
                        font: {
                            size: 10
                        }
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.5)',
                        font: {
                            size: 10
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        };
    }

    // Initialize Arcade Mode single punch graph
    initArcadeGraph(canvasId, data) {
        const ctx = document.getElementById(canvasId).getContext('2d');
        
        const gradientFill = ctx.createLinearGradient(0, 0, 0, 160);
        gradientFill.addColorStop(0, 'rgba(99, 102, 241, 0.5)');
        gradientFill.addColorStop(1, 'rgba(99, 102, 241, 0)');

        const config = {
            type: 'line',
            data: {
                labels: data.timestamps,
                datasets: [{
                    label: 'Force',
                    data: data.force,
                    borderColor: 'rgba(99, 102, 241, 1)',
                    borderWidth: 2,
                    fill: true,
                    backgroundColor: gradientFill,
                    tension: 0.4,
                    pointRadius: 0
                }]
            },
            options: {
                ...this.defaultOptions,
                scales: {
                    ...this.defaultOptions.scales,
                    x: {
                        ...this.defaultOptions.scales.x,
                        display: false
                    }
                }
            }
        };

        this.graphs.set(canvasId, new Chart(ctx, config));
    }

    // Initialize Workout Mode session graph
    initWorkoutGraph(canvasId, data) {
        const ctx = document.getElementById(canvasId).getContext('2d');
        
        const config = {
            type: 'line',
            data: {
                labels: data.timestamps,
                datasets: [{
                    label: 'Force',
                    data: data.force,
                    borderColor: 'rgba(34, 197, 94, 1)',
                    borderWidth: 2,
                    fill: false,
                    tension: 0.3,
                    pointRadius: 2,
                    pointBackgroundColor: 'rgba(34, 197, 94, 1)'
                }]
            },
            options: {
                ...this.defaultOptions,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    tooltip: {
                        enabled: true,
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: 'rgba(255, 255, 255, 0.8)',
                        bodyColor: 'rgba(255, 255, 255, 0.8)',
                        displayColors: false
                    }
                }
            }
        };

        this.graphs.set(canvasId, new Chart(ctx, config));
    }

    // Initialize Challenge Mode comparison graph
    initChallengeGraph(canvasId, data) {
        const ctx = document.getElementById(canvasId).getContext('2d');
        
        const config = {
            type: 'bar',
            data: {
                labels: ['You', 'Opponent'],
                datasets: [{
                    data: [data.player1Force, data.player2Force],
                    backgroundColor: [
                        'rgba(234, 179, 8, 0.5)',
                        'rgba(255, 255, 255, 0.2)'
                    ],
                    borderColor: [
                        'rgba(234, 179, 8, 1)',
                        'rgba(255, 255, 255, 0.5)'
                    ],
                    borderWidth: 2,
                    borderRadius: 4
                }]
            },
            options: {
                ...this.defaultOptions,
                scales: {
                    x: {
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        beginAtZero: true
                    }
                }
            }
        };

        this.graphs.set(canvasId, new Chart(ctx, config));
    }

    // Initialize Fight Mode real-time graph
    initFightGraph(canvasId, data) {
        const ctx = document.getElementById(canvasId).getContext('2d');
        
        const config = {
            type: 'line',
            data: {
                labels: data.timestamps,
                datasets: [
                    {
                        label: 'You',
                        data: data.player1Force,
                        borderColor: 'rgba(239, 68, 68, 1)',
                        backgroundColor: 'rgba(239, 68, 68, 0.2)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 0
                    },
                    {
                        label: 'Opponent',
                        data: data.player2Force,
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 0
                    }
                ]
            },
            options: {
                ...this.defaultOptions,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            color: 'rgba(255, 255, 255, 0.7)',
                            boxWidth: 12,
                            padding: 8
                        }
                    }
                }
            }
        };

        this.graphs.set(canvasId, new Chart(ctx, config));
    }

    // Update methods for real-time data
    updateArcadeGraph(canvasId, newData) {
        const graph = this.graphs.get(canvasId);
        if (graph) {
            graph.data.labels = newData.timestamps;
            graph.data.datasets[0].data = newData.force;
            graph.update('none'); // Use 'none' for smooth updates
        }
    }

    updateWorkoutGraph(canvasId, newData) {
        const graph = this.graphs.get(canvasId);
        if (graph) {
            graph.data.labels.push(...newData.timestamps);
            graph.data.datasets[0].data.push(...newData.force);
            
            // Keep only last 20 data points for performance
            if (graph.data.labels.length > 20) {
                graph.data.labels = graph.data.labels.slice(-20);
                graph.data.datasets[0].data = graph.data.datasets[0].data.slice(-20);
            }
            
            graph.update('none');
        }
    }

    updateFightGraph(canvasId, newData) {
        const graph = this.graphs.get(canvasId);
        if (graph) {
            graph.data.labels.push(newData.timestamp);
            graph.data.datasets[0].data.push(newData.player1Force);
            graph.data.datasets[1].data.push(newData.player2Force);
            
            // Keep only last 10 seconds of data
            if (graph.data.labels.length > 10) {
                graph.data.labels = graph.data.labels.slice(-10);
                graph.data.datasets[0].data = graph.data.datasets[0].data.slice(-10);
                graph.data.datasets[1].data = graph.data.datasets[1].data.slice(-10);
            }
            
            graph.update('none');
        }
    }

    // Cleanup method
    destroyGraph(canvasId) {
        const graph = this.graphs.get(canvasId);
        if (graph) {
            graph.destroy();
            this.graphs.delete(canvasId);
        }
    }
}

// Export as a singleton
export const sessionGraphs = new SessionGraphs();

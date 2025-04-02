/* 
 * Strike Force App 
 * Core application logic and state management
 * 
 * Features:
 * - Central data store for session information
 * - Dynamic visualization of force metrics
 * - Responsive UI with interactive components
 * - Support for multiple session types
 * 
 * Last updated: March 27, 2025
 */

class App {
    constructor() {
        this.state = {
            user: {
                id: 'user123',
                name: 'Chris',
                profilePic: null
            },
            sessions: [],
            stats: {
                today: {
                    force: 12.3,
                    maxForce: 14.7,
                    avgForce: 8.3
                },
                allTime: {
                    maxForce: 14.7,
                    avgForce: 8.3,
                    fastestHands: 360,
                    totalSessions: 65,
                    fightsWon: 65,
                    challengesWon: 23
                }
            }
        };
        
        // Initialize with mock data
        this.loadMockData();
    }
    
    async init() {
        // Remove any grid debug overlays that might be active from browser extensions
        document.querySelectorAll('.__grid-overlay__').forEach(el => el.remove());
        
        // Setup routes
        window.addEventListener('hashchange', () => this.handleRoute());
        window.addEventListener('DOMContentLoaded', () => this.handleRoute());
        
        // Initialize feather icons
        feather.replace();
        
        // Setup event listeners
        this.setupEventListeners();
    }
    
    handleRoute() {
        const hash = window.location.hash || '#/';
        
        // Clear current view
        const app = document.getElementById('app');
        
        // Route to correct view
        if (hash === '#/') {
            this.loadView('/views/home.html');
        } else if (hash === '#/history') {
            this.loadView('/views/history.html');
        } else if (hash === '#/leaderboard') {
            this.loadView('/views/leaderboard.html');
        } else if (hash === '#/profile') {
            this.loadView('/views/profile.html');
        } else if (hash === '#/session') {
            this.loadView('/views/session.html');
        } else {
            this.loadView('/views/home.html');
        }
        
        // Update active nav status
        document.querySelectorAll('nav a').forEach(link => {
            if (link.getAttribute('href') === hash) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    async loadView(viewPath) {
        try {
            const response = await fetch(viewPath);
            const html = await response.text();
            
            document.getElementById('app').innerHTML = html;
            
            // Reinitialize icons after view change
            feather.replace();
            
            // Setup chart and other components
            this.initViewComponents();
        } catch (error) {
            console.error('Error loading view:', error);
        }
    }
    
    initViewComponents() {
        // Initialize force chart if present
        const forceChart = document.querySelector('sf-force-chart');
        if (forceChart) {
            // Listen for metric toggle changes
            document.addEventListener('metric-change', (e) => {
                if (forceChart) {
                    const { metric } = e.detail;
                    forceChart.setActiveDataset(metric === 'max' ? 0 : 1);
                }
            });
            
            // Get filtered sessions and set chart data
            const timeFilter = document.querySelector('sf-segmented-control');
            if (timeFilter) {
                const selectedOption = timeFilter.querySelector('button[selected]');
                const timeFrame = selectedOption ? selectedOption.value || selectedOption.textContent : 'week';
                
                const filteredSessions = this.filterSessionsByTimeFrame(timeFrame);
                const chartData = this.formatSessionDataForChart(filteredSessions);
                
                forceChart.updateChartData(chartData);
                
                // Listen for time filter changes - fix the event name to match what the component dispatches
                timeFilter.addEventListener('change', (e) => {
                    const timeFrame = e.detail.value;
                    const filteredSessions = this.filterSessionsByTimeFrame(timeFrame);
                    const chartData = this.formatSessionDataForChart(filteredSessions);
                    forceChart.updateChartData(chartData);
                });
            }
        }
        
        // Initialize session section if present
        const sessionSection = document.querySelector('sf-session-section');
        if (sessionSection) {
            sessionSection.sessions = this.state.sessions.slice(0, 10);
        }
        
        // Update metric cards if present
        this.updateMetricCards();
    }
    
    setupEventListeners() {
        // Handle grid overlay debug tools if they exist
        if (window.__gridOverlay) {
            window.__gridOverlay.disable();
            delete window.__gridOverlay;
        }
        
        // Remove all overlays and debug elements
        const removeDebugElements = () => {
            document.querySelectorAll('[data-debug], [class*="debug"], [id*="debug"]').forEach(el => {
                el.remove();
            });
        };
        setTimeout(removeDebugElements, 100);
    }
    
    updateMetricCards() {
        // Update Quick Stats cards
        const maxForceCard = document.getElementById('max-force');
        const challengesWonCard = document.getElementById('challenges-won');
        const fastestHandsCard = document.getElementById('fastest-hands');
        const fightsWonCard = document.getElementById('fights-won');
        
        if (maxForceCard) {
            const valueSlot = maxForceCard.querySelector('[slot="value"]');
            if (valueSlot) {
                const maxForce = Math.max(...this.state.sessions.map(s => s.maxForce));
                valueSlot.textContent = `${maxForce.toFixed(1)}G`;
            }
        }
        
        if (challengesWonCard) {
            const valueSlot = challengesWonCard.querySelector('[slot="value"]');
            if (valueSlot) {
                // Count challenges
                const challenges = this.state.sessions
                    .filter(s => s.type === 'Challenge' && s.won)
                    .length;
                valueSlot.textContent = challenges;
            }
        }
        
        if (fastestHandsCard) {
            const valueSlot = fastestHandsCard.querySelector('[slot="value"]');
            if (valueSlot) {
                // Get max punches per minute
                const maxPPM = Math.max(...this.state.sessions.map(s => s.punchesPerMinute || 0));
                valueSlot.textContent = maxPPM;
            }
        }
        
        if (fightsWonCard) {
            const valueSlot = fightsWonCard.querySelector('[slot="value"]');
            if (valueSlot) {
                // Count fights won
                const fightsWon = this.state.sessions
                    .filter(s => s.type === 'Fight' && s.won)
                    .length;
                valueSlot.textContent = fightsWon;
            }
        }
    }
    
    // Format session data for chart
    formatSessionDataForChart(sessions) {
        // Group sessions by date
        const dateMap = new Map();
        
        sessions.forEach(session => {
            const date = new Date(session.date);
            const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
            
            if (!dateMap.has(dateStr)) {
                dateMap.set(dateStr, {
                    maxForces: [],
                    avgForces: []
                });
            }
            
            dateMap.get(dateStr).maxForces.push(session.maxForce);
            dateMap.get(dateStr).avgForces.push(session.avgForce);
        });
        
        // Sort dates chronologically
        const sortedDates = Array.from(dateMap.keys()).sort((a, b) => {
            const [aMonth, aDay] = a.split('/').map(Number);
            const [bMonth, bDay] = b.split('/').map(Number);
            
            if (aMonth !== bMonth) {
                return aMonth - bMonth;
            }
            
            return aDay - bDay;
        });
        
        // Calculate max value for each day
        const maxValues = sortedDates.map(date => {
            const forces = dateMap.get(date).maxForces;
            return Math.max(...forces);
        });
        
        // Calculate avg value for each day
        const avgValues = sortedDates.map(date => {
            const forces = dateMap.get(date).avgForces;
            return forces.reduce((sum, force) => sum + force, 0) / forces.length;
        });
        
        return {
            labels: sortedDates,
            datasets: [
                {
                    label: 'Max Force',
                    data: maxValues,
                    borderColor: '#2979FF',
                    backgroundColor: 'rgba(41, 121, 255, 0.2)',
                    tension: 0.4,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    fill: true
                },
                {
                    label: 'Avg Force',
                    data: avgValues,
                    borderColor: '#4CAF50',
                    backgroundColor: 'rgba(76, 175, 80, 0.2)',
                    tension: 0.4,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    fill: true,
                    hidden: true
                }
            ]
        };
    }
    
    filterSessionsByTimeFrame(timeFrame) {
        const now = new Date();
        const sessions = this.state.sessions;
        
        switch (timeFrame) {
            case 'day':
                // Last 24 hours
                return sessions.filter(session => {
                    const sessionDate = new Date(session.date);
                    return (now - sessionDate) <= 24 * 60 * 60 * 1000;
                });
            case 'week':
                // Last 7 days
                return sessions.filter(session => {
                    const sessionDate = new Date(session.date);
                    return (now - sessionDate) <= 7 * 24 * 60 * 60 * 1000;
                });
            case 'month':
                // Last 30 days
                return sessions.filter(session => {
                    const sessionDate = new Date(session.date);
                    return (now - sessionDate) <= 30 * 24 * 60 * 60 * 1000;
                });
            case 'year':
                // Last 365 days
                return sessions.filter(session => {
                    const sessionDate = new Date(session.date);
                    return (now - sessionDate) <= 365 * 24 * 60 * 60 * 1000;
                });
            case 'all':
            default:
                return sessions;
        }
    }
    
    // Load mock data for testing
    loadMockData() {
        const sessionTypes = ['Arcade', 'Fitness', 'Challenge', 'Fight'];
        const sessions = [];
        
        // Current date
        const now = new Date();
        
        // Ensure we have at least one of each session type
        const guaranteedSessions = [
            // Arcade - Power
            {
                id: 'session-arcade-power',
                type: 'Arcade',
                subType: 'power',
                date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 10, 30).toISOString(),
                duration: 1,
                maxForce: 13.7,
                avgForce: 10.2,
                strikes: 5, // Few strikes = power type
                punchesPerMinute: 60,
                calories: 120,
                won: true
            },
            // Arcade - Speed
            {
                id: 'session-arcade-speed',
                type: 'Arcade',
                subType: 'speed',
                date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2, 15, 45).toISOString(),
                duration: 3,
                maxForce: 9.8,
                avgForce: 7.5,
                strikes: 250, // Many strikes = speed type
                punchesPerMinute: 300,
                calories: 180,
                won: true
            },
            // Challenge - Power
            {
                id: 'session-challenge-power',
                type: 'Challenge',
                subType: 'power',
                date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3, 9, 15).toISOString(),
                duration: 2,
                maxForce: 14.2,
                avgForce: 11.3,
                strikes: 8, // Few strikes = power type
                punchesPerMinute: 70,
                calories: 150,
                won: true
            },
            // Challenge - Speed
            {
                id: 'session-challenge-speed',
                type: 'Challenge',
                subType: 'speed',
                date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 4, 16, 20).toISOString(),
                duration: 2,
                maxForce: 10.4,
                avgForce: 8.1,
                strikes: 280, // Many strikes = speed type
                punchesPerMinute: 320,
                calories: 200,
                won: false
            },
            // Fight
            {
                id: 'session-fight',
                type: 'Fight',
                date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 5, 18, 0).toISOString(),
                duration: 8,
                maxForce: 12.8,
                avgForce: 9.6,
                strikes: 150,
                punchesPerMinute: 160,
                calories: 350,
                won: true
            },
            // Fitness
            {
                id: 'session-fitness',
                type: 'Fitness',
                date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6, 7, 30).toISOString(),
                duration: 25,
                maxForce: 11.5,
                avgForce: 8.8,
                strikes: 320,
                punchesPerMinute: 140,
                calories: 450,
                won: null
            }
        ];
        
        // Add guaranteed session types
        sessions.push(...guaranteedSessions);
        
        // Create additional random data for the last 14 days
        for (let i = 0; i < 20; i++) {
            // Create 1-2 sessions per day for more variety
            const sessionsPerDay = 1 + Math.floor(Math.random() * 2);
            
            for (let j = 0; j < sessionsPerDay; j++) {
                const daysAgo = i;
                const hoursAgo = Math.floor(Math.random() * 24);
                const minutesAgo = Math.floor(Math.random() * 60);
                
                const sessionDate = new Date(now);
                sessionDate.setDate(sessionDate.getDate() - daysAgo);
                sessionDate.setHours(sessionDate.getHours() - hoursAgo);
                sessionDate.setMinutes(sessionDate.getMinutes() - minutesAgo);
                
                const sessionType = sessionTypes[Math.floor(Math.random() * sessionTypes.length)];
                const isPowerFocused = Math.random() > 0.5;
                
                // Set appropriate metrics based on session type and power/speed focus
                let maxForce, avgForce, strikes, punchesPerMinute;
                
                if (isPowerFocused) {
                    // Power-focused session (fewer strikes, higher force)
                    maxForce = 11 + Math.random() * 5; // 11-16G
                    avgForce = maxForce - 2 - Math.random() * 3;
                    strikes = Math.floor(Math.random() * 50) + 5; // 5-55 strikes
                    punchesPerMinute = Math.floor(Math.random() * 60) + 40; // 40-100 PPM
                } else {
                    // Speed-focused session (more strikes, lower force)
                    maxForce = 8 + Math.random() * 4; // 8-12G
                    avgForce = maxForce - 1 - Math.random() * 2;
                    strikes = Math.floor(Math.random() * 200) + 100; // 100-300 strikes
                    punchesPerMinute = Math.floor(Math.random() * 150) + 150; // 150-300 PPM
                }
                
                const subType = isPowerFocused ? 'power' : 'speed';
                
                sessions.push({
                    id: `session-${i}-${j}`,
                    type: sessionType,
                    subType: (sessionType === 'Arcade' || sessionType === 'Challenge') ? subType : null,
                    date: sessionDate.toISOString(),
                    duration: Math.floor(Math.random() * 20) + 5, // 5-25 minutes
                    maxForce: maxForce,
                    avgForce: avgForce,
                    strikes: strikes,
                    punchesPerMinute: punchesPerMinute,
                    calories: Math.floor(Math.random() * 300) + 100, // 100-400 calories
                    won: (sessionType === 'Fight' || sessionType === 'Challenge') ? (Math.random() > 0.3) : null // 70% chance of winning for Fight/Challenge
                });
            }
        }
        
        // Sort by date, most recent first
        this.state.sessions = sessions.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
    window.app.init(); // Call init() to set up routes and load initial view
});

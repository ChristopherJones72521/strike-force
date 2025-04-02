// Leaderboard Controller
export class LeaderboardController {
    constructor() {
        this.rankings = []; // Initialize empty array
        this.loadData();
    }

    async loadData() {
        try {
            const response = await fetch('/data/leaderboard/global.json');
            const data = await response.json();
            this.rankings = data.rankings;
            this.initializeView();
        } catch (error) {
            console.error('Error loading leaderboard data:', error);
            // Show error state
            const container = document.getElementById('leaderboardEntries');
            if (container) {
                container.innerHTML = `
                    <div class="bg-red-500/20 text-red-200 p-4 rounded-lg backdrop-blur-lg">
                        <p class="font-semibold">Error loading leaderboard data</p>
                        <p class="text-sm mt-1">Please try again later</p>
                    </div>
                `;
            }
        }
    }

    initializeView() {
        if (!this.rankings || !this.rankings.length) return;
        this.renderLeaderboard();
        this.setupFilters();
    }

    renderLeaderboard() {
        const container = document.getElementById('leaderboardEntries');
        if (!container || !this.rankings) return;

        container.innerHTML = '';

        this.rankings.forEach(user => {
            const entry = document.createElement('div');
            entry.className = 'leaderboard-entry bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 flex items-center gap-6 hover:bg-gray-700/50 transition-colors';
            
            entry.innerHTML = `
                <div class="flex items-center gap-4 min-w-[200px]">
                    <div class="text-3xl font-bold text-white/80">#${user.rank}</div>
                    <div class="h-12 w-12 bg-white/20 rounded-full flex items-center justify-center text-white text-xl font-bold">
                        ${user.name.charAt(0)}
                    </div>
                    <div>
                        <div class="font-semibold text-white">${user.name}</div>
                        <div class="text-sm text-white/60">${user.country}</div>
                    </div>
                </div>
                <div class="flex-1 flex items-center justify-end gap-6">
                    <div class="flex flex-col items-end min-w-[100px]">
                        <div class="font-bold text-white">${user.maxForce.toFixed(1)} Gs</div>
                        <div class="text-sm text-white/60">${user.totalSessions} sessions</div>
                    </div>
                    <div class="flex flex-wrap gap-2 justify-end min-w-[200px] max-w-[300px]">
                        ${user.achievements.map(achievement => `
                            <div class="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-300 text-sm whitespace-nowrap">
                                ${this.formatAchievement(achievement)}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            
            container.appendChild(entry);
        });

        // Initialize feather icons
        if (window.feather) {
            feather.replace();
        }
    }

    setupFilters() {
        const typeSelect = document.getElementById('leaderboardType');
        const timeSelect = document.getElementById('timeRange');
        const regionSelect = document.getElementById('region');

        const updateLeaderboard = () => {
            // This would normally filter and sort based on selections
            console.log('Filters:', {
                type: typeSelect?.value,
                time: timeSelect?.value,
                region: regionSelect?.value
            });
            this.renderLeaderboard();
        };

        if (typeSelect) typeSelect.addEventListener('change', updateLeaderboard);
        if (timeSelect) timeSelect.addEventListener('change', updateLeaderboard);
        if (regionSelect) regionSelect.addEventListener('change', updateLeaderboard);
    }

    formatAchievement(achievement) {
        return achievement
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }
}

export default LeaderboardController;

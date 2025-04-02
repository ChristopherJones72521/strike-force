// Session Details View Controller
class SessionDetailsController {
    constructor() {
        this.initializeElements();
        this.loadSessionData();
        this.setupEventListeners();
    }

    initializeElements() {
        // Get all display elements
        this.sessionDate = document.getElementById('sessionDate');
        this.sessionDuration = document.getElementById('sessionDuration');
        this.sessionLocation = document.getElementById('sessionLocation');
        this.participantsList = document.getElementById('participantsList');
        this.equipmentList = document.getElementById('equipmentList');
        this.sessionNotes = document.getElementById('sessionNotes');
        
        // Get action buttons
        this.editButton = document.getElementById('editSession');
        this.shareButton = document.getElementById('shareSession');
        this.cancelButton = document.getElementById('cancelSession');
    }

    loadSessionData() {
        // Get session ID from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const sessionId = urlParams.get('sessionId');

        if (!sessionId) {
            console.error('No session ID provided');
            return;
        }

        // For now, we'll use mock data
        // In a real app, this would fetch from your backend
        this.displaySessionData({
            date: new Date(urlParams.get('date') || Date.now()).toLocaleDateString(),
            duration: urlParams.get('duration') || '00:00:00',
            location: 'Main Gym',
            participants: ['Chris Johnson', 'Mike Smith'],
            equipment: ['Boxing Gloves', 'Strike Sensors', 'Timer'],
            notes: 'Great session focusing on power and accuracy.',
            force: urlParams.get('force') || '0.0',
            count: urlParams.get('count') || '0'
        });
    }

    displaySessionData(data) {
        this.sessionDate.textContent = data.date;
        this.sessionDuration.textContent = data.duration;
        this.sessionLocation.textContent = data.location;

        // Update title with force and count
        document.querySelector('.session-title').textContent = 
            `Training Session (Force: ${data.force} Gs • Count: ${data.count})`;

        // Update participants list
        this.participantsList.innerHTML = data.participants
            .map(participant => `<li>${participant}</li>`)
            .join('');

        // Update equipment list
        this.equipmentList.innerHTML = data.equipment
            .map(item => `<li>${item}</li>`)
            .join('');

        // Update notes
        this.sessionNotes.textContent = data.notes;
    }

    setupEventListeners() {
        // Edit button handler
        this.editButton?.addEventListener('click', () => {
            // Implement edit functionality
            console.log('Edit session clicked');
        });

        // Share button handler
        this.shareButton?.addEventListener('click', () => {
            if (navigator.share) {
                navigator.share({
                    title: 'Strike Force Training Session',
                    text: `Check out my training session! Force: ${document.querySelector('.session-title').textContent}`,
                    url: window.location.href
                }).catch(console.error);
            }
        });

        // Cancel button handler
        this.cancelButton?.addEventListener('click', () => {
            if (confirm('Are you sure you want to cancel this session?')) {
                // Implement cancel functionality
                console.log('Session cancelled');
                window.history.back();
            }
        });
    }
}

// Initialize controller when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SessionDetailsController();
});

// Session Service - Maps to Swift SessionService protocol/class
import { Session } from '../models/Session.js';

export class SessionService {
    constructor() {
        // In-memory cache (maps to Swift property wrapper @Published)
        this.currentSession = null;
        this.sessions = new Map();
        
        // Event system (maps to Swift Combine publishers)
        this.listeners = new Map();
        
        // Load saved sessions (maps to Swift UserDefaults or CoreData)
        this.loadSessions();
    }

    // MARK: - Session Management
    
    startSession(type, mode = null) {
        if (this.currentSession) {
            throw new Error('Session already in progress');
        }

        const session = new Session({ type, mode });
        this.currentSession = session;
        this.sessions.set(session.id, session);
        this.emit('sessionStarted', session);
        
        return session;
    }

    endSession() {
        if (!this.currentSession) {
            throw new Error('No session in progress');
        }

        this.currentSession.endTime = new Date();
        this.saveSessions();
        this.emit('sessionEnded', this.currentSession);
        
        const endedSession = this.currentSession;
        this.currentSession = null;
        
        return endedSession;
    }

    updateSessionMetrics(metrics) {
        if (!this.currentSession) {
            throw new Error('No session in progress');
        }

        this.currentSession.metrics = {
            ...this.currentSession.metrics,
            ...metrics
        };

        this.emit('metricsUpdated', this.currentSession);
    }

    // MARK: - Data Persistence
    
    saveSessions() {
        const serialized = Array.from(this.sessions.values()).map(s => s.toJSON());
        localStorage.setItem('sessions', JSON.stringify(serialized));
    }

    loadSessions() {
        try {
            const saved = localStorage.getItem('sessions');
            if (saved) {
                const parsed = JSON.parse(saved);
                parsed.forEach(sessionData => {
                    const session = Session.fromJSON(sessionData);
                    this.sessions.set(session.id, session);
                });
            }
        } catch (error) {
            console.error('Failed to load sessions:', error);
        }
    }

    // MARK: - Event System (maps to Swift Combine)
    
    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event).add(callback);
        
        // Return unsubscribe function (maps to Swift Combine cancellable)
        return () => {
            this.listeners.get(event)?.delete(callback);
        };
    }

    emit(event, data) {
        this.listeners.get(event)?.forEach(callback => callback(data));
    }

    // MARK: - Query Methods (map to Swift protocol methods)
    
    getSession(id) {
        return this.sessions.get(id);
    }

    getAllSessions() {
        return Array.from(this.sessions.values());
    }

    getSessionsByType(type) {
        return this.getAllSessions().filter(s => s.type === type);
    }

    getSessionsByDateRange(start, end) {
        return this.getAllSessions().filter(s => 
            s.startTime >= start && s.startTime <= end
        );
    }
}

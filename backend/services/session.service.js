class SessionService {
    constructor() {
      this.sessions = new Map();
    }
  
    createSession(sessionId, phoneNumber) {
      const session = {
        phoneNumber,
        data: {},
        createdAt: new Date(),
        lastActive: new Date()
      };
      this.sessions.set(sessionId, session);
      return session;
    }
  
    getSession(sessionId) {
      return this.sessions.get(sessionId);
    }
  
    updateSession(sessionId, data) {
      const session = this.getSession(sessionId);
      if (session) {
        session.data = { ...session.data, ...data };
        session.lastActive = new Date();
      }
      return session;
    }
  
    endSession(sessionId) {
      this.sessions.delete(sessionId);
    }
  
    cleanupExpiredSessions(timeout = 300000) { // 5 minutes
      const now = new Date();
      for (const [sessionId, session] of this.sessions) {
        if (now - session.lastActive > timeout) {
          this.endSession(sessionId);
        }
      }
    }
  }
  
  module.exports = new SessionService();
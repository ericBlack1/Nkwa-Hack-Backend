const SessionService = require('./session.service');
const AfricaTalkingService = require('./africastalking.service');

class USSDService {
  constructor() {
    this.menuStates = {
      INITIAL: this.handleInitialState,
      BALANCE: this.handleBalanceState,
      AIRTIME: this.handleAirtimeState,
      PAYMENTS: this.handlePaymentsState
    };
  }

  async processUSSDRequest(sessionId, phoneNumber, text) {
    // Cleanup old sessions
    SessionService.cleanupExpiredSessions();

    // Get or create session
    let session = SessionService.getSession(sessionId) || 
                 SessionService.createSession(sessionId, phoneNumber);

    // Determine current state
    const currentState = this.determineState(text, session);
    const handler = this.menuStates[currentState] || this.handleInvalidInput;

    // Process the request
    const response = await handler(text, session);

    // Update session
    SessionService.updateSession(sessionId, { currentState });

    return response;
  }

  determineState(text, session) {
    if (!text || text === '') return 'INITIAL';
    if (session.data.currentState) return session.data.currentState;
    
    const option = text.split('*')[0];
    switch(option) {
      case '1': return 'BALANCE';
      case '2': return 'AIRTIME';
      case '3': return 'PAYMENTS';
      default: return 'INVALID';
    }
  }

  handleInitialState() {
    return {
      response: `CON Welcome to AfriPay
1. Check Balance
2. Buy Airtime
3. Make Payment
4. Customer Support`,
      shouldClose: false
    };
  }

  async handleBalanceState(text, session) {
    const balance = await AfricaTalkingService.getUserBalance(session.phoneNumber);
    return {
      response: `END Your balance is ${balance}`,
      shouldClose: true
    };
  }

  async handleAirtimeState(text, session) {
    const parts = text.split('*');
    if (parts.length === 1) {
      return {
        response: `CON Enter amount:`,
        shouldClose: false
      };
    }
    
    const amount = parts[1];
    if (isNaN(amount)) {
      return {
        response: `END Invalid amount. Please try again.`,
        shouldClose: true
      };
    }
    
    const result = await AfricaTalkingService.buyAirtime(session.phoneNumber, amount);
    return {
      response: `END ${result.message}`,
      shouldClose: true
    };
  }

  handleInvalidInput() {
    return {
      response: `END Invalid input. Please try again.`,
      shouldClose: true
    };
  }
}

module.exports = new USSDService();

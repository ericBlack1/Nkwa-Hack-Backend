// backend/services/africastalking.service.js
const AfricasTalking = require('africastalking');

const credentials = {
  apiKey: process.env.AT_API_KEY,
  username: process.env.AT_USERNAME
};

const africastalking = AfricasTalking(credentials);

class AfricaTalkingService {
  static async getUserBalance(phoneNumber) {
    try {
      // Implement actual balance check
      return 'NGN 500'; // Mock response
    } catch (error) {
      console.error('Balance check failed:', error);
      return 'NGN 0';
    }
  }

  static async buyAirtime(phoneNumber, amount) {
    try {
      const airtime = africastalking.AIRTIME;
      const options = {
        recipients: [{
          phoneNumber,
          amount: `${amount}`,
          currencyCode: 'NGN'
        }]
      };
      
      const response = await airtime.send(options);
      return { success: true, message: 'Airtime purchase successful' };
    } catch (error) {
      console.error('Airtime purchase failed:', error);
      return { success: false, message: 'Failed to purchase airtime' };
    }
  }

  static async sendSMS(phoneNumber, message) {
    const sms = africastalking.SMS;
    const options = {
      to: [phoneNumber],
      message: message
    };
    
    return sms.send(options);
  }
}

module.exports = AfricaTalkingService;

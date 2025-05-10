// backend/controllers/ussd.controller.js
const USSDService = require('../services/ussd.service');

const handleUSSDRequest = async (req, res) => {
  try {
    const { sessionId, serviceCode, phoneNumber, text } = req.body;
    
    const result = await USSDService.processUSSDRequest(
      sessionId, 
      phoneNumber, 
      text || ''
    );

    res.set('Content-Type', 'text/plain');
    res.send(result.response);

    if (result.shouldClose) {
      SessionService.endSession(sessionId);
    }
  } catch (error) {
    console.error('USSD processing error:', error);
    res.set('Content-Type', 'text/plain');
    res.send('END An error occurred. Please try again later.');
  }
};

module.exports = { handleUSSDRequest };

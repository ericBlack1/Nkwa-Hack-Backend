// backend/routes/ussd.routes.js
const express = require('express');
const router = express.Router();
const ussdController = require('../controllers/ussd.controller');

router.post('/', ussdController.handleUSSDRequest);

module.exports = router;

const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser'); // Add this for USSD
const setupSwagger = require("./utils/swagger");
const verificationRoutes = require("./routes/verification.routes");
const PasswordRecoveryRoutes = require("./routes/passwordRecovery.routes");
const ussdRoutes = require('./routes/ussd.routes'); // Add this line

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// USSD-specific middleware (must come before other middleware)
app.use('/ussd', 
  bodyParser.urlencoded({ extended: false }), // Parse USSD form data
  (req, res, next) => {
    // Special CORS handling for USSD if needed
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
  }
);

// Initialize Swagger
setupSwagger(app);

// Routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/wallet", require("./routes/wallet.routes"));
app.use("/api/payments", require("./routes/payment.routes"));
app.use("/api/verification", verificationRoutes);
app.use("/api/password", PasswordRecoveryRoutes);
app.use("/ussd", ussdRoutes); // Add USSD routes

// Basic route to test if server is running
app.get("/", (req, res) => {
  res.redirect("/api-docs");
});

module.exports = app;

const express = require("express");
const cors = require("cors");
const setupSwagger = require("./utils/swagger"); // Updated import
const verificationRoutes = require("./routes/verification.routes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Swagger
setupSwagger(app); // This should come before your routes

// Routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/wallet", require("./routes/wallet.routes"));
app.use("/api/payments", require("./routes/payment.routes"));
app.use("/api/verification", verificationRoutes);

// Basic route to test if server is running
app.get("/", (req, res) => {
  res.redirect("/api-docs");
});

module.exports = app;

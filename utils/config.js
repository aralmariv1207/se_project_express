require("dotenv").config(); // Load environment variables from .env file

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-here"; // In production, this would be an environment variable

module.exports = { JWT_SECRET }; // Export the JWT secret for use in other parts of the application
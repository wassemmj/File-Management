const jwt = require("jsonwebtoken");


// Generate an access token (short-lived)
const generateAccessToken = (data) => {
    return jwt.sign(
        data, // Payload
        'MySecureKey',                 // Secret key
        { expiresIn: "15m" }               // Valid for 15 minutes
    );
};

// Generate a refresh token (long-lived)
const generateRefreshToken = (data) => {
    return jwt.sign(
        data,
        'MySecureKeyRef',
        { expiresIn: "7d" } // Valid for 7 days
    );
};

module.exports = { generateAccessToken, generateRefreshToken };
const jwt = require("jsonwebtoken");

function generateAccessToken(data) {
  return jwt.sign({ data }, process.env.TOKEN_SECRET, { expiresIn: "2592000s" });
}

module.exports = generateAccessToken;

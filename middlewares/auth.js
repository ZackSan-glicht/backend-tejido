const { auth } = require('express-oauth2-jwt-bearer');
require('dotenv').config();

// Este es el middleware que validará que el token enviado por el frontend sea real
const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  tokenSigningAlg: 'RS256'
});

module.exports = checkJwt;
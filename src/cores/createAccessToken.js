const jwt = require('jsonwebtoken')

function createAccessToken(data) {
    return jwt.sign(data, process.env.JWT_SECRET) //{ expiresIn: '10s' }
}

module.exports = createAccessToken;
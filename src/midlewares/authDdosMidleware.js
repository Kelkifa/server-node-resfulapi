const rateLimit = require('express-rate-limit');

function authDdosMidleware(limit = 4) {
    return rateLimit({
        windowMs: 5 * 60 * 1000, // 5 minutes
        max: limit,
        message: 'Too many request'
    });
}
module.exports = authDdosMidleware;

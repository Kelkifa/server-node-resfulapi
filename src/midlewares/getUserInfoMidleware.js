const jwt = require('jsonwebtoken');

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns add userId into req
 */

function getUserInfoMidleware(req, res, next) {
    req.body.userId = undefined;
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1]

    if (!token)
        return next();
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.body.userId = decoded.userId;
        return next();
    } catch (err) {
        console.log(`[DECODED GET USERINFO ERR]`, err);
        return next();
    }

    // next();

}

module.exports = getUserInfoMidleware;
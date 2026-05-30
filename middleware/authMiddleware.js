const jwt = require ("jsonwebtoken");

const JWT_SECRET = "leao-de-juda-2026";

function authenticateToken (req, res, next) {
    const token =  req.cookies?.token;

    if (!token) {
        return res.redirect("/");
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.redirect("/");
    }
}

module.exports = { authenticateToken, JWT_SECRET};
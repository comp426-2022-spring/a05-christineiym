// Route (endpoint) definitions for debug
const express = require("express");
const HTTP_STATUS_OK = 200;

// debugRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware.
const debugRoutes = express.Router();

// READ a list of access log records (HTTP method GET) at endpoint /app/log/access
debugRoutes.route('/app/log/access/').get(function (req, res, next) {
    try {
        const stmt = db.prepare('SELECT * FROM accesslogs').all()
        res.status(HTTP_STATUS_OK).json(stmt)
    } catch {
        console.error(e)
    }
});

// Error test (taken with modification from thi link:
// http://expressjs.com/en/guide/error-handling.html)
debugRoutes.route('/app/error/').get(function (req, res, next) {
    throw new Error('Error test successful.') // Express will catch this on its own.
})

module.exports = debugRoutes;
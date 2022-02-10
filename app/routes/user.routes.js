module.exports = (app) => {
    const user = require('../controllers/user.controller.js');

    // Register
    app.post("/api/register", user.register)

    // Login
    app.post("/api/login", user.login)
}
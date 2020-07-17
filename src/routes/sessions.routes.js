const { Router } = require('express');

const AuthController = require('../controllers/AuthController');

const sessionsRouter = Router();

sessionsRouter.post("/authenticate", AuthController.authenticate); // 

module.exports = sessionsRouter;
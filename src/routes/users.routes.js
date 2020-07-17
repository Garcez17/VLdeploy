const { Router } = require('express');

const AuthController = require('../controllers/AuthController');

const usersRouter = Router();

usersRouter.post("/register", AuthController.create);

module.exports = usersRouter;
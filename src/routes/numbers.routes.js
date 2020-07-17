const { Router } = require('express');

const NumberController = require('../controllers/NumberController');

const numbersRouter = Router();

const ensureAuthenticated = require('../middlewares/ensureAuthenticated');

numbersRouter.get("/:raffle_id", NumberController.index);

numbersRouter.get("/:raffle_id/:number_id", ensureAuthenticated, NumberController.show); //

module.exports = numbersRouter;
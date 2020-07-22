const { Router } = require('express');

const OrderController = require('../controllers/OrderController');

const ordersRouter = Router();

const ensureAuthenticated = require('../middlewares/ensureAuthenticated');

ordersRouter.get("/:raffle_id", ensureAuthenticated, OrderController.index);
ordersRouter.get("/:raffle_id/:search/order-id", OrderController.searchId);
ordersRouter.get("/:raffle_id/order-name", OrderController.searchName);
ordersRouter.get("/:raffle_id/:cpf", OrderController.show);

ordersRouter.post("/buy/:raffle_id", OrderController.create);

ordersRouter.put("/approve/:raffle_id/:order_id", ensureAuthenticated, OrderController.update);
ordersRouter.delete("/reject/:raffle_id/:order_id", ensureAuthenticated, OrderController.destroy);

module.exports = ordersRouter;
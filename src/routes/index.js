const { Router } = require('express');

const ordersRouter = require('./orders.routes');
const sessionsRouter = require('./sessions.routes');
const usersRouter = require('./users.routes');
const rafflesRouter = require('./raffles.routes');
const affiliatesRouter = require('./affiliates.routes');
const paymentsRouter = require('./payments.routes');
const numbersRouter = require('./numbers.routes');

const routes = Router();

routes.use('/orders', ordersRouter);
routes.use('/raffles', rafflesRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/affiliates', affiliatesRouter);
routes.use('/payments', paymentsRouter);
routes.use('/numbers', numbersRouter);
routes.use('/admin', usersRouter);

module.exports = routes;
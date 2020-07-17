const { Router } = require('express');
const multer = require('multer');

const multerConfig = require('../config/multer');

const MethodsPaysController = require('../controllers/MethodsPaysController');

const paymentsRouter = Router();
const upload = multer(multerConfig);

const ensureAuthenticated = require('../middlewares/ensureAuthenticated');

paymentsRouter.get("/", MethodsPaysController.index);

paymentsRouter.post("/", ensureAuthenticated, upload.single('image'), MethodsPaysController.create); //
paymentsRouter.put("/:id", ensureAuthenticated, MethodsPaysController.update); //
paymentsRouter.delete("/:id", ensureAuthenticated, MethodsPaysController.destroy); //

module.exports = paymentsRouter;
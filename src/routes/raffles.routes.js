const { Router } = require('express');
const multer = require('multer');

const multerConfig = require('../config/multer');

const RaffleController = require('../controllers/RaffleController');

const rafflesRouter = Router();
const upload = multer(multerConfig);

const ensureAuthenticated = require('../middlewares/ensureAuthenticated');

rafflesRouter.get("/:id/winners", RaffleController.showinners);
rafflesRouter.get("/", RaffleController.index);
rafflesRouter.get("/:id/unique", RaffleController.show);
rafflesRouter.get("/home-filter", RaffleController.indexfilter);
rafflesRouter.get("/principal/homeraffle", RaffleController.indexhome);

rafflesRouter.post("/", ensureAuthenticated, upload.array('image', 2), RaffleController.create);
rafflesRouter.put("/:id", ensureAuthenticated, RaffleController.finalize);
rafflesRouter.put("/:id/edit", ensureAuthenticated, RaffleController.update);
rafflesRouter.delete("/:id", ensureAuthenticated, RaffleController.destroy);

module.exports = rafflesRouter;
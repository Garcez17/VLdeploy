const { Router } = require('express');

const AffiliatesController = require('../controllers/AffiliatesController');

const affiliatesRouter = Router();

const ensureAuthenticated = require('../middlewares/ensureAuthenticated');

affiliatesRouter.get("/", AffiliatesController.index);
affiliatesRouter.get("/:id", AffiliatesController.show);

affiliatesRouter.post("/", ensureAuthenticated, AffiliatesController.create); //
affiliatesRouter.put("/:id", ensureAuthenticated, AffiliatesController.update); //
affiliatesRouter.delete("/:id", ensureAuthenticated, AffiliatesController.destroy); //

module.exports = affiliatesRouter;
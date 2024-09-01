const express = require("express");
const router = express.Router();

const productionController = require("../app/controllers/ProductionController");

router.get("/create", productionController.create);
router.get("/search/price/view/page/:page", productionController.searchPriceViewPagination);
router.get("/search/date/view", productionController.searchDateView);
router.get("/search/price/view", productionController.searchPriceView);
router.get("/search", productionController.searchIndex);
router.get("/search/page/:page", productionController.search)
router.get("/sort/date/product", productionController.dateSort);
router.get("/type/sort/date/product", productionController.dateTypeSort);
router.get("/type/sort/date/product/page/:page", productionController.sortTypepagination);
router.get("/sort/date/page/:page", productionController.sortpagination);
router.get("/page/:page", productionController.pagination);
router.get("/type/:type", productionController.type);
router.get("/type/:type/page/:page", productionController.typepagination);
router.post("/store", productionController.store);
router.get("/:id/edit", productionController.edit);
router.post("/trash/handle-form-actions", productionController.handleFormActions);
router.post("/handle-form-actions", productionController.handleFormActions);
router.put("/:id", productionController.update);
router.delete("/order/:id/force", productionController.forceDeleteOrder);
router.delete("/:id/force", productionController.forceDelete);
router.delete("/:id", productionController.delete);
router.get("/:slug", productionController.show);
router.patch("/:id/restore", productionController.restore);
router.get("/", productionController.index);

module.exports = router;

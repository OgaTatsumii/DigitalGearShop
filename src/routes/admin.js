const express = require("express");
const router = express.Router();

const adminController = require("../app/controllers/AdminController");

router.get("/stored/production", adminController.storedProductions);
router.get("/stored/account", adminController.storedAccounts);
router.get("/stored/order", adminController.storedOrder);
router.get("/trash/order", adminController.trashOrders);
router.get("/trash/production", adminController.trashProductions);
router.get("/myOrderSearch", adminController.myOrdersearch)
router.get("/search/situation/order", adminController.situationSearchOrder)
router.get("/search/price", adminController.priceSearch)
router.get("/search/situation/product", adminController.situationSearch)
router.get("/search", adminController.search)
router.get("/statistic", adminController.statistic);
router.post("/statistic/statisticOption", adminController.statisticOption);
router.post("/statistic/importMoneyOption", adminController.importMoneyOption);
router.get("/statistic/preparingOrder", adminController.preparingOrder);
router.get("/statistic/deliveringOrder", adminController.deliveringOrder);
router.get("/statistic/completedOrder", adminController.completedOrder);
router.get("/statistic/failedOrder", adminController.failedOrder);
router.post("/statistic/highestSalesOfType", adminController.highestSalesOfType);
router.get("/user/:email/edit", adminController.edit);
router.get("/:id/edit", adminController.edit);
router.post("/user/handle-form-actions",adminController.handleFormActions)
router.put("/:id/cancelOrder", adminController.updateOrder);
router.put("/:id/order", adminController.updateOrder);
router.delete("/:id/order", adminController.deleteOrder);
router.delete("/:id", adminController.deleteAccount);
// router.get("/", adminController.index);

module.exports = router;

const express = require("express");
const router = express.Router();

const cartController = require("../app/controllers/CartController");

router.delete("/order/:orderId/force", cartController.forceDeleteOrder);
router.post("/add-to-cart", cartController.addToCart);
router.put("/update/:id", cartController.updateCartQuantity);
router.put("/update-guest", cartController.updateCartQuantity_guest);
router.patch("/restore/handle-form-actions", cartController.handleFormActions);
router.post("/checkout", cartController.checkout);
router.delete('/:id', cartController.delete);
router.post('/order', cartController.order);
router.post('/handle-form-actions', cartController.handleFormActions);
router.get("/", cartController.index);

module.exports = router;

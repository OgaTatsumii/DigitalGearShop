const express = require("express");
const router = express.Router();

const loginController = require("../app/controllers/LoginController");

router.post("/register", loginController.register);
router.post("/login", loginController.login);
router.get("/forgot-password", loginController.forgot);
router.post("/reset-password", loginController.reset);
router.post("/reset-success", loginController.resetSuccess);
router.get("/account/:id/detail",loginController.account)
router.get("/account/:id/myOrder",loginController.myOrder)
router.put("/account/:id", loginController.update)

module.exports = router;
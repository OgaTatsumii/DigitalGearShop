const express = require("express");
const router = express.Router();

const payController = require("../app/controllers/PayController");

router.get("/:slug", payController.show);
router.get("/", payController.index);

module.exports = router;

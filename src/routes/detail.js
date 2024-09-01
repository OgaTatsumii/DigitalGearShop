const express = require("express");
const router = express.Router();

const detailController = require("../app/controllers/DetailController");

router.get("/:slug", detailController.show);
router.get("/", detailController.index);

module.exports = router;

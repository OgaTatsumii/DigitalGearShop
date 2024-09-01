var express = require("express");
var router = express.Router();

const siteController = require("../app/controllers/SiteController");

// siteController.index;

router.get("/search", siteController.search);
router.get("/search", siteController.search);
router.get("/page/:page", siteController.pagination);
router.get("/", siteController.index);

module.exports = router;

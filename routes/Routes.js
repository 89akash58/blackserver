const express = require("express");
const router = express.Router();
const sectorController = require("../controller/Controller");

router.get("/", sectorController.getAllSector);
router.post("/upload", sectorController.uploadData);
router.get("/filter", sectorController.filterData);
module.exports = router;

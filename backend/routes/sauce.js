const auth = require('../middleware/auth');
const express = require("express");
const router = express.Router();
const controllers=require("../controllers/sauce")
const multer = require("../middleware/multer-config");

router.get("/sauces",auth, controllers.getSauces)
router.get("/sauces/:id",auth,controllers.singleSauce)
router.post("/sauces",auth,multer, controllers.createSauce)
router.put("/sauces/:id",auth,multer,controllers.modifySauce)
router.delete("/sauces/:id",auth,controllers.deleteSauce)


module.exports=router
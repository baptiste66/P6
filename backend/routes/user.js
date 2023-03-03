const express = require("express");
const router = express.Router();
const controllers=require("../controllers/user")
//oblige a trouver un meilleur mot de passe
const passwordCondition=require("../controllers/password")
//limite le nombre de tentative
const raterLimit = require("express-rate-limit");

const limiter = raterLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10, // 10 essais
});

router.post("/signup",passwordCondition,controllers.signup);
router.post("/login",limiter, controllers.login)

module.exports = router
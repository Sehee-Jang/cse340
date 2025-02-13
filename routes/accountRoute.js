const express = require("express");
const router = express.Router();
const accountController = require("../controllers/accountController");
const Util = require("../utilities");

// Route to build login view
// router.get("/", Util.handleErrors(accountController.buildLogin));
router.get("/login", Util.handleErrors(accountController.buildLogin));

// Route to build registration view
router.get("/register", Util.handleErrors(accountController.buildRegister));

// Route to register account
router.post("/register", Util.handleErrors(accountController.registerAccount));


module.exports = router;

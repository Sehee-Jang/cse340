const express = require("express");
const router = express.Router();
const accountController = require("../controllers/accountController");
const Util = require("../utilities");
const regValidate = require("../utilities/account-validation");

// Route to build login view
router.get("/login", Util.handleErrors(accountController.buildLogin));

// Route to build registration view
router.get("/register", Util.handleErrors(accountController.buildRegister));

// Route to register account
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  Util.handleErrors(accountController.registerAccount)
);

// Process the login attempt
router.post(
  "/login",
  (req, res) => {
    res.status(200).send('login process')
  }
)
module.exports = router;

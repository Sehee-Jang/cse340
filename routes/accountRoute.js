const express = require("express");
const router = express.Router();
const accountController = require("../controllers/accountController");
const Util = require("../utilities");
const regValidate = require("../utilities/account-validation");

// Route to build login view
router.get("/login", Util.handleErrors(accountController.buildLogin));

// Route to build registration view
router.get("/register", Util.handleErrors(accountController.buildRegister));

// Route to display account dashboard after login
router.get("/", Util.handleErrors(accountController.accountDashboard));

// Route to register account
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  Util.handleErrors(accountController.registerAccount)
);

// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  Util.handleErrors(accountController.accountLogin)
);

module.exports = router;

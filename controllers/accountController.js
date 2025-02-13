const Util = require("../utilities");

/* ****************************************
 *  Build Login View
 * *************************************** */
async function buildLogin(req, res, next) {
  let nav = await Util.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
  });
}

/* ****************************************
 *  Build Registeration View
 * *************************************** */
async function buildRegister(req, res, next) {
  let nav = await Util.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
  });
}

module.exports = { buildLogin, buildRegister };

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

module.exports = { buildLogin };

const Util = require("../utilities");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/* ****************************************
 *  Build Login View
 * *************************************** */
async function buildLogin(req, res, next) {
  try {
    let nav = await Util.getNav();
    res.render("account/login", {
      title: "Login",
      nav,
    });
  } catch (error) {
    console.error("Error rendering login page: ", error);
    res.status(500).send("Internal Server Error");
  }
}

/* ****************************************
 *  Build Registeration View
 * *************************************** */
async function buildRegister(req, res, next) {
  let nav = await Util.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res) {
  let nav = await Util.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the registration."
    );
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you're registered ${account_firstname}. Please log in.`
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    });
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await Util.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);

  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
    return;
  }

  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 * 1000 }
      );
      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      } else {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3600 * 1000,
        });
      }
      req.session.user = accountData;

      return res.redirect("/account/");
    } else {
      req.flash("message", "Please check your credentials and try again.");
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      });
    }
  } catch (error) {
    throw new Error("Access Forbidden");
  }
}

async function buildManagement(req, res) {
  let nav = await Util.getNav();

  if (!req.session.user) {
    console.log("No session - Redirecting to login page");
    return res.redirect("account/login");
  }
  const message = req.flash("message")[0] || "";

  res.render("account/account", {
    title: "Hello",
    nav,
    message,
    user: req.session.user,
  });
}

async function renderUpdateView(req, res) {
  let nav = await Util.getNav();
  const userId = req.session.user.account_id; // 로그인된 사용자 ID 가져오기

  if (!userId) {
    req.flash("error", "You must be logged in.");
    return res.redirect("/login");
  }

  try {
    // 사용자의 ID를 이용해 데이터베이스에서 사용자 정보를 조회
    const user = await accountModel.getAccountById(userId);

    if (!user) {
      req.flash("error", "User not found.");
      return res.redirect("/account");
    }

    res.render("account/update", {
      user,
      errors: null,
      title: "Update Account Information",
      nav,
      message: null,
    });
  } catch (error) {
    console.error(error);
    res.redirect("/account");
  }
}

async function updateAccount(req, res) {
  const { account_firstname, account_lastname, account_email, account_id } =
    req.body;
  try {
    // 이메일 중복 체크
    const existingAccount = await accountModel.getAccountByEmail(account_email);
    if (
      existingAccount &&
      existingAccount.account_id !== parseInt(account_id)
    ) {
      req.flash("error", "Email is already in use.");
      return res.redirect("/account/update");
    }

    // 계정 정보 업데이트 실행
    await accountModel.updateAccount(
      account_id,
      account_firstname,
      account_lastname,
      account_email
    );
    req.flash("success", "Account information updated successfully.");
    res.redirect("/account");
  } catch (error) {
    console.error(error);
    req.flash("error", "An error occurred while updating account information.");
    res.redirect("/account/update");
  }
}

async function changePassword(req, res) {
  const { new_password, account_id } = req.body;

  try {
    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(new_password, 10);

    // 비밀번호 업데이트 실행
    await accountModel.updatePassword(account_id, hashedPassword);
    req.flash("success", "Password updated successfully.");
    res.redirect("/account");
  } catch (error) {
    console.error(error);
    req.flash("error", "An error occurred while changing the password.");
    res.redirect("/account/update");
  }
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  buildManagement,
  renderUpdateView,
  updateAccount,
  changePassword,
};

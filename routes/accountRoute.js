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
router.get(
  "/",
  Util.checkJWTToken,
  Util.handleErrors(accountController.buildManagement)
);

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

// 로그아웃 라우트 추가
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return res.redirect("/");
    }
    res.redirect("/"); // 홈 페이지로 리디렉션
  });
});

// 계정 업데이트 페이지 렌더링
router.get("/update/:id", accountController.renderUpdateView);

// 계정 정보 업데이트 처리
router.post(
  "/update",
  regValidate.validateUpdate,
  accountController.updateAccount
);

// 비밀번호 변경 처리
router.post(
  "/change-password",
  regValidate.validatePassword,
  accountController.changePassword
);

module.exports = router;

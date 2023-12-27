const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/user");
const Message = require("../models/message");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const passport = require("../passport.js");

const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("log-in");
  }
};

router.use((req, res, next) => {
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
  }
  next();
});

router.post(
  "/message/:id/delete",
  asyncHandler(async (req, res, next) => {
    await Message.findByIdAndDelete(req.params.id);
    res.redirect("/");
  })
);

// GET home page
router.get(
  "/",
  asyncHandler(async (req, res, next) => {
    const messages = await Message.find({}).populate("user").exec();
    res.render("index", { messages: messages });
  })
);

// GET sign up page
router.get("/sign-up", function (req, res, next) {
  res.render("sign-up");
});

// POST sign up form
router.post(
  "/sign-up",
  [
    body("username").trim().isLength({ min: 1 }).escape().withMessage("Username must be specified"),
    body("name").trim().isLength({ min: 1 }).escape().withMessage("Name must be specifed").isAlphanumeric().withMessage("Name contains non-alphanumeric characters"),
    body("password").trim().isLength({ min: 1 }).escape().withMessage("Password must be specified").isAlphanumeric().withMessage("Password contains non-alphanumeric characters"),
    body("confirmPassword")
      .trim()
      .isLength({ min: 1 })
      .escape()
      .withMessage("Confirm password must be specifed")
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords do not match");
        }
        return true;
      }),
  ],

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("sign-up", { errors: errors.array() });
    } else {
      console.log(req.body.password);
      const password = req.body.password;
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log(hashedPassword);
      const user = new User({
        username: req.body.username,
        name: req.body.name,
        password: hashedPassword,
        membershipStatus: false,
        admin: false,
      });
      await user.save();
      res.redirect("/");
    }
  })
);

// GET member form
router.get("/become-a-member", ensureAuthenticated, function (req, res, next) {
  res.render("member-form");
});

// POST member form
router.post(
  "/become-a-member",
  ensureAuthenticated,
  body("secretPassword").trim().isLength({ min: 1 }).escape().withMessage("Secret Password must be specified"),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("member-form", { errors: errors.array() });
    } else {
      const secretPassword = "Secret_1234";
      if (req.body.secretPassword === secretPassword) {
        await User.findByIdAndUpdate(req.user._id, { membershipStatus: true });
        res.redirect("/");
      }
    }
  })
);

// GET sign in form
router.get("/log-in", function (req, res, next) {
  res.render("log-in");
});

// POST sign in form
router.post(
  "/log-in",
  [body("username").trim().isLength({ min: 1 }).escape().withMessage("Username must be specified"), body("password").trim().isLength({ min: 1 }).escape().withMessage("Password must be specified").isAlphanumeric().withMessage("Password contains non-alphanumeric characters")],

  // Validation passed, proceed to authentication
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/log-in",
  })
);

// GET message form
router.get("/new-message", function (req, res, next) {
  res.render("message-form");
});

// POST message form
router.post("/new-message", [
  body("title").trim().isLength({ min: 1 }).withMessage("Title must be specified"),
  body("text").trim().isLength({ min: 1 }).withMessage("Text content must be specified"),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const date = new Date();
    const timestamp = date.toLocaleString("en-US");

    if (!errors.isEmpty()) {
      res.render("message-form", { errors: errors.array() });
    } else {
      const message = new Message({
        title: req.body.title,
        text: req.body.text,
        timestamp: timestamp,
        user: req.user._id,
      });
      await message.save();
      res.redirect("/");
    }
  }),
]);

// GET admin form
router.get("/become-an-admin", ensureAuthenticated, function (req, res, next) {
  res.render("admin-form");
});

// POST admin form
router.post(
  "/become-an-admin",
  ensureAuthenticated,
  body("adminPassword").trim().isLength({ min: 1 }).escape().withMessage("Admin Password must be specified"),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("admin-form", { errors: errors.array() });
    } else {
      const adminPassword = "admin_1234";
      if (req.body.adminPassword === adminPassword) {
        await User.findByIdAndUpdate(req.user._id, { admin: true, membershipStatus: true });
        res.redirect("/");
      }
    }
  })
);

router.get("/logout", ensureAuthenticated, (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
  });
  res.redirect("/");
});

module.exports = router;

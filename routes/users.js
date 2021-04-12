const express = require("express");
const jsonschema = require("jsonschema");

// User models for db interaction
const User = require("../models/user");

// authorization middlwares for private routes
const { ensureCorrectUserOrAdmin, ensureAdmin } = require("../middleware/auth");

// custom error handling
const { BadRequestError } = require("../expressError");

// schemas for validating data entering db
const userNewSchema = require("../schemas/users/userNew.json");
const userUpdateSchema = require("../schemas/users/userUpdate.json");
const userUpdateAdminSchema = require("../schemas/users/userUpdateAdmin.json");

// jwt compiler function
const { createToken } = require("../helpers/tokens");

const router = express.Router();

// create new user as admin
router.post("/", ensureAdmin, async (req, res, next) => {
  try {
    const validator = jsonschema.validate(req.body, userNewSchema);
    if (!validator.valid) {
      const errors = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errors);
    }
    const user = await User.register(req.body);
    const token = createToken(user);
    return res.status(201).json({ user, token });
  } catch (err) {
    return next(err);
  }
});

// get all users
router.get("/", ensureAdmin, async (req, res, next) => {
  try {
    const users = await User.findAll();
    return res.json({ users });
  } catch (err) {
    return next(err);
  }
});

// get specific user
router.get("/:username", ensureCorrectUserOrAdmin, async (req, res, next) => {
  try {
    const user = await User.get(req.params.username);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

// update user information as user or admin
router.patch("/:username", ensureCorrectUserOrAdmin, async (req, res, next) => {
  try {
    const validator = jsonschema.validate(req.body, userUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }
    const user = await User.updateUser(req.params.username, req.body);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

// update user information as admin (only route to give admin or fullaccess credentials)
router.patch("/:username/admin", ensureAdmin, async (req, res, next) => {
  try {
    const validator = jsonschema.validate(req.body, userUpdateAdminSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }
    const user = await User.updateUser(req.params.username, req.body);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

// delete user from database
router.delete(
  "/:username",
  ensureCorrectUserOrAdmin,
  async (req, res, next) => {
    try {
      await User.deleteUser(req.params.username);
      return res.json({ deleted: req.params.username });
    } catch (err) {
      return next(err);
    }
  }
);

module.exports = router;

// Add new user

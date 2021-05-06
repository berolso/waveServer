const express = require("express");
const jsonschema = require("jsonschema");

const User = require("../models/user");
const { createToken } = require("../helpers/tokens");
const userAuthSchema = require("../schemas/users/userAuth.json");
const userRegisterSchema = require("../schemas/users/userRegister.json");
const { BadRequestError } = require("../expressError");

const router = new express.Router();

// register new user
// POST /auth/register {user} => {token}
// user must include { username, password, firstName, lastName, email, phone }
router.post("/register", async (req, res, next) => {
  try {
    const validator = jsonschema.validate(req.body, userRegisterSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) =>
        // allow for custom errors hand coded into into jsonschema with the customErrors property
        // console.log(
        //   "^^^^",
        //   validator.schema.properties[e.path].customError
        // ),
        validator.schema.properties[e.path].customError
          ? validator.schema.properties[e.path[0]].customError[e.name]
          : e.stack
      );
      throw new BadRequestError(errs);
    }
    const newUser = await User.register({
      ...req.body,
      isAdmin: false,
      isFullAccess: false,
    });
    const token = createToken(newUser);
    return res.status(201).json({ token });
  } catch (err) {
    return next(err);
  }
});

// get token for authentication. for login

router.post("/token", async (req, res, next) => {
  try {
    const validator = jsonschema.validate(req.body.data, userAuthSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }
    const { email, password } = req.body;
    const user = await User.authenticate(email, password);
    const token = createToken(user);
    return res.json({ token });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;

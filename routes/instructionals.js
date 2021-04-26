const express = require("express");
const jsonschema = require("jsonschema");
const { BadRequestError } = require("../expressError");

const { ensureAdmin, ensureFullAccess } = require("../middleware/auth");
const Instructional = require("../models/instructional");
const instructionalNewSchema = require("../schemas/instructionals/instructionalNew.json");
const instuctionalUpdateSchema = require("../schemas/instructionals/instructionalUpdate.json");
const Slack = require("../models/slack");

const router = new express.Router();

// get all instructionals
router.get("/", ensureFullAccess, async (req, res, next) => {
  try {
    const instructionals = await Instructional.findAll();
    return res.json({ instructionals });
  } catch (err) {
    return next(err);
  }
});

// create new instructional
router.post("/", ensureAdmin, async (req, res, next) => {
  try {
    const validator = jsonschema.validate(req.body, instructionalNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }
    const instructional = await Instructional.create(req.body);
    return res.status(201).json({ instructional });
  } catch (err) {
    return next(err);
  }
});

// get instructional by id
router.get("/:id", ensureFullAccess, async (req, res, next) => {
  try {
    const instructional = await Instructional.get(req.params.id);
    return res.json({ instructional });
  } catch (err) {
    return next(err);
  }
});

router.patch("/:id", ensureAdmin, async (req, res, next) => {
  try {
    const validator = jsonschema.validate(req.body, instuctionalUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }
    const instructional = await Instructional.update(req.params.id, req.body);
    return res.json({ instructional });
  } catch (err) {
    return next(err);
  }
});

// delete instructional
router.delete("/:id", ensureAdmin, async (req, res, next) => {
  try {
    await Instructional.delete(req.params.id);
    return res.json({ deleted: req.params.id });
  } catch (err) {
    return next(err);
  }
});

// incoming request to be sent to Slack API
router.post("/request", ensureFullAccess, async (req, res, next) => {
  // if no images are sent
  if (req.files === null) {
    console.log("no image file sent", req.files);
    res.status(400).json({ msg: "No file uploaded" });
    try {
      await Slack.sendRequest(JSON.parse(req.body.json));
      return res.status(201).json({ instructionals: "no image sent to slack" });
    } catch (err) {
      return next(err);
    }
  }
  try {
    console.log("req.files", req.files);
    const files = req.files.files || [];
    await Slack.sendImages(JSON.parse(req.body.json), files);
    return res.status(201).json({ instructional: "Images sent to slack" });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;

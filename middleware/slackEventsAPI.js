const express = require("express");
const router = new express.Router();
const Slack = require("../models/slack");

// slack events api
const { createEventAdapter } = require("@slack/events-api");
const { slackSigningSecret } = require("../config");

const slackEvents = createEventAdapter(slackSigningSecret);

router.use("/", slackEvents.expressMiddleware());

// listen for mention "@waveServer" in slack
slackEvents.on("app_mention", async (event) => {
  console.log("slackevent");
  try {
    console.log(event);
    console.log("I got a mention in this channel", event.channel);
  } catch (e) {
    console.log(e);
  }
});

// listen for any messages where waveServer bot is involved
slackEvents.on("message", async (event) => {
  console.log("slackevent");
  try {
    console.log("event%", event);
    // slack code block should look like this
    //  {"title":"This is The Title","date":"July 13, 2021","description":"Here's some sample description of the instructional"}

    // parse slack text line code to obj
    const json = event.text.replace(/```/g, "");
    const obj = JSON.parse(json);
    console.log("obj", obj);
    // send confirmation text to slack thread
    await Slack.instrucitonalConfirmation(event);
  } catch (e) {
    console.log(e);
  }
});

slackEvents.on("error", (error) => {
  console.log("Slack Events ERERErrr", error); // TypeError
});

module.exports = router;

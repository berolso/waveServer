const express = require("express");
const router = new express.Router();

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
    console.log("event.blocks%", event.blocks[0].elements);
  } catch (e) {
    console.log(e);
  }
});

slackEvents.on("error", (error) => {
  console.log("Slack Events ERERErrr", error); // TypeError
});

module.exports = router;

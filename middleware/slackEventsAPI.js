const express = require("express");
const router = new express.Router();
const Slack = require("../models/slack");
const Instructional = require("../models/instructional");

// slack events api
const { createEventAdapter } = require("@slack/events-api");
const { slackSigningSecret } = require("../config");

const slackEvents = createEventAdapter(slackSigningSecret);

router.use("/", slackEvents.expressMiddleware());

// listen for mention "@waveServer" in slack
slackEvents.on("app_mention", async (event) => {
  try {
    console.log("I got a mention in this channel", event.channel);
  } catch (e) {
    console.log(e);
  }
});

// listen for any messages where waveServer bot is involved. if includes a file send to db.
slackEvents.on("message", async (event) => {
  try {
    if (event.files) {
      // slack code block should look like this
      //  {"title":"This is The Title","date":"July 13, 2021","description":"Here's some sample description of the instructional"}

      // parse slack text line code to obj
      const json = event.text.replace(/```/g, "");
      const obj = JSON.parse(json);
      // send confirmation text to slack thread
      await Slack.instrucitonalConfirmation(event);

      // create viewable link. prevent corb blocking permalinks
      const parsedPermalink = event.files[0].permalink_public.split("-");
      const pubSecret = parsedPermalink[parsedPermalink.length - 1];
      const image_url = event.files[0].url_private + `?pub_secret=${pubSecret}`;

      // create insturcional object
      const instructionalObj = {
        name: obj.title,
        section_id: 1,
        json: {
          ...obj,
          image_url,
          url_private_download: event.files[0].url_private_download,
          permalink_public: event.files[0].permalink_public,
        },
      };
      let res = await Instructional.create(instructionalObj);
      // console.log("res", res);
    }
  } catch (e) {
    console.log(e);
  }
});

slackEvents.on("error", (error) => {
  console.log("Slack Events ERERErrr", error); // TypeError
});

module.exports = router;

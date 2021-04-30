const { WebClient } = require("@slack/web-api");
const { SLACK_TOKEN } = require("../config");

// Create a new instance of the WebClient class with the token read from your environment variable
const web = new WebClient(SLACK_TOKEN);
// The current date
const currentTime = new Date().toTimeString();

class Slack {
  // use this method to format blocks with external image url's and requests sent without an attached image
  static async sendRequest(data, files) {
    console.log("data/files", data, files);
    try {
      // format slack web api blocks
      const blocks = [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `${data.username} ${data.phoneNumber} ${data.email}`,
          },
        },
        {
          type: "image",
          title: {
            type: "plain_text",
            text: data.description || "No description provided",
            emoji: true,
          },
          image_url:
            "https://assets3.thrillist.com/v1/image/1682388/size/tl-horizontal_main.jpg",
          alt_text: "marg",
        },
      ];

      const slackObj = {
        channel: "waveserver-request",
        text: JSON.stringify(data),
        blocks,
      };

      // Use the `chat.postMessage` method to send a message from this app
      const result = await web.chat.postMessage(slackObj);
      console.log("result", result);
    } catch (error) {
      return console.log(error);
    }

    console.log("Message posted!");
  }

  // handle multiple file uploads to slack channel
  static async sendImages(json, files) {
    console.log("json/files", json, files);

    // files can olny be added 1 at a time. loop through and request
    // TODO: replace with promiseAll and .map() to execute in parrelel
    for (let i in files) {
      // format object for slack files upload
      const slackObj = {
        channels: "waveserver-request",
        file: files[i].data,
        initial_comment: `${+i + 1} of ${files.length}`,
        filename: files[i].name,
        title: files[i].name,
      };

      // format first image to include json data as first comment
      if (+i === 0) {
        slackObj.initial_comment = `${json.firstName} ${json.lastName} - ${
          json.username
        } ${json.phoneNumber} ${json.email}
        Description: 
        ${json.description}

        ${+i + 1} of ${files.length} images`;
      }

      try {
        // Call the files.upload method using the WebClient
        const result = await web.files.upload(slackObj);
        console.log("result", result);
      } catch (err) {
        console.error("oopsy", err);
      }
    }
  }
  // send confirmation to slack that instructional was successfully parsed
  static async instrucitonalConfirmation(event) {
    console.log("event", event);
    const slackObj = {
      channel: event.channel,
      text: "ok cool. Got it all parsed up.",
      thread_ts: event.thread_ts,
    };

    try {
      // Call the chat.postMessage method using the WebClient
      const result = await web.chat.postMessage(slackObj);
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = Slack;

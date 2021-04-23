const { WebClient } = require("@slack/web-api");
const { SLACK_TOKEN } = require("../config");

// Create a new instance of the WebClient class with the token read from your environment variable
const web = new WebClient(SLACK_TOKEN);
// The current date
const currentTime = new Date().toTimeString();

class Slack {
  // authenticate user
  static async sendRequest(data) {
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
            text: data.description,
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
      console.log("Slack", result);
    } catch (error) {
      return console.log(error);
    }

    console.log("Message posted!");
  }
}

module.exports = Slack;

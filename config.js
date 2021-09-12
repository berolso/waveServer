require("dotenv").config();
require("colors");

const SECRET_KEY = process.env.SECRET_KEY
const PORT = +process.env.PORT || 3000;

// Use dev database, testing database, or via env var, production database
function getDatabaseUri() {
  return process.env.NODE_ENV === "test"
    ? "waveserver_test"
    : process.env.DATABASE_URL || "waveserver";
}

// Speed up bcrypt during tests, since the algorithm safety isn't being tested
//
// WJB: Evaluate in 2021 if this should be increased to 13 for non-test use
const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;

// slack web api
const SLACK_TOKEN_BOT = process.env.SLACK_TOKEN_BOT;

// slack user OAuth Token
const SLACK_TOKEN_USER = process.env.SLACK_TOKEN_USER;

// slack events api
const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;

console.log("---");
console.log("waveServer Config:".green);
// console.log("SECRET_KEY:".yellow, SECRET_KEY);
console.log("PORT:".yellow, PORT.toString());
console.log("BCRYPT_WORK_FACTOR".yellow, BCRYPT_WORK_FACTOR);
console.log("Database:".yellow, getDatabaseUri());
console.log("---");

module.exports = {
  SECRET_KEY,
  PORT,
  BCRYPT_WORK_FACTOR,
  getDatabaseUri,
  SLACK_TOKEN_BOT,
  SLACK_TOKEN_USER,
  slackSigningSecret,
};

// slack event json
text = {
  title: "This is The Title",
  date: "July 13, 2021",
  description: "Here's some sample description of the instructional",
};
// console.log(JSON.stringify(text));

textJSON = {
  title: "This is The Title",
  date: "July 13, 2021",
  description: "Here's some sample description of the instructional",
};

const inst = {
  title: "This is The Title",
  date: "July 13, 2021",
  description: "Here's some sample description of the instructional",
  image_url:
    "https://files.slack.com/files-pri/T01T4PK83QD-F02059B2ZU7/screen_shot_2019-12-20_at_8.46.04_pm.png?pub_secret=29411b058b",
  url_private_download:
    "https://files.slack.com/files-pri/T01T4PK83QD-F02059B2ZU7/download/screen_shot_2019-12-20_at_8.46.04_pm.png",
  permalink_public:
    "https://slack-files.com/T01T4PK83QD-F02059B2ZU7-29411b058b",
};
// console.log(JSON.stringify(inst));

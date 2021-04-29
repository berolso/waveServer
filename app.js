const express = require("express");
const morgan = require("morgan");
const fileUpLoad = require("express-fileupload");

// slack events api
const { createEventAdapter } = require("@slack/events-api");
const { slackSigningSecret } = require("./config");

const slackEvents = createEventAdapter(slackSigningSecret);

// custom error class extensions
const { NotFoundError } = require("./expressError");
// authenticate token from user
const { authenticateJWT } = require("./middleware/auth");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const instructionalRoutes = require("./routes/instructionals");

const app = express();


app.use("/slack/events", slackEvents.expressMiddleware());
app.use(express.json());
app.use(morgan("dev"));
app.use(authenticateJWT);
app.use(fileUpLoad());

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/instructionals", instructionalRoutes);

slackEvents.on("app_mention", async (event) => {
  console.log("slackevent");
  try {
    console.log(event);
    console.log("I got a mention in this channel", event.channel);
  } catch (e) {
    console.log(e);
  }
});

slackEvents.on("message", async (event) => {
  console.log("slackevent");
  try {
    console.dir(event);
    console.log("message.im", blocks);
  } catch (e) {
    console.log(e);
  }
});

slackEvents.on("error", (error) => {
  console.log("ERERE", error); // TypeError
  // return next()
});


// handle 404 page not found errors.
// no matching routes were found
app.use((req, res, next) => {
  return next(new NotFoundError());
});

/** Generic error handler; anything unhandled goes here. all errors sent via next(e) end up here */
app.use((err, req, res, next) => {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;

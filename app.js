const express = require("express");
const morgan = require("morgan");
const fileUpLoad = require("express-fileupload");
const cors = require("cors");

// custom error class extensions
const { NotFoundError } = require("./expressError");
// authenticate token from user
const { authenticateJWT } = require("./middleware/auth");
// routes folders
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const instructionalRoutes = require("./routes/instructionals");
const slackEventsAPI = require("./middleware/slackEventsAPI");

const app = express();

// endpoint to listen for slack Events API requests
// IMPORTANT must come before parse(express.json)
app.use("/slack/events", slackEventsAPI);

// middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(authenticateJWT);
app.use(fileUpLoad());
app.use(cors())

// routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/instructionals", instructionalRoutes);

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

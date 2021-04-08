const express = require("express");
const morgan = require("morgan");

// custom error class extensions
const { NotFoundError } = require("./expressError");

const authRoutes = require("./routes/auth");

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.use("/auth", authRoutes);

app.use("/", (req, res, next) => {
  return res.send("hi");
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

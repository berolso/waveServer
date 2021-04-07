const express = require("express");
const morgan = require('morgan')

const authRoutes = require("./routes/auth");

const app = express();

app.use(express.json());
app.use(morgan('dev'))

app.use("/auth", authRoutes);

app.use('/',(req,res,next)=>{
  return res.send('hi')
})

module.exports = app;

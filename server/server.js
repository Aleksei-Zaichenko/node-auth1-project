const express = require("express");
const cors = require("cors");
const session = require('express-session');

const usersRouter = require("../users/user-router.js");
const authRouter = require('../auth/auth-router.js')
const authenticator = require('../auth/authenticator.js');

const server = express();

const sessionConfig = {
  name: 'lambda',
  secret: process.env.SESSION_SECRET || 'keep it secret',
  resave: false,
  saveUninitialized: process.env.SEND_COOKIE || false,
  cookie: {
    maxAge: 1000 * 60 * 10,
    secure: process.env.USE_SECURE_COOKIES || false,//used over https only, in production set to true
    httpOnly: true
  },
}

server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));

server.use("/api/users",authenticator, usersRouter);
server.use('/api', authRouter);

server.get("/", (req, res) => {
  res.json({ api: "up" });
});

module.exports = server;

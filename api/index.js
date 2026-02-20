const express = require("express");
const { createRequestHandler } = require("@remix-run/express");
const build = require("../build");

const app = express();

app.disable("x-powered-by");
app.use(express.static("public", { maxAge: "1h" }));
app.use("/build", express.static("public/build", { immutable: true, maxAge: "1y" }));
app.all("*", createRequestHandler({ build, mode: process.env.NODE_ENV }));

module.exports = app;

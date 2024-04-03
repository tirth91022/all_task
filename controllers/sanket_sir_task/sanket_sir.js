const express = require('express');
const authentication = require("/home/tirth-raval/Documents/one_union_form/middleware/authentication.js");
const app = express();

app.get("/sanketSirTask", authentication, (req, res) => {
    res.sendFile("/home/tirth-raval/Documents/one_union_form/views/sanket_lakhani_task/index.html");
});

app.get("/details", authentication, (req, res) => {
    res.render("/home/tirth-raval/Documents/one_union_form/views/sanket_lakhani_task/personal.ejs");
});

module.exports = app;
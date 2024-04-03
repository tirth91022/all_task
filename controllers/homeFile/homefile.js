const express = require('express');
const authentication = require("/home/tirth-raval/Documents/one_union_form/middleware/authentication.js");
const app = express();
app.get("/", authentication, (req, res) => {
    res.sendFile("/home/tirth-raval/Documents/one_union_form/views/home.html");
});
module.exports = app;
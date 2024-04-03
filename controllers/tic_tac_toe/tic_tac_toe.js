const express = require('express');
const authentication = require("/home/tirth-raval/Documents/one_union_form/middleware/authentication.js");
const app = express();
app.get("/tic_tac_toe", authentication, (req, res) => {
    res.sendFile("/home/tirth-raval/Documents/one_union_form/views/tic_tac_toe/tic_tac_toe.html");
});
module.exports = app
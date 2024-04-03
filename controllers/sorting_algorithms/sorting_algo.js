const express = require('express');
const authentication = require("/home/tirth-raval/Documents/one_union_form/middleware/authentication.js");
const app = express();
app.get("/soring_algos", authentication, (req, res) => {
    res.sendFile("/home/tirth-raval/Documents/one_union_form/views/sortin_algorithm/sorting_baki_algos.html");
});
module.exports = app;
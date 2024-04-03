const express = require('express');
const authentication = require("/home/tirth-raval/Documents/one_union_form/middleware/authentication.js");
const app = express();
app.get("/html3", authentication, (req, res) => {
    res.render('/home/tirth-raval/Documents/one_union_form/views/html3/index3.ejs');
});
module.exports = app;
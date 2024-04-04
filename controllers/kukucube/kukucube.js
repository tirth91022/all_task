const express = require('express');
const authentication = require("/home/tirth-raval/Documents/one_union_form/middleware/authentication.js");
const app = express();
app.get("/kuku_cube", authentication, (req, res) => {
    res.sendFile("/home/tirth-raval/Documents/one_union_form/views/kuku_cube/kuku_cube.html");
});
module.exports = app
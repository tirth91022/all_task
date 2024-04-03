const express = require('express');
const authentication = require("/home/tirth-raval/Documents/one_union_form/middleware/authentication.js");
const app = express();
app.get("/kuku_cube", authentication, (req, res) => {
    res.sendFile("/home/tirth-raval/Documents/one_union_form/views/dynamic_table/dynamic_table_baki.html");
});
module.exports = app
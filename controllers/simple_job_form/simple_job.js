const express = require('express');
const authentication = require("/home/tirth-raval/Documents/one_union_form/middleware/authentication.js");
const app = express();
app.get("/job_form", authentication, (req, res) => {
    res.sendFile("/home/tirth-raval/Documents/one_union_form/views/job_form/jobForm1.html");
});
module.exports = app;
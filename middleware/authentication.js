const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const authentication = async (req, res, next) => {
    console.log("hello tirth");
    if (req.cookies.token) {
        next();

    }
    else {
        res.redirect("/sign_in");
    }
}
module.exports = authentication;
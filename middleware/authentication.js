const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const authentication = async (req, res, next) => {
    console.log("hello vijay");
    if (req.cookies.token) {
        next();

    }
    else {
        res.redirect("/sign_in");
    }
}
module.exports = authentication;
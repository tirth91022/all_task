const bodyParser = require('body-parser');
const express = require('express');
const app = express();
require("dotenv").config();
const cookieparser = require("cookie-parser");
app.use(cookieparser());
app.use(express.json());
const port = 8000;

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));
const router = require('./routes/routes')
app.use('/', router)

app.listen(port, () => {
    console.log("Server running");
});
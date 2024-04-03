const bodyParser = require('body-parser');
const express = require('express');
const app = express();


require("dotenv").config();

const md5 = require("md5");
const jwt = require("jsonwebtoken");
const cookieparser = require("cookie-parser");
app.use(cookieparser());
app.use(express.json());


app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

const connection = require("/home/tirth-raval/Documents/one_union_form/db config/db.js");

app.get("/home_again", (req, res) => {
    if (req.cookies.token) {
        res.render("/home/tirth-raval/Documents/one_union_form/views/login_logout/home.ejs");
    }
    else {
        res.render("/home/tirth-raval/Documents/one_union_form/views/login_logout/signup.ejs");
    }
})

app.post("/sign_up", async (req, res) => {
    try {

        const { fname, lname, email } = req.body;

        console.log(req.body);

        const isUserExist = await connection.promise().query(`select * from users where email='${email}'`);

        console.log(isUserExist);

        if (isUserExist[0].length !== 0) {
            return res.json({ msg: "invalid email" });
        }
        const characters = 'ABCDEFGHIJKLM1800067890NOPQRSTUVWXYZ';
        const charactersLength = characters.length;
        let counter = 0;
        let salt = ""
        let access_key = ""
        while (counter <= 12) {
            salt += characters.charAt(Math.floor(Math.random() * charactersLength))
            access_key += characters.charAt(Math.floor(Math.random() * charactersLength));
            counter += 1;
        }
        salt = salt.slice(0, 4);
        let response = await connection.promise().query(`insert into users(first_name,last_name,email,salt,access_key) values ('${fname}','${lname}','${email}','${salt}','${access_key}')`);
        console.log(response);
        res.json({ id: response[0].insertId, access_key, salt })
    }
    catch (error) {
        console.log(error);
    }
})

app.get("/password", async (req, res) => {
    try {
        const { id, access_key, salt } = req.query;
        console.log("id");
        console.log(id);
        let data = await connection.promise().query(`select * from users where id='${id}'`)
        console.log(data);
        let isvalid = true;
        if (access_key !== data[0][0].access_key) isvalid = false;
        var diff = new Date().valueOf() - data[0][0].createdAt.valueOf();
        console.log(diff);
        let hours = Math.floor(diff / (1000 * 60 * 60))
        console.log(hours);
        res.render("/home/tirth-raval/Documents/one_union_form/views/login_logout/password.ejs", { id, access_key, hours, salt, isvalid })
    }
    catch (error) {
        console.log(error);
    }

})

app.post("/password", async (req, res) => {
    try {
        const { id, salt, password, r_password } = req.body;
        // console.log(id);
        // console.log(req.body);
        // console.log(req);
        if (password === r_password) {
            const hashed = md5(password + salt);
            let data = await connection.promise().query(`update users set password='${hashed}' where id=${id}`)
            res.json({ status: 200, msg: "Account activated successfully" });

        }
        else {
            res.json({ status: 400, msg: "please enter same password" });
        }
        res.json({})
    }

    catch (error) {
        console.log(error);
    }
})

app.get("/sign_in", (req, res) => {
    res.render("/home/tirth-raval/Documents/one_union_form/views/login_logout/signin.ejs")
})

app.post("/sign_in", async (req, res) => {
    try {
        const { email, password } = req.body;
        let isUserExist = await connection.promise().query(`select * from users where email='${email}'`)
        if (isUserExist[0].length == 0) {
            return res.json({ msg: "Invalid email or password", msg2: "" })

        }
        const user = isUserExist[0][0];
        const id = user.id;
        const d_password = md5(password + user.salt);
        if (user.password !== d_password) {
            return res.json({ msg: "Invalid email or password", msg2: "" })
        }
        const token = jwt.sign({ id }, "sdjhksd", { expiresIn: "1h" })
        res.cookie('token', token, { expires: new Date(Date.now() + 900000), httpOnly: true })
        return res.json({ msg: "login succesfully", token, msg_2: "click here to <a href=http://localhost:8000/> Go to dashboard</a>" })

    }
    catch (error) {
        console.log(error);
    }
})

app.get("/home", async (req, res) => {
    try {
        if (req.cookies.token) {
            const token = req.cookies.token;
            const decoded = jwt.verify(token, "sdjhksd");
            const userId = decoded.id;
            let userData = await connection.promise().query(`select * from users where id='${userId}'`);
            const userName = userData[0][0].first_name; // Assuming first_name contains the user's name
            res.render("/home/tirth-raval/Documents/one_union_form/views/login_logout/home.ejs", { userName }); // Pass the userName to the EJS template
        } else {
            res.redirect("/sign_in"); // Redirect to sign-in page if no token found
        }
    } catch (error) {
        console.log(error);
        res.redirect("/sign_in"); // Redirect to sign-in page in case of error
    }
});

app.get("/logout", (req, res) => {
    res.clearCookie('token');
    res.redirect("/sign_in")
})

app.get("/forgotPassword1", (req, res) => {
    res.render("/home/tirth-raval/Documents/one_union_form/views/login_logout/forgotPassword1.ejs");
})

app.get("/forgotPassword", (req, res) => {
    res.render("/home/tirth-raval/Desktop/login_logout_office/Login_homeWork/views/forgotPassword.ejs")
})

app.post("/forgotPassword1", async (req, res) => {
    let email = req.body.email;
    console.log(req.body);

    let result = await connection.promise().query(`select * from users where email='${email}'`)
    console.log(result[0]);
    if (result[0].length === 0) {
        return res.json({ msg: "Invalid Email" })
    }
    else {
        console.log("end");
        return res.json({ msg: "succesfull", email: email })

    }

})

app.post("/forgotPassword", async (req, res) => {

    try {
        let email = req.body.email;
        let password = req.body.password;

        let result = await connection.promise().query(`select salt from users where email='${email}'`)
        console.log(result[0][0].salt);
        let salt = result[0][0].salt;
        let hashed = md5(password + salt);

        let data = await connection.promise().query(`update users set password='${hashed}' where email='${email}'`)
        console.log(data);
        if (data.length > 0) {
            return res.json({ msg: "succesfull" })
        }

    }
    catch (error) {
        console.log(error);
    }

})

module.exports = app
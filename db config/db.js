const mysql = require("mysql2")

require("dotenv").config()
const con = mysql.createConnection({
    host: `${process.env.HOST}`,
    user: `${process.env.DBUSER}`,
    password: `${process.env.DBPASSWORD}`,
    database: `${process.env.DATABASE}`,
    multipleStatements:true,
    port:3306
})

module.exports = con;
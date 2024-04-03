const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const authentication = require("/home/tirth-raval/Documents/one_union_form/middleware/authentication.js");

require("dotenv").config();

const cookieparser = require("cookie-parser");
app.use(cookieparser());
app.use(express.json());



app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

const connection = require("/home/tirth-raval/Documents/one_union_form/db config/db.js");

app.get('/:year/:month', authentication, (req, res) => {
    const year = req.params.year;
    const month = req.params.month;
    const perPage = 10;
    const page = req.query.page || 1;
    const offset = (page - 1) * perPage;

    const daysInMonth = new Date(year, month, 0).getDate();
    const fromDate = `${year}-${month}-01 00:00:00`;
    const toDate = `${year}-${month}-${daysInMonth} 23:59:59`;

    connection.query(`SELECT studentss.studentId, studentss.firstName, COUNT(attandance.statusPA) AS present_days, (COUNT(attandance.statusPA)/${daysInMonth})*100 AS present_days_ratio 
                      FROM studentss 
                      INNER JOIN attandance ON studentss.studentId=attandance.studentId 
                      WHERE attandance.statusPA LIKE 'present' 
                      AND attandance.attendanceDate BETWEEN ? AND ? 
                      GROUP BY studentss.studentId 
                      ORDER BY studentss.studentId 
                      LIMIT ?, ?`, [fromDate, toDate, offset, perPage], (err, rows) => {
        if (err) throw err;
        const nextPage = rows.length === perPage;
        res.render('/home/tirth-raval/Documents/one_union_form/views/attandance_task/index.ejs', { student: rows, currentPage: parseInt(page), nextPage });


    });
});

module.exports = app
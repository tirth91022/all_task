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

app.get('/exam', authentication, (req, res) => {
    const perPage = 10;
    const page = req.query.page || 1;
    const offset = (page - 1) * perPage;
    connection.query(`SELECT 
    student.student_id,
    student.first_name,
    SUM(CASE
        WHEN exam_master.type = 'Prelim' THEN result.obtained_practical_marks
        ELSE 0
    END) AS total_prelim_practical_marks,
    SUM(CASE
        WHEN exam_master.type = 'Prelim' THEN result.obtained_theory_marks
        ELSE 0
    END) AS total_prelim_theory_marks,
    SUM(CASE
        WHEN exam_master.type = 'Terminal' THEN result.obtained_practical_marks
        ELSE 0
    END) AS total_terminal_practical_marks,
    SUM(CASE
        WHEN exam_master.type = 'Terminal' THEN result.obtained_theory_marks
        ELSE 0
    END) AS total_terminal_theory_marks,
    SUM(CASE
        WHEN exam_master.type = 'Final' THEN result.obtained_practical_marks
        ELSE 0
    END) AS total_final_practical_marks,
    SUM(CASE
        WHEN exam_master.type = 'Final' THEN result.obtained_theory_marks
        ELSE 0
    END) AS total_final_theory_marks,
    SUM(result.obtained_practical_marks + result.obtained_theory_marks) AS total
FROM
    student
        INNER JOIN
    result ON student.student_id = result.student_id
        INNER JOIN
    exam_master ON result.exam_id = exam_master.id
GROUP BY student.student_id order by student.student_id LIMIT ? ,?`, [offset, perPage], (err, rows) => {
        if (err) throw err;
        const nextPage = rows.length === perPage;
        res.render('/home/tirth-raval/Documents/one_union_form/views/seach_by_query_report_card/index.ejs', { result: rows, currentPage: parseInt(page), nextPage });
    });
});

app.get('/report/:student1_id', authentication, (req, res) => {

    let student_id2 = req.params.student1_id;
    const page = req.query.page || 1;

    connection.query(`SELECT 
    student.first_name AS student_name,
    subject.sub_name AS subject_name,
    exam_master.type,
    result.obtained_practical_marks,
    result.obtained_theory_marks
FROM
    student
        INNER JOIN
    result ON student.student_id = result.student_id
        INNER JOIN
    exam_master ON exam_master.id = result.exam_id
        INNER JOIN
    subject ON subject.sub_id = result.sub_id
WHERE
    student.student_id = ${student_id2}`, (err, rows) => {
        if (err) throw err;
        res.render('/home/tirth-raval/Documents/one_union_form/views/seach_by_query_report_card/report.ejs', { data: rows });
    });
});

module.exports = app
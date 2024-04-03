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

app.post('/filtering_and', authentication, (req, res) => {
    const perPage = 10;
    const page = req.query.page || 1;
    const offset = (page - 1) * perPage;
    let tingting2;
    let fname = req.body.fname;
    let prilim = req.body.prilim;
    let terminal = req.body.terminal;
    let final = req.body.final;
    let total = req.body.total;
    let percentage = req.body.percentage;
    // if(req.body.and_or == 'and'){

    // }  
    connection.query(`select * from (SELECT 
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
    GROUP BY student.student_id order by student.student_id) as tt1 WHERE
        first_name LIKE '%${fname}%'
            ${req.body.and_or} (total_prelim_practical_marks + total_prelim_theory_marks) > ${prilim}
            ${req.body.and_or} (total_terminal_practical_marks + total_terminal_theory_marks) > ${terminal}
            ${req.body.and_or} (total_final_practical_marks + total_final_theory_marks) > ${final}
            ${req.body.and_or} total >${total}
            ${req.body.and_or} ((total) / 1200) * 100 > ${percentage};`, (err, rows) => {
        if (err) throw err;
        res.render('/home/tirth-raval/Documents/one_union_form/views/seach_by_query_report_card/index.ejs', { result: rows });
    });
});
app.get('/search_by_query', authentication, (req, res) => {
    res.render('/home/tirth-raval/Documents/one_union_form/views/seach_by_query_report_card/index22.ejs');
});
app.post('/dynamic', authentication, (req, res) => {
    try {
        const perPage = 10;
        // const page = req.query.page || 1;
        // const offset = (page - 1) * perPage;
        let query = req.body.query;
        connection.query(query, function (error, rows) {
            if (error) throw error;
            res.render('/home/tirth-raval/Documents/one_union_form/views/seach_by_query_report_card/dynamic.ejs', { data: rows });
        });
    } catch (error) {
        res.write("Try again ");
        return res.end();
    }
});

module.exports = app
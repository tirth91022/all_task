const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const authentication = require("/home/tirth-raval/Documents/one_union_form/views/login_logout/authentication.js");
const { request } = require('http');
// const mysql = require("mysql");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const md5 = require("md5");
const jwt = require("jsonwebtoken");
const cookieparser = require("cookie-parser");
app.use(cookieparser())
app.use(express.json())
const alert = require("alert-node")
const mysql = require("mysql2");

const port = 8000;

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Dev@123',
    database: 'db',
    multipleStatements: true
});

app.use(express.static('public'));

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.get("/", authentication, (req, res) => {
    res.sendFile(__dirname + "/views/home.html");
});
app.get("/job_form", authentication, (req, res) => {
    res.sendFile(__dirname + "/views/job_form/jobForm1.html");
});
app.get("/html3", authentication, (req, res) => {
    res.render('html3/index3');
});
app.get("/dynamic_table", authentication, (req, res) => {
    res.sendFile(__dirname + "/views/dynamic_table/dynamic_table_baki.html");
});
app.get("/kuku_cube", authentication, (req, res) => {
    res.sendFile(__dirname + "/views/kuku_cube/kuku_cube.html");
});
app.get("/tic_tac_toe", authentication, (req, res) => {
    res.sendFile(__dirname + "/views/tic_tac_toe/tic_tac_toe.html");
});
app.get("/soring_algos", authentication, (req, res) => {
    res.sendFile(__dirname + "/views/sortin_algorithm/sorting_baki_algos.html");
});
app.get("/task3", authentication, (req, res) => {
    res.sendFile(__dirname + "/views/assets/index3.html");
});

//sanket sir
app.get("/sanketSirTask", authentication, (req, res) => {
    res.sendFile(__dirname + "/views/sanket_lakhani_task/index.html");
});

app.get("/details", authentication, (req, res) => {
    res.render("/home/tirth-raval/Documents/one_union_form/views/sanket_lakhani_task/personal.ejs");
});

//delimited Search
app.get('/delimited_search', authentication, (req, res) => {
    const pageS = 100;

    let mapping = {
        '_': 'id',
        '^': 'name',
        '$': 'phone',
        '}': 'city',
        '{': 'zipcode',
        ':': 'bloodGroup'
    };

    let query = '', expression = '';

    const queryObj = new URLSearchParams(req.query);

    function getString(s, flag = true) {
        let o = '';
        for (let a of s) {
            if (mapping.hasOwnProperty(a)) {
                return o;
            }
            if (a == '%' && flag) {
                o += '\\%';
            } else {
                o += a;
            }
        }
        return o;
    }

    if (queryObj.has('search') && queryObj.get('search').length && queryObj.get('search') !== getString(queryObj.get('search'))) {
        let q = queryObj.get('search', false);
        let expression1 = '', expression2 = '', expression3 = '', expression4 = '', expression5 = '', expression6 = '';

        let id = q.split('_')?.filter(l => l.length);
        if (id.length) {
            expression1 = id.map(e => getString(e)).filter(l => l.length).map(e => `id LIKE '%${e}%'`).join(' OR ');
        }

        let name = q.split('^')?.filter(l => l.length);
        if (name.length) {
            expression2 = name.map(e => getString(e)).filter(l => l.length).map(e => `name LIKE '%${e}%'`).join(' OR ');
        }

        let phone = q.split('$')?.filter(l => l.length);
        if (phone.length) {
            expression3 = phone.map(e => getString(e)).filter(l => l.length).map(e => `phone LIKE '%${e}%'`).join(' OR ');
        }

        let city = q.split('}')?.filter(l => l.length);
        if (city.length) {
            expression4 = city.map(e => getString(e)).filter(l => l.length).map(e => `city LIKE '%${e}%'`).join(' OR ');
        }

        let zipcode = q.split('{')?.filter(l => l.length);
        if (zipcode.length) {
            expression5 = zipcode.map(e => getString(e)).filter(l => l.length).map(e => `zipcode LIKE '%${e}%'`).join(' OR ');
        }

        let bloodGroup = q.split(':')?.filter(l => l.length);
        if (bloodGroup.length) {
            expression6 = bloodGroup.map(e => getString(e)).filter(l => l.length).map(e => `bloodGroup LIKE '%${e}%'`).join(' OR ');
        }

        expression = [expression1, expression2, expression3, expression4, expression5, expression6].filter(l => l.length).map(a => '( ' + a + ' )').join(' AND ');
    }

    new Promise((resolve, reject) => {
        connection.query(connection.format(`
            SELECT
                id, name, phone, city, zipcode, bloodGroup
            FROM
                student_master
            ${expression.length ? `WHERE ${expression}` : ``}
            LIMIT ${pageS}`), (err, results, fields) => {
            if (err) reject(err);
            resolve({
                results, fields
            });
        });
    }).then(data => res.render('/home/tirth-raval/Documents/one_union_form/views/delmited_search/index.ejs', { ...data, mapping: Object.values(mapping), query: queryObj.get('search') }))
        .catch(err => res.send(err))
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
app.get('/form/:id', authentication, (req, res) => {
    console.log("hello");
    const userId = req.params.id;
    const sql = `select * from basic_details where bid = ${userId};`;
    const eql = `select * from education_details where bid=${userId};`;
    const wql = `select * from work_experience where bid=${userId};`;
    const rql = `select * from referance_contact where bid=${userId};`;
    const yql = `select * from referance_details where bid=${userId};`;
    // const opl = `select * from language_known where bid=${userId};`;
    // const htl = `select * from technology_known where bid=${userId};`;

    //basic details
    connection.query(sql + eql + wql + rql + yql, (error, results) => {
        if (error) {
            console.error(error);
            res.render('error', { errorMessage: 'error occured while fetching user data.' })
        } else {

            const userData = results;

            console.log(results);
            res.render('/home/tirth-raval/Documents/one_union_form/views/ajax_form/form2.ejs', { userData: userData });
        }
    });

    //education details

});
//year wise month wise
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

//filter and report card 
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

//login logout
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
        const characters = 'ABCDEFGHIJKLM1234567890NOPQRSTUVWXYZ';
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

//ajax valu task
app.get("/form", authentication, (req, res) => {
    let id = req.params.id;
    res.render("/home/tirth-raval/Documents/one_union_form/views/ajax_form/form2.ejs", { userData: '', errorMessage: null })
})

app.post('/your-details', authentication, (req, res) => {

    var first_name = req.body.firstName;
    var last_name = req.body.lastName;
    var designation = req.body.Designation;
    var address_1 = req.body.Address_1;
    var address_2 = req.body.address_2;
    var phone_number = req.body.phone_number;
    var city = req.body.city;
    var state = req.body.State;
    var gender = req.body.gender;
    var zip_code = req.body.zip_code;
    var relationalshipStatus = req.body.relation;
    var DOB = req.body.date_of_birth;
    var email = req.body.email;

    var educationDetails = req.body.educationDetails;
    var workExperienceDetails = req.body.workExperienceDetails;
    var referanceContactDetails = req.body.referanceContactDetails;
    var technologies = req.body.technologies;
    var languages = req.body.languages;

    let lang12 = req.body.languages.length;

    let last_id;

    var Preferd_location = req.body.Preferd_location;
    var Notice_period = req.body.Notice_period;
    var Department = req.body.Department;
    var Expacted_CTC = req.body.Expacted_CTC;
    var Current_CTC = req.body.Current_CTC;

    // var language = req.body.language;
    // var hindi = req.body.hindi;
    // var english = req.body.english;
    // var gujarati = req.body.gujarati;

    // var technology = req.body.technology;
    // var mysql = req.body.mysql;
    // var oracle = req.body.oracle;
    // var laravel = req.body.laravel;
    // var php = req.body.php;
    console.log(technologies);
    console.log(educationDetails);
    console.log(languages);

    connection.query(`INSERT INTO basic_details (first_name,last_name,designation,address_1,address_2,phone_number,city,state,gender,zip_code,relationalshipStatus,DOB,email) VALUES ("${first_name}","${last_name}","${designation}","${address_1}","${address_2}","${phone_number}","${city}","${state}","${gender}","${zip_code}","${relationalshipStatus}","${DOB}","${email}");`, (error, results) => {
        if (error) {
            console.error(error);
            res.render('/home/tirth-raval/Documents/one_union_form/views/ajax_form/form2.ejs', { errorMessage: 'Error occurred while submitting the form.' });
        } else {
            console.log('basic details Data inserted successfully');
            last_id = results.insertId;

            call(results.insertId)
            // Redirect to the form page after successful submission
        }
    });

    function call(c_id) {

        connection.query(`INSERT INTO referance_details (bid,prefered_location,notice_period,current_ctc,expected_ctc,department) VALUES ("${c_id}","${Preferd_location}","${Notice_period}","${Current_CTC}","${Expacted_CTC}","${Department}")`, (error, results) => {
            if (error) {
                console.error(error);
                res.render('/home/tirth-raval/Documents/one_union_form/views/ajax_form/form2.ejs', { errorMessage: 'Error occurred while submitting the form.' });
            } else {
                console.log('preferance_details Data inserted successfully');
            }
        });
        educationDetails.forEach((education) => {
            const insertQuery1 = `INSERT INTO education_details (course_name, passing_year, percentage,bid) VALUES ('${education.courseName}', '${education.passingYear}', '${education.percentage}',"${c_id}");`;
            connection.query(insertQuery1, (error, results) => {
                if (error) {
                    console.error(error);
                    res.render('/home/tirth-raval/Documents/one_union_form/views/ajax_form/form2.ejs', { errorMessage: 'Error occurred while submitting the form.' });
                } else {

                    console.log('education_details Data inserted successfully');
                }
            })
        })
        // console.log(workExperienceDetails);
        workExperienceDetails.forEach((workExperience) => {
            const insertQuery2 = `INSERT INTO work_experience (companyName1, designation1, from1,to1,bid) VALUES ('${workExperience.companyName1}', '${workExperience.Designation1}', '${workExperience.From1}','${workExperience.To1}',"${c_id}");`;
            connection.query(insertQuery2, (error, results) => {
                if (error) {
                    console.error(error);
                    res.render('/home/tirth-raval/Documents/one_union_form/views/ajax_form/form2.ejs', { errorMessage: 'Error occurred while submitting the form.' });
                } else {

                    console.log('work experience Data inserted successfully');
                }
            })
        })

        referanceContactDetails.forEach((refer) => {
            const insertQuery3 = `INSERT INTO referance_contact (name1, contactNo1, relation1,bid) VALUES ('${refer.Name1}', '${refer.ContactNumber1}', '${refer.Relation1}',"${c_id}");`;
            connection.query(insertQuery3, (error, results) => {
                if (error) {
                    console.error(error);
                    res.render('/home/tirth-raval/Documents/one_union_form/views/ajax_form/form2.ejs', { errorMessage: 'Error occurred while submitting the form.' });
                } else {

                    console.log('refer contacts Data inserted successfully');
                }
            })
        })

        // for (let i = 0; i < language.length; i++) {
        //     console.log(req.body[language[i]][0]);
        //     connection.query(`INSERT INTO language_known (bid,language_name,lang_read,lang_write,lang_speak) VALUES ("${c_id}","${language[i]}","${req.body[language[i]][0] || ""}","${req.body[language[i]][1] || ""}","${req.body[language[i]][2] || ""}")`, (error, results) => {
        //         if (error) {
        //             console.error(error);
        //             res.render('jobForm1', { errorMessage: 'Error occurred while submitting the form.' });
        //         } else {

        //             console.log('languages data inserted successfully');
        //         }
        //     });
        // }

        technologies.forEach((education) => {
            const insertQuery4 = `INSERT INTO technology_known (bid, technology_name, tech_level) VALUES ("${c_id}", "${education.technology}","${education.proficiency}");`;
            connection.query(insertQuery4, (error, results) => {
                if (error) {
                    console.error(error);
                    res.render('/home/tirth-raval/Documents/one_union_form/views/ajax_form/form2.ejs', { errorMessage: 'Error occurred while submitting the form.' });
                } else {

                    console.log('technology data inserted successfully');
                }
            })
        })

        for (let i = 0; i < lang12.length; i++) {
            console.log(req.body[languages[i]][0]);
            connection.query(`INSERT INTO language_known (bid,language_name,lang_read,lang_write,lang_speak) VALUES ("${c_id}","${languages[i]}","${req.body[languages[i]][0] || ""}","${req.body[languages[i]][1] || ""}","${req.body[languages[i]][2] || ""}")`, (error, results) => {
                if (error) {
                    console.error(error);
                    res.render('jobForm1', { errorMessage: 'Error occurred while submitting the form.' });
                } else {

                    console.log('languages data inserted successfully');
                }
            });
        }

    }
});

app.get("/data", authentication, (req, res) => {
    let sql = 'select bid,first_name,last_name,designation,address_1,phone_number,city,email,gender from basic_details';
    connection.query(sql, (err, result) => {
        if (err) {
            throw err;
        } else {
            res.render('/home/tirth-raval/Documents/one_union_form/views/ajax_form/updatedForm.ejs', { users: result })
        }
    })
})

// app.listen('8000', () => { console.log('Server listening to port 8000') });

app.listen(port);
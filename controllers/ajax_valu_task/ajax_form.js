const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const authentication = require("/home/tirth-raval/Documents/one_union_form/middleware/authentication.js");

require("dotenv").config();

const cookieparser = require("cookie-parser");
app.use(cookieparser());
app.use(express.json());
const alert = require("alert-node");
const mysql = require("mysql2");
const port = 8000;

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

const connection = require("/home/tirth-raval/Documents/one_union_form/db config/db.js");

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

    const lang12 = languages.length;
    console.log(lang12);

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

        for (let i = 0; i < lang12; i++) {
            console.log('hello');
            connection.query(`INSERT INTO language_known (bid,language_name,lang_read,lang_write,lang_speak) VALUES ("${c_id}","${languages[i].language}","${languages[i].proficiency1[0] || ""}","${languages[i].proficiency1[1] || ""}","${languages[i].proficiency1[2] || ""}")`, (error, results) => {
                if (error) {
                    console.error(error);
                    res.render('/home/tirth-raval/Documents/one_union_form/views/ajax_form/form2.ejs', { errorMessage: 'Error occurred while submitting the form.' });
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

app.get('/form/:id', authentication, (req, res) => {
    console.log("hello");
    const userId = req.params.id;
    const sql = `select * from basic_details where bid = ${userId};`;
    const eql = `select * from education_details where bid=${userId};`;
    const wql = `select * from work_experience where bid=${userId};`;
    const rql = `select * from referance_contact where bid=${userId};`;
    const yql = `select * from referance_details where bid=${userId};`;
    const uql = `select * from language_known where bid=${userId};`;
    const lql = `select * from technology_known where bid=${userId};`;
    // const opl = `select * from language_known where bid=${userId};`;
    // const htl = `select * from technology_known where bid=${userId};`;

    //basic details
    connection.query(sql + eql + wql + rql + yql + uql + lql, (error, results) => {
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

module.exports = app
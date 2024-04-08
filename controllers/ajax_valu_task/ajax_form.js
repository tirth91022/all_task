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



    let last_id1;
    let last_id2;

    var Preferd_location = req.body.Preferd_location;
    var Notice_period = req.body.Notice_period;
    var Department = req.body.Department;
    var Expacted_CTC = req.body.Expacted_CTC;
    var Current_CTC = req.body.Current_CTC;


    connection.query(`SELECT * FROM basic_details WHERE email = "${email}"`, (selectError, selectResults) => {
        if (selectError) {
            console.error(selectError);
            res.status(500).send('Error occurred while checking user data existence.');
        } else {
            if (selectResults.length > 0) {
                const userId = selectResults[0].bid;

                connection.query(`UPDATE basic_details SET first_name="${first_name}", last_name="${last_name}", designation="${designation}", address_1="${address_1}", address_2="${address_2}", phone_number="${phone_number}", city="${city}", state="${state}", gender="${gender}", zip_code="${zip_code}", relationalshipStatus="${relationalshipStatus}", DOB="${DOB}" WHERE email = "${email}"`, (updateError, updateResults) => {
                    if (updateError) {
                        console.error(updateError);
                        res.status(500).send('Error occurred while updating user data.');
                    } else {

                        console.log(userId);
                        call(userId)

                        console.log('User data updated successfully');
                        res.status(200).send('User data updated successfully');
                    }
                });
            } else {

                connection.query(`INSERT INTO basic_details (first_name,last_name,designation,address_1,address_2,phone_number,city,state,gender,zip_code,relationalshipStatus,DOB,email) VALUES ("${first_name}","${last_name}","${designation}","${address_1}","${address_2}","${phone_number}","${city}","${state}","${gender}","${zip_code}","${relationalshipStatus}","${DOB}","${email}")`, (insertError, insertResults) => {
                    if (insertError) {
                        console.error(insertError);
                        res.status(500).send('Error occurred while inserting user data.');
                    } else {

                        last_id2 = insertResults.insertId;
                        call(last_id2)

                        console.log('User data inserted successfully');
                        res.status(200).send('User data inserted successfully');
                    }
                });
            }
        }
    });

    function call(c_id) {

        connection.query(`SELECT * FROM referance_details WHERE bid = ${c_id}`, (selectError, selectResults) => {
            if (selectError) {
                console.error(selectError);
                res.status(500).send('Error occurred while checking referance details existence.');
            } else {
                if (selectResults.length > 0) {

                    connection.query(`UPDATE referance_details SET prefered_location="${Preferd_location}", notice_period="${Notice_period}", current_ctc="${Current_CTC}", expected_ctc="${Expacted_CTC}", department="${Department}" WHERE bid = ${c_id}`, (updateError, updateResults) => {
                        if (updateError) {
                            console.error(updateError);
                            res.status(500).send('Error occurred while updating referance details.');
                        } else {
                            console.log('Referance details updated successfully');

                        }
                    });
                } else {

                    connection.query(`INSERT INTO referance_details (bid, prefered_location, notice_period, current_ctc, expected_ctc, department) VALUES (${c_id}, "${Preferd_location}", "${Notice_period}", "${Current_CTC}", "${Expacted_CTC}", "${Department}")`, (insertError, insertResults) => {
                        if (insertError) {
                            console.error(insertError);
                            res.status(500).send('Error occurred while inserting referance details.');
                        } else {
                            console.log('Referance details inserted successfully');

                        }
                    });
                }
            }
        });

        educationDetails.forEach((education) => {

            connection.query(`SELECT * FROM education_details WHERE bid = ${c_id} AND course_name = '${education.courseName}'`, (selectError, selectResults) => {
                if (selectError) {
                    console.error(selectError);
                    res.status(500).send('Error occurred while checking education details existence.');
                } else {
                    if (selectResults.length > 0) {

                        connection.query(`UPDATE education_details SET passing_year = '${education.passingYear}', percentage = '${education.percentage}' WHERE bid = ${c_id} AND course_name = '${education.courseName}'`, (updateError, updateResults) => {
                            if (updateError) {
                                console.error(updateError);
                                res.status(500).send('Error occurred while updating education details.');
                            } else {
                                console.log('Education detail updated successfully');
                            }
                        });
                    } else {

                        connection.query(`INSERT INTO education_details (course_name, passing_year, percentage, bid) VALUES ('${education.courseName}', '${education.passingYear}', '${education.percentage}', ${c_id})`, (insertError, insertResults) => {
                            if (insertError) {
                                console.error(insertError);
                                res.status(500).send('Error occurred while inserting education details.');
                            } else {
                                console.log('Education detail inserted successfully');
                            }
                        });
                    }
                }
            });
        });

        workExperienceDetails.forEach((workExperience) => {

            connection.query(`SELECT * FROM work_experience WHERE bid = ${c_id} AND companyName1 = '${workExperience.companyName1}'`, (selectError, selectResults) => {
                if (selectError) {
                    console.error(selectError);
                    res.status(500).send('Error occurred while checking work experience details existence.');
                } else {
                    if (selectResults.length > 0) {

                        connection.query(`UPDATE work_experience SET designation1 = '${workExperience.Designation1}', from1 = '${workExperience.From1}', to1 = '${workExperience.To1}' WHERE bid = ${c_id} AND companyName1 = '${workExperience.companyName1}'`, (updateError, updateResults) => {
                            if (updateError) {
                                console.error(updateError);
                                res.status(500).send('Error occurred while updating work experience details.');
                            } else {
                                console.log('Work experience detail updated successfully');
                            }
                        });
                    } else {

                        connection.query(`INSERT INTO work_experience (companyName1, designation1, from1, to1, bid) VALUES ('${workExperience.companyName1}', '${workExperience.Designation1}', '${workExperience.From1}', '${workExperience.To1}', ${c_id})`, (insertError, insertResults) => {
                            if (insertError) {
                                console.error(insertError);
                                res.status(500).send('Error occurred while inserting work experience details.');
                            } else {
                                console.log('Work experience detail inserted successfully');
                            }
                        });
                    }
                }
            });
        });

        referanceContactDetails.forEach((refer) => {

            connection.query(`SELECT * FROM referance_contact WHERE bid = ${c_id} AND name1 = '${refer.Name1}'`, (selectError, selectResults) => {
                if (selectError) {
                    console.error(selectError);
                    res.status(500).send('Error occurred while checking reference contact details existence.');
                } else {
                    if (selectResults.length > 0) {

                        connection.query(`UPDATE referance_contact SET contactNo1 = '${refer.ContactNumber1}', relation1 = '${refer.Relation1}' WHERE bid = ${c_id} AND name1 = '${refer.Name1}'`, (updateError, updateResults) => {
                            if (updateError) {
                                console.error(updateError);
                                res.status(500).send('Error occurred while updating reference contact details.');
                            } else {
                                console.log('Reference contact detail updated successfully');
                            }
                        });
                    } else {

                        connection.query(`INSERT INTO referance_contact (name1, contactNo1, relation1, bid) VALUES ('${refer.Name1}', '${refer.ContactNumber1}', '${refer.Relation1}', ${c_id})`, (insertError, insertResults) => {
                            if (insertError) {
                                console.error(insertError);
                                res.status(500).send('Error occurred while inserting reference contact details.');
                            } else {
                                console.log('Reference contact detail inserted successfully');
                            }
                        });
                    }
                }
            });
        });


        technologies.forEach((technology) => {

            connection.query(`SELECT * FROM technology_known WHERE bid = ${c_id} AND technology_name = '${technology.technology}'`, (selectError, selectResults) => {
                if (selectError) {
                    console.error(selectError);
                    res.status(500).send('Error occurred while checking technology details existence.');
                } else {
                    if (selectResults.length > 0) {

                        connection.query(`UPDATE technology_known SET tech_level = '${technology.proficiency}' WHERE bid = ${c_id} AND technology_name = '${technology.technology}'`, (updateError, updateResults) => {
                            if (updateError) {
                                console.error(updateError);
                                res.status(500).send('Error occurred while updating technology details.');
                            } else {
                                console.log('Technology detail updated successfully');
                            }
                        });
                    } else {

                        connection.query(`INSERT INTO technology_known (bid, technology_name, tech_level) VALUES (${c_id}, '${technology.technology}', '${technology.proficiency}')`, (insertError, insertResults) => {
                            if (insertError) {
                                console.error(insertError);
                                res.status(500).send('Error occurred while inserting technology details.');
                            } else {
                                console.log('Technology detail inserted successfully');
                            }
                        });
                    }
                }
            });
        });



        languages.forEach((language) => {

            let langRead = language.proficiency1.includes('read') ? 'read' : '';
            let langWrite = language.proficiency1.includes('write') ? 'write' : '';
            let langSpeak = language.proficiency1.includes('speak') ? 'speak' : '';


            connection.query(`SELECT * FROM language_known WHERE bid = ${c_id} AND language_name = '${language.language}'`, (selectError, selectResults) => {
                if (selectError) {
                    console.error(selectError);
                    res.status(500).send('Error occurred while checking language details existence.');
                } else {
                    if (selectResults.length > 0) {

                        connection.query(`UPDATE language_known SET lang_read = '${langRead}', lang_write = '${langWrite}', lang_speak = '${langSpeak}' WHERE bid = ${c_id} AND language_name = '${language.language}'`, (updateError, updateResults) => {
                            if (updateError) {
                                console.error(updateError);
                                res.status(500).send('Error occurred while updating language details.');
                            } else {
                                console.log('Language detail updated successfully');
                            }
                        });
                    } else {

                        connection.query(`INSERT INTO language_known (bid, language_name, lang_read, lang_write, lang_speak) VALUES (${c_id}, '${language.language}', '${langRead}', '${langWrite}', '${langSpeak}')`, (insertError, insertResults) => {
                            if (insertError) {
                                console.error(insertError);
                                res.status(500).send('Error occurred while inserting language details.');
                            } else {
                                console.log('Language detail inserted successfully');
                            }
                        });
                    }
                }
            });
        });


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
    const userId = req.params.id;
    const sql = `select * from basic_details where bid = ${userId};`;
    const eql = `select * from education_details where bid=${userId};`;
    const wql = `select * from work_experience where bid=${userId};`;
    const rql = `select * from referance_contact where bid=${userId};`;
    const yql = `select * from referance_details where bid=${userId};`;
    const uql = `select * from language_known where bid=${userId};`;
    const lql = `select * from technology_known where bid=${userId};`;

    //basic details
    connection.query(sql + eql + wql + rql + yql + uql + lql, (error, results) => {
        if (error) {
            console.error(error);
            res.render('error', { errorMessage: 'error occured while fetching user data.' })
        } else {

            const userData = results;
            res.render('/home/tirth-raval/Documents/one_union_form/views/ajax_form/form2.ejs', { userData: userData });
        }
    });

});

module.exports = app
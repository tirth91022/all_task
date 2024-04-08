const express = require('express');
const authentication = require("/home/tirth-raval/Documents/one_union_form/middleware/authentication.js");
const app = express();

const connection = require("/home/tirth-raval/Documents/one_union_form/db config/db.js");

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
    console.log('here', queryObj);

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
        console.log('id ', id.map(e => getString(e)).filter(l => l.length).map(e => `id LIKE '%${e}%'`).join(' OR '));
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
        console.log('exp', expression);
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

module.exports = app
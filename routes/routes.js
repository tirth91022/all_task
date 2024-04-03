const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const router = express.Router();
const cookieparser = require("cookie-parser");
app.use(cookieparser());
app.use(express.json());
const port = 8000;
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));

router.use('/', require('../controllers/kukucube/kukucube'));
router.use('/', require('../controllers/dynamic_table/dynamic_table'));
router.use('/', require('../controllers/tic_tac_toe/tic_tac_toe'));
router.use('/', require('../controllers/simple_job_form/simple_job'));
router.use('/', require('../controllers/html_task_3/html_task3'));
router.use('/', require('../controllers/homeFile/homefile'));
router.use('/', require('../controllers/sorting_algorithms/sorting_algo'));
router.use('/', require('../controllers/sanket_sir_task/sanket_sir'));
router.use('/', require('../controllers/delimited_search/delimited_search'));
router.use('/', require('../controllers/report_card/report_card'));
router.use('/', require('../controllers/ajax_valu_task/ajax_form'));
router.use('/', require('../controllers/login_logout/login_logout'));
router.use('/', require('../controllers/attandance_task/attandance'));
router.use('/', require('../controllers/filtering_and_searching/filter_search'));

module.exports = router;
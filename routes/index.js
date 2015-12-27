var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* ble60 */
router.get('/ble60', function(req, res, next) {
  res.render('keyboard', {  kbtype: 'ble60' });
});

/* kc60 */
router.get('/kc60', function(req, res, next) {
    res.render('keyboard', {  kbtype: 'kc60' });
});

/* epbt60 */
router.get('/epbt60', function(req, res, next) {
    res.render('keyboard', {  kbtype: 'epbt60' });
});

/* epbt60v2 */
router.get('/epbt60v2', function(req, res, next) {
    res.render('keyboard', {  kbtype: 'epbt60v2' });
});

/* diyso60 */
router.get('/diyso60', function(req, res, next) {
    res.render('keyboard', {  kbtype: 'diyso60' });
});

/* epbt75 */
router.get('/epbt75', function(req, res, next) {
    res.render('keyboard', {  kbtype: 'epbt75' });
});

/* test2 */
router.get('/index2', function(req, res, next) {
    res.render('epbt75', { kbtype: 'epbt75' });
});
module.exports = router;

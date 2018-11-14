var express = require('express');
var mysql = require('./dbcon.js');
var bodyParser = require('body-parser');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.use(bodyParser.urlencoded({extended:true}));
app.use('/static', express.static('public'));
app.set('view engine', 'handlebars');
app.set('port', 17014);
app.set('mysql', mysql);
app.use('/whosit', require('./whosit.js'));
app.use('/wheresit', require('./wheresit.js'));
app.use('/whatsit', require('./whatsit.js'));
app.use('/hasA', require('./hasA.js'));
app.use('/howsit', require('./howsit.js'));
app.use('/feelsA', require('./feelsA.js'));
app.use('/whysit', require('./whysit.js'));
app.use('/', express.static('public'));

app.get('/', function(req, res) {
    res.render('index');
});

/*
app.get('/index', function(req, res) {
    res.render('index');
});
*/

app.use(function(req, res) {
    res.status(404);
    res.render('404');
});

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

app.listen(app.get('port'), function() {
    console.log('Express started on flip3.engr.oregonstate.edu:' + app.get('port') + '; press Ctrl-C to terminate.');
});

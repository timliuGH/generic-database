var express = require('express');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout: 'main'});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');				
app.set('port', 10376);												

app.get('/', function(req, res) {
	res.render('index');	
});

app.get('/whosit.html', function(req, res) {
	res.render('whosit');
});

app.get('/whysit.html', function(req, res) {
	res.render('whysit');
});

app.get('/wheresit.html', function(req, res) {
	res.render('wheresit');
});

app.get('/whatsit.html', function(req, res) {
	res.render('whatsit');
});

app.get('/update.html', function(req, res) {
	res.render('update');
});

app.get('/howsit.html', function(req, res) {
	res.render('howsit');
});

app.get('/hasA.html', function(req, res) {
	res.render('hasA');
});

app.get('/feelsA.html', function(req, res) {
	res.render('feelsA');
});

app.use(function(req, res) {
	res.status(404);
	res.render('404');
});

app.use(function(err, req, res, next) {
	console.error(err.stack);
	res.type('plain/text');
	res.status(500);
	res.render('500');
});

app.listen(app.get('port'), function() {
	console.log('Express started on flip3.engr.oregonstate.edu:10376')
});
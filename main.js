var express = require('express');
var app = express();
var cons = require('consolidate');

app.engine('html', cons.swig);
app.set('view engine', 'html');

app.use('/static', express.static(__dirname + '/public'));

app.get('/', function(req, res) {
	res.render('index.html');
});

app.listen(3000, function() {
	console.log('Example app listening on port 3000!');
});
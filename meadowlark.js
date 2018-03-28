var express = require('express');

var app = express();
var handlebars = require('express-handlebars')
    .create({ defaultLayout: 'main' });

var fortune = require('./lib/fortune');

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 3000);

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.render('home');
});

app.get('/about', function (req, res) {
    res.render('about', { fortune: fortune.getFortune() });
});

// 404 page
app.use(function(req, res) {
    res.status(404);
    res.render('404');
});

// 500 page
app.use(function(err, req, res) {
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

app.listen(app.get('port'), function() {
    console.log('Express launched on http://localhost:' + app.get('port'));
});
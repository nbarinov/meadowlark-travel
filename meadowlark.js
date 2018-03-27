var express = require('express');

var app = express();

app.set('port', process.env.PORT || 3000);

app.get('/', function(req, res) {
    res.type('text/plain');
    res.send('Meadowlark Travel');
});

app.get('/about', function (req, res) {
    res.type('text/plain');
    res.send('About Meadowlark Travel');
});

// 404 page
app.use(function(req, res) {
    res.type('text/plain');
    res.status(404);
    res.send('404 - Not found');
});

// 500 page
app.use(function(req, res) {
    res.type('text/plain');
    res.status(500);
    res.send('500 – Server error');
});

app.listen(app.get('port'), function() {
    console.log('Express launched on http://localhost:' + app.get('port'));
});
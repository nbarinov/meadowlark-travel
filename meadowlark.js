var express = require('express');

var app = express();
var handlebars = require('express-handlebars')
    .create({ 
        defaultLayout: 'main', 
        helpers: {
            section: function(name, options) {
                if(!this._sections) {
                    this._sections = {};
                }

                this._sections[name] = options.fn(this);

                return null;
            }
        }
    });
var formidable = require('formidable');

var fortune = require('./lib/fortune');
var weather = require('./lib/weather');
var credentials = require('./credentials');

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 3000);

app.use(express.static(__dirname + '/public'));
app.use(require('body-parser').urlencoded({extended: true}));
app.use(require('cookie-parser')(credentials.cookieSecret));
app.use(require('express-session')({
    resave: false,
    saveUninitialized: false,
    secret: credentials.cookieSecret
}));

app.use(function(req, res, next) {
    res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
    next();
});
app.use(function(req, res, next) {
    res.locals.partials = (res.locals.partials) ? res.locals.partials : {};

    res.locals.partials.weatherContext = weather.getWeatherData();

    next();
});
app.use(function(req, res, next) {
    res.locals.flash = req.session.flash;
    delete req.session.flash;

    next();
});

app.get('/', function(req, res) {
    res.render('home');
});

app.get('/about', function (req, res) {
    res.render('about', { 
        fortune: fortune.getFortune(),
        pageTestScript: '/qa/tests-about.js'
    });
});

app.get('/tours/hood-river', function(req, res) {
    res.render('tours/hood-river');
});

app.get('/tours/oregon-coast', function (req, res) {
    res.render('tours/oregon-coast');
});

app.get('/tours/request-group-rate', function(req, res) {
    res.render('tours/request-group-rate');
});

app.get('/headers', function(req, res) {
    res.set('Content-type', 'text/plain');

    var s = '';
    for(var name in req.headers)
        s += name + ': ' + req.headers[name] + '\n';
    
    res.send(s);
});

app.get('/thank-you', function (req, res) {
    res.render('thank-you');
});

app.get('/newslatter', function(req, res) {
    res.render('newslatter', { csrf: 'CSRF token goes here' });
});

function NewslatterSignUp() {}

NewslatterSignUp.prototype.save = function(cb) {
    cb();
};

var VALID_EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

app.post('/newslatter', function(req, res) {
    var name = req.body.name || '';
    var email = req.body.email || '';

    if(!email.match(VALID_EMAIL_REGEX)) {
        if(req.xhr) {
            return res.json({
                error: 'Invalid name email address.'
            });
        }

        return res.redirect(303, '/newslatter/archive');
    }

    new NewslatterSignUp({ name: name, email: email }).save(function(err) {
        if(err) {
            if(req.xhr) {
                return res.json({
                    error: 'Database error.'
                });
            }

            req.session.flash = {
                type: 'danger',
                intro: 'Database error!',
                message: 'There was a database error; please try again later.',
            };

            return res.redirect(303, '/newslatter/archive');
        }

        if(req.xhr) {
            return res.json({ success: true });
        } 

        req.session.flash = {
            type: 'success',
            intro: 'Thank you!',
            message: 'You have now been signed up for the newsletter.',
        };

        return res.redirect(303, '/newslatter/archive');
    });
});

app.get('/newslatter/archive', function(req, res) {
    res.render('newslatter/archive');
});

app.get('/contest/vacation-photo', function (req, res) {
    var now = new Date();

    res.render(
        'contest/vacation-photo', 
        { 
            year: now.getFullYear(), 
            month: now.getMonth() 
        }
    );
});

app.post('/contest/vacation-photo/:year/:month', function(req, res) {
    var form = formidable.IncomingForm();

    form.parse(req, function(err, fields, files) {
        if(err) {
            return res.redirect(303, '/error');
        }

        console.log('received fields:');
        console.log(fields);
        console.log('received files:');
        console.log(files);

        res.redirect(303, '/thank-you');
    });
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
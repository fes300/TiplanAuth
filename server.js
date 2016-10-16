var logger          = require('morgan'),
    cors            = require('cors'),
    http            = require('http'),
    express         = require('express'),
    errorhandler    = require('errorhandler'),
    dotenv          = require('dotenv'),
    bodyParser      = require('body-parser'),
    mongoose        = require('mongoose');

var app = express();

dotenv.load();

// Parsers
// old version of line
// app.use(bodyParser.urlencoded());
// new version of line
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use((err, req, res, next)=> {
  if (err.name === 'StatusError') {
    res.send(err.status, err.message);
  } else {
    next(err);
  }
});

if (process.env.NODE_ENV !== 'production') {
  app.use(logger('dev'));
  app.use(errorhandler());
  mongoose.connect('mongodb://localhost/matilde');
}else{
  app.use(logger('common'));
}

// app.use(require('./anonymous-routes'));
// app.use(require('./protected-routes'));
// app.use(require('./user-routes'));
//app.use(favicon(__dirname + '/public/favicon.ico'));

app.use('/users', require('./controllers/userController'));
app.use('/maps', require('./controllers/mapsController'));
app.use('/sessions', require('./controllers/sessionController'));
app.use('/quotes', require('./controllers/quotesController'));

var port = process.env.PORT || 3001;

http.createServer(app).listen(port, function (err) {
  console.log('listening in http://localhost:' + port);
});

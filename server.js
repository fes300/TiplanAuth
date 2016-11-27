var logger          = require('morgan'),
    cors            = require('cors'),
    http            = require('http'),
    express         = require('express'),
    errorhandler    = require('errorhandler'),
    dotenv          = require('dotenv'),
    bodyParser      = require('body-parser'),
    mongoose        = require('mongoose');

var app = express();
var dbName = 'mongodb://' + process.env.MONGODB_PORT_27017_TCP_ADDR + ':' + process.env.MONGODB_PORT_27017_TCP_PORT + '/matilde'
console.log(dbName);
dotenv.load();



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
  mongoose.connect(dbName);
}else{
  app.use(logger('common'));
}

app.use('/users', require('./controllers/userController'));
app.use('/sessions', require('./controllers/sessionController'));
app.use('/quotes', require('./controllers/quotesController'));

var port = process.env.PORT || 3001;

http.createServer(app).listen(port, function (err) {
  console.log('listening in http://localhost:' + port);
});

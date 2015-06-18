var express = require('express');
var app = express();
var bodyParser = require("body-parser");

var session      = require('express-session');

var flash    = require('connect-flash');
//var passport = require('passport')
//  , LocalStrategy = require('passport-local').Strategy;

var cookieParser = require('cookie-parser');



app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.use(flash()); // use connect-flash for flash messages stored in session
//app.set('view engine', "ejs");
//app.use(cookieParser("skhsaufyewng67hg65fFHHG676hggj"));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());  


//chat with jade listening same port

//app.set('views', __dirname + '/tpl');
//app.set('view engine', "jade");
//app.engine('jade', require('jade').__express);
//app.get("/", function(req, res){
//    res.render("page");
//});
//
//


//create session object
var sessionMiddleware = session({
//  secret: 'skhsaufyewng67hg65fFHHG676hggj',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: true,
		domain: "secure-badlands-6804.herokuapp.com",
    maxAge: ( 24 * 60 * 60 * 1000 )
		
  },
	store: require('./mongoose_models.js').SessionStore(session)
});

//socket io chat
var io = require('socket.io').listen(app.listen(app.get('port')));

//share session between express and socket io
app.use(sessionMiddleware);
io.use(function(socket, next) {
    sessionMiddleware(socket.request, socket.request.res, next);
});

io.sockets.on('connection', function (socket) {
		console.log("ON SOCKET CONNECTION  " + socket.request.session.username);	
    socket.emit('message', { message: 'welcome to the chat' });
		//receive send messages from client and broadcast to all
    //socket.on('send', function (data) {
    //    io.sockets.emit('message', data);
    //});
});
//socket io chat end

//chat with jade end

//else no socket io listening
//app.listen(app.get('port'));
//no socket listening end


//passport.use(new LocalStrategy(
//  function(username, password, done) {
//
//		//return done(null, {username: username});
//		return done(null, false, {message: 'Incorrect'});
//
//
//  }
//));
//
//!!!Init app session before passport
//app.use(passport.initialize());
//app.use(passport.session()); // persistent login sessions


//require('./routes.js')(app, passport); 
require('./routes.js')(app); 















//http://mherman.org/blog/2015/02/12/postgresql-and-nodejs/#.VW2hz1T2NHw
//TODO Why do I need router?
//var router = express.Router();

//console.log("ROUTER " + router);









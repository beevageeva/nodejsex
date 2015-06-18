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
var sessionSecret = "secret77";
//app.use(cookieParser("secret77"));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());  


// jade / ejs rendering engine instead of using angular

//app.set('views', __dirname + '/tpl');
//app.set('view engine', "jade");
//app.set('view engine', "ejs"); //Use ejs instead of jade
//app.engine('jade', require('jade').__express);
//app.get("/", function(req, res){
//    res.render("page");
//});
//
//


var mongoStore = require('./mongoose_models.js').SessionStore(session);

//create session object
var sessionMiddleware = session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: true,
  cookie: {
		//TODO comment the following:(secure: true) to avoid creating a new session on every request(setting the secret as parameter to cookieParser does not work!)
    //secure: true,
		domain: "secure-badlands-6804.herokuapp.com",
    maxAge: ( 24 * 60 * 60 * 1000 )
		
  },
	store: mongoStore
});

//socket io chat
var io = require('socket.io').listen(app.listen(app.get('port')));

//share session between express and socket io
app.use(sessionMiddleware);
//TODO following not working
//io.use(require("express-socket.io-session")(sessionMiddleware));
//TODO uncomment to share session
io.use(function(socket, next) {
    //sessionMiddleware(socket.request, socket.request.res, next);
    //sessionMiddleware(socket.request, {}, next);
    //ONLY the following is working in order to share the session!	
    cookieParser(sessionSecret)(socket.request, {}, function(err) {
      var sessionId = socket.request.signedCookies['connect.sid'];

      mongoStore.get(sessionId, function(err, session) {
        socket.request.session = session;
				next();
			});
		});
        
});

io.sockets.on('connection', function (socket) {
		if(socket.request.session!=null){
			console.log("ON SOCKET CONNECTION  SESSION USERNAME" + socket.request.session.username);	
		}
    socket.emit('message', { message: 'welcome to the chat' });
		//receive send messages from client and broadcast to all
    socket.on('room', function (data) {
				socket.join(data.message);
        io.sockets.emit('newRoom', {'room': data.message, 'username': socket.request.session.username});
    });
});
//socket io chat end

exports.io = io;
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









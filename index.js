var express = require('express');
var pg = require('pg');
var app = express();
var bodyParser = require("body-parser");
var flash    = require('connect-flash');
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;




app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));




// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

require('./routes.js')(app, passport); 










//chat with jade listening same port

//app.set('views', __dirname + '/tpl');
//app.set('view engine', "jade");
//app.engine('jade', require('jade').__express);
//app.get("/", function(req, res){
//    res.render("page");
//});
//
//
////socket io chat
//var io = require('socket.io').listen(app.listen(app.get('port')));
//io.sockets.on('connection', function (socket) {
//    socket.emit('message', { message: 'welcome to the chat' });
//    socket.on('send', function (data) {
//        io.sockets.emit('message', data);
//    });
//});
////socket io chat end

//chat with jade end

//else no socket io listening
app.listen(app.get('port'));
//no socket listening end




connectionString = process.env.DATABASE_URL

console.log(connectionString);

//http://mherman.org/blog/2015/02/12/postgresql-and-nodejs/#.VW2hz1T2NHw
//TODO Why do I need router?
//var router = express.Router();

//console.log("ROUTER " + router);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());  








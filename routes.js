
//module.exports = function(app, passport) {
module.exports = function(app) {


//AJAX
//TODOS
var todos = require('./controllers/todos.js');
app.post('/api/todos', todos.create); 
app.get('/api/todos', todos.list);
app.put('/api/todos/:todo_id', todos.update);
app.delete('/api/todos/:todo_id', todos.delete);

//USERS
var users = require('./controllers/users.js');
app.post('/api/users', users.create); 
app.post('/api/login', users.login); 
app.post('/api/logout', users.logout); 



//BOARD
var board = require('./controllers/board.js');
app.get('/api/board', board.load);





//SINGLE PAGES

//TODOS
app.get('/todos', function(req, res){
	res.sendfile('./public/todos.html');	
//BOARD
});
app.get('/board', function(req, res){
	res.sendfile('./public/board.html');	
});
//REGISTER
app.get('/register', function(req, res){
	res.sendfile('./public/register.html');	
});

//REGISTER
app.get('/login', function(req, res){
	res.sendfile('./public/login.html');	
});


//CHAT
app.get('/chat', function(req, res){
	res.sendfile('./public/chat.html');	

});
};

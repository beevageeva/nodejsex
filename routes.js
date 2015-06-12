
module.exports = function(app, passport) {

//TODOS
var todos = require('./controllers/todos.js');
var board = require('./controllers/board.js');

app.post('/api/todos', todos.create); 
app.get('/api/todos', todos.list);
app.put('/api/todos/:todo_id', todos.update);
app.delete('/api/todos/:todo_id', todos.delete);

app.get('/api/board', board.load);

app.get('/todos', function(req, res){
	res.sendfile('./public/todos.html');	

});
app.get('/board', function(req, res){
	res.sendfile('./public/board.html');	

});


//CHAT
app.get('/chat', function(req, res){
	res.sendfile('./public/chat.html');	

});
};

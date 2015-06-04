
module.exports = function(app, passport) {
var todos = require('controllers/todos.js');

app.post('/api/todos', todos.create); 
app.get('/api/todos', todos.list);
app.put('/api/todos/:todo_id', todos.update);
app.delete('/api/todos/:todo_id', todos.delete);



};

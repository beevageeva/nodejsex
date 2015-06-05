var mongoose = require('mongoose');
var databaseConfig = require('./config/databaseMongo.js')
mongoose.connect(databaseConfig.url);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
		console.log("open database");
 });




//USERS
var userSchema = mongoose.Schema({
    name: String,
    username: String,
    password: String,
		created_at: Date,
  	updated_at: Date

})

// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// on every save, add the date
userSchema.pre('save', function(next) {
  // get the current date
  var currentDate = new Date();
  
  // change the updated_at field to current date
  this.updated_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.created_at){
    this.created_at = currentDate;
	}

  next();
});

exports.User = mongoose.model('user', userSchema);




//TODOS
var todoSchema = mongoose.Schema({
    text: String,
    complete: Boolean,
		created_at: Date, 
		updated_at: Date 
})

todoSchema.pre('save', function(next) {

  // get the current date
  var currentDate = new Date();
  
  // change the updated_at field to current date
  this.updated_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.created_at){
    this.created_at = currentDate;
	}

  next();
});

exports.Todo = mongoose.model('todo', todoSchema);


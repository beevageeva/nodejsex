var bcrypt = require("bcrypt-nodejs");

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
    name: {type: String, required: true},
    username: {type: String, minlength: 3 },
    password: {type: String, minlength: 6 },
		active: Boolean,
		admin: Boolean,
		created_at: Date,
  	updated_at: Date

})

// generating a hash
userSchema.methods.setPasswordHash = function(password) {
    this.password = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};
//create a model user in collection 'user' which will be exported
userModel = mongoose.model('user', userSchema);

//validate unique username 
userSchema.path('username').validate(function (value, respond) {
		console.log("In validation mongoose_models . User");
    userModel.findOne({ username: value }, function (err, user) {
        if(user) respond(false);                                                                                
    });
		console.log("In validation mongoose_models . User validation endss???");
		respond(true);
}, 'This username is already registered');






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

exports.User = userModel;




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




//SESSION STORE
exports.SessionStore = function (expressSession){
	var MongoStore = require('connect-mongo')(expressSession);
	return new MongoStore({mongooseConnection: db});
}



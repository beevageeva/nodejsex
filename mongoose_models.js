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


//GAME ROOM
var roomSchema = mongoose.Schema({
    name: String,
    finished: Boolean,
		usernames: [String],
		games: [{'cards': [[Number]], 'hands': [{'bet': Number, 'done': Number}], 'atu': Number, 'moves': [[Number]]}],
    created_at: Date,
    updated_at: Date
})

roomSchema.pre('save', function(next) {

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


function getNextGameNCards(nPlayers, numberGame){
	if(numberGame<nPlayers - 1){
		return 1;
	}
	else if(numberGame<nPlayers + 7){
		return numberGame - nPlayers + 1;
	}
	else if(numberGame<2*nPlayers + 7){
		return 8;
	}
	else if(numberGame<2 * nPlayers + 14){
		return numberGame - 2 * nPlayers - 7;
	}
	else if(numberGame<3 * nPlayers + 14){
		return 1;
	}
	else{
		return -1;
	}

}

function getCards(nPlayers, nCards){
	var start = 51 - nPlayers * 8;
	var end = 52;
	var cards = [];	
	for(var i = start; i<=end; i++){
		cards.push(i);
	}
	var newCards = shuffle(cards);
	console.log("new cards length " + newCards.length);
	var playerCards = [];
	for(var i = 0;i<nPlayers;i++){
		playerCards.push(newCards.slice(i*nCards, (i+1)*nCards));
	}
	atu = 0;
	if(nCards<8){
		atu = newCards[nPlayers * nCards];
	}	
	return {"cards": playerCards, "atu": atu};
}

roomSchema.methods.addGame = function(nCards){
	nPlayers = this.usernames.length;
	resCards = getCards(nPlayers, nCards);
	//add rest of hash variables to this one , it's the same as newRoom.games[0] afterwards
	resCards["moves"] = []; //array of length = nCards for each game each of length = nPlayers (matrix nCards x nPlayers)
	resCards["hands"] = []; //array of length = nPlayers for each game
	this.games.push(resCards);
}



//also checks for turn username variable from session map 
roomSchema.methods.addMove = function(card, username){
	//finished game completely = 0, finished game = 1(addNewGame), finished round = 2, unfinished = 3
	g = this.games[this.games.length - 1];
	nPlayers = this.usernames.length;
	addNewRound = g.moves.length == 0 || g.moves[g.moves.length-1].length == nPlayers;
	indexUsername = this.games.length % nPlayers + (addNewRound?0:g.moves[g.moves.length - 1].length)
	//TODO check username
	console.log("IS USER AUTH: "  + (this.usernames[indexUsername] == username));
	nCards = g.cards[0].length;
	res = 3;
	username = null;
	if (addNewRound){
		res = 2;
		//round finished
		//calculate who took it and add one to done to that username
		//check bp
		if(g.moves.length == nCards){
			g.moves.push([]);	
			username = this.usernames[0];
		}
		else{
			console.log("INVALID MOVE");
			return null;
		}
	}
	else{
		username = this.usernames[indexUsername + 1];
	}	
	g.moves[g.moves.length - 1].push(card);
	//test if this last move was the last in the game
	if(g.moves[g.moves.length-1].length == nPlayers && g.moves.length == nCards){
			//insert next game
			nextGameNCards = getNextGameNCards(nPlayers, this.games.length);
			if(nextGameNCards == -1){
				//game finished
				res = 0;
			}
			else{
				//round finished, new game
				res = 1;
				this.addGame(nextGameNCards);
			}
	}
	return [username, res, g.moves[g.moves.length - 1].length];
}




roomSchema.methods.addHandBet = function(bet, username){
	g = this.games[this.games.length - 1];
	nPlayers = this.usernames.length;
	//first check	
	if (g.hands.length < nPlayers){
		g.hands.push({"bet": bet, "done": 0});
	}
	else{
		console.log("INVALID MOVE ");
		return null;
	}
	indexUsername = this.games.length % nPlayers +  g.hands.length
	//TODO check username
	console.log("IS USER AUTH: "  + (this.usernames[indexUsername] == username));
	username = null;
	res = 1;
	if (g.hands.length == nPlayers){
		console.log("roomSchema.methods.addHandBet:  alreday at max ");
		username = this.usernames[0];
		res = 0;
	}
	else{
		username =  this.usernames[indexUsername + 1];
	}
	return [res, username, g.hands.length];
}





exports.Room = mongoose.model('room', roomSchema);


//GAME ROOM END




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
	return new MongoStore({mongooseConnection: db,  clear_interval: 3600 });
}



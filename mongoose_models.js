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


//ROOM
var roomSchema = mongoose.Schema({
    name: String,
    finished: Boolean,
		usernames: [String],
		games: [{'cards': Array, 	'hands': [{'bet': Number, 'done': Number}], 	'atu': Number, 'moves': [{'username': String, 'cardsPut':[Number] }], 'firstPlayer':[String] }],
    created_at: Date,
    updated_at: Date
});


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
	if(numberGame<nPlayers -1){
		return 1;
	}
	else if(numberGame<nPlayers + 7){
		return numberGame - nPlayers + 3;
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


function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}



function getCards(nPlayers, nCards){
	var start = 53 - nPlayers * 8;
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
//	console.log("GET CARDS in mongoose_model");
//	console.log(typeof(playerCards));	
//	console.log(playerCards);
//	console.log(JSON.stringify(playerCards));	
//	console.log("GET CARDS in mongoose_model END");
	return {"cards": playerCards, "atu": atu};
}

roomSchema.methods.addGame = function(nCards){
	nPlayers = this.usernames.length;
	resCards = getCards(nPlayers, nCards);
	//add rest of hash variables to this one , it's the same as newRoom.games[0] afterwards
	resCards["moves"] = []; //array of length = nPlayers indexed by field username for each cardsPut field is an array of length nCards
	for(var i = 0;i<nPlayers;i++){
		resCards["moves"].push({'username': this.usernames[i], "cardsPut":[] });
	}
	resCards["hands"] = []; //array of length = nPlayers for each game
	resCards["firstPlayer"] = [this.usernames[this.games.length  % nPlayers]]; //array of length = nCards, first player for each round
	this.games.push(resCards);
}



//also checks for turn username variable from session map 
roomSchema.methods.addMove = function(card, username){
	//finished game completely = 0, finished game = 1(addNewGame), 2 finish last round , unfinished = 3
	g = this.games[this.games.length - 1];
	nPlayers = this.usernames.length;
	nCards = g.cards[0].length;
	//TODO following not working	
	//g.moves.findOne({username: username}, function (err, m) {});
	m = null;
	for(var i = 0;i<g.moves.length && !m;i++){
		if(g.moves[i].username == username){
			m = g.moves[i];
		}
	}




	//g.moves.findOne({username: username}, function (err, m) {
		if(m.cardsPut.length<nCards){
			m.cardsPut.push(card);
			finished = false;
		}
		else{
			finished = true;
		}
		indexFirstPlayer = this.usernames.indexOf(g.firstPlayer[g.firstPlayer.length - 1]);
		console.log("INDEX FIRST PLAYER = " + indexFirstPlayer + " firstPlayer cards length = " + g.moves[indexFirstPlayer].cardsPut.length);
		indexNextPlayer = -1; //and will be -1 <=> allEqual = true
		position = indexFirstPlayer;

		//TODO test continous...AUTH
		for(var i = indexFirstPlayer +1; i<nPlayers && indexNextPlayer ==-1; i++){
			if(g.moves[i].cardsPut.length != g.moves[indexFirstPlayer].cardsPut.length){
				indexNextPlayer = i;
			}
			else{
				position = i;
			}
		}
		for(var i = 0; i<indexFirstPlayer && indexNextPlayer ==-1; i++){
			if(g.moves[i].cardsPut.length != g.moves[indexFirstPlayer].cardsPut.length){
				indexNextPlayer = i;
			}
			else{
				position = i;
			}
		}
		//AUTH
		console.log("MOVE CARD isUserAuth: " +  (this.usernames[position] == username) );
		//END
		if(indexNextPlayer == -1){
			//new round
			username = g.firstPlayer[g.firstPlayer.length - 1];
			firstUserCard = g.moves[indexFirstPlayer].cardsPut[g.moves[indexFirstPlayer].cardsPut.length - 1];
			biggestAtu = 0;
			for(var i = 0;i<nPlayers;i++){
				if(i!=indexFirstPlayer){
					thisUserCard = g.moves[i].cardsPut[g.moves[i].cardsPut.length - 1];
					if( (thisUserCard - firstUserCard)%4==0  && thisUserCard>firstUserCard ){
						username = this.usernames[i];
					}
					else if( (thisUserCard - g.atu)%4==0  && thisUserCard>biggestAtu ){
						username = this.usernames[i];
						biggestAtu = thisUserCard;
					}
					
				}
			}
			g.hands[this.usernames.indexOf(username)].done++;
			//set firstPlayer
			g.firstPlayer.push(username);
			res = 2;
			//the same using 0 as firstPlayerIndex as they are all equal
			if(g.moves[0].cardsPut.length == nCards){
			//new game
				nextGameNCards = getNextGameNCards(nPlayers, this.games.length);
				console.log("****nextGameNCards = " + nextGameNCards);
				if(nextGameNCards == -1){
					//game finished
					res = 0;
				}
				else{
					//round finished, new game
					//calculate scores

					res = 1;
					this.addGame(nextGameNCards);
				}
			}
		}
		else{
			res = 3;
			username = this.usernames[indexNextPlayer];
		}
		//g.markModified("moves");
		this.markModified("games");
		return [username, res, (position - indexFirstPlayer)%nPlayers];
		
	//}); //findOne



	
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
	indexUsername = (this.games.length -1 + g.hands.length -1) % nPlayers 
	console.log("INDEX username " + indexUsername);
	//TODO check username
	console.log("IS USER AUTH: "  + (this.usernames[indexUsername] == username));
	username = null;
	if (g.hands.length == nPlayers){
		console.log("roomSchema.methods.addHandBet:  alreday at max ");
		res = 0;
	}
	else{
		res = 1;
	}
	if (indexUsername == nPlayers - 1){
		username = this.usernames[0];
	}
	else{
		username =  this.usernames[indexUsername + 1];
	}
	console.log("addHANDBET username " + username);
	return [res, username, g.hands.length - 1];
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



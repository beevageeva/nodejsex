module.exports = function(io){

//START IO MOVE IN A SEPARTE FILE
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



startedRooms = {};

io.sockets.on('connection', function (socket) {
		if(socket.request.session!=null){
			console.log("ON SOCKET CONNECTION  SESSION USERNAME" + socket.request.session.username);	
		}
    socket.emit('message', { message: 'welcome to the chat' });
		//receive send messages from client and broadcast to all
    socket.on('room', function (data) {
				//if(!data.message in startedRooms){
					socket.join(data.message);
        	io.sockets.emit('newRoom', {'room': data.message, 'username': socket.request.session.username});
				//}
    });

    socket.on('startRoom', function (data) {
				conSockets = Object.keys(io.nsps["/"].adapter.rooms[data.message]);
				nPlayers = conSockets.length;
				//if(nPlayers>=3 && nPlayers<=6 && !(data.message in startedRooms)){
				if(nPlayers>=3 && nPlayers<=6){
					startedRooms[data.message] = [0,1];
					firstUser = io.sockets.connected[conSockets[0]].request.session.username;
					console.log("NUMBER PLAYERS IN THE ROOM start message on server : "  + nPlayers);
        	io.to(data.message).emit('startRoom', {'room': data.message, 'nPlayers': nPlayers});
					resCards = getCards(nPlayers, 1);
					console.log("SERVER PLAYER CARDS " + resCards);
					for(var i = 0; i<nPlayers; i++){
						io.to(conSockets[i]).emit("cards", {"cards": resCards["cards"][i], "atu": resCards["atu"]});
						//put room in session for every user
						io.sockets.connected[conSockets[i]].request.session.room = data.message;
					}

        	io.to(data.message).emit('moveUser', {'username': firstUser});

				}
    });
		
    socket.on('sendCard', function (data) {
			console.log("SERVER SEND CARD " + data.card);
			//send card to all users in the room kept as a variable in session map	
			io.to(socket.request.session.room).emit("cardMoved", {"card": data.card, "position": 0});	
    });


});

}

module.exports = function(io){

var Room = require('../mongoose_models').Room;
//remove all rooms at the beginning
Room.remove({}, function (err) {
  if (err){
	 return console.log("Error removing rooms: " + err);
	}
	else{
  	// removed!
	  console.log("removed all rooms!");
  }
});






io.sockets.on('connection', function (socket) {
		if(socket.request.session!=null){
			console.log("ON SOCKET CONNECTION  SESSION USERNAME" + socket.request.session.username);	
      io.sockets.emit('newUsername', {'username': socket.request.session.username, 'room': socket.id });
		}
    socket.emit('message', { message: 'welcome to the chat' });
		//receive send messages from client and broadcast to all
    socket.on('room', function (data) {
				socket.join(data.message);
        io.sockets.emit('newRoom', {'room': data.message, 'username': socket.request.session.username});
    });

    socket.on('startRoom', function (data) {
				conSockets = Object.keys(io.nsps["/"].adapter.rooms[data.message]);
				nPlayers = conSockets.length;
				roomUsernames = [];
				for(var i = 0; i<conSockets.length; i++){
					roomUsernames.push(io.sockets.connected[conSockets[i]].request.session.username);
				}
				if(nPlayers>=3 && nPlayers<=6){
					//delete already saved rooms with this name
					Room.remove({"name": data.message});
					var newRoom = new Room({"name": data.message, "usernames": roomUsernames , "finished": false, "games": []});
					newRoom.scores = [];
					for(var i = 0; i< nPlayers; i++){
						newRoom.scores.push(0);
					}
					//nCards = 1 for the first game
					newRoom.addGame(1);
					
				  newRoom.save(function (err) {
				    if (!err) {
				      console.log("created");
				    } else {
				      console.log(err);
				    }
				  });

					console.log("NUMBER PLAYERS IN THE ROOM start message on server : "  + nPlayers);
        	io.to(data.message).emit('startRoom', {'room': data.message, 'nPlayers': nPlayers});
					for(var i = 0; i<nPlayers; i++){
						console.log("send Cards to player " + i);
						console.log(newRoom.games[0].cards[i]);		
						console.log("send Cards to player END ");
				
						console.log();
						io.to(conSockets[i]).emit("cards", {"cards":  newRoom.games[0].cards[i], "atu":  newRoom.games[0].atu, "username" : roomUsernames[0] });
						//put room in session for every user
						io.sockets.connected[conSockets[i]].request.session.room = data.message;
					}


				}
    });

		socket.on('getCards', function (data) {
			 Room.findOne({ name: socket.request.session.room }, function (err, room) {
				scores = [];
				for(var i = 0;i<room.usernames.length; i++){
					scores.push({'username': room.usernames[i], 'score': this.scores[i] });
				}
				for(var i = 0;i<room.usernames.length; i++){
					if(socket.request.session.username == room.usernames[i]){
						g = room.games[room.games.length - 1];
						//TODO send scores
						socket.emit("cards", {"cards":  g.cards[i], "atu":  g.atu, "username": g.firstPlayer[g.firstPlayer.length - 1], "scores": scores });
						break;	
					}
				}
				//send getCards to the other
				io.to(room.name).emit("getCardsRec", {"fromUsername": socket.request.session.username});
			 });	
		});

		
    socket.on('sendBet', function (data) {
			console.log("SERVER SEND BET " + data.bet);
			Room.findOne({ name: socket.request.session.room }, function (err, room) {
				if(!err){
					resBet = room.addHandBet(data.bet,  socket.request.session.username);
					if(resBet!=null){
						room.save(function(err){
							if(!err){
								
								//send card to all users in the room kept as a variable in session map	
								io.to(socket.request.session.room).emit("betMade", {"bet": data.bet, "fromUsername": socket.request.session.username, "username": resBet[1], "res": resBet[0], "position": resBet[2]});
							}
							else{
								console.log(err);
							}
						});
					}		
					else{
						console.log("resBet == null");
					}		
				}
				else{
					console.log(err);
				}
		   });
    });

    socket.on('sendCard', function (data) {
			console.log("SERVER SEND CARD " + data.card);
			Room.findOne({ name: socket.request.session.room }, function (err, room) {
        if(!err && room){
					resMove = room.addMove(data.card,  socket.request.session.username);
					
					if(resMove!=null){						
						room.save(function(err){
							if(!err){
							//send card to all users in the room kept as a variable in session map	
								io.to(socket.request.session.room).emit("cardMoved", {"card": data.card, "position": resMove[2], "fromUsename": socket.request.session.username, "username": resMove[0], "res": resMove[1]});
							}	
							else{
									console.log(err);
							}
			   		});
					}
					else{
						console.log("resMove == null");
					}		
					



				}
    	});
		});


	});

}


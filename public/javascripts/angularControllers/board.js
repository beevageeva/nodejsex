





//controller functions
var boardApp = angular.module('boardApp', [])
    .config(['$controllerProvider',
      function($controllerProvider) {
        $controllerProvider.allowGlobals();
      }])
		.config(['$compileProvider',
     function($compileProvider) {
        $compileProvider.debugInfoEnabled(true);
      }
    ]);

function mainController($scope, $http) {







    $scope.formData = {};

    // when landing on the page, get all todos and show them
    $http.get('/api/board')
        .success(function(data) {
            $scope.players = data.users;
            $scope.clients = data.clients;
            $scope.username = data.username;
	
            console.log("CLIENTS after get api/board" + data.clients);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    //$scope.createGrid(30,20);
		$scope.moved = 0;
		$scope.startedRoom = null;
		$scope.nPlayers = 0;
		$scope.nCards = 0;
		$scope.tableCards = [];
		$scope.myCards = [];	
		$scope.selected = 0;	
		$scope.atu = 0;	


		var socket = io.connect('https://secure-badlands-6804.herokuapp.com');
		socket.on('message', function (data) {
			console.log("client message data " +  data);
			$scope.$apply();
		});
		socket.on('newUsername', function (data) {
			$scope.clients[data.username] = [data.room];
				$scope.$apply();
			
		});
		socket.on('newRoom', function (data) {
			console.log("new room " +  data.room + " from username " + data.username);
			$scope.clients[data.username].push(data.room);
			$scope.$apply();
		});
		socket.on('startRoom', function (data) {
			console.log("start room " +  data.room );
			if($scope.startedRoom == null){
				$scope.startedRoom = data.room;
				$scope.moved = 1;
				$scope.nPlayers = data.nPlayers;
				$scope.isGetCardsDisabled = true;
				//initialize tableCards
				for(var i = 0;i<data.nPlayers; i++){
					$scope.tableCards.push(0);
				}
				$scope.moveUser = data.username;
				$scope.$apply();
			}
		});

		//receive cards
		socket.on('cards', function (data) {
			$scope.$apply(function () {
				console.log("get cards  " +  data.cards );
				$scope.nCards = data.cards.length;
				//init myCards
				for(var i = 0; i< data.cards.length; i++){
					$scope.myCards.push(data.cards[i]);
				}
				console.log("mycards 0 = " + $scope.myCards[0]);
				//new game bets!
				$scope.gameBets = [];
				for(var i = 0; i< $scope.nPlayers; i++){
					$scope.gameBets.push(0);
				}
				$scope.atu = data.atu;
				$scope.selected = $scope.myCards[0];
				console.log("selected = " + $scope.selected);

			});

		});

		socket.on('cardMoved', function (data) {
			console.log("move card " +  data.card + " on position " + data.position  + ", moveUser " + data.username  + ", res = " + data.res);
			$scope.tableCards[data.position] = data.card;
			$scope.moveUser = data.username;
			if(data.res == 1){
				$scope.isGetCardsDisabled = false;
			}
			$scope.$apply();
		});
		socket.on('betMade', function (data) {
			console.log("bet made " +  data.bet + " on position " + data.position + ", moveUser " + data.username);
			$scope.gameBets[data.position] = data.bet;
			$scope.moveUser = data.username;
			$scope.$apply();
		});

    // when submitting the add form, send the text to the node API

		$scope.isSendCardDisabled = function(){
			//	console.log("move user: " + $scope.moveUser + ", username: " + $scope.username + " test ineq: " + ($scope.moveUser!=$scope.username));
				return $scope.moveUser!=$scope.username || $scope.moved!=2;
			
		}

		$scope.isBetDisabled = function(){
				return $scope.moveUser!=$scope.username || $scope.moved!=1;
			
		}


		

		$scope.clickMyCard = function(i){
			console.log("SCOPE FUNCION Click My card= " + i );
			//$scope.moved = "i=" + i + ",j=" + j;
			console.log("my cards length " + $scope.myCards.length);
			if($scope.myCards[i]!=0 && $scope.selected != $scope.myCards[i]){
				$scope.selected = $scope.myCards[i];
				$scope.$apply();
			}
		}

		$scope.createRoom = function(){
			socket.emit('room', { message: $scope.formData.room });			
		}
		$scope.joinRoom = function(room){
			socket.emit('room', { message: room });			
		}

		$scope.getCards = function(){
			//reinit vars	
			$scope.myCards.length = 0;	
			//$scope.myCards = [];	
			$scope.isSendCardDisabled = true;	
			$scope.moved = 1;
			for(var i = 0;i<$scope.tableCards.length; i++){
				$scope.tableCards[i] = 0;
			}
			//send server request
			socket.emit('getCards');
			
		}


		$scope.startRoom = function(room){
			socket.emit('startRoom', { message: room });			
		}

		$scope.sendCard = function(){
			console.log("SCOPE FUNCION send card= " + $scope.selected );
			if($scope.moved!=2){
				return;
			}	
			$scope.moved = 3;
			for(var i = 0; i<$scope.nCards; i++){
				if($scope.myCards[i]== $scope.selected){
					$scope.myCards[i] = 0;
					break;	
				}
			}
			socket.emit("sendCard", {"card": $scope.selected});
			$scope.selected = 0;
			//TODO no apply		
			//$scope.$apply();

		}

		$scope.sendBet = function(){
			console.log("SCOPE FUNCION send bet from form= " + $scope.formData.bet );
			if($scope.moved == 2){
				return;
			}	
			$scope.moved = 2;
			//$scope.$apply();
			socket.emit("sendBet", {"bet": $scope.formData.bet});
				
		}


}



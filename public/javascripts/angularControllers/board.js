





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
		$scope.moved = "NONE";
		$scope.startedRoom = null;
		$scope.nPlayers = 0;
		$scope.tableCards = [0,0,0,0,0,0];
		$scope.myCards = [0,0,0,0,0,0,0,0];	
		$scope.selected = 0;	
		$scope.atu = 0;	


		var socket = io.connect('https://secure-badlands-6804.herokuapp.com');
		socket.on('message', function (data) {
			console.log("client message data " +  data);
			$scope.moved = data.message;
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
				$scope.nPlayers = data.nPlayers;
				//$scope.createTableCards(data.nPlayers);
				$scope.$apply();
			}
		});

		//receive cards
		socket.on('cards', function (data) {
			console.log("get cards  " +  data.cards );
			for(var i = 0; i< data.cards.length; i++){
				$scope.myCards[i] = data.cards[i];
			}
			$scope.atu = data.atu;
			$scope.selected = $scope.myCards[0];
			$scope.$apply();
		});

		socket.on('moveUser', function (data) {
			console.log("move user " +  data.username );
			$scope.moveUser = data.username;
			$scope.$apply();
		});

    // when submitting the add form, send the text to the node API


		$scope.clickMyCard = function(i){
			console.log("SCOPE FUNCION Click My card= " + i );
			//$scope.moved = "i=" + i + ",j=" + j;
			$scope.selected = $scope.tableCards[i]
			$scope.$apply();
		}

		$scope.createRoom = function(){
			socket.emit('room', { message: $scope.formData.room });			
		}


		$scope.startRoom = function(room){
			socket.emit('startRoom', { message: room });			
		}

		$scope.sendCard = function(){
			console.log("SCOPE FUNCION send card= " + $scope.selected );
			socket.emit("sendCard", {"card": $scope.selected});	
		}


}



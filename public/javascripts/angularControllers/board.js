
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


//other js function moved here
$scope.createGrid = function(m,n) {
    var size=50;

    var parent = $('<div />', {
        class: 'grid',
        width: m  * size,
        height: n  * size
    }).addClass('grid').appendTo('body');

    for (var i = 0; i < m; i++) {
        for(var j = 0; j < n; j++){
            $('<div />', {
                width: size - 1,
                height: size - 1
            	}).attr({
    						'coord-row': i,
    						'coord-col': j,
    						//'ng-click': clickCell($(this).attr('coord-row'), $(this).attr('coord-col'))
							})
							.click(function(){
								//console.log('i=' + $(this).attr('coord-row') + ",j=" + $(this).attr('coord-col'));
            		$scope.clickCell($(this).attr('coord-row'), $(this).attr('coord-col'));


        	  	})
						.appendTo(parent);
        }
    }
}

	





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

    $scope.createGrid(30,20);
		$scope.moved = "NONE";
		$scope.startedRoom = null;

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
				$scope.$apply();
			}
		});

    // when submitting the add form, send the text to the node API


		$scope.clickCell = function(i,j){
			console.log("SCOPE FUNCION Row = " + i + "  COL = " + j);
			$scope.moved = "i=" + i + ",j=" + j;
			//TODO why?
			$scope.$apply();
		}

		$scope.createRoom = function(){
			socket.emit('room', { message: $scope.formData.room });			
		}


		$scope.startRoom = function(room){
			socket.emit('startRoom', { message: room });			
		}


}



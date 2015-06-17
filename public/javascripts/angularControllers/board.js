//other javascript functions
function createGrid(m,n) {
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
    						'ng-click': clickCell($(this).attr('coord-row'), $(this).attr('coord-col'))
							})
							//.click(function(){
							//	console.log('i=' + $(this).attr('coord-row') + ",j=" + $(this).attr('coord-col'));
        	  	//})
						.appendTo(parent);
        }
    }
}

//controller functions
var boardApp = angular.module('boardApp', [])
    .config(['$controllerProvider',
      function($controllerProvider) {
        $controllerProvider.allowGlobals();
      }]);

function mainController($scope, $http) {
    $scope.formData = {};

    // when landing on the page, get all todos and show them
    $http.get('/api/board')
        .success(function(data) {
            $scope.players = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    createGrid(30,20);

    // when submitting the add form, send the text to the node API


		$scope.clickCell = function(i,j){
			console.log("SCOPE FUNCION Row = " + i + "  COL = " + j);

		}


}



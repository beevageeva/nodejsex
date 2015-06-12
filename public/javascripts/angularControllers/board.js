//other javascript functions
function createGrid(size) {
    var ratioW = Math.floor($(window).width()/size),
        ratioH = Math.floor($(window).height()/size);

    var parent = $('<div />', {
        class: 'grid',
        width: ratioW  * size,
        height: ratioH  * size
    }).addClass('grid').appendTo('body');

    for (var i = 0; i < ratioH; i++) {
        for(var p = 0; p < ratioW; p++){
            $('<div />', {
                width: size - 1,
                height: size - 1
            }).appendTo(parent);
        }
    }
}

//controller functions
var boardApp = angular.module('boardApp', []);

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

			//angular.element(document).ready(function () {
        createGrid(50);
    	//});

    // when submitting the add form, send the text to the node API
    $scope.createTodo = function() {
        $http.post('/api/todos', $scope.formData)
            .success(function(data) {
                $scope.formData = {}; // clear the form so our user is ready to enter another
                $scope.todos = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // delete a todo after checking it
    $scope.deleteTodo = function(id) {
        $http.delete('/api/todos/' + id)
            .success(function(data) {
                $scope.todos = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

}



var scotchTodo = angular.module('scotchTodo', []);
var todo = require('../../mongoose_models.js').Todo;

function mainController($scope, $http) {
    $scope.formData = {};

    // when landing on the page, get all todos and show them



		todo.find(function (err, objs) {
	    if (!err) {
				$scope.todos = objs;
	    } else {
	      console.log(err);
	    }
	  });



    // when submitting the add form, send the text to the node API
    $scope.createTodo = function() {

	  console.log("POST: ");
	  console.log(req.body);
	  var obj = new todo({
	    text: $scope.formData.text,
			complete: false
	  });
	  obj.save(function (err) {
	    if (!err) {
	      console.log("created");
				$scope.todos.push(obj);
	    } else {
	      console.log(err);
	    }
	  });
	


    };

    // delete a todo after checking it
    $scope.deleteTodo = function(id) {

	  todo.findById(req.params.id, function (err, obj) {
    	obj.remove(function (err) {
      if (!err) {
        console.log("removed");
				$scope.todos.remove(obj);	
      } else {
        console.log(err);
      }
    });
  });
		


    };

}

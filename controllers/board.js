
var User = require('../mongoose_models').User;

exports.create = function(req, res) {

//		console.log("--------------------post-------------------");
//		console.log(req.headers);
//		console.log("--------------------post-params------------------");
//		console.log(req.params);
//		console.log("--------------------post-prop------------------");
//		console.log(Object.keys(req));
//		console.log("--------------------post-body------------------");
//		console.log(req.body);
//		console.log("--------------------post-query------------------");
//		console.log(req.query);
//		console.log("--------------------post-url------------------");
//		console.log(req.url);
//console.log("--------------------post-end------------------");



  console.log("POST: ");
  console.log(req.body);
  var obj = new todo({
    text: req.body.text,
		complete: false
  });
  obj.save(function (err) {
    if (!err) {
      console.log("created");
    } else {
      console.log(err);
    }
  });
	 res.redirect('/api/todos');


};


exports.show = function(req, res){

  todo.findById(req.params.id, function (err, product) {
    if (!err) {
      return res.send(product);
    } else {
      return console.log(err);
    }
  });

};



exports.load = function(req, res) {
	var io = require("../index.js").io;
	//replace io.sockets by io.of("/namespace")	 if using a namespace
	clients = [];
	for (var id in io.sockets.connected) {
		//for (k in io.sockets.connected[id]){
		//	console.log("Prop " + k);
		//}
		console.log("id = "+ id + ", value = " + io.sockets.connected[id].request.session.username);
		clients.push({io.sockets.connected[id].request.session.username: io.sockets.connected[id].rooms});
		
	}
	console.log("*******************IO in controller board.js" + io);
	User.find(function (err, objs) {
    if (!err) {
			
			return res.json({'users':objs, 'clients': clients, 'username': req.session.username});	

    } else {
      console.log(err);
    }
  });




};


exports.update = function(req, res) {
  return todo.findById(req.params.id, function (err, obj) {
    obj.text = req.body.text;
    return obj.save(function (err) {
      if (!err) {
        console.log("updated");
				//TODO return 
      } else {
        console.log(err);
      }
    });
  });

};



exports.delete = function(req, res) {
//		console.log("--------------------post-------------------");
//		console.log(req.headers);
//		console.log("--------------------post-params------------------");
//		console.log(req.params);
//		console.log("--------------------post-prop------------------");
//		console.log(Object.keys(req));
//		console.log("--------------------post-body------------------");
//		console.log(req.body);
//		console.log("--------------------post-query------------------");
//		console.log(req.query);
//		console.log("--------------------post-url------------------");
//		console.log(req.url);
//console.log("--------------------post-end------------------");
	  todo.findById(req.params.todo_id, function (err, obj) {
    	obj.remove(function (err) {
      if (!err) {
        console.log("removed");


				todo.find(function (err, objs) {
			    if (!err) {
						
						return res.json(objs);	
			
			    } else {
			      console.log(err);
			    }
			  });

      } else {
        console.log(err);
      }
    });
  });


};



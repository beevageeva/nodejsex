
var User = require('../mongoose_models').User;


function verifyCaptcha(response){
	//console.log("VERIFYCAPTCHA FUNCTION " + response);	

}


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

	var responseCaptcha = "";


	var querystring = require('querystring');
	var http = require('https');

	var postData = querystring.stringify({
  'secret' : process.env.RECAPTCHA_PRIVATE_KEY,
	'response' : req.body.captchaResp
	});

	var options = {
	  hostname: 'www.google.com',
	  port: 443,
	  path: '/recaptcha/api/siteverify',
	  method: 'POST',
	  headers: {
	    'Content-Type': 'application/x-www-form-urlencoded',
	    'Content-Length': postData.length
	  }
	};
	
	callback = function(response) {
		console.log('STATUS: ' + response.statusCode);
	  console.log('HEADERS: ' + JSON.stringify(response.headers));
	  response.setEncoding('utf8');
	  response.on('data', function (chunk) {
	    responseCaptcha += chunk;
	  });
	
	  response.on('end', function () {
	    console.log("END RESPONSE CALLBACK" + responseCaptcha);
			if(JSON.parse(responseCaptcha).success){
				console.log("captcha correct, try to create user:");
			  var obj = new User({
			    username: req.body.username,
			    name: req.body.name,
					active: true,
					admin: false
			  });
			  obj.setPasswordHash(req.body.password);
				console.log("BEFORE SAVE");
			  obj.save(function (err) {
			    if (!err) {
			      console.log("User created");
						req.session.username = obj.username;
						res.send(true);	
			    } else {
			      console.log("user save failed: " + err);
						res.send(false);
			    }
			  });
				console.log("AFTER SAVE");
			}
			else{
				console.log("captcha incorrect, user not created ");
				res.send(false);	
			}
		
			console.log(" before return user.create result THIS PRINTED BEFORE User created?" );
	  });
	}

	var reqGoogle = http.request(options, callback);

	reqGoogle.on('error', function(e) {
  	console.log('VCPACHA FUNC ERR problem with request: ' + e);
	});


 	reqGoogle.write(postData);
	reqGoogle.end();




};

exports.login = function(req, res){

  User.findOne({username: req.body.username}, function (err, user) {
    if (user && !err) {
			if(user.validPassword(req.body.password)){
				req.session.username = user.username;	
      	res.send(true);
			}
			else{
      	res.send(false);
				console.log("user/pass inv");
			}	
    } else {
      	res.send(false);
       	console.log("No user or " + err);
    }
  });

};

exports.logout = function(req, res){
	req.session.username = null;
	res.redirect("/login");

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



exports.list = function(req, res) {

	todo.find(function (err, objs) {
    if (!err) {
			
			return res.json(objs);	

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



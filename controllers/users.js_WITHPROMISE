
var User = require('../mongoose_models').User;
global.Fiber = require('fibers');



function verifyCaptcha(response){
	//console.log("VERIFYCAPTCHA FUNCTION " + response);	


	var querystring = require('querystring');
	var http = require('https');

	var postData = querystring.stringify({
  'secret' : process.env.RECAPTCHA_PRIVATE_KEY,
	'response' : response
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

	var responseCaptcha = "";

	var promise = require('fibers-promise');
	promise.start(function() {

	  var p = promise();
	
	  var req = http.request(options, p);
		var response = p.get();
		
		console.log('STATUS: ' + response.statusCode);
	  console.log('HEADERS: ' + JSON.stringify(response.headers));
	  response.setEncoding('utf8');
	  response.on('data', p); 
	  response.on('end', p)
		var chunk;
		while (chunk = p.get()) {
	    	responseCaptcha += chunk;
	  }
	
		req.on('error', function(e) {
	  	console.log('VCPACHA FUNC ERR problem with request: ' + e);
		});
	
	 	req.write(postData);
		req.end();
		console.log("*****************VERIFYCAPTCHA FUNCTION END " + responseCaptcha );
	});	
	console.log("*****************VERIFYCAPTCHA FUNCTION END OUTSIDE PROMISE " + responseCaptcha );
	return responseCaptcha;	

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
	result = false;

	cResp = verifyCaptcha(req.body.captchaResp);
	console.log("**************IN USERCREATE CAPTCHA RESPONSE " +  cResp);	
	//put this in the fiber!!!
	//console.log("JSON PARSED " + JSON.parse(cResp));

	if(JSON.parse(cResp).success){
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
				result = true;	
	    } else {
	      console.log("user save failed: " + err);
				//by default false
				//result =  false;	
	    }
	  });
		console.log("AFTER SAVE");
	}
	else{
		console.log("captcha incorrect, user not created ");
		//result = false;	
	}

	console.log(" before return user.create result " + result);
	return result;

};

exports.login = function(req, res){

  User.findOne({username: req.body.username}, function (err, user) {
    if (!err) {
			if(user.validPassword(req.body.password)){
				req.session.username = user.username;	
      	res.redirect("/board");
			}
			else{
				console.log("user/pass inv");
			}	
    } else {
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




var User = require('../mongoose_models').User;
var Fiber = require('fibers');



function verifyCaptcha(response){
	console.log("VERIFYCAPTCHA FUNCTION " + response);	
	var responseCaptcha = "";


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
	
	callback = function(response) {
		console.log('STATUS: ' + response.statusCode);
	  console.log('HEADERS: ' + JSON.stringify(response.headers));
	  response.setEncoding('utf8');
	  response.on('data', function (chunk) {
	    responseCaptcha += chunk;
	  });
	
	  response.on('end', function () {
	    console.log("END RESPONSE CALLBACK" + responseCaptcha);
			//return str;
			Fiber.current.run();
	  });
	}


	var req = http.request(options, callback);
	//var req = wait.for(http.request,options);

	req.on('error', function(e) {
  	console.log('VCPACHA FUNC ERR problem with request: ' + e);
	});


 	req.write(postData);
	req.end();
	Fiber.yield();
	return responseCaptcha;	
	console.log("*****************VERIFYCAPTCHA FUNCTION END " + responseCaptcha );	

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
	Fiber(function() {
		cResp = verifyCaptcha(req.body.captchaResp);
		console.log("IN USERCREATE " +  cResp);	
	}).run();
	//cResp = wait.launchFiber(verifyCaptcha,req.body.captchaResp);

	console.log("CAPTCHA RESP " + cResp);




  var obj = new User({
    username: req.body.username,
    password: req.body.password,
    name: req.body.name,
		active: true,
		admin: false
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



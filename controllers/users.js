
var User = require('../mongoose_models').User;


function verifyCaptcha(response){
	var querystring = require('querystring');

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
	
	var req = http.request(options, function(res) {
	  console.log('STATUS: ' + res.statusCode);
	  console.log('HEADERS: ' + JSON.stringify(res.headers));
	  res.setEncoding('utf8');
	  res.on('data', function (chunk) {
	    console.log('BODY: ' + chunk);
			return chunk;
	  });
	});
	
	req.on('error', function(e) {
	  console.log('problem with request: ' + e.message);
		//return same type of response as google recaptcha
		return {'success': false, 'error-codes' : [e.message]};
	});

// write data to request body
 req.write(postData);
 req.end();




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

	cResp = verifyCaptcha(req.body.captchaResp);

	console.log("CAPTCHA RESP " + cResp.success);




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



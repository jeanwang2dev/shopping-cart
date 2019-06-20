var customerModel = require('../../models').Customer;

var js = '<script src="/public/js/Ajax.js"></script>';
js += '<script src="/public/js/user.js"></script>';

module.exports = {
	/*User Login Page first Load*/
	index: function(req, res){
		var url = require('url');
		var url_parts = url.parse(req.url, true);
		var query = url_parts.query;

		/*If the person is already logged in and got to this page then
    the page is redirected back to the admin home page*/
        if(req.session.success){
        	res.redirect('/user/checkout');
        }
        /*If there is an error parameter passed with the value of 1
        then display an error message and show the Login Page*/
        else if (query.error == 1){
        	error = "You do not have access to the buyer area";
        	res.render('user/login',{error: error, title: 'Login', heading: 'Login', user: true, js: js});
        }
        else{
        	/*Just the default login page, no errors. This will be called when 
          they first access the login page. The error is set to an empty string to clear out and past error message*/
            error = '';
            res.render('user/login', {error: error, title: 'Login', heading:'Login', user:true, js: js});
	    }
    },

    access: function(req, res){

        var data = JSON.parse(req.body.data);

         customerModel.findOne({email: data.email}, function(err, customer){
              if(customer === null){
                  //res.render('user/login',{error: 'No record found with that username and password',title: 'Login', heading:'Login', user:true, js: js});
                  res.send('error^^^No record found with that email and password');
              }
              else {
                var bcrypt = require('bcrypt');
                bcrypt.compare(data.pw, customer.password, function(err, response) {
                    if(response){
                      req.session.regenerate(function(err){
                        if(err){
                             console.log(err);
                        }
                        else{
                            req.session.success = 'access approved';
                            res.send('success');
                        }
 
                      });

                    } 
                    else {
                      //res.render('user/login', {error: 'Incorrect Password', title: 'Login', heading:'Login', user:true, js:js});
                      res.send('error^^^No record found with that email and password.');
                    }
                });

              }
          });

    },

    /* this is the logout page where the session is destroyed */
    logout: function(req, res){
        
    	req.session.destroy(function(err){
    		if(err){
    			console.log(err);
    		}
    		else{
    			res.redirect('/user/');
    		}
    	});
    }



}
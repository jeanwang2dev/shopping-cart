var adminModel = require('../../models').Admin;

var js = '<script src="/public/js/Ajax.js"></script>';
js += '<script src="/public/js/admin.js"></script>';

module.exports = {

	/*Admin Login page first load*/
	index: function(req, res){
		var url = require('url');
		var url_parts = url.parse(req.url, true);
		var query = url_parts.query;

        /* If the person is already logged in and they got to this page
        they are redirected backt to admin home page*/
        if(req.session.adminsuccess){
        	res.redirect('../../admin/');
        }
        /* If there is an error parameter passed with the value of 1 
        then display an error messgae and show the login page.*/
        else if (query.error == 1){
        	error = "You do not have access to the admin area";
        	res.render('user/ad-login',{error: error, title: 'Login Page', heading: 'Login Page', admin_head:true, js:js});
        }
        else{
            /*Just the default login page no errors. this will be called when
             they first access the login page. the error is set to an empty string to clear out any past error message*/
            error = '';
            res.render('user/ad-login', {error: error, title: 'Admin Login', heading:'Admin Login', admin_head:true, js: js});
	    }
    },

    access: function(req, res){

        var formdata = JSON.parse(req.body.data);
        
        adminModel.findOne({username: formdata.un}, function(err, data){
              if(data === null){
                  res.send('error^^^No record found with that username!');
              }
              else {
                 
                var bcrypt = require('bcrypt');
                bcrypt.compare(formdata.pw, data.password, function(err, response) {
                    if(response){
                      req.session.regenerate(function(err){
                        if(err){
                             console.log(err);
                             res.send('error');
                        }
                       
                        else{
                             req.session.adminsuccess = 'access approved';
                             res.send('success');
                        }
 
                      });

                    } 
                    else {
                      res.send('error^^^No record found with that username and password.');
                    }
                });  
                
                // if( formdata.pw == "mypassword"){
                //     req.session.adminsuccess = 'access approved';
                //     res.send('success');
                // } else {
                //       res.send('error^^^No record found with that username and password.');
                // }

              }//end else
          }); 

    },

    /*This is the logout page where the session is destroyed*/
    logout: function(req, res){
    	req.session.destroy(function(err){
    		if(err){
    			console.log(err);
    		}
    		else{
    			res.redirect('/user/ad-login');
    		}
    	});
    }



}
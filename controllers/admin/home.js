var adminModel = require('../../models').Admin;

var js = '<script src="/public/js/Ajax.js"></script>';
js += '<script src="/public/js/admin.js"></script>';

module.exports = {

	index: function(req, res){
	/*Checks to see if the success property exsits in the session object.
	If so move on, if not don't */
	    //console.log(req.session);
		if(req.session.adminsuccess){
			res.render('admin/home',{title: 'Admin Home Page', heading:'Admin Home', admin: true, admin_head: true});
		}
		/*If there is not success property then redirect to the login page*/
		else{
			/* Use redirect here to pass an error message (added the error=1 parameter) */
			res.redirect('/user/ad-login/?error=1');
		}

 	},

    /* the hidden form page to add admin user */
 	adminform: function(req, res){
 		console.log("adminform...");
        if(req.session.adminsuccess){
            res.render('admin/add-admin',{title: 'Add Administrator', heading: 'Add Administrator', admin_head: true, js: js});
        }
        else{
			/* Use redirect here to pass an error message (added the error=1 parameter) */
			res.redirect('/user/ad-login/?error=1');
		}

    },

    /* from  the hidden form page: add admin username and encrypted password*/
    addadmin: function(req, res){
        
        console.log("add admin user...");

        var data = JSON.parse(req.body.data);
        /* Require bcrypt and set the salt rounds*/ 
        var bcrypt = require('bcrypt');
        var saltRounds = 10;
        var pw = data.pw;
        var documentData = {};

        bcrypt.hash(pw, saltRounds, function(err, hash){
            if(err){
                console.log(err);
            }
            else {
                /* pass the hash, username(data.us) and response object
                as parameters to the checkInsertAdmin function */ 
                checkInsertAdmin(hash, data.un, res);
            }
            
        });

        /*
        bcrypt.hash(pw, saltRounds, function(err, hash) {
                if(err){
                    console.log(err)
                }
                else{
                    documentData.username = data.un;
                    documentData.password = hash;
                    
                     
                    adminModel.findOne({username: data.un}, function(err, name){
                        if(err){
                            console.log(err);
                        }
                        else{
                           
                            if(name === null){
                                 var admin = new adminModel(documentData);
                                admin.save(function(err){
                                    if(err){
                                        res.send('System Error Cannot Login');
                                    }
                                    else {
                                        res.send('Admin Account Created');
                                    }
                                });
                           }
                            
                           else {
                                res.send('Username already in use please pick another')
                           }
                           
                         }
                    });


                }
                
            });
        */
    }

};

function checkInsertAdmin(hashedPw, username, res){
    var msg = '';
    var documentData = {};
    documentData.password = hashedPw;
    documentData.username = username;
    
    /*CHECK FOR THE USERNAME TO EXIST*/
    adminModel.findOne({username: documentData.username}, function(err, name){
        if(err){
            console.log(err);
        }
        else{
           /*IF THE USERNAME IS NOT FOUND ENTER THE USERNAME AND THE PASSWORD*/
            if(name === null){
                var admin = new adminModel(documentData);
                admin.save(function(err){
                    if(err){
                        res.send('System Error Cannot Login');
                    }
                    else {
                        res.send('Admin Account Created');
                    }
                });
           }
           /*IF THE USERNAME IS FOUND TELL THE USER THAT USERNAME IS ALREADY IN USE.*/
           else {
                res.send('Username already in use please pick another');
           }
           
         }
    });
}
module.exports = {
	
	index : function(req, res) {
		/*This is the thank you and logout page where the session is destroyed*/
		req.session.destroy(function(err){
    		if(err){
    			console.log(err);
    		}
    		else{
    			res.render('user/thx4order', {title: 'User Home', heading:'Order Complete', user: true});
    		}
    	});
		
	}


};
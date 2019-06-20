var productModel = require('../../models').Product;

var js = '<script src="/public/js/Ajax.js"></script>';
js += '<script src="/public/js/user-viewcart.js"></script>';
js += '<script src="/public/js/user.js"></script>';

var tContent = '';


module.exports = {
	
	index : function(req, res) {
		if(req.session.success){           
			res.render('user/viewcart', {title: 'User Home', heading:'View Cart', buyer: true, js: js});
		}
		else{
			res.render('user/viewcart', {title: 'User Home', heading:'View Cart', user: true, js: js});
		}

	},

	getProduct : function(req, res){

		var tHead = '<table class="table table-bordered">'
			tHead += '<thead><tr>';
			tHead += '<th class ="col-md-2">Image</th>';
			tHead += '<th class ="col-md-4">Product Name</th>';
			tHead += '<th class ="col-md-1">Price</th>';
			tHead += '<th class ="col-md-1">Amount</th>';
			tHead += '<th class ="col-md-2">Description</th>';
			tHead += '<th class ="col-md-2">Update</th>';
			tHead += '</tr></thead>'; 
			tHead += '<tbody>';
        
		var cart = JSON.parse(req.body.data);

		if(tContent!==''){
			tContent = '';
		}
   
		if(cart){

			var len = cart.length;		
			var i = 0;
			    
			loopCart(cart, i, function(){

	            table = tHead + tContent + '</tbody></table>';
	            res.send('success^^^' + table); 
			});

		}
		
	}

};

/* loop through the shopping cart */
function loopCart(cart,i,callback){

	setTimeout(function(){

		if(i < cart.length){
			i++;

			setTimeout( function(){

					var idArr = cart[i-1].pid.split("***");
					var gid = idArr[0];
					var pid = idArr[1];
				
	                var amount = cart[i-1].count;
	                var id = cart[i-1].id;
	                
	               
						productModel.findOne({_id:gid}, function(err,docs){

							if(err){
								console.log(err);
							}
							else{
								if(docs) {
								 	var path = docs.imgFolder;								 	
									search4product(gid, pid, path, amount, docs);
									
								}//end if
						    }//end else
						});
		        
		    		loopCart(cart, i, callback);
		    }, 10);
		}
	    else{
	    	callback();
	    }
	},20);   
	    
}

/* search for the product by the product id and get the product info then add to the table */
function search4product(gid, pid, path, amount, docs){
	
	    tContent += '<tr>';
		for( var i = 0 ; i< docs.products.length; i++){
		 
			if(docs.products[i]._id == pid){   //if I use '===' it won't match, don't know why
						 				
				var imgPath = '/public/img/' + path +'/' + docs.products[i].p_imgId;
			    var pname = docs.products[i].p_name;
			    var price = docs.products[i].p_price;
			    var desc  = docs.products[i].p_desc;
			    var id = gid + "***" + pid;

		        tContent += '<td> <img src="'+ imgPath + '" class="img-thumbnail" ></td>'; 
		        tContent += '<td>' + pname + '</td>';
		        tContent += '<td> $' + price + '</td>';
		        tContent += '<td><input type="text" name="amount" id="p_amount" size="1" value="' + amount + '"></td>';
		        tContent += '<td desc="' + desc + '"><button type="button" class="btn btn-primary" id="desc">Description</button></td>';
		        tContent += '<td id="' + id +  '"><button type="button" class="btn btn-success" id="update">Update</button></td>';
					 				
	         }//end if
	    }
	    tContent += '</tr>';
	    return tContent;
	    //console.log("end for search4product");//end for
	    
}


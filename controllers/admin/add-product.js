var fs = require('fs');
var productModel = require('../../models').Product;

var js = '<script src="/public/js/Ajax.js"></script>';
js += '<script src="/public/js/admin.js"></script>';

module.exports = {
	//this provides the content for the index page
	index : function(req, res) {
		productModel.find({}).
		select({groupName: 1, _id: 0}).
		exec(function(err, docs){
			if(err){
				console.log(err);
			}
			else{
				res.render('admin/add-product', {title: 'Admin Area', heading:'Admin Add Product', admin: true, admin_head:true, groups: docs, js: js});	 
			}
		});	

	},

	addProduct: function(req, res) {

		console.log("addProduct...");

		var id = "";
		var path = "";
		//
		var data = JSON.parse(req.body.data);
		
		var groupName = data.groupName;

        var productArr = {};
        productArr.p_name = data.productName;
        productArr.p_price = parseFloat(data.productPrice);
        productArr.p_desc = data.productDesc;
        productArr.p_status = "current";
        
        productModel.findOne({ groupName:groupName}, function(err,docs){

			if(err){
				console.log(err);
			}
			else{
				if(docs) {
				 	id = docs._id;
				 	path = docs.imgFolder;	
			 		 	
				 	//if there is img file attached
				 	if(typeof(req.file) !== "undefined"){
				 		/* if the file is jpg type and smaller than 1MB */
				 		if (req.file.mimetype === 'image/jpeg' && req.file.size < 1048576){
							fs.rename( './public/upload/' + req.file.filename, './public/img/'+ path + '/' + req.file.filename + '.jpg', function(err){
				      			if(err){		      				
				      				console.log(err);
				      			}
					 		});
					 		productArr.p_imgName = data.productImgName;		
				            productArr.p_imgId = req.file.filename + '.jpg';	
					 	}
					 	else {
								console.log("Wrong img type or file too big!");
						}
					}
					else{
						console.log("there is no image attached");
					}

                    docs.products[docs.products.length] = productArr;
					docs.save(function(err){
						if(err){			         
							res.send('error');
						}
						else{
							res.send('success');
						}
					});
                }
				
			} 
			      
	    });

    }//end of addProduct


};
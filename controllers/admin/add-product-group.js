/* product model */
var productModel = require('../../models').Product;
/* mkdir -p module */
var mkdirp = require('mkdirp');

var js = '<script src="/public/js/Ajax.js"></script>';
js += '<script src="/public/js/admin.js"></script>';


module.exports = {
	//this provides the content for the index page
	index : function(req, res) {
		res.render('admin/add-product-group', {title: 'Admin Area', heading:'Admin Add Group', admin: true, admin_head:true, js: js});

	},

	// add product group 
	addGroup : function(req, res){
		
		console.log("addGroup... ");

		var data = JSON.parse(req.body.data);
		
		/* save all the varibles in lowerCase */
		var productData = {};
		productData.groupName = data.groupName.toLowerCase();
		productData.imgFolder = data.imgFolder.toLowerCase();

		/*if there is space in the imgFolder name, replace the space with dash */
		var str = productData.imgFolder;
		if(str.split(" ").length !=1 ){
			str = str.replace(/\s/ig, "-");
		}
		productData.imgFolder = str;

		var product = new productModel(productData);

		/*search the database if there is a same groupName exisit already
		 if it does exisit then send error1, else save the data*/
		productModel.findOne({ groupName:productData.groupName}, function(err,docs){

			if(err){
				console.log(err);
			}
			else{
				 if(docs) {
				 	console.log("group name " + productData.groupName +" already exist!");
				 	res.send('error1');
				 }
				 else {
				 	product.save(function(err){
						if(err){
							res.send('error');
						}
						else {
							mkdirp("./public/img/" + productData.imgFolder, function (err) {
							    if(err) console.error(err);
							});
							res.send('success');
						}
					});
				 } 
			} 
			      
		});
	}

};
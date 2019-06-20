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
					res.render('admin/update-product', {title: 'Admin Area', heading:'Update Product(s)', admin: true, groups: docs,admin_head:true, js: js});	 
				}
			});	
	},
    
    /* show the product */
	showProduct : function(req, res) {

        var groupName = req.body.data;

		//find all the products in this group
		productModel.findOne({ groupName:groupName}, function(err,docs){

			if(err){
				console.log(err);
				alert("error!!");
			}
			else{

				 if(docs) {
				 	var groupId = docs._id; 
				 	var pArr = docs.products;
				 	 
				 	for( var i = 0; i < pArr.length; i++){
				 		
				 		if(pArr[i].p_status === 'removed'){
				 			pArr.splice(i, 1);
				 		}
				 	}
				 	var table = createTable(groupId,pArr);
				 	res.send('success^^^' + table);
				 }
				 else {
				 	res.send('error');
				 }
			} 
			      
		});


	},

	deleteProduct : function(req, res) {

        console.log('Delete Product...');

		var data = JSON.parse(req.body.data);
        
		productModel.findOne({_id:data.groupId}, function(err, docs){
			if(err){
				console.log("err :" + err);
				res.send('error');
			}
			/* if successfully find the product with the product Id and set the p_status to 'removed'.*/
			else {
				  var pArr = docs.products.slice(0);//copy the products array
                  for( var i = 0; i < docs.products.length; i++){
                  	
                  	if(docs.products[i]._id == data.productId){     		
                  		docs.products[i].p_status = 'removed';
                  		pArr.splice(i,1);//remove the product from showing array
                  	}
                  }

                  docs.save(function(err){
						if(err){			         
							console.log(err);
						}
						else{
							var table = createTable(data.groupId, pArr);
							res.send('success^^^' + table);
						}
		
				   });
					 
			}
		});
	},

	updateProductForm : function(req, res) {
	
        var data = JSON.parse(req.body.data);

		// get the group name, product name, price and description 
		productModel.findOne({_id:data.groupId}, function(err, docs){
			if(err){
				console.log("err :" + err);
				res.send('error');
			}
			 
			else {
				  var pArr = [];
				  pArr.groupName = docs.groupName;
                  for( var i = 0; i < docs.products.length; i++){
                  	
                  	if(docs.products[i]._id == data.productId){     		
                  		pArr.productName = docs.products[i].p_name;
                  		pArr.productPrice = docs.products[i].p_price;
                  		pArr.desc = docs.products[i].p_desc;
                  	}
                  }
                  var form = createForm(data.productId, pArr);
                  res.send('success' + '^^^' + form);
			}
		});		

	},

	updateProduct : function(req, res) {
		
		console.log('Update Product...');
		var data = JSON.parse(req.body.data);
		
		
		var groupName = data.groupName;
        var productImgId ='';
        var path;

        productModel.findOne({ groupName:groupName}, function(err,docs){

			if(err){
				console.log(err);
				res.send('error');
			}
			else{
				if(docs) {

				 	//id = docs._id;
				 	path = docs.imgFolder;
				 	for( var i = 0; i < docs.products.length; i++){
                  	
	                  	if(docs.products[i]._id == data.productId){     		
	                  		//update the product
	                  		
                            docs.products[i].p_name = data.productName;
                            docs.products[i].p_price = parseFloat(data.productPrice);
                            docs.products[i].p_desc = data.productDesc;
                            
	                  		//if there is img file sent then remove the old one and upload the new img 
	                  		if(typeof(req.file) !== "undefined"){
                                //remove the old img if there is one        
                                if(docs.products[i].p_imgId !== '' && typeof(docs.products[i].p_imgId) !=="undefined"){

                                	productImgId = docs.products[i].p_imgId;
                                	
                                }

						 		//upload the file if it is jpg type and smaller than 1MB  
						 		if (req.file.mimetype === 'image/jpeg' && req.file.size < 1048576){
									fs.rename( './public/upload/' + req.file.filename, './public/img/'+ path + '/' + req.file.filename + '.jpg', function(err){
						      			if(err){		      				
						      				console.log(err);
						      			}
							 		});
							 		docs.products[i].p_imgName = data.productImgName;		
						            docs.products[i].p_imgId = req.file.filename + '.jpg';	
							 	}
							 	else {
										console.log("Wrong img type or file too big!");
								}
							}
							
	                  	}
                    }

                    docs.save(function(err){
								if(err){			         
									res.send('error');
								}
								else{
									// remove the old img file
									if(productImgId !== ''){
										var imgfile = './public/img/' + path + '/' + productImgId;
	                                	//console.log("remove img..." + imgfile);
										fs.unlink(imgfile,function(err){
											if(err){
												console.log("err" + err);		
											}
											else{
												console.log("removed file: " + imgfile);
												
											}
										});
									}
									res.send('success');
								}
							});	

                   
                }//end if docs
				
			} 
			      
	    });

	}


};

function createTable(gid, data){
	var len = data.length;
	
	var i = 0;
	var table = '<table class="table table-striped table-bordered">';
	table += '<thead>';
	table += '<tr>';
	table += '<th class="col-md-6">Product Name</th>';
	table += '<th class="col-md-3">Update Product</th>'
	table += '<th class="col-md-3">Delete Product</th>'
	table += '</tr></thead><tbody>';

	while( i < len ){
		table += '<tr>';
		table += '<td id="'+ gid + '***' +  data[i]._id + '">' + data[i].p_name + '</td>';
		table += '<td><button type="submit" class="btn btn-primary" id="updateProductForm">Update Product</button></td>'
		table += '<td><button type="button" class="btn btn-danger" id="deleteProduct">Delete Product</button></td>';
		table += '</tr>';
		i++;
	}
	table += '</tbody></table>';
	return table;
}

function createForm(pid, data){

    var form = '<div class="form-group">';
    form += '<label for="pname" id="' + pid + '">Product Name:</label>';
    form += '<input type="text" class="form-control" id="pname" value="'+ data.productName +'"></div>';

    form += '<div class="form-group">';
    form += '<label for="pprice">Product Price:</label>';
    form += '<input type="text" class="form-control" id="pprice" value="' + data.productPrice + '"></div>';

    form += ' <div class="form-group">';
    form += '<label for="pimagefile">Product Image (Leave this blank unless you want to update the image) </label>';
    form += '<input type="file" class="form-control" id="pimage"></div>';

    form += '<div class="form-group">';
    form += '<label for="pdesc">Product Description</label>';
    form += '<textarea class="form-control" rows="5" id="desc">' + data.desc + '</textarea></div>';

    form += '<button type="button" class="btn btn-success" id="updateProduct">Update Product</button>';

    return form;

}


var productModel = require('../../models').Product;

var js = '<script src="/public/js/Ajax.js"></script>';
js += '<script src="/public/js/user.js"></script>';

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
				if(req.session.success){
		            res.render('user/home',{title: 'User Home', heading:'Home', buyer: true, groups:docs, js:js});
		        }
		        else{
					res.render('user/home', {title: 'User Home', heading:'Home', user: true, groups: docs, js: js});	
				} 
			}
		});	

	},

	showProduct : function(req, res) {

        var groupName = req.body.data;
		//find all the products in this group
		productModel.findOne({ groupName:groupName}, function(err,docs){

			if(err){
				console.log(err);
				alert("error!!");
			}
			else{
				if(docs){
					var gid = docs._id;

					 if(docs) {
					 	var imgPath = "/public/img/" + docs.imgFolder + "/";
					 	
					 	var parr = docs.products;
					 	for( var i = 0; i < parr.length; i++){
					 		//console.log(docs.products[i].p_name + "|| " + docs.products[i].p_status);
					 		if(parr[i].p_status === 'removed'){
					 			parr.splice(i, 1);
					 		}
					 	}
					 	var table = createTable(imgPath, gid, parr);
					 	res.send('success^^^' + table);
					 }
					 else {
					 	res.send('error');
					 }
				}
			}
			      
		});


	}

};

function createTable(path, gid, data){
	var len = data.length;
	
	var i = 0;
	var table = '<table class="table table-striped table-bordered">';
	table += '<thead>';
	table += '<tr>';
	table += '<th class="col-md-2">Image</th>';
	table += '<th class="col-md-4">Product Name</th>'
	table += '<th class="col-md-1">Price</th>'
	table += '<th class="col-md-2">Description</th>'
	table += '<th class="col-md-2">Add to Cart</th>'
	table += '</tr></thead><tbody>';

	while( i < len ){
		table += '<tr>';
		//<img src="/public/img/NG_first_animals_150X150.jpg" class="img-thumbnail" >
		if(data[i].p_imgName){
			table += '<td> <img src="' + path + data[i].p_imgId + '" class="img-thumbnail" ></td>'; 
	    }
	    else{
	    	table += '<td> <strong> No Image </strong></td>'; 
	    }
		table += '<td>' + data[i].p_name + '</td>';
		table += '<td>$' + data[i].p_price + '</td>';
		table += '<td desc="' + data[i].p_desc +'"><button type="button" class="btn btn-primary" id="desc">Description</button></td>'
		//group id and product id
		var id = gid + "***" + data[i]._id;
		table += '<td id="' + id +  '"><button type="button" class="btn btn-success" id="add2cart">Add To Cart</button></td>';
		table += '</tr>';
		i++;
	}
	table += '</tbody></table>';
	return table;
}


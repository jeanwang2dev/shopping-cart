/*CREATE adminObj OBJECT*/
/************
METHODS:
1. init
2. adminLogin
3. addGroup
4. addProduct
5. showProduct
6. deleteProduct
7. updateProductForm
8. updateProduct
9. addEvent
10. ackMsg
11. validate
12. showOrderDetails
13. descWindow
14. checkCustomerWindow
15. addAdmin
***********/
adminObj = {}

adminObj.init = function(){
	if(document.getElementById('addGroup')){
		document.getElementById('addGroup').addEventListener('click', adminObj.addGroup, false);
	}

	if(document.getElementById('addProduct')){
		document.getElementById('addProduct').addEventListener('click', adminObj.addProduct, false);
	}

	if(document.getElementById('groupname')){
		document.getElementById('groupname').addEventListener('change', adminObj.showProduct, false);
	}

	if(document.getElementById('table')){
		document.getElementById('table').addEventListener('click', adminObj.deleteProduct, false);
	}
    
	if(document.getElementById('table')){
		document.getElementById('table').addEventListener('click', adminObj.updateProductForm, false);
	}

	if(document.getElementById('form')){
		document.getElementById('form').addEventListener('click', adminObj.updateProduct, false);
	}

	if(document.getElementById('c-customer')){
		document.getElementById('c-customer').addEventListener('change', adminObj.checkCustomerOrder, false);
	}

	if(document.getElementById('table')){
		document.getElementById('table').addEventListener('click', adminObj.showOrderDetails, false);
	}	

	if(document.getElementById('admin-login')){
		document.getElementById('admin-login').addEventListener('click', adminObj.adminLogin, false);
	}

    if(document.getElementById('addAdminBtn')){
		document.getElementById('addAdminBtn').addEventListener('click', adminObj.addAdmin, false);
	}

}


adminObj.adminLogin = function(){

	var password = document.getElementById('password').value;
	var username = document.getElementById('username').value;
	var msg ='';
	
	if(password == '' || username == ''){
		msg = '<p>Please fill in the blanks!</p><div id="buttons"><button type="button" class="btn btn-primary" id="okay">okay</button></div>';
		adminObj.ackMsg('Error', msg, '#d34441', true);
		document.getElementById('buttons').addEventListener('click', adminObj.addEvent, false);

	}
	else{

		var data = {};
		data.pw = password;
		data.un = username;

		data = JSON.stringify(data);

		/* clear the fields */
		document.forms[0].reset();

	    Ajax.sendRequest('/user/ad-login',function(res){
			responseArr = res.responseText.split('^^^');
			if(responseArr[0] ==='error'){
                msg = '<p>' + responseArr[1] + '</p><div id="buttons"><button type="button" class="btn btn-primary" id="okay">okay</button></div>'
				adminObj.ackMsg('Error', msg, '#d34441', true);
				document.getElementById('buttons').addEventListener('click', adminObj.addEvent, false);

			}
			else if(responseArr[0] === 'success'){
				window.location = '../../admin/';
			}
			
		}, data);
	}

}

adminObj.addGroup = function(){

	var groupName = document.getElementById('ad_groupname');
	var imgFolder = document.getElementById('imgfolder');

	/*validate the field, if empty return error*/
	var arg = [groupName.value, imgFolder.value];
	var valid = adminObj.validate(arg);
	if(!valid) return;  
    
	/*tell the user that the dat is being saved*/
	adminObj.ackMsg('Saving group name','Saving group name please wait...', '#286090', true);

    /* create a data object*/
	var data = {};

	/*add the group name and the img folder name with path */
	data.groupName = groupName.value;
	data.imgFolder = imgFolder.value;

    /*Stringify the object so that will pass as a string to the server */
	data = JSON.stringify(data);
   
	/* clean the fields*/
    groupName.value = "";
    imgFolder.value = "";

	/* send Ajax request*/
	Ajax.sendRequest('/admin/add-product-group/',function(res){

		/*IF ERROR DISPLAY GENERIC MESSAGE*/
		if(res.responseText === 'error'){
			adminObj.ackMsg('Error','Sorry there was a problem adding the group name', '#d34441', true);
			setTimeout(function(){adminObj.ackMsg('','','#000',false)}, 1500);
		}
		/*IF NO ERROR THEN INFORM USER FILE SAVE WAS SUCCESSFUL*/
		else if (res.responseText === 'success'){
			var msg = '<p>Group Name successfully added</p><div id="buttons"><button type="button" class="btn btn-primary" id="okay">okay</button></div>';
			adminObj.ackMsg('Success', msg, '#4eb04d', true);
			document.getElementById('buttons').addEventListener('click', adminObj.addEvent, false);
		}
		else if( res.responseText === 'error1'){
			var msg = '<p>There is already a group called this name. Please choose another name</p><div id="buttons"><button type="button" class="btn btn-primary" id="okay">okay</button></div>';
			adminObj.ackMsg('Error', msg, '#d34441', true);
			document.getElementById('buttons').addEventListener('click', adminObj.addEvent, false);
		}
		
	}, data);

}

adminObj.addProduct = function(){
	/* get the product detail input from form data */
	var select = document.getElementById('addp_groupname'); 
	var productName = document.getElementById('pname');
	var productPrice = document.getElementById('pprice');
	var productDesc = document.getElementById('pdesc');
	var imgfile = document.getElementById('pimage');
    var flag = true;

    /* the data sent by Ajax, if the upload file is empty, then send object data, if not, send formdata */
    var sendData;
    /*validate the field, if empty return error*/
	var arg = [productName.value, productPrice.value, productDesc.value];
	var valid = adminObj.validate(arg);
	if(!valid) return;  

    /* create a data object*/
	var data = {};
	data.groupName = select.options[select.selectedIndex].value;
	data.productName = productName.value;
	data.productPrice= productPrice.value;
	data.productDesc = productDesc.value;
	if(imgfile.value !== ''){
		var tmpArr = imgfile.value.split("\\");
		data.productImgName = tmpArr[tmpArr.length - 1];
    }
    else{
    	flag = false;
    }
   
	/*tell the user that the data is being saved*/
	adminObj.ackMsg('Saving Product','Saving product please wait...', '#286090', true);
	
	/*Stringify the object so that will pass as a string to the server */
	data = JSON.stringify(data);
   
	/* create a new formdata object for sending the file*/
	var formData = new FormData();

	/* append the file name and file*/
	if(flag){
		formData.append('file', imgfile.files[0]);
		formData.append('data', data);
		sendData = formData;
	}
	else{
		sendData = data;
	}

	/* clean the fields*/
	document.forms[0].reset();
     
	/* send Ajax request*/
	Ajax.sendRequest('/admin/add-product/',function(res){
		 
		if(res.responseText === 'error'){
			adminObj.ackMsg('Error','Sorry there was a problem adding the product', 'red', true);
			setTimeout(function(){adminObj.ackMsg('','','#000',false)}, 1500);
		}	 
		else if (res.responseText === 'success'){
			var msg = '<p>Product successfully added</p><div id="buttons"><button type="button" class="btn btn-primary" id="okay">okay</button></div>';
			adminObj.ackMsg('Success', msg, 'green', true);
			document.getElementById('buttons').addEventListener('click', adminObj.addEvent, false);
		}
		
	}, sendData, flag); 

}

adminObj.showProduct = function(evt){

	 var currentNode = evt.target;
	 var data = evt.target.value;

	 Ajax.sendRequest('/admin/update-product',function(res){
        var responseArr = res.responseText.split('^^^');
		
		if(responseArr[0] === 'error'){
			console.log("there is a error showing the product");
		}
		else if (responseArr[0] === 'success'){
			document.getElementById('table').innerHTML = responseArr[1];
		}
		
	}, data);
}

adminObj.deleteProduct = function(e){

	if(e.target.id === 'deleteProduct'){
		/* the message will contain confirmation buttons*/
		var msg = "<p>You are about to permanently delete this record. It cannot be undone. If this is what you want to do click 'OK', otherwise click 'Cancel'</p>";
		msg += '<div id="buttons"><button type="button" class="btn btn-danger" id="cancel">Cancel</button>&nbsp;<button type="button" class="btn btn-success" id="okay">OK</button></div>';
		var tr = e.target.parentNode.parentNode;
		
		adminObj.ackMsg('Warning', msg, 'red', true);

		/* create a data object*/
	    var data = {};
	    var idArr = tr.firstChild.id.split("***");

	    //console.log("id: " + idArr[0] + "," + idArr[1]);
	    data.groupId = idArr[0];
	    data.productId = idArr[1];
        data = JSON.stringify(data);

		document.getElementById('buttons').addEventListener('click', chooseEvent, false);

		function chooseEvent(e){
			if(e.target.id === 'okay'){
					/* remove event listener so it is not sitting in memory */
					document.getElementById('buttons').removeEventListener('click', chooseEvent, false);

					adminObj.ackMsg('Delete Product','Deleting Product please wait...', 'blue', true);
	                

					Ajax.sendRequest('/admin/deleteproduct', function(res){
						responseArr = res.responseText.split('^^^');
						if(responseArr[0] ==='error'){
							adminObj.ackMsg('Error','Sorry there was a problem deleting the Product!', 'red', true);
							setTimeout(function(){adminObj.ackMsg('','', '#000', false)}, 1500);
						}
						else if(responseArr[0] === 'success'){
							adminObj.ackMsg('Success','Product was successfully deleted', 'blue', true);
							/* remove row that was clicked. This is done by overwriting the content of the
							div with the id of table with the new table created on the server. */
							document.getElementById('table').innerHTML = responseArr[1];
							
							setTimeout(function(){adminObj.ackMsg('','','#000', false)}, 1500);

						}
					}, data, false);


				}
				else if(e.target.id === 'cancel'){

					/* remove event listener so it is not sitting in memory */
					document.getElementById('buttons').removeEventListener('click', chooseEvent, false);
					/* hide acknowledgment message */
					adminObj.ackMsg('','', '#000',false);
				}
		}//end of chooseEvent

	}


}


adminObj.updateProductForm = function(e){

	if(e.target.id === 'updateProductForm'){
        
		var tr = e.target.parentNode.parentNode;

		var data = {};
	    var idArr = tr.firstChild.id.split("***");

	    data.groupId = idArr[0];
	    data.productId = idArr[1];
        data = JSON.stringify(data);

        //console.log("data: " + data);

		Ajax.sendRequest('/admin/update-product1', function(res){
			
			responseArr = res.responseText.split('^^^');
			if(responseArr[0] ==='error'){
				console.log('there is an error updating product.');
			}
			else if(responseArr[0] === 'success'){
				document.getElementById('groupname').removeEventListener('change', adminObj.showProduct, false);
				document.getElementById('table').innerHTML = '';
				document.getElementsByTagName('p')[0].innerHTML = 'NOTE: The group selection is to change the group for the product and not to redirect to a new product group.';
				document.getElementById('form').innerHTML = responseArr[1];

                
            }
		}, data, false); 

	}

}

adminObj.updateProduct = function(e){
	
	if(e.target.id === 'updateProduct'){

		var select = document.getElementById('groupname'); 
		var productName = document.getElementById('pname');
		var productPrice = document.getElementById('pprice');
		var productDesc = document.getElementById('desc');
		var imgfile = document.getElementById('pimage');
	    var flag = true;

	    /* the data sent by Ajax, if the upload file is empty, then send object data, if not, send formdata */
	    var sendData;

	    /* create a data object*/
		var data = {};
		data.productId = productName.previousSibling.id;
		data.groupName = select.options[select.selectedIndex].value;
		data.productName = productName.value;
		data.productPrice= productPrice.value;
		data.productDesc = productDesc.value;
		if(imgfile.value !== ''){
			//console.log("imgFile: " + imgfile.value);
			var tmpArr = imgfile.value.split("\\");
			data.productImgName = tmpArr[tmpArr.length - 1];
	    }
	    else{
	    	flag = false;
	    	//data.productImgName = '';
	    }

	    /*tell the user that the data is being saved*/
		adminObj.ackMsg('Update Product','Updating Product Please Wait...', '#286090', true);
		
		/*Stringify the object so that will pass as a string to the server */
		data = JSON.stringify(data);
	   
		/* create a new formdata object for sending the file*/
		var formData = new FormData();

		/* append the file name and file*/
		if(flag){
			formData.append('file', imgfile.files[0]);
			formData.append('data', data);
			sendData = formData;
		}
		else{
			sendData = data;
		}

		/* clean the fields*/
		//document.forms[0].reset();

		/* send Ajax request*/
		Ajax.sendRequest('/admin/update-product2/',function(res){
			 
			if(res.responseText === 'error'){
				adminObj.ackMsg('Error','Sorry there was a problem updating the product', 'red', true);
				setTimeout(function(){adminObj.ackMsg('','','#000',false)}, 1500);
			}	 
			else if (res.responseText === 'success'){
				var msg = '<p>Product successfully updated</p><div id="buttons"><button type="button" class="btn btn-primary" id="okay">okay</button></div>';
				adminObj.ackMsg('Success', msg, 'green', true);
				document.getElementById('buttons').addEventListener('click', addEvent, false);
				

			}
			
		}, sendData, flag); 

	    function addEvent(e){
				if(e.target.id === 'okay'){
					/* remove event listener so it is not sitting in memory */
					document.getElementById('buttons').removeEventListener('click', addEvent, false);
					/* hide acknowledgment message */
					adminObj.ackMsg('','', '#000',false);
					//after the customer click okay than direct the page to update-product
					window.location = '/admin/update-product/';
				}
		}

	}
}

adminObj.addEvent = function (e){
			if(e.target.id === 'okay'){
				/* remove event listener so it is not sitting in memory */
				document.getElementById('buttons').removeEventListener('click', adminObj.addEvent, false);
				/* hide acknowledgment message */
				adminObj.ackMsg('', '', '#000',false);
			}
}

adminObj.ackMsg = function(msghead, msg, color, show){
	
	var ackhead = "<div id='ackheader' style='background-color:" + color + "'><h4>" + msghead +"</h4></div>";
	var acknowledgment = document.getElementById('ack');
	acknowledgment.innerHTML = ackhead + msg;
	
	if(show){
		acknowledgment.style.display = 'block';
	}
	else {
		acknowledgment.style.display = 'none';
	}
}

adminObj.validate = function(arg){
	var len = arg.length;
	var valid = true;
	for(var i= 0 ; i < len; i++){
		if(arg[i] === '') {
			valid = false;
		}
	}
    if(!valid){
		var msg = "<p>Fields cannot be empty.</p>";
			msg += '<div id="buttons"><button type="button" class="btn btn-primary" id="okay">okay</button></div>';
		adminObj.ackMsg('Error', msg, '#d34441', true);
		document.getElementById('buttons').addEventListener('click', adminObj.addEvent, false);
	}
	return valid;
}

adminObj.showOrderDetails = function(evt){

	if(evt.target.id === 'orderDetails'){
		var data = evt.target.parentNode.previousSibling.firstChild.nodeValue;

	    Ajax.sendRequest('/admin/check-customer-order-detail',function(res){
	        var responseArr = res.responseText.split('^^^');
			
			if(responseArr[0] === 'error'){
				console.log("there is an error showing the order detail.");
			}
			else if (responseArr[0] === 'success'){
				var msg = responseArr[1];
				var msgbutton = '<div id="buttons"><button type="button" class="btn btn-primary" id="okay">okay</button>';
				adminObj.descWindow(msg + msgbutton, true);
				document.getElementById('buttons').addEventListener('click', addEvent, false);	
				
			}
			
		}, data);

	}

	function addEvent(e){
				if(e.target.id === 'okay'){
					/* remove event listener so it is not sitting in memory */
					document.getElementById('buttons').removeEventListener('click', addEvent, false);
					/* hide acknowledgment message */
					adminObj.descWindow('',false);
					
				}
	}

}

adminObj.descWindow = function(msg, show){
	
	var whead = "<div id='descHeader' style='background-color: #3E8ACC'><h4>Description</h4></div>"; 
	var descWindow = document.getElementById('descWindow');
	descWindow.innerHTML = whead + msg;
	
	if(show){
		descWindow.style.display = 'block';
	}
	else {
		descWindow.style.display = 'none';
	}
}

adminObj.checkCustomerOrder = function(evt){
	var currentNode = evt.target;
	var data = evt.target.value;

	Ajax.sendRequest('/admin/check-customer-order',function(res){
        var responseArr = res.responseText.split('^^^');
		
		if(responseArr[0] === 'error'){
			adminObj.ackMsg('Error', responseArr[1], 'red', true);
			setTimeout(function(){adminObj.ackMsg('','','#000',false)}, 1500);
		}
		else if(responseArr[0] === 'error1'){
			//console.log("there is an error showing the customer order.");
			document.getElementById('table').innerHTML = '';
			var msg = "<p>This customer hasn't order anything yet.</p>";
			msg += '<div id="buttons"><button type="button" class="btn btn-primary" id="okay">okay</button></div>';
			adminObj.ackMsg('Attention', msg, 'green', true);
			document.getElementById('buttons').addEventListener('click', adminObj.addEvent, false);

		}
		else if (responseArr[0] === 'success'){
			document.getElementById('table').innerHTML = responseArr[1];
		}

		
	}, data);
}

/* the hidden add Admin page for Admin area, add username and password to database */
adminObj.addAdmin = function(){

	var password = document.getElementById('password').value;
	var userName = document.getElementById('username').value;
	var data = {};
	data.pw = password;
	data.un = userName;

	data = JSON.stringify(data);
	adminObj.ackMsg('', 'Creating admin account please wait...', 'green', true);

	/*Clear the username and password fields*/
	password = '';
	userName = '';
	Ajax.sendRequest('/admin/addadmin/',function(res){
		
		adminObj.ackMsg('',res.responseText, 'green', true);

		setTimeout(function(){adminObj.ackMsg('','','green',false)}, 1500);
        
        if ( res.responseText == 'Admin Account Created'){
        	window.location = "/user/ad-login/";
        }

	}, data);
}

adminObj.init();


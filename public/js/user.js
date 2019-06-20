/*CREATE userObj OBJECT*/
/************
METHODS:
1. init
2. showProduct
3. showDesc
4. descWindow
5. add2cart
6. update
7. registCustomer
8. validate
9. validState
10. validField
11. hideSpan
12. showspan
13. ackMsg
14. completeCheckout
15. customerLogin
16. creditCardFormat
17. logout
***********/
userObj = {}

userObj.init = function(){
	
	var h3 = document.getElementsByTagName('header')[0].lastElementChild.firstElementChild.firstChild;
	var cart = JSON.parse(localStorage.getItem('cartItems'));
	if(cart){
		
		var amount = 0;
		for(var i = 0; i < cart.length; i++){
			amount += cart[i].count;
		}
		h3.nodeValue = amount;
	}

	if(document.getElementById('groupname')){
		document.getElementById('groupname').addEventListener('change', userObj.showProduct, false);
	}

	if(document.getElementById('table')){
		document.getElementById('table').addEventListener('click', userObj.showDesc, false);
	}

	if(document.getElementById('table')){
		document.getElementById('table').addEventListener('click', userObj.add2cart, false);
	}

	if(document.getElementById('table')){
		document.getElementById('table').addEventListener('click', userObj.update, false);
	}

	if(document.getElementById('register')){
		document.getElementById('register').addEventListener('click', userObj.registCustomer, false);
	}

	if(document.getElementById('cp-checkout')){
		document.getElementById('cp-checkout').addEventListener('click', userObj.completeCheckout, false);
	}

	if(document.getElementById('cust-login')){
		document.getElementById('cust-login').addEventListener('click', userObj.customerLogin, false);
	}

    /* if the customer click logout than clear the localStorage */
    if(document.getElementsByTagName('li')[3] !== undefined){
        document.getElementsByTagName('li')[3].addEventListener('click', userObj.logout, false);
	}

	if(document.getElementById('card')){
        document.getElementById('card').addEventListener('keyup', userObj.creditCardFormat, false);
	}


}



userObj.showProduct = function(evt){

	 //var currentNode = evt.target;
	 var data = evt.target.value;
	 //console.log("chose name: " + data);

	 Ajax.sendRequest('/user/home',function(res){
        var responseArr = res.responseText.split('^^^');
		/*IF ERROR DISPLAY GENERIC MESSAGE*/
		if(responseArr[0] === 'error'){
			console.log("there is a error showing the product");
		}
		/*IF NO ERROR THEN INFORM USER FILE SAVE WAS SUCCESSFUL*/
		else if (responseArr[0] === 'success'){
			document.getElementById('table').innerHTML = responseArr[1];
		}
		
	}, data);
}

/* show the description popup window */
userObj.showDesc = function(evt){

	if(evt.target.id === 'desc'){
		
		var tr = evt.target.parentNode.parentNode; //get the row that the description button is at
		
		var msgimg ; //get the img path if there is one
		if(tr.firstElementChild.firstElementChild.nodeName === 'IMG' )
		{
			var src = tr.firstElementChild.firstElementChild.getAttribute('src');
			msgimg = '<img src="'+ src +'">';
		}
		else{
			msgimg = "<strong>No Image</strong>";
		}
		
		var name = tr.firstElementChild.nextSibling.firstChild.nodeValue;
		var price = tr.firstElementChild.nextElementSibling.nextElementSibling.firstChild.nodeValue;
		//evt.target.parentNode.previousElementSibling.firstChild.nodeValue;
		var desc = tr.lastElementChild.previousSibling.getAttribute('desc');

		var msginfo = "<div id='info'>"; 
		msginfo += '<div id="name"><h2>' + name +'</h2></div>' + '<div id="price"> Price: ' + price + '</div>' + '<div id="pdesc">' + desc +'</div>';
		msginfo += '</div>';

		var msgbutton = '<div id="buttons"><button type="button" class="btn btn-primary" id="okay">okay</button>';
		var msg = msgimg + msginfo + msgbutton;
		userObj.descWindow(msg, true);
		document.getElementById('buttons').addEventListener('click', addEvent, false);

	}

	function addEvent(e){
				if(e.target.id === 'okay'){
					/* remove event listener so it is not sitting in memory */
					document.getElementById('buttons').removeEventListener('click', addEvent, false);
					/* hide acknowledgment message */
					userObj.descWindow('',false);
					
				}
	}
}

/* description window div */
userObj.descWindow = function(msg, show){
	
	var whead = "<div id='descHeader' style='background-color: #3E8ACC'><h4>Description</h4></div>"; 
	var descWindow = document.getElementById('descWindow-user');
	descWindow.innerHTML = whead + msg;
	
	if(show){
		descWindow.style.display = 'block';
	}
	else {
		descWindow.style.display = 'none';
	}
}

userObj.add2cart = function(evt){

	if(evt.target.id === 'add2cart'){
		var h3 = document.getElementsByTagName('header')[0].lastElementChild.firstElementChild.firstChild;
    	var num = parseInt(h3.nodeValue);
        num += 1;
    	h3.nodeValue = num;

    	var id =  evt.target.parentNode.id;
    	var price = evt.target.parentNode.previousElementSibling.previousElementSibling.firstChild.nodeValue.substring(1);
        
        /* temporary cartItems array, use to hold the shopping info of this page */  
        var cartItems = [];    

        /* get the shopping info from the localStorage, if the cart is null, 
        that means customer has added any item yet*/
        var cart = JSON.parse(localStorage.getItem('cartItems'));

        /* a flag in the loop to check if the product is already added, if it is then set it to 1*/
        var sentinel = 0;

        /* when the localStorage is empty */
        if(!cart){
    		cartItems.push( {"count" : 1 , "pid" : id , "price" : price});
        }
        else{
        	/*when localStorage is not empty, check if the product is already added and add one to the number, 
        	otherwise add one new product */
        	cartItems = cart;
        	for(var i = 0; i < cartItems.length; i++){
        		if(id === cartItems[i].pid){
        			cartItems[i].count += 1;
        			sentinel = 1;
        		}
        	}
        	if(sentinel === 0){
        		cartItems.push( {"count" : 1 , "pid" : id , "price" : price});
        	}
        }
    	localStorage.setItem('cartItems', JSON.stringify(cartItems));
 
	}

}

userObj.update = function(evt){

	if(evt.target.id === 'update'){
		//get the amount from the page
		var amount = evt.target.parentNode.previousElementSibling.previousSibling.firstElementChild.value;
		
		var cart = JSON.parse(localStorage.getItem('cartItems'));	 
        var id = evt.target.parentNode.id;
        var len = cart.length;
        var count = 0;
		
		/*when customer set the amount to zero */
		if( amount == 0){
			/*remove the product from localStorage*/
            var j = 0;
            for(var j =0; j < len; j++){
            	
            	if(cart[j] !== undefined && cart[j].pid === id){
            		
            		cart.splice(j,1); 
            	}
            }
            /*recount cart*/
            len = cart.length;
            
            if(len == 0){
            	localStorage.removeItem('cartItems');
            	count = 0;
            }
            else{
	            for(var i = 0; i < len; i++){
	            	count += cart[i].count;
	            }
	            localStorage.setItem('cartItems', JSON.stringify(cart));
            }
            

            /*and remove row*/
			var row = evt.target.parentNode.parentNode.rowIndex;
    		document.getElementsByTagName("table")[0].deleteRow(row);

		}
		else{
			/*modify the localStorage*/
			
			for(var i = 0; i < len; i++){
            	if(cart[i].pid === id){
            		cart[i].count = parseFloat(amount);//document.getElementById('amount').value;
            	}
            }
            for(var i = 0; i < len; i++){
            	count += cart[i].count;
            }
            
            
            localStorage.setItem('cartItems', JSON.stringify(cart));
		}

		//modify the shopping cart number
		var h3 = document.getElementsByTagName('header')[0].lastElementChild.firstElementChild.firstChild;
		h3.nodeValue = count;

	}
		
}

userObj.registCustomer = function(){

 var sign = userObj.validate();
 
 if(sign){

	var password = document.getElementById('password').value.trim();
	var email = document.getElementById('email').value.trim();
	var firstname = document.getElementById('firstname').value.trim();
	var lastname = document.getElementById('lastname').value.trim();
	var address = document.getElementById('address').value.trim();
	var city = document.getElementById('city').value.trim();
	var state = document.getElementById('state').value.toUpperCase().trim();
	var zipcode = document.getElementById('zipcode').value.trim();
	var phone = document.getElementById('phone').value.trim();
	var data = {};
	data.pw = password;
	data.email = email;
	data.f_name = firstname;
	data.l_name = lastname;
	data.address = address;
	data.city = city;
	data.state = state;
	data.zipcode = zipcode;
	data.phone = phone;

	data = JSON.stringify(data);

	Ajax.sendRequest('/user/register/',function(res){
		responseArr = res.responseText.split('^^^');
		if(responseArr[0] ==='error'){
			var msg = '<p>'+responseArr[1]+ '</p>' + '<div id="buttons"><button type="button" class="btn btn-primary" id="okay">okay</button></div>';
			userObj.ackMsg('Error', msg, 'red', true);
			document.getElementById('buttons').addEventListener('click', userObj.addEvent, false);

			//userObj.ackMsg('Error', responseArr[1], 'red', true);
			//setTimeout(function(){userObj.ackMsg('','','#000',false)}, 3000);
		}
		else if(responseArr[0] === 'success'){
			userObj.ackMsg('Success', responseArr[1], 'blue', true);
			setTimeout(function(){userObj.ackMsg('','','#000',false)}, 3000);
			//send the customer email to localStorage
			localStorage['customer-email'] = email;
			window.location = '/user/checkout';
		}

		/*HIDE ACKNOWLEDGMENT MESSAGE AFTER 1.5 SECONDS*/
		
	}, data);

  }

}

userObj.addEvent = function (e){
			if(e.target.id === 'okay'){
				/* remove event listener so it is not sitting in memory */
				document.getElementById('buttons').removeEventListener('click', userObj.addEvent, false);
				/* hide acknowledgment message */
				userObj.ackMsg('', '', '#000',false);
			}
}

userObj.validate = function(){
	 var len = document.forms[0].elements.length;
       
        var valid = true;
        for( var i = 0; i < len; i++){
            
            if( document.forms[0].elements[i].name != "submit"){ // when the element is not the button
            
               var node = document.forms[0].elements[i];
               var id = node.id; 
               var result;  
               if(id == "state"){
               	result =  userObj.validState(node);
               }
               else{
               	result = userObj.validField(node,id);    
               }
               if(!result) valid = false;
             }
             
        }//end for
         
        return valid?true:false;
}

userObj.validState = function(node){
	
	var input_str = node.value.toUpperCase();
    var valid = false;
	var usStates = [
	    { name: 'ALABAMA', abbreviation: 'AL'},
	    { name: 'ALASKA', abbreviation: 'AK'},
	    { name: 'AMERICAN SAMOA', abbreviation: 'AS'},
	    { name: 'ARIZONA', abbreviation: 'AZ'},
	    { name: 'ARKANSAS', abbreviation: 'AR'},
	    { name: 'CALIFORNIA', abbreviation: 'CA'},
	    { name: 'COLORADO', abbreviation: 'CO'},
	    { name: 'CONNECTICUT', abbreviation: 'CT'},
	    { name: 'DELAWARE', abbreviation: 'DE'},
	    { name: 'DISTRICT OF COLUMBIA', abbreviation: 'DC'},
	    { name: 'FEDERATED STATES OF MICRONESIA', abbreviation: 'FM'},
	    { name: 'FLORIDA', abbreviation: 'FL'},
	    { name: 'GEORGIA', abbreviation: 'GA'},
	    { name: 'GUAM', abbreviation: 'GU'},
	    { name: 'HAWAII', abbreviation: 'HI'},
	    { name: 'IDAHO', abbreviation: 'ID'},
	    { name: 'ILLINOIS', abbreviation: 'IL'},
	    { name: 'INDIANA', abbreviation: 'IN'},
	    { name: 'IOWA', abbreviation: 'IA'},
	    { name: 'KANSAS', abbreviation: 'KS'},
	    { name: 'KENTUCKY', abbreviation: 'KY'},
	    { name: 'LOUISIANA', abbreviation: 'LA'},
	    { name: 'MAINE', abbreviation: 'ME'},
	    { name: 'MARSHALL ISLANDS', abbreviation: 'MH'},
	    { name: 'MARYLAND', abbreviation: 'MD'},
	    { name: 'MASSACHUSETTS', abbreviation: 'MA'},
	    { name: 'MICHIGAN', abbreviation: 'MI'},
	    { name: 'MINNESOTA', abbreviation: 'MN'},
	    { name: 'MISSISSIPPI', abbreviation: 'MS'},
	    { name: 'MISSOURI', abbreviation: 'MO'},
	    { name: 'MONTANA', abbreviation: 'MT'},
	    { name: 'NEBRASKA', abbreviation: 'NE'},
	    { name: 'NEVADA', abbreviation: 'NV'},
	    { name: 'NEW HAMPSHIRE', abbreviation: 'NH'},
	    { name: 'NEW JERSEY', abbreviation: 'NJ'},
	    { name: 'NEW MEXICO', abbreviation: 'NM'},
	    { name: 'NEW YORK', abbreviation: 'NY'},
	    { name: 'NORTH CAROLINA', abbreviation: 'NC'},
	    { name: 'NORTH DAKOTA', abbreviation: 'ND'},
	    { name: 'NORTHERN MARIANA ISLANDS', abbreviation: 'MP'},
	    { name: 'OHIO', abbreviation: 'OH'},
	    { name: 'OKLAHOMA', abbreviation: 'OK'},
	    { name: 'OREGON', abbreviation: 'OR'},
	    { name: 'PALAU', abbreviation: 'PW'},
	    { name: 'PENNSYLVANIA', abbreviation: 'PA'},
	    { name: 'PUERTO RICO', abbreviation: 'PR'},
	    { name: 'RHODE ISLAND', abbreviation: 'RI'},
	    { name: 'SOUTH CAROLINA', abbreviation: 'SC'},
	    { name: 'SOUTH DAKOTA', abbreviation: 'SD'},
	    { name: 'TENNESSEE', abbreviation: 'TN'},
	    { name: 'TEXAS', abbreviation: 'TX'},
	    { name: 'UTAH', abbreviation: 'UT'},
	    { name: 'VERMONT', abbreviation: 'VT'},
	    { name: 'VIRGIN ISLANDS', abbreviation: 'VI'},
	    { name: 'VIRGINIA', abbreviation: 'VA'},
	    { name: 'WASHINGTON', abbreviation: 'WA'},
	    { name: 'WEST VIRGINIA', abbreviation: 'WV'},
	    { name: 'WISCONSIN', abbreviation: 'WI'},
	    { name: 'WYOMING', abbreviation: 'WY' }
	];

	len = usStates.length;
    for(var i = 0; i<len ; i++){
    	if( input_str == usStates[i].name ) valid = true;
    	if( input_str == usStates[i].abbreviation ) valid = true;
  	}

  	if(valid) {
  		userObj.hideSpan(node);
  		return true;
  	}
  	else{
  		var msg = "State cannot be blank and is not a valid state";
  		userObj.showSpan(node,msg);
  		return false;
  	}

}

userObj.validField = function(node, id){

        /* replace all the '-' in the card number from the input field*/
	    if(id == 'card'){
	    	var cardValue = node.value.trim();
	    	cardValue = cardValue.replace(/-/g, "");
	    }
        
        var regCard = /^(\d){16}$/;
        var regCcv = /^\d{3}/;
        var regExpdate = /^(0*[1-9]|1[0-2])\/((1[6-9])|[2-9]\d)$/;

        var regName = /^[a-zA-Z ]+[ -]*[a-zA-Z ]+$/;
        var regAdd  = /\b[a-zA-Z0-9]+[a-zA-Z0-9 -.]*[a-zA-Z0-9.]$/;
        var regCity = /^[a-zA-Z ]+[ -]*[a-zA-Z ]+$/;
        
        var regZip = /(^\d{5}$)/;
        var regPhone = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
        var regEmail = /([a-zA-Z])+@([a-zA-Z])+\.([a-zA-Z])+/;
        var regPw = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-><]).{8,10}$/;
        var valid = true;
        
        var msgA = "Please enter valid credit card number (16 digits)";
        var msgB = "Please enter valid ccv code";
        var msgC = "Format MM/YY. Please enter a valid date";

        var msg1 = "First Name cannot be blank and can only include Letters, with spaces or hyphens";
        var msg2 = "Last Name cannot be blank and can only include Letters, with spaces or hyphens";
        var msg3 = "Address cannot be blank and can only include Letters, with spaces, hyphens, numbers";
        var msg4 = "City cannot be blank and cannot be blank and can only include Letters, with spaces or hyphens";
        
        var msg6 = "Zipcode cannot be blank and need to be five digit";
        var msg7 = "Phone cannot be blank and is not in a phone format(needs 10 digits)";
        var msg8 = "Email cannot be blank and is not in an email formt";
        var msg9 = "Password need to be 8 to 10 characters, must contain uppercase letter(s), number(s), special characters";
        var msg10 = "Confirm Password cannot be blank and has to be the same as password";
        
         switch( id ){     
            case "card"      : regCard.test(cardValue)?userObj.hideSpan(node):( userObj.showSpan(node,msgA), valid = false ); break;
            case "ccv"       : regCcv.test(node.value)?userObj.hideSpan(node):( userObj.showSpan(node,msgB), valid = false ); break;
            case "expdate"   : regExpdate.test(node.value)?userObj.hideSpan(node):( userObj.showSpan(node,msgC), valid = false ); break;
            case "firstname" : regName.test(node.value.trim())?userObj.hideSpan(node):( userObj.showSpan(node,msg1), valid = false ); break;
            case "lastname"  : regName.test(node.value.trim())?userObj.hideSpan(node):( userObj.showSpan(node,msg2), valid = false ); break;
            case "address"   : regAdd.test(node.value.trim())?userObj.hideSpan(node): ( userObj.showSpan(node,msg3), valid = false ); break;
            case "city"      : regCity.test(node.value.trim())?userObj.hideSpan(node):( userObj.showSpan(node,msg4), valid = false ); break;   
            //case "state"     : regState.test(node.value)?userObj.hideSpan(node):(userObj.showSpan(node,msg5), valid = false ); break; 
            case "zipcode"       : regZip.test(node.value.trim())?userObj.hideSpan(node):( userObj.showSpan(node,msg6), valid = false  ); break;  
            case "phone"     : regPhone.test(node.value.trim())?userObj.hideSpan(node):(userObj.showSpan(node,msg7), valid = false ); break; 
            case "email"     : regEmail.test(node.value.trim())?userObj.hideSpan(node):(userObj.showSpan(node,msg8), valid = false ); break; 
            case "password"  : regPw.test(node.value)?userObj.hideSpan(node):(userObj.showSpan(node,msg9), valid = false ); break; 
            case "con-password"  : node.value !== "" && node.value===node.parentNode.previousElementSibling.lastElementChild.value?userObj.hideSpan(node):(userObj.showSpan(node,msg10), valid = false); break;             
         }

        return valid;
                       
}

userObj.hideSpan = function(node){
        
        var span= node.previousElementSibling.lastChild;
        span.className='';
}
    
userObj.showSpan = function(node, msg){
        
        var span = node.previousElementSibling.lastChild;
        span.className='glyphicon glyphicon-exclamation-sign myalert';
        span.setAttribute('data-content',msg);
        
}

userObj.ackMsg = function(msghead, msg, color, show){
	
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

userObj.completeCheckout = function(){
	
	var sign = userObj.validate();

	if(sign){
        
        //get the order info from localStorage
        var cart = JSON.parse(localStorage.getItem('cartItems'));
        var email = localStorage.getItem('customer-email');
        var timestamp = new Date();
       

        if(cart){
            
            var data = [];
			data = cart;
			data.push(email);
			data.push(timestamp);
					
			data = JSON.stringify(data);
			
			Ajax.sendRequest('/user/complete-checkout/',function(res){

				if(res.responseText ==='error'){
					userObj.ackMsg('Error', "There is a problem while placing your order, please contact the customer service.", 'red', true);
					setTimeout(function(){userObj.ackMsg('','','#000',false)}, 3000);
				}
				else if(res.responseText === 'success'){
                    //remove the cart and customer email from localStorage
					localStorage.removeItem('cartItems');
					localStorage.removeItem('customer-email');
                    //redirect to the final page
					window.location = '/user/thx4order';
				}
				
			}, data);

		}
		else{
			userObj.ackMsg('Attention', 'You need to put something in cart before checkout', 'green', true);
			setTimeout(function(){userObj.ackMsg('','','#000',false)}, 3000);
		}
	}	

}

userObj.customerLogin = function(){

	var password = document.getElementById('password').value.trim();
	var email = document.getElementById('email').value.trim();

	if(password == '' || email == ''){
		msg = '<p>Please fill in the blanks!</p><div id="buttons"><button type="button" class="btn btn-primary" id="okay">okay</button></div>';
		userObj.ackMsg('Error', msg, '#d34441', true);
		document.getElementById('buttons').addEventListener('click', userObj.addEvent, false);

	}
	else{

		var data = {};
		data.pw = password;
		data.email = email;

		data = JSON.stringify(data);

		/* clear the fields */
		document.forms[0].reset();

	    Ajax.sendRequest('/user/login/',function(res){
			responseArr = res.responseText.split('^^^');
			if(responseArr[0] ==='error'){
				var msg = '<p>' + responseArr[1] + '</p><div id="buttons"><button type="button" class="btn btn-primary" id="okay">okay</button></div>'
				userObj.ackMsg('Error', msg, '#d34441', true);
				document.getElementById('buttons').addEventListener('click', userObj.addEvent, false);
			}
			else if(responseArr[0] === 'success'){
				//save customer email to localStorage and login
				localStorage['customer-email'] = email;
				window.location = '/user/checkout';
			}
			
		}, data);

	}

}


/* put a '-' between every four digits */
userObj.creditCardFormat = function(evt){
	var cardNumber = evt.target.value;
	evt.target.value = evt.target.value.replace(/\s/g,'').replace(/\D/g,'').replace(/(\d{4})(?=\d)/g,"$1-");
}


userObj.logout = function(evt){
	console.log("logout");
	localStorage.removeItem('cartItems');
	localStorage.removeItem('customer-email');
}

userObj.init();
checkoutObj = {}

checkoutObj.init = function(){

	if(localStorage.getItem('cartItems')){
		window.load = checkoutObj.showCart();
	}
	if(localStorage.getItem('customer-email')){
		checkoutObj.showCustomer();
	}

}

checkoutObj.showCart = function(){

	var cart = JSON.parse(localStorage.getItem('cartItems'));
	
	var h3 = document.getElementsByTagName('header')[0].lastElementChild.firstElementChild.firstChild;
   
	var data = [];
	var amount = 0;
	if(cart){
		for(var i = 0; i < cart.length; i++){
			amount += cart[i].count;
		}
		h3.nodeValue = amount;
        data = cart;
	}
	data = JSON.stringify(data);

	Ajax.sendRequest('/user/checkout',function(res){
		        var responseArr = res.responseText.split('^^^');
				
				if(responseArr[0] === 'error'){
					console.log("there is a error showing the product");
				}
				else if (responseArr[0] === 'success'){
					//console.log("here: " + responseArr[1]);
					document.getElementById('table').innerHTML =responseArr[1];
				}
		
	}, data);
}

checkoutObj.showCustomer = function(){

	var data = localStorage.getItem('customer-email');

	Ajax.sendRequest('/user/checkout-customer',function(res){
		        
		        var responseArr = res.responseText.split('^^^');
				
				if(responseArr[0] === 'error'){
					console.log("There is an error showing the product");
				}
				else if (responseArr[0] === 'success'){
					//console.log("here: " + responseArr[1]);
					var name = responseArr[1];
					document.getElementById('name').firstElementChild.firstChild.nodeValue = responseArr[1];
					document.getElementById('address').firstElementChild.firstChild.nodeValue = responseArr[2];
					document.getElementById('location').firstElementChild.firstChild.nodeValue = responseArr[3];
					 
				}
		
	}, data);
}

checkoutObj.init();


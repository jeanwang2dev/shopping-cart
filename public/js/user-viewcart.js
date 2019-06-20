viewObj = {}

viewObj.init = function(){

	if(localStorage.getItem('cartItems')){
		window.load = viewObj.showCart();
	}

	if(document.getElementById('checkout')){
		document.getElementById('checkout').addEventListener('click', viewObj.checkout, false);
	}

}

viewObj.showCart = function(){

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

	Ajax.sendRequest('/user/viewcart',function(res){
		        var responseArr = res.responseText.split('^^^');
				
				if(responseArr[0] === 'error'){
					console.log("There is an error showing the product");
				}
				
				else if (responseArr[0] === 'success'){
					
					document.getElementById('table').innerHTML =responseArr[1];
				}
		
	}, data);
   
}

viewObj.checkout = function(){
	window.location = "/user/login";
}

viewObj.init();
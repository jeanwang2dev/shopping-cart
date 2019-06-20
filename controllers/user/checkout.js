var productModel = require('../../models').Product;
var customerModel = require('../../models').Customer;
var orderModel = require('../../models').Order;


var js = '<script src="/public/js/Ajax.js"></script>';
js += '<script src="/public/js/user-checkout.js"></script>';
js += '<script src="/public/js/user.js"></script>';

js += '<script>\n';
js += '$(document).ready(function(){\n';
js += '$(\'[data-toggle="popover"]\').popover({title: "Field Error", content:" ", trigger:"hover"}); \n';
js += '});\n';
js += '</script>';

var tContent = '';

module.exports = {

    index: function(req, res){
	   if(req.session.success){
            res.render('user/checkout',{title: 'User Home', heading:'Checkout', buyer: true, js:js});
        }
        else{
            res.redirect('/user/login/?error=1');
        }
    },

    /* show the customer info on the checkout page: name and address */
    showCustomer: function(req, res){

        var email =  req.body.data;

        customerModel.findOne({email: email}, function(err, customer){

                        if(err){
                            console.log(err);
                            res.send('error');
                        }
                        else{
                            
                          if(customer!== null){
                            var name =  customer.f_name + "  " + customer.l_name;   
                            var address = customer.address;
                            var location = customer.city + ", " + customer.state + " " + customer.zipcode;
                            res.send('success^^^' + name + "^^^" + address + "^^^" + location);
                              

                          }
                          else{
                            console.log("can't find the cumstomer!")
                            res.send('error');
                          }
                          
                         }
        });


    },

    /* save the order to the database */
    placeOrder: function(req,res){

        var data = JSON.parse(req.body.data);

        var len = data.length;
        var cart = [];
        cart = data.slice(0, len-2);

        var email = data[len-2];
        var timestamp = data[len-1];

         
        findCustomerId(email, function(id){
              
            var orderData = {};
            orderData.customerID = id;
            orderData.timestamp = timestamp;
            orderData.orderInfo = cart;
            
            var order = new orderModel(orderData);

            order.save(function(err){
                if(err){
                  res.send('error');
                }
                else {
                  res.send('success');
                }
            }); 
 
        }); 

    },

    /* show the shopping cart content */
    showCart: function(req, res){

      var tHead = '<table class="table table-bordered">'
      tHead += '<thead><tr>';
      tHead += '<th>Product Name</th>';
      tHead += '<th>Price Each</th>';
      tHead += '<th>Amount</th>';
      tHead += '<th>Total Price</th>';
      tHead += '</tr></thead>'; 
      tHead += '<tbody>';
        
      var cart = JSON.parse(req.body.data);

      if(tContent!==''){
        tContent = '';
      }

      if(cart){

          var len = cart.length;    
          var i = 0;
          var sum = 0;
          for(var j= 0; j< len; j++){
            sum += parseInt(cart[j].count) * parseFloat(cart[j].price);
          }
          sum = sum.toFixed(2);

          var tTotal = '<tr>';
          tTotal += '<td></td> <td></td> <td>Grand Total</td>';
          tTotal += '<td>$' + sum + '</td>';
          tTotal += '</tr>';
            
          loopCart(cart, i, function(){
             
             var  table = tHead + tContent + tTotal +'</tbody></table>';
              res.send('success^^^' + table); 
          });
          

      }//end if cart
      
    }

};

function findCustomerId(email, callback){

  setTimeout( function(){
     //var id;
     customerModel.findOne({email: email}, function(err, customer){

                        if(err){
                            console.log(err);      
                        }
                        else{                  
                          if(customer!== null){
                             var id = customer._id;
                             callback(id);
                          }
                         
                        }
      });
     
  }, 100);

}

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
            loopCart(cart, i, callback);}, 10);
        }
        else{
            
            callback();
        }
    },20);   
        
}

/* search for the product by the product id, get the product info and add it to the table */
function search4product(gid, pid, path, amount, docs){
    
        tContent += '<tr>';
        var total = 0;
        for( var i = 0 ; i< docs.products.length; i++){
         
            if(docs.products[i]._id == pid){   //if I use '===' it won't match, don't know why
                                        
                var pname = docs.products[i].p_name;
                var price = docs.products[i].p_price;
                var id = gid + "***" + pid;

                tContent += '<td>' + pname + '</td>';
                tContent += '<td> $' + price + '</td>';
                tContent += '<td>' + amount + '</td>';
                total = parseFloat(price) * parseFloat(amount);
                tContent += '<td> $' + total + "</td>";
             }
        }
        tContent += '</tr>';
      
}


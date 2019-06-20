/* PULL IN OUR DEPENDENCIES */
var express = require('express'),
	router = express.Router(),
	multer = require('multer');
	
	home  = require('../controllers/user/home');
	login = require('../controllers/user/login');
	viewcart = require('../controllers/user/viewcart');
	checkout = require('../controllers/user/checkout');
	thx4order = require('../controllers/user/thx4order');
	register = require('../controllers/user/register');

    ad_login = require('../controllers/user/ad-login');

	admin = require('../controllers/admin/home');
	add_product = require('../controllers/admin/add-product');
	update_product = require('../controllers/admin/update-product');
	add_pro_group = require('../controllers/admin/add-product-group');
	check_cust_order = require('../controllers/admin/check-customer-order');



module.exports = function(app){
	/*
	
	router.use(function(req, res, next){
		if (req.secure) {
			return next();
		};
		res.redirect('https://'+req.hostname+':'+app.get('port')+req.url);
		//res.redirect('http://'+req.hostname+':'+app.get('port')+req.url);
	}); */

    /* User routes */
	router.get('/user/', home.index);
	router.get('/user/viewcart/', viewcart.index);
	router.get('/user/checkout', checkout.index);
	router.get('/user/register',register.index);
	router.get('/user/login', login.index);
	router.get('/user/logout', login.logout);
	router.get('/user/thx4order', thx4order.index);

	router.post('/user/home', home.showProduct);
	router.post('/user/viewcart', viewcart.getProduct);
	router.post('/user/checkout', checkout.showCart);
	router.post('/user/checkout-customer',checkout.showCustomer);
	router.post('/user/complete-checkout',checkout.placeOrder);
	router.post('/user/register',register.saveCustomer);
	router.post('/user/login', login.access);
    
    /* Admin Login and logout */
    router.get('/user/ad-login', ad_login.index); 
	router.post('/user/ad-login', ad_login.access);
	router.get('/admin/logout', ad_login.logout);

	/* Admin routes */
    
    router.get('/admin/adminform/', admin.adminform);

    router.post('/admin/addadmin/',admin.addadmin);

	router.get('/admin/', admin.index);
	router.get('/admin/update-product', update_product.index);
	router.get('/admin/add-product-group', add_pro_group.index);//add-product-group page
	router.get('/admin/add-product', add_product.index);//add-product page
	router.get('/admin/check-customer-order', check_cust_order.index);

	router.post('/admin/update-product', update_product.showProduct);

	router.post('/admin/update-product1', update_product.updateProductForm);
	router.post('/admin/update-product2', multer({dest:'./public/upload'}).single('file'),update_product.updateProduct);

	router.post('/admin/deleteproduct', update_product.deleteProduct);
	router.post('/admin/add-product-group', add_pro_group.addGroup);

    /* Added multer to the following post because it will be doing the file uploads.*/
    router.post('/admin/add-product', multer({dest:'./public/upload'}).single('file'), add_product.addProduct);

    router.post('/admin/check-customer-order', check_cust_order.showOrder);
    router.post('/admin/check-customer-order-detail',check_cust_order.showDetail);

	app.use(router);
};
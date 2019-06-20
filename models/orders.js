var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var orderSchema = new Schema({
	customerID: String,
	timestamp: Date, 
	orderInfo: [{ 
		         pid: String, 
		         count: Number,
		         price: String } ] },
    {collection: 'orders'});

module.exports = mongoose.model('Order', orderSchema);


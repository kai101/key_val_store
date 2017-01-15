/*!
 * Key Value Store Service
 * Handling all the storing procedure.
 *
 */

var mongoose = require('mongoose');
var Objects = mongoose.model('Objects');


function store(key,val,callback){
	//assign default value
	callback = typeof callback !== "undefined" ? callback : function(){};
	
	var objects = new Objects({key: key, value: val,created_at: Math.floor(Date.now() / 1000) });
	objects.save(function(err, objects){
		callback(err, objects);
	});
}

function get(key, timestamp,callback){
	//assign default value
	callback = typeof callback !== "undefined" ? callback : function(){};
	timestamp = typeof timestamp !== "undefined" ? timestamp : null;
	
	//mongodb query
	var q = {
		key:key
	};

	if(timestamp !== null){
		q.created_at = {$lt : ++timestamp};
	}
	
	Objects.findOne(q,function(err, objects){
		callback(err, objects);
	}).sort('-created_at');

}

//export module
module.exports = {
    get: get,
    store: store
};
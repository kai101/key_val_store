var express = require('express');
var mongoose = require('mongoose');
var Objects = mongoose.model('Objects');
var KeyValueStore = require(appRoot+'/modules/KeyValueStore.js');
var router = express.Router();


router.get('/:key', function(req, res, next) {

	//validate inputs
	req.checkQuery({
		'timestamp': {
			optional: {
				options: { checkFalsy: true } // or: [{ checkFalsy: true }]
			},
			isInt: {
				errorMessage: 'Invalid timestamp.'
			}
		}
	});

	var errors = req.validationErrors();

	if (errors) {
		var error = new Error("Input errors");
			error.errors = errors;
			error.status = 400;
		return next(error);
	}
	
	
	//errors
	var timestamp = null;
	if(typeof req.query.timestamp !== "undefined"){
		// add timestamp search parameter.
		timestamp = req.query.timestamp;
	}
	
	KeyValueStore.get(req.params.key,timestamp, function(err, objects){
		if(err){
			return next(err);
		}
		
		
		if(objects) {
			res.json(objects.value);
		}else{
			// Key not found, return a 
			var error = new Error("Key not found");
			error.status = 404;
			return next(error);
		}
		
	});
});

/* POST Objects storing. */
router.post('/', function(req, res, next) {
	
	for(var attr in req.body) {
		var key = attr;
		var value = req.body[attr];
	}
	
	//input validation
	KeyValueStore.store(key,value,function(err, objects){
		if(err){ return next(err); }

		res.json(objects.value);
	});
	
	// var objects = new Objects({key: key, value: value});

	// objects.save();
});

module.exports = router;

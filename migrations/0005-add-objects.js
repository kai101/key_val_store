
var mongodb = require('mongodb');

exports.up = function(db, next){
	var objects = mongodb.Collection(db, 'objects');
	objects.createIndex({ key: 1, created_at: -1 })
    next();
};

exports.down = function(db, next){
	var objects = mongodb.Collection(db, 'objects');
	objects.dropIndex({ key: 1, created_at: -1 })
    next();
};

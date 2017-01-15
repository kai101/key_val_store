var mongoose = require('mongoose');

var ObjectsSchema = new mongoose.Schema({
  key: String,
  value: String,
  created_at: {type: Number, default: 0}
});

//compound index to speed up document searching.
ObjectsSchema.index({ key: 1, created_at: -1 });

mongoose.model('Objects', ObjectsSchema);
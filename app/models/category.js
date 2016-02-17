var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//var Bookmark = require('./bookmark.js')

var CategorySchema = new Schema({	
	title: {type : String, required: true },
	bookmarks:[
		{type: Schema.Types.ObjectId, ref:'Bookmark'}
	]
});

module.exports = mongoose.model('Category', CategorySchema);
var mongoose = require('mongoose');
//var Category = require('./category.js');
var Schema = mongoose.Schema;

var BookmarkSchema = new Schema({
	category_type : { type : String, required: true },
	bookmarks:[{
		name : { type : String, required: true },
		uri: { 
			type : String, 
			validate: {
				validator: function(v){
					var re = /^(https?:\/\/)([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
					return re.test(v);				
				},
				message:"Not a valid uri!"
			},
			required: true 
		}
	}],
	created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
});

BookmarkSchema.pre('save', function(next){
    var now = new Date();
    this.updated_at = now;
    if(!this.created_at) {
        this.created_at = now
    }
    next();
});

module.exports = mongoose.model('Bookmark', BookmarkSchema);

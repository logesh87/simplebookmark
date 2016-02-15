var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BookmarkSchema = new Schema({
	name : {type : String, required: true },
	uri: { 
		type : String, 
		validate: {
			validator: function(v){
				var re = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
				return re.test(v);				
			},
			message:"Not a valid uri!"
		},
		required: true 
	},
	created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
});

BookmarkSchema.pre('save', function(next){
    now = new Date();
    this.updated_at = now;
    if(!this.created_at) {
        this.created_at = now
    }
    next();
});

module.exports = mongoose.model('Bookmark', BookmarkSchema);

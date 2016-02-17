var mongoose = require('mongoose');
//var Bookmark = require('./models/category.js');
var Bookmark = require('./models/bookmark.js');


module.exports = function(app) {
	

	app.get('/bookmarks', function(req, res){
		var query = Bookmark.find({});
		query.exec(function(err, bookmarks){			
            if(err){            	
                res.send(err);            
            }            	
            res.json(bookmarks);
        });
	});

	app.post('/bookmark', function(req, res){
        
        var categoryName = req.body.category_type;
        
        var query = Bookmark.find({"category_type":categoryName});
        query.exec(function(err, bookmarks){
           if(err){
               console.log(err);
           }  
           
           if(bookmarks.length < 1){
                var bookmark = new Bookmark(req.body);
		
                bookmark.save(function(err){
                    if (err) {
                        res.json(err.errors);
                    }
                    res.json(req.body);
                });
           }
           console.log(bookmark);  
        });
                
		
	});

	app.put('/bookmark', function(req, res){
		Bookmark.findById(req.params.bookmark_id, function(err, bookmark){
			if (err) {
				res.send(err);
			}
			bookmark.category_type = req.body.category_type;
			bookmark.name = req.body.name;
			bookmark.uri = req.body.uri;

			bookmark.save(function(err){
				if(err){
					res.send(err);
				}

				res.json({ message: 'Bookmark updated'});
			});
		});
	});

	app.delete('/bookmark', function(req, res){
		console.log(req.body.bookmark_id);
		Bookmark.remove({
			_id:req.body.bookmark_id
		}, function(err, bookmark){
			if (err) {
				res.send(err);				
			}

			res.json({message: "Successfully deleted"});
		});
	});

	/*app.get('*', function(req, res) {
		res.sendFile(__dirname + '/public/index.html');
	});*/

};
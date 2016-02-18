var mongoose = require('mongoose');
//var Bookmark = require('./models/category.js');
var Bookmark = require('./models/bookmark.js');


module.exports = function(app) {
    
    app.get('/categories', function(req, res){
		var query = Bookmark.find({}, {category_type:1, _id:1});
		query.exec(function(err, bookmarks){			
            if(err){            	
                res.send(err);            
            }            	
            res.json(bookmarks);
        });
	});
	

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
 
        var bookmark = new Bookmark(req.body);
        bookmark.category_type = req.body.category_type;
        bookmark.bookmarks.push(req.body.bookmark);
        
        bookmark.save(function(err){
            if (err) {
                res.send(err);
            }
            res.json(req.body);
        });
           
		
	});
    
    app.put('/update_bookmark', function(req, res){
        Bookmark.update({'bookmarks._id':req.body.bookmarkId}, {'$set':{
            'bookmarks.$.name':req.body.bookmarkName,
            'bookmark.$.uri': req.body.uri
            
        }}, function(err, data){
             if(err){
                 res.send(err);
             }
             res.json(data);   
        }); 
    });

	app.put('/bookmark', function(req, res){
		
        Bookmark.findById(req.body.id, function(err, bookmark){
			if (err) {
				res.send(err);
			}
			
            bookmark.bookmarks.push(req.body.bookmark);
            
            
            //bookmark.name = req.body.name;
			//bookmark.uri = req.body.uri;

			bookmark.save(function(err){
				if(err){
					res.send(err);
				}

				res.json({ message: 'Bookmark updated'});
			});
		});
        
        
	});

	app.delete('/bookmark', function(req, res){         
         Bookmark.findByIdAndUpdate(req.body.categoryId, {
             $pull:{ 'bookmarks':{ _id: req.body.bookmarkId } }
         }, function(err, data){
             if(err){
                 res.send(err);
             }
             res.json(data);   
        }); 		
	});
    
    app.delete('/category', function(req, res){        
		Bookmark.remove({
			_id:req.body.categoryId
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
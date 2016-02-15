var mongoose = require('mongoose');
var Bookmark = require('./model.js');

module.exports = function(app) {
	app.get('/hello', function(req, res) {
		res.json({name:"hellosddd"});
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
		
		bookmark.save(function(err){
			if (err) {
				res.json(err.errors.uri.message);
			}

			res.json(req.body);
		});
	});

	app.put('/bookmark', function(req, res){
		Bookmark.findById(req.params.bookmark_id, function(err, bookmark){
			if (err) {
				res.send(err);
			}

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

	app.get('*', function(req, res) {
		res.sendFile('./public/index.html');
	});


};
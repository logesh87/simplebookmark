var mongoose = require('mongoose'),
    Bookmark = require('./models/bookmark.js'),
    User = require('./models/user.js'),
    moment = require('moment'),
    jwt = require('jwt-simple'),
    multer = require('multer'),
    fs = require('fs'),
    sizeOf = require('image-size'),
    path = require('path');
module.exports = function (app, router) {
    app.use('/', router);

    //Authentication middleware 
    function ensureAuthenticated(req, res, next) {
        if (!req.header('Authorization')) {
            return res.status(401).send({ message: 'Please make sure your request has an Authorization header.' });
        }
        var token = req.header('Authorization').split(' ')[1];

        var payload = null;
        try {
            payload = jwt.decode(token, "thisisasecret");
        } catch (err) {
            return res.status(401).send({ message: err.message });
        }

        if (payload.exp <= moment().unix()) {
            return res.status(401).send({ message: 'Token has expired' });
        }
        req.user = payload.sub;
        next();
    }

    //Generate JWT
    function createJWT(user) {
        var payload = {
            sub: user._id,
            iat: moment().unix(),
            exp: moment().add(14, 'days').unix()
        };
        return jwt.encode(payload, "thisisasecret");
    }

    //Get all categories
    router.get('/categories', function (req, res) {
        var query = Bookmark.find({}, { category_type: 1, _id: 1 });
        query.exec(function (err, bookmarks) {
            if (err) {
                res.send(err);
            }
            res.json(bookmarks);
        });
    });

    //Get all bookmarks
    router.get('/bookmarks', function (req, res) {
        var query = Bookmark.find({});
        query.exec(function (err, bookmarks) {
            if (err) {
                res.send(err);
            }
            res.json(bookmarks);
        });
    });

    //Add a new category with a bookmark
    router.post('/bookmark', ensureAuthenticated, function (req, res) {

        upload(req, res, function (err) {
            if (err) {
                console.log(err);
                return
            }

            var form = {
                body: req.body,
                file: req.file
            }

            var file = form.file;

            if (file) {
                var filename = file.filename || "";
            }

            var bookmarkCat = new Bookmark();
            bookmarkCat.category_type = req.body.category_type;

            var bookmark = {
                name: form.body.bookmarkName,
                uri: form.body.bookmarkUri,
                favicon: filename,
                resetFavicon: form.body.resetFavicon
            }
            bookmarkCat.bookmarks.push(bookmark);


            bookmarkCat.save(function (err) {
                if (err) {
                    res.send(err);
                }
                res.json(req.body);
            });

        });

    });

    router.post('/bookmark_with_cat', ensureAuthenticated, function (req, res) {

        upload(req, res, function (err) {
            if (err) {
                console.log(err);
                return
            }

            var form = {
                body: req.body,
                file: req.file
            }

            var file = form.file;

            if (file) {
                var filename = file.filename || "";
            }


            Bookmark.findById(form.body.categoryId, function (err, result) {
                console.log(result);
                if (err) {
                    res.send(err);
                }

                var bookmark = {
                    name: form.body.bookmarkName,
                    uri: form.body.bookmarkUri,
                    favicon: filename,
                    resetFavicon: form.body.resetFavicon
                }

                result.bookmarks.push(bookmark);

                result.save(function (err) {
                    if (err) {
                        res.send(err);
                    }

                    res.json({ message: 'Bookmark updated' });
                });
            });

        })



    });

    //Delete a single bookmark
    router.delete('/bookmark', ensureAuthenticated, function (req, res) {
        Bookmark.findByIdAndUpdate(req.body.categoryId, {
            $pull: { 'bookmarks': { _id: req.body.bookmarkId } }
        }, function (err, data) {
            if (err) {
                res.send(err);
            }
            res.json(data);
        });
    });

    //Delete a whole category with bookmarks
    router.delete('/category', ensureAuthenticated, function (req, res) {
        Bookmark.remove({
            _id: req.body.categoryId
        }, function (err, bookmark) {
            if (err) {
                res.send(err);
            }

            res.json({ message: "Successfully deleted" });
        });
    });


    //protected route example
    router.get('/users', ensureAuthenticated, function (req, res) {
        User.find(function (err, data) {
            var users = data.filter(function (user) {
                return user.email !== "bookmarkadmin@krds.com"
            });
            res.send(users);
        });
    });

    router.delete('/user', ensureAuthenticated, function (req, res) {

        User.findById(req.body.userId, function (err, user) {
            console.log(user);
            if (user.email == "bookmarkadmin@krds.com") {
                res.status(400);
                res.send({message:"You are not allowed to delete this user"});
            } else {
                
                User.remove({
                    _id: req.body.userId
                }, function (err, bookmark) {
                    if (err) {
                        res.send(err);
                    }

                    res.json({ message: "Successfully deleted" });
                });
            }

        });


    });

    //Login 
    router.post('/auth/login', function (req, res) {
        User.findOne({ email: req.body.email }, '+password', function (err, user) {
            if (!user) {
                return res.status(401).send({ message: 'Invalid email and/or password' });
            }
            user.comparePassword(req.body.password, function (err, isMatch) {
                if (!isMatch) {
                    return res.status(401).send({ message: 'Invalid email and/or password' });
                }
                res.send({ token: createJWT(user) });
            });
        });
    });


    //signup
    router.post('/auth/signup', function (req, res) {
        User.findOne({ email: req.body.email }, function (err, existingUser) {
            if (existingUser) {
                return res.status(409).send({ message: 'Email is already taken' });
            }

            var user = new User({
                //displayName: req.body.name,
                email: req.body.email,
                password: req.body.password
            });
            console.log(user);
            user.save(function (err, result) {
                if (err) {
                    res.status(500).send({ message: err.message });
                } else {
                    res.send({ "message": "user added successfully" });
                    //res.send({ token: createJWT(result) });    
                }


            });
        });
    });

    router.get('/image/:filename', function (req, res) {
        var file = __dirname + '/uploads/' + req.params.filename;
        var dimensions = sizeOf(file);

        fs.readFile(file, function (err, content) {
            if (err) {
                res.writeHead(400, { 'Content-type': 'text/html' })
                console.log(err);
                res.end("No such image");
            } else {
                //specify the content type in the response will be an image
                res.writeHead(200, { 'Content-type': 'image/png' });
                res.end(content);
            }
        });

    });
    
    //grabs the image and store it under app/uploads 
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, __dirname + '/uploads/')
        },
        filename: function (req, file, cb) {
            cb(null, file.fieldname + '-' + Date.now())
        }
    })

    var upload = multer({ storage: storage, limits: { fileSize: 30000, files: 1 } }).single('file');

    router.post('/updateBookmark', ensureAuthenticated, function (req, res) {

        upload(req, res, function (err) {
            if (err) {
                console.log(err);
                return
            }

            var form = {
                body: req.body,
                file: req.file
            }

            var file = form.file;

            if (file) {
                //var filepath = file.path + "." + file.mimetype.split("/")[1] || "";
                var filename = file.filename || "";
                                                               
                // fileB64 = new Buffer(fs.readFileSync(file.path)).toString("base64");
                // fs.unlink(req.file.path);
            }


            Bookmark.update({ 'bookmarks._id': form.body.bookmarkId }, {
                '$set': {
                    'bookmarks.$.name': form.body.bookmarkName,
                    'bookmarks.$.uri': form.body.bookmarkUri,
                    'bookmarks.$.favicon': filename,
                    'bookmarks.$.resetFavicon': form.body.resetFavicon
                }
            }, function (err, data) {
                if (err) {
                    res.send(err);
                }
                res.json(data);
            });

       
            // if (filedata && require('fs').statSync(filedata.path).isFile()) {
            //     return res.status(200).send('OK')
            // }
            // else {
            //     return res.status(404).send("File not found")
            // }

        });

    });

};

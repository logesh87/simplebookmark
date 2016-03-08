var mongoose = require('mongoose');
var Bookmark = require('./models/bookmark.js');
var User = require('./models/user.js');
var moment = require('moment');
var jwt = require('jwt-simple');


module.exports = function (app) {

    //Authentication middleware 
    function ensureAuthenticated(req, res, next) {
        if (!req.header('Authorization')) {
            return res.status(401).send({ message: 'Please make sure your request has an Authorization header' });
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
    app.get('/categories', function (req, res) {
        var query = Bookmark.find({}, { category_type: 1, _id: 1 });
        query.exec(function (err, bookmarks) {
            if (err) {
                res.send(err);
            }
            res.json(bookmarks);
        });
    });

    //Get all bookmarks
    app.get('/bookmarks', function (req, res) {
        var query = Bookmark.find({});
        query.exec(function (err, bookmarks) {
            if (err) {
                res.send(err);
            }
            res.json(bookmarks);
        });
    });

    //Add a new category with a bookmark
    app.post('/bookmark', ensureAuthenticated, function (req, res) {

        var bookmark = new Bookmark(req.body);
        bookmark.category_type = req.body.category_type;
        bookmark.bookmarks.push(req.body.bookmark);

        bookmark.save(function (err) {
            if (err) {
                res.send(err);
            }
            res.json(req.body);
        });

    });

    //Update a bookmark
    app.put('/update_bookmark', ensureAuthenticated, function (req, res) {
        Bookmark.update({ 'bookmarks._id': req.body.bookmarkId }, {
            '$set': {
                'bookmarks.$.name': req.body.bookmarkName,
                'bookmark.$.uri': req.body.uri

            }
        }, function (err, data) {
            if (err) {
                res.send(err);
            }
            res.json(data);
        });
    });

    //Add a bookmrk to an existing category
    app.put('/bookmark', ensureAuthenticated, function (req, res) {

        Bookmark.findById(req.body.id, function (err, bookmark) {
            if (err) {
                res.send(err);
            }

            bookmark.bookmarks.push(req.body.bookmark);

            bookmark.save(function (err) {
                if (err) {
                    res.send(err);
                }

                res.json({ message: 'Bookmark updated' });
            });
        });


    });

    //Delete a single bookmark
    app.delete('/bookmark', ensureAuthenticated, function (req, res) {
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
    app.delete('/category', ensureAuthenticated, function (req, res) {
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
    app.get('/api/me', ensureAuthenticated, function (req, res) {
        User.findById(req.user, function (err, user) {
            res.send(user);
        });
    });

    //Login 
    app.post('/auth/login', function (req, res) {
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
    app.post('/auth/signup', function (req, res) {
        User.findOne({ email: req.body.email }, function (err, existingUser) {
            if (existingUser) {
                return res.status(409).send({ message: 'Email is already taken' });
            }

            var user = new User({
                //displayName: req.body.name,
                email: req.body.email,
                password: req.body.password
            });
            user.save(function (err, result) {
                if (err) {
                    res.status(500).send({ message: err.message });
                }
                res.send({ token: createJWT(result) });
            });
        });
    });


};

var mongoose = require('mongoose');
var bcrypt 	 = require('bcryptjs');
var Schema = mongoose.Schema;


var UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, lowercase: true },
  password: { type: String, select: false }
  //displayName: String
});

UserSchema.pre('save', function(next) {
  var user = this;
  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) {
    return next();
  }
  // generate a salt
  bcrypt.genSalt(10, function(err, salt) {
    // hash the password along with our new salt
    bcrypt.hash(user.password, salt, function(err, hash) {
        
      // override the cleartext password with the hashed one
      user.password = hash;
      next();
      
    });
  });
});

UserSchema.methods.comparePassword = function(password, done) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    done(err, isMatch);
  });
};


module.exports = mongoose.model('User', UserSchema);
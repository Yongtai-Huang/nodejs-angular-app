'use strict';

const mongoose = require('mongoose');
const router = require('express').Router();
const passport = require('passport');
const User = mongoose.model('User');
const auth = require('../auth');
const multer  = require('multer');
const fs = require('fs');
const path = require('path');

// Set the storage
const storage = multer.diskStorage({
  destination: path.join(__dirname, '../..','public/upload', 'avatars')
});

// Init Upload
const upload = multer({
  storage: storage,
  limits: {fileSize: 1000000},
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
}).single('uploadFile');

// Check File Type
function checkFileType(file, cb){
  // Allowed ext
let filetypes = /jpeg|jpg|png|gif/;
  // Check ext
let extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
let mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null, true);
  } else {
    let err = new Error();
    err.code = 'filetype';
    return cb(err);
  }
}

// Get all users
router.get('/', auth.adminSuperUser, function(req, res, next) {
  User.find().then(function(users){
    return res.json({
      users: users.map(function(user){
        return user.toAuthJSON();
      })
    });
  }).catch(next);
});

// Add user's admin role
router.post('/admin/:username', auth.superUser, function(req, res, next) {
  User.findById(req.payload.id).then(function(user){
    if(!user || !user.roles.indexOf('SUPERUSER') < 0){ res.sendStatus(401); }

    User.findOne({username: req.params.username}).then(function(userData){
      if(!userData){ res.sendStatus(404); }
      // Cannot remove the user's admin role himself
      //if(!userData || userData.username === user.username){ res.sendStatus(404); }

      userData.roles.push('ADMIN');
      //userData.roles.push('SUPERUSER');

      userData.save().then( function(usr) {
        res.json({usr: usr.toAuthJSON()});
      });

    })
  }).catch(next);
});

// Remove user's admin role
router.delete('/admin/:username', auth.superUser, function(req, res, next) {
  User.findById(req.payload.id).then(function(user){
    if(!user || !user.roles.indexOf('SUPERUSER') < 0){ res.sendStatus(401); }

    User.findOne({username: req.params.username}).then(function(userData){
      if(!userData){ res.sendStatus(404); }
      // Cannot remove the user's admin role himself
      //if(!userData || userData.username === user.username){ res.sendStatus(404); }

      let ind = userData.roles.indexOf('ADMIN');
      userData.roles.splice(ind, 1);

      userData.save().then( function(usr) {
        res.json({usr: usr.toAuthJSON()});
      });

    })
  }).catch(next);
});

// Get user
router.get('/user', auth.required, function(req, res, next){
  User.findById(req.payload.id).then(function(user){
    if(!user){ res.sendStatus(401); }

    res.json({user: user.toAuthJSON()});
  }).catch(next);
});

// Create new user
router.post('/users', function(req, res, next) {
  upload(req, res, function(err) {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        //console.log('File size is too large. Max limit is 1 MB.');
        return res.status(422).json({errors: {'File size error': "File size is too large. Max limit is 1 MB."}});
      } else if (err.code === 'filetype') {
        //console.log('Filetype is invalid. Must be .png, .jpeg, .jpg. or .gif.');
        return res.status(422).json({errors: {'File type error': "File type is invalid. Must be .png, .jpeg, .jpg. or .gif."}});
      } else {
        //console.log('Fail to submit');
        return res.status(422).json({errors: {Err: "to submit."}});
      }
    } else {
      // Change the name of the uploaded file and move the file to the directory /public/upload/avatars
      let filename = '';
      if (req.file) {
        let file = req.file;
        filename = "ava" + (new Date).valueOf() + "-" + file.originalname;
        fs.rename(file.path, path.join(__dirname, '../..', 'public/upload', 'avatars', filename), function (err) {
          if (err) throw err;
        });
      }

      if (!req.body.password || !req.body.username || !req.body.email) {
        return res.status(422).json({errors: {'Requirement error': "Username, password or email cannot be blank."}});
      }

      // Find the user by email ang username to ensure email ang username are unique
      return Promise.all([
        User.find({email: req.body.email}),
        User.find({username: req.body.username})
      ]).then(function(results){
        if(results[0].length > 0) {
          return res.status(422).json({errors: {'Duplicated email error': "This email has been taken. Try 'Sign in' and 'Forgot password?' if it is your email."}});
        } else if (results[1].length > 0) {
          // If same username has been taken, generate random string and recommend new username
          // Pay attention: the uniqueness of the suggested username is not guaranteed
          let num = randomstring.generate({
            length: 2,    //??
            charset: 'numeric'
          });
          let newUsername = req.body.username + num;
          return res.status(422).json({errors: {'Duplicated username': "This username has been taken. Try: " + newUsername}});
        } else {

          let user = new User();
          user.username = req.body.username;
          user.email = req.body.email;
          user.setPassword(req.body.password);

          if (req.body.firstname) {
            user.firstname = req.body.firstname;
          }

          if (req.body.lastname) {
            user.lastname = req.body.lastname;
          }

          if (filename) {
            user.image = filename;
          }

          user.save().then( function(userData) {
            res.json({user: userData.toAuthJSON()});
          });

        }
      }).catch(next);
    }
  });

});

// Update user
router.put('/user', auth.required, function(req, res, next) {
  upload(req, res, function(err) {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        //console.log('File size is too large. Max limit is 1MB.');
        return res.status(422).json({errors: {'File size error': "File size is too large. Max limit is 1 MB."}});
      } else if (err.code === 'filetype') {
        //console.log('Filetype is invalid. Must be .png, .jpeg, .jpg. or .gif.');
        return res.status(422).json({errors: {'File type error': "File type is invalid. Must be .png, .jpeg, .jpg. or .gif."}});
      } else {
        //console.log('Fail to submit');
        return res.status(422).json({errors: {'Submit error': "Fail to submit."}});
      }
    } else {
      User.findById(req.payload.id).then(function(user) {
        if(!user){ return res.sendStatus(401); }

        // If new avatar file is uploaded or req.body.removeAvatar is true
        // get the path of the previous file
        let filePath = '';
        if ((user.image && req.file) || (req.body.removeAvatar === 'true')) {
          filePath = path.join(__dirname, '../..', 'public/upload', 'avatars', user.image);
        }

        // Change the name of the uploaded file and move the file to the directory /public/upload/avatars
        let filename = '';
        if (req.file) {
          let file = req.file;
          filename = "a" + (new Date).valueOf() + "-" + file.originalname;
          fs.rename(file.path, path.join(__dirname, '../..', 'public/upload', 'avatars', filename), function (err) {
            if (err) throw err;
          });
        }

        // Only update fields that were actually passed
        if(typeof req.body.username !== 'undefined'){
          user.username = req.body.username;
        }
        if(typeof req.body.firstname !== 'undefined'){
          user.firstname = req.body.firstname;
        }
        if(typeof req.body.lastname !== 'undefined'){
          user.lastname = req.body.lastname;
        }
        if(typeof req.body.email !== 'undefined'){
          user.email = req.body.email;
        }
        if(typeof req.body.bio !== 'undefined'){
          user.bio = req.body.bio;
        } else {
          user.bio = '';
        }

        if(req.body.removeAvatar === 'true'){
          user.image = '';
        }

        if(filename){
          user.image = filename;
        }

        if(req.body.password){
          user.setPassword(req.body.password);
        }

        // Save the change
        user.save().then( function(userData) {
          // remove previous file
          if ((filePath && filename) || (req.body.removeAvatar === 'true')) {
            fs.unlink(filePath, function(err) {
              if(err && err.code == 'ENOENT') {
                // File doens't exist
                console.info("File does not exist, will not remove it.");
              } else if (err) {
                // Other errors, e.g. maybe we don't have enough permission
                console.error("Error occurred while trying to remove avatar file");
              } else {
                console.info(`previous avatar file removed`);
              }
            });
          }

          res.json({user: userData.toAuthJSON()});
        });
      }).catch(next);
    }
  });
});

// login
router.post('/users/login', function(req, res, next) {
  upload(req, res, function(err) {
    if (err) {
      //console.log('Fail to login');
      return res.status(422).json({errors: {'Login error': "Fail to login"}});
    } else {

      if(!req.body.email) {
        return res.status(422).json({errors: {'Blank email error': "Email can't be blank"}});
      }

      if(!req.body.password) {
        return res.status(422).json({errors: {'Password missed error': "Password can't be blank"}});
      }

      passport.authenticate('local', {session: false}, function(err, user, info) {
        if(err){ return next(err); }

        if(user){
          user.token = user.generateJWT();
          return res.json({user: user.toAuthJSON()});
        } else {
          return res.status(422).json(info);
        }
      })(req, res, next);

    }
  });
});

module.exports = router;

'use strict';

const router = require('express').Router();
const mongoose = require('mongoose');
const Photo = mongoose.model('Photo');
const PhotoComment = mongoose.model('PhotoComment');
const User = mongoose.model('User');
const auth = require('../auth');

const multer  = require('multer');

const fs = require('fs');
const path = require('path');

// Fize size limit: 5 MB
const photoFileSizeLimit = 5 * Math.pow(1024, 2);
// Set the storage: image files will be stored in the folder: public/upload/photos
const photos_dir = path.join(__dirname, '../..', 'public/upload', 'photos');
const storage = multer.diskStorage({
  destination: photos_dir
});

// Init upload: one file
const upload = multer({
  storage: storage,
  limits: {fileSize: photoFileSizeLimit},
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
}).single('uploadFile');

// Check file type
function checkFileType(file, cb){
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null, true);
  } else {
    let err = new Error();
    err.code = 'filetype';
    return cb(err);
  }
}

// Rename file
function renamePhotoFile(file) {
  return new Promise(function(resolve, reject) {
    let filename = "p" + (new Date).valueOf() + "-" + file.originalname;

    fs.rename(file.path, path.join(photos_dir, filename), function(err) {
      if (err) reject(err)
      resolve(filename);
    });

  });
}

// Remove file
function removePhotoFile(filename) {
  return new Promise(function(resolve, reject) {
    fs.unlink(path.join(photos_dir, filename), function(err) {
      if(err && err.code == 'ENOENT') {
        console.info("File doesn't exist, won't remove it.");
        reject(err);
      } else if (err) {
        console.error("Error occurred while trying to remove image file");
        reject(err);
      }

      console.info(`previous image file removed`);
      resolve();
    });

  });
}

// Preload photo objects on routes with ':photo'
// The photo object: req.photo
router.param('photo', function(req, res, next, slug) {
  Photo.findOne({ slug: slug })
    .populate('createdBy')
    .then( function(photo) {
      if (!photo) { return res.sendStatus(404); }

      req.photo = photo;

      return next();
    }).catch(next);
});

// Preload photo comment on routes with ':photo-comment'
// req.photoComment
router.param('photoComment', function(req, res, next, id) {
  PhotoComment.findById(id).then(function(comment){
    if(!comment) { return res.sendStatus(404); }

    req.photoComment = comment;

    return next();
  }).catch(next);
});

// Query photos by user, upvotes or downvotes
router.get('/', auth.optional, function(req, res, next) {
  let query = {};
  // limit and offset are used for pagination
  // limit: the maxium number of photos that can be displayed on a page
  // offset: depends on the page

  let limit = 20; //default
  let offset = 0; //default

  // Set limit if provided
  if(typeof req.query.limit !== 'undefined'){
    limit = req.query.limit;
  }

  // Set offset if provided
  if(typeof req.query.offset !== 'undefined'){
    offset = req.query.offset;
  }

  // Query photos by photo tag
  if( typeof req.query.tag !== 'undefined' ){
    query.tagList = {"$in" : [req.query.tag]};
  }

  Promise.all([
    req.query.createdBy ? User.findOne({username: req.query.createdBy}) : null,
    req.query.upvoted ? User.findOne({username: req.query.upvoted}) : null,
    req.query.downvoted ? User.findOne({username: req.query.downvoted}) : null
  ]).then(function(results){
    let createdBy = results[0];
    let upvoter = results[1];
    let downvoter = results[2];

    if(createdBy){
      query.createdBy = createdBy._id;
    }

    if(upvoter){
      query._id = {$in: upvoter.photoUpvotes};
    } else if(req.query.upvoted){
      query._id = {$in: []};
    }

    if(downvoter){
      query._id = {$in: downvoter.photoDownvotes};
    } else if(req.query.downvoted){
      query._id = {$in: []};
    }

    return Promise.all([
      Photo.find(query)
        .limit(Number(limit))
        .skip(Number(offset))
        .sort({createdAt: 'desc'})
        .populate('createdBy')
        .exec(),
      Photo.count(query).exec(),
      req.payload ? User.findById(req.payload.id) : null
    ]).then(function(results){
      let photos = results[0];
      let photosCount = results[1];
      let user = results[2];

      return res.json({
        photos: photos.map(function(photo){
          return photo.toJSONFor(user);
        }),
        photosCount: photosCount
      });
    });
  }).catch(next);
});

// The photos of the users whom you are following
router.get('/feed', auth.required, function(req, res, next) {
  let limit = 20;
  let offset = 0;

  if(typeof req.query.limit !== 'undefined'){
    limit = req.query.limit;
  }

  if(typeof req.query.offset !== 'undefined'){
    offset = req.query.offset;
  }

  User.findById(req.payload.id).then(function(user){
    if (!user) { return res.sendStatus(401); }

    Promise.all([
      Photo.find({ createdBy: {$in: user.following}})
        .limit(Number(limit))
        .skip(Number(offset))
        .sort({createdAt: 'desc'})
        .populate('createdBy')
        .exec(),
      Photo.count({ createdBy: {$in: user.following}})
    ]).then(function(results){
      let photos = results[0];
      let photosCount = results[1];

      return res.json({
        photos: photos.map(function(photo){
          return photo.toJSONFor(user);
        }),
        photosCount: photosCount
      });
    }).catch(next);
  });
});

router.post('/', auth.required, function(req, res, next) {
  upload(req, res, function(err) {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        console.log('File size is too large. Max limit is 5 MB.');
        return res.status(422).json({errors: {'File size error': "File size is too large. Max limit is 5 MB."}});
      } else if (err.code === 'filetype') {
        console.log('Filetype is invalid. Must be .png, .jpeg, .jpg. or .gif.');
        return res.status(422).json({errors: {'File type error': "File type is invalid. Must be .png, .jpeg, .jpg. or .gif."}});
      } else {
        console.log('Fail to submit');
        return res.status(422).json({errors: {'Submit error': "Error to submit."}});
      }
    }

    User.findById(req.payload.id).then(function(user) {
      if (!user) { return res.sendStatus(401); }

      let photo = new Photo();
      photo.createdBy = user;

      return Promise.resolve(req.file ? renamePhotoFile(req.file) : null)
      .then(function(filename) {
        if (filename) {
          photo.image = filename;
        }

        if (req.body.title) {
          photo.title = req.body.title;
        }

        if (req.body.description) {
          photo.description = req.body.description;
        }

        if (req.body.tagList) {
          photo.tagList = JSON.parse(req.body.tagList);
        }

        if (req.body.takenAt) {
          photo.takenAt = req.body.takenAt;
        }

        return photo.save().then( function(photoData) {
          return res.json({photo: photoData.toJSONFor(user)});
        });

      });
    }).catch(next);
  });
});

// Get a photo
router.get('/:photo', auth.optional, function(req, res, next) {
  Promise.resolve(req.payload ? User.findById(req.payload.id) : null)
  .then(function(user){
    return res.json({photo: req.photo.toJSONFor(user)});
  }).catch(next);
});

// Update photo
router.put('/:photo', auth.required, function(req, res, next) {
  upload(req, res, function(err) {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        console.log('File size is too large. Max limit is 5 MB.');
        return res.status(422).json({errors: {'File size error': "File size is too large. Max limit is 5 MB."}});
      } else if (err.code === 'filetype') {
        console.log('Filetype is invalid. Must be .png, .jpeg, .jpg. or .gif.');
        return res.status(422).json({errors: {'File type error': "File type is invalid. Must be .png, .jpeg, .jpg. or .gif."}});
      } else {
        console.log('Fail to submit');
        return res.status(422).json({errors: {'Submit error': "Error to submit."}});
      }
    }

    User.findById(req.payload.id).then(function(user) {
      if(!user || photoData.createdBy._id.toString() !== req.payload.id.toString()) {
        return res.sendStatus(403);
      }

      let updatedPhoto = req.photo;

      if(typeof req.body.title !== 'undefined'){
        updatedPhoto.title = req.body.title;
      }

      if(typeof req.body.description !== 'undefined'){
        updatedPhoto.description = req.body.description;
      }

      if (typeof req.body.tagList !== 'undefined') {
        updatedPhoto.tagList = JSON.parse(req.body.tagList);
      }

      if (typeof req.body.takenAt !== 'undefined') {
        updatedPhoto.takenAt = req.body.takenAt;
      }

      // Remove revious file and rename the newly uploaded file
      return Promise.all([
        req.file ? renamePhotoFile(req.file) : null,
        req.file && req.photo.image ? removePhotoFile(req.photo.image) : null
      ]).then(function(results){
        let filename = results[0];

        if (filename) {
          updatedPhoto.image = filename;
        }

        return updatedPhoto.save().then( function(photo) {
          return res.json({photo: photo.toJSONFor(user)});
        });

      });
    }).catch(next);
  });
});

// Delete photo
router.delete('/:photo', auth.required, function(req, res, next) {
  const photoId = req.photo._id;
  User.findById(req.payload.id).then(function(user) {
    if(!user || req.photo.createdBy._id.toString() !== req.payload.id.toString()){
      return res.sendStatus(401);
    }

    // Remove photo and file
    return Promise.all([
      req.photo.remove(),
      req.photo.image ? removePhotoFile(req.photo.image) : null
    ]).then(function() {
      // Update photo upvotes and downvotes
      return User.update( {photoUpvotes: {$in: [photoId]}}, {$pull: {photoUpvotes: photoId}}, { safe: true }, function(err) {
        if(err) {
          console.error("Error occurred while removing photo upvotes");
          return res.sendStatus(403);
        }
        return User.update( {photoDownvotes: {$in: [photoId]}}, {$pull: {photoDownvotes: photoId}}, { safe: true }, function(err) {
          if(err) {
            console.error("Error occurred while removing photo downvotes");
            return res.sendStatus(403);
          }
          return res.sendStatus(204);
        });
      });
    });
  }).catch(next);
});

// Upvote an photo
router.post('/:photo/upvote', auth.required, function(req, res, next) {
  const photoId = req.photo._id;

  User.findById(req.payload.id).then(function(user){
    if (!user || user._id.toString() === req.photo.createdBy._id.toString()) {
      return res.status(401).json({errors: {'Unauthorized error': "You are not allowed to upvote this photo."}});
    }

    if (user.photoUpvotes.indexOf(photoId) > -1) {
      return res.sendStatus(400);
    }
    user.photoUpvotes.push(photoId);

    let ind = user.photoDownvotes.indexOf(photoId);
    if (ind > -1) {
      user.photoDownvotes.splice(ind, 1);
    }

    return user.save().then( function(userData){
      return req.photo.updateUpDownvoteCount().then( function(photo){
        return res.json({photo: photo.toJSONFor(userData)});
      });
    });

  }).catch(next);
});

// Downvote an photo
router.post('/:photo/downvote', auth.required, function(req, res, next) {
  const photoId = req.photo._id;

  User.findById(req.payload.id).then(function(user){

    if (!user || user._id.toString() === req.photo.createdBy._id.toString()) {
      return res.status(401).json({errors: {'Unauthorized error': "You are not allowed to downvote this photo."}});
    }

    if (user.photoDownvotes.indexOf(photoId) > -1) {
      return res.sendStatus(400);
    }
    user.photoDownvotes.push(photoId);

    let ind = user.photoUpvotes.indexOf(photoId);
    if (ind > -1) {
      user.photoUpvotes.splice(ind, 1);
    }

    return user.save().then( function(userData){
      return req.photo.updateUpDownvoteCount().then(function(photo){
        return res.json({photo: photo.toJSONFor(userData)});
      });
    });

  }).catch(next);
});

// Cancle upvote an photo
router.delete('/:photo/upvote', auth.required, function(req, res, next) {
  const photoId = req.photo._id;

  User.findById(req.payload.id).then(function(user){

    if (!user || user._id.toString() === req.photo.createdBy._id.toString()) {
      return res.status(401).json({errors: {'Unauthorized error': "You are not allowed to cancel the upvote on this photo."}});
    }

    let ind = user.photoUpvotes.indexOf(photoId);
    if ( ind < 0) {
      return res.sendStatus(404);
    }
    user.photoUpvotes.splice(ind, 1);

    return user.save().then( function(userData) {
      return req.photo.updateUpvoteCount().then(function(photo){
        return res.json({photo: photo.toJSONFor(userData)});
      });
    });

  }).catch(next);
});

// Cancel downvote on photo
router.delete('/:photo/downvote', auth.required, function(req, res, next) {
  const photoId = req.photo._id;

  User.findById(req.payload.id).then(function(user){

    if (!user || user._id.toString() === req.photo.createdBy._id.toString()) {
      return res.status(401).json({errors: {'Unauthorized error': "You are not allowed to cancel the downvote on this photo."}});
    }

    let ind = user.photoDownvotes.indexOf(photoId);
    if (ind < 0) {
      return res.sendStatus(404);
    }
    user.photoDownvotes.splice(ind, 1);

    return user.save().then( function(userData){
      return req.photo.updateDownvoteCount().then(function(photo){
        return res.json({photo: photo.toJSONFor(userData)});
      });
    });

  }).catch(next);
});

// Return an photo's comments
router.get('/:photo/photoComments', auth.optional, function(req, res, next){
  Promise.resolve(req.payload ? User.findById(req.payload.id) : null).then(function(user) {
    return req.photo.populate({
      path: 'photoComments',
      populate: { path: 'author' },
      options: { sort: { createdAt: 'desc' } }
    }).execPopulate().then(function(photo) {
      return res.json({photoComments: req.photo.photoComments.map( function(photoComment) {
        return photoComment.toJSONFor(user);
      })});
    });
  }).catch(next);
});

// Create a new comment on a photo
router.post('/:photo/photoComments', auth.required, function(req, res, next) {
  User.findById(req.payload.id).then(function(user){
    if(!user){ return res.sendStatus(401); }

    let photoComment = new PhotoComment(req.body.photoComment);
    photoComment.photo = req.photo;
    photoComment.author = user;

    return photoComment.save().then(function(){
      req.photo.photoComments.push(photoComment);

      return req.photo.save().then(function(photo) {
        res.json({photoComment: photoComment.toJSONFor(user)});
      });

    });
  }).catch(next);
});

// Remove a comment
router.delete('/:photo/photoComments/:photoComment', auth.required, function(req, res, next) {
  if(req.photoComment.author.toString() !== req.payload.id.toString()){
    return res.sendStatus(401);
  }

  req.photo.photoComments.remove(req.photoComment._id);

  req.photo.save()
  .then(PhotoComment.find({_id: req.photoComment._id}).remove().exec())
  .then(function(){
    return res.sendStatus(204);
  }).catch(next);
});

module.exports = router;

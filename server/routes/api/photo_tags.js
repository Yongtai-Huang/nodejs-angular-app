'use strict';

const router = require('express').Router();
const mongoose = require('mongoose');
const Photo = mongoose.model('Photo');

// Return a list of tags
router.get('/', function(req, res, next) {
  Photo.find()
  .distinct('tagList')
  .then(function(tags){
    return res.json({tags: tags.sort()});
  }).catch(next);
});

// Return a list of tags of the photos that have location info
// router.get('/mapPhotoTags', function(req, res, next) {
//   Photo.find({$and: [{latitude: {$exists: true}}, {longitude: {$exists: true}}]})
//   .distinct('tagList')
//   .then(function(tags){
//     return res.json({tags: tags.sort()});
//   }).catch(next);
// });

module.exports = router;

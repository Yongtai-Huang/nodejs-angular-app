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

module.exports = router;

'use strict';

const router = require('express').Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const auth = require('../auth');

// Preload user profile on routes with ':username'
router.param('username', function(req, res, next, username){
  User.findOne({username: username}).then(function(user){
    if (!user) { return res.sendStatus(404); }

    req.profile = user;

    return next();
  }).catch(next);
});

// Get profile by username
router.get('/:username', auth.optional, function(req, res, next){
  if(req.payload){
    User.findById(req.payload.id).then(function(user){
      if(!user){ return res.json({profile: req.profile.toProfileJSONFor(false)}); }

      return res.json({profile: req.profile.toProfileJSONFor(user)});
    });
  } else {
    return res.json({profile: req.profile.toProfileJSONFor(false)});
  }
});

// Follow the user: username
router.post('/:username/follow', auth.required, function(req, res, next){
  const profileId = req.profile._id;

  User.findById(req.payload.id).then(function(user){
    if (!user || user._id.toString() === req.profile._id.toString()) {
      return res.status(401).json({errors: {'Unauthorized error': "You are not allowed to follow the user."}});
    }

    return user.follow(profileId).then(function(){
      return res.json({profile: req.profile.toProfileJSONFor(user)});
    });
  }).catch(next);
});

// Unfollow the user: username
router.delete('/:username/follow', auth.required, function(req, res, next){
  const profileId = req.profile._id;

  User.findById(req.payload.id).then(function(user){
    if (!user || user._id.toString() === req.profile._id.toString()) {
      return res.status(401).json({errors: {'Unauthorized error': "You are not allowed to unfollow the user."}});
    }

    return user.unfollow(profileId).then(function(){
      return res.json({profile: req.profile.toProfileJSONFor(user)});
    });
  }).catch(next);
});

module.exports = router;

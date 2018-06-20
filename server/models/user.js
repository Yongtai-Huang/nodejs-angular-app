'use strict';

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const secret = require('../config/settings').secret;

const UserSchema = new mongoose.Schema({
  username: {type: String, unique: true,
    required: [true, "can't be blank"],
    match: [/^[a-zA-Z0-9]+$/, 'is invalid'], index: true},
  firstname: String,
  lastname: String,
  email: {type: String, lowercase: true, unique: true,
    required: [true, "can't be blank"],
    match: [/\S+@\S+\.\S+/, 'is invalid'], index: true},
  bio: String,
  image: String,
  //articleUpvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Article' }],
  //articleDownvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Article' }],
  photoUpvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Photo' }],
  photoDownvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Photo' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  hash: String,
  salt: String  //,
  // code: String   // For account restoration
}, {timestamps: true});

UserSchema.plugin(uniqueValidator, {message: 'is already taken.'});

UserSchema.methods.validPassword = function(password) {
  let hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  return this.hash === hash;
};

UserSchema.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

// Generate token
UserSchema.methods.generateJWT = function() {
  let today = new Date();
  let exp = new Date(today);
  exp.setDate(today.getDate() + 60);  //??

  return jwt.sign({
    id: this._id,
    username: this.username,
    exp: parseInt(exp.getTime() / 1000),
  }, secret);
};

// User in json
UserSchema.methods.toAuthJSON = function(){
  return {
    username: this.username,
    email: this.email,
    token: this.generateJWT(),
    bio: this.bio,
    image: this.image
  };
};

// Profile in json
// user: the "user" that get the profile of "this" user
UserSchema.methods.toProfileJSONFor = function(user){
  return {
    username: this.username,
    firstname: this.firstname,
    lastname: this.lastname,
    bio: this.bio,
    image: this.image,  // || 'smiley-cyrus.jpg', //?? hyt
    following: user ? user.isFollowing(this._id) : false  // the "user" is following "this" user or not
  };
};

// Already upvoted the article (id: article._id) or not
UserSchema.methods.isArticleUpvote = function(id){
  return this.articleUpvotes.some(function(articleUpvoteId){
    return articleUpvoteId.toString() === id.toString();
  });
};

// Already downvoted the article (id: article._id) or not
UserSchema.methods.isArticleDownvote = function(id){
  return this.articleDownvotes.some(function(articleDownvoteId){
    return articleDownvoteId.toString() === id.toString();
  });
};

// Already upvoted the photo (id: photo._id) or not
UserSchema.methods.isPhotoUpvote = function(id){
  return this.photoUpvotes.some(function(photoUpvoteId){
    return photoUpvoteId.toString() === id.toString();
  });
};

// Already downpvoted the photo (id: photo._id) or not
UserSchema.methods.isPhotoDownvote = function(id){
  return this.photoDownvotes.some(function(photoDownvoteId){
    return photoDownvoteId.toString() === id.toString();
  });
};

// Follow the user (id: user._id) or not
UserSchema.methods.follow = function(id){
  if(this.following.indexOf(id) === -1){
    this.following.push(id);
  }
  return this.save();
};

// Unfollow the user (id: user._id) or not
UserSchema.methods.unfollow = function(id){
  if(this.following.indexOf(id) > -1){
    this.following.remove(id);
  }
  return this.save();
};

// Is following the user (id: user._id) or not
UserSchema.methods.isFollowing = function(id){
  return this.following.some(function(followId){
    return followId.toString() === id.toString();
  });
};

mongoose.model('User', UserSchema);

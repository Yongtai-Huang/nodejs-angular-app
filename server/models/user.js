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
  photoUpvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Photo' }],
  photoDownvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Photo' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  followersCount: {type: Number, min: 0, default: 0},
  hash: String,
  salt: String,
  roles: [{type: String, default: ["USER"], enum: ["SUPERADMIN", "ADMIN", "USER"]}],
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
  exp.setDate(today.getDate() + 60);  // ?? To change

  return jwt.sign({
    id: this._id,
    username: this.username,
    admin: this.isAdmin(),
    superAdmin: this.isSuperAdmin(),
    exp: parseInt(exp.getTime() / 1000),
  }, secret);
};

// User in json
UserSchema.methods.toAuthJSON = function(){
  return {
    username: this.username,
    firstname: this.firstname,
    lastname: this.lastname,
    email: this.email,
    admin: this.isAdmin(),
    superAdmin: this.isSuperAdmin(),
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
    image: this.image,
    // the "user" is following "this" user or not
    following: user ? user.isFollowing(this._id) : false,
    // is your profile or other user's
    yourself: user ? user._id.toString() === this._id.toString() : false,
    followersCount: this.followersCount,
    createdAt: this.createdAt
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

// Follow the user (id: user._id)
UserSchema.methods.follow = function(id){
  if(this.following.indexOf(id) === -1){
    this.following.push(id);
  }
  return this.save();
};

// Unfollow the user (id: user._id)
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

// Is an administor or not
UserSchema.methods.isAdmin = function(){
  return this.roles.indexOf("ADMIN") > -1;
};

// Is a super administor or not
UserSchema.methods.isSuperAdmin = function(){
  return this.roles.indexOf("SUPERADMIN") > -1;
};

mongoose.model('User', UserSchema);

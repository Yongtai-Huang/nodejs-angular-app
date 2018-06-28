'use strict';

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const slug = require('slug');
const User = mongoose.model('User');
const PhotoComment = mongoose.model('PhotoComment');

const PhotoSchema = new mongoose.Schema({
  slug: {type: String, lowercase: true, unique: true},
  image: String,
  title: String,
  description: String,
  upvotesCount: {type: Number, default: 0},
  downvotesCount: {type: Number, default: 0},
  photoComments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PhotoComment' }], //pcomments => comments ??
  tagList: [{ type: String }],
  takenBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  takenAt: Date
}, {timestamps: true});

PhotoSchema.plugin(uniqueValidator, {message: 'is already taken'});

PhotoSchema.pre('validate', function(next){
  if(!this.slug)  {
    this.slugify();
  }
  next();
});

// Remove the comments on the photo that has already been removed
PhotoSchema.post('remove', function(next){
  let photo = this;
  return PhotoComment.remove({photo: photo._id}, function(err) {
    if (err) {
      console.error("Error occurred while trying to remove photo comments");
      return res.sendStatus(403);
    }
  });
});

PhotoSchema.methods.slugify = function() {
  this.slug = slug(this.title) + '-' + (Math.random() * Math.pow(36, 6) | 0).toString(36);
};

// Update the number of upvotes on the photo
PhotoSchema.methods.updateUpvoteCount = function() {
  let photo = this;
  return User.count({photoUpvotes: {$in: [photo._id]}}).then(function(count){
    photo.upvotesCount = count;
    return photo.save();
  });
};

// Update the number of downvotes on the photo
PhotoSchema.methods.updateDownvoteCount = function() {
  let photo = this;
  return User.count({photoDownvotes: {$in: [photo._id]}}).then(function(count){
    photo.downvotesCount = count;
    return photo.save();
  });
};

// When a user change has vote from upvote to downvote, or from downvote to upvote,
// both the numbers of upvotes and downvotes need to be updated
PhotoSchema.methods.updateUpDownvoteCount = function() {
  let photo = this;
  return User.count({photoUpvotes: {$in: [photo._id]}}).then(function(countUp){
    photo.upvotesCount = countUp;
    return User.count({photoDownvotes: {$in: [photo._id]}}).then(function(countDown){
      photo.downvotesCount = countDown;
      return photo.save();
    });
  });
};

// Return the photo object to user in json
// user: the user retrieve the photo
PhotoSchema.methods.toJSONFor = function(user){
  return {
    slug: this.slug,
    image: this.image,
    title: this.title,
    description: this.description,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    upvotesCount: this.upvotesCount,
    downvotesCount: this.downvotesCount,
    upvoted: user ? user.isPhotoUpvote(this._id) : false, // The user has already upvote the photo or not
    downvoted: user ? user.isPhotoDownvote(this._id) : false,
    tagList: this.tagList,
    takenBy: this.takenBy.toProfileJSONFor(user), // The profile of the person that took the photo
    takenAt: this.takenAt
  };
};

mongoose.model('Photo', PhotoSchema);

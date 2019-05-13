'use strict';

const mongoose = require('mongoose');

const PhotoCommentSchema = new mongoose.Schema({
  body: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  photo: { type: mongoose.Schema.Types.ObjectId, ref: 'Photo' }
}, {timestamps: true});

// Photo comment in json
PhotoCommentSchema.methods.toJSONFor = function(user){
  return {
    id: this._id,
    body: this.body,
    createdAt: this.createdAt,
    // Profile of the comment author
    author: this.author.toProfileJSONFor(user)
  };
};

mongoose.model('PhotoComment', PhotoCommentSchema);

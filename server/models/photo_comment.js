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
    author: this.author.toProfileJSONFor(user)  // Profile of the author
  };
};

mongoose.model('PhotoComment', PhotoCommentSchema);

'use strict';

module.exports = {
  // Used to generate and verify jwt
  secret: process.env.NODE_ENV === 'production' ? process.env.SECRET : 'NoOneKnows',
};

'use strict';

const jwt = require('express-jwt');
const jsonwebtoken = require('jsonwebtoken');
const secret = require('../config/settings').secret;

// Logged-in user
function getTokenFromHeader(req){
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token' ||
      req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {

    return req.headers.authorization.split(' ')[1];
  }
  
  return null;
}

// User with a super admin role
function getTokenFromHeaderWithSuperAdmin(req){
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token' ||
    req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {

    let token = req.headers.authorization.split(' ')[1];
    return jsonwebtoken.verify(token, secret, (err, decoded) => {

      if (err) {
        res.status(401).json({errors: {'Auth err': "Failed to authenticate."}});
      } else {
        if (decoded['superAdmin']) {
          return token;
        } else {
          return null;
        }
      }

    });

  }

  return null;
}

// User with an admin or superuser role
function getTokenFromHeaderWithAdminSuperAdmin(req){
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token' ||
      req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {

    let token = req.headers.authorization.split(' ')[1];
    return jsonwebtoken.verify(token, secret, (err, decoded) => {
      if (err) {
        res.status(401).json({errors: {'Auth err': "Failed to authenticate."}});
      } else {
        if (decoded['admin'] || decoded['superAdmin']) {
          return token;
        } else {
          return null;
        }

      }
    });

  }

  return null;
}

const auth = {
  required: jwt({
    secret: secret,
    userProperty: 'payload',
    getToken: getTokenFromHeader
  }),
  optional: jwt({
    secret: secret,
    userProperty: 'payload',
    credentialsRequired: false,
    getToken: getTokenFromHeader
  }),
  superAdmin: jwt({
    secret: secret,
    userProperty: 'payload',
    getToken: getTokenFromHeaderWithSuperAdmin
  }),
  adminSuperAdmin: jwt({
    secret: secret,
    userProperty: 'payload',
    getToken: getTokenFromHeaderWithAdminSuperAdmin
  })
};

module.exports = auth;

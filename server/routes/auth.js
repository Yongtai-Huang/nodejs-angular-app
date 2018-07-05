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

// User with admin role
// function getTokenFromHeaderWithAdmin(req){
//   if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token' ||
//       req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
//
//     let token = req.headers.authorization.split(' ')[1];
//     return jsonwebtoken.verify(token, secret, (err, decoded) => {
//       if (err) {
//         res.status(401).json({errors: {'Auth err': "Failed to authenticate."}});
//       } else {
//         if (decoded['admin']) {
//           return token;
//         } else {
//           return null;
//         }
//
//       }
//     });
//
//   }
//
//   return null;
// }

// User with super user role
function getTokenFromHeaderWithSuperUser(req){
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token' ||
      req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {

    let token = req.headers.authorization.split(' ')[1];
    return jsonwebtoken.verify(token, secret, (err, decoded) => {

      if (err) {
        res.status(401).json({errors: {'Auth err': "Failed to authenticate."}});
      } else {
        if (decoded['superUser']) {
          return token;
        } else {
          return null;
        }
      }

    });

  }

  return null;
}

// User with admin or superuser role
function getTokenFromHeaderWithAdminSuperUser(req){
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token' ||
      req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {

    let token = req.headers.authorization.split(' ')[1];
    return jsonwebtoken.verify(token, secret, (err, decoded) => {
      if (err) {
        res.status(401).json({errors: {'Auth err': "Failed to authenticate."}});
      } else {
        //console.log("auth decoded: " + JSON.stringify(decoded));
        if (decoded['admin'] || decoded['superUser']) {
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
  // admin: jwt({
  //   secret: secret,
  //   userProperty: 'payload',
  //   getToken: getTokenFromHeaderWithAdmin
  // }),
  superUser: jwt({
    secret: secret,
    userProperty: 'payload',
    getToken: getTokenFromHeaderWithSuperUser
  }),
  adminSuperUser: jwt({
    secret: secret,
    userProperty: 'payload',
    getToken: getTokenFromHeaderWithAdminSuperUser
  })
};

module.exports = auth;

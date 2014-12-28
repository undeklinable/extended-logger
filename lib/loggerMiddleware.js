'use strict';

var uuid = require('node-uuid');
var createNamespace = require('continuation-local-storage').createNamespace;
var requestIdentifier = createNamespace('requestIdentifier');

var _reqID = 0;
var _idGenerator = setConsecutiveID;
var _enabled = true;

function enable() {
  _enabled = true;
}

function disable() {
  _enabled = false;
}

function setConsecutiveID() {
  _reqID = 0;
 _idGenerator = function() {
   ++_reqID;
 }
}

function setRandomId() {
  _idGenerator = function() {
    _reqID = uuid.v1();
  }
}

function getRequestId() {
  return (requestIdentifier.get('requestID') || '');
};

function reqIdMiddleware(req, res, next) {
  if (!_enabled) {
    return next();
  }

  _idGenerator();

  requestIdentifier.run(function() {
    requestIdentifier.set('requestID', _reqID);
    next();
  });
}

exports.reqIdMiddleware = reqIdMiddleware;
exports.setConsecutiveID = setConsecutiveID;
exports.setRandomId = setRandomId;

exports.getRequestId = getRequestId;
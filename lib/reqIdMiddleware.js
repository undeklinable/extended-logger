'use strict';

var uuid = require('node-uuid');
var createNamespace = require('continuation-local-storage').createNamespace;
var requestIdentifier = createNamespace('requestIdentifier');

var _reqID = 0;
var _idGenerator = null;
var _enabled = true;

var reqIdMiddleware = exports;

reqIdMiddleware.enable = function() {
  _enabled = true;
};

reqIdMiddleware.disable = function() {
  _enabled = false;
};

reqIdMiddleware.setConsecutiveID = function() {
  _reqID = 0;
 _idGenerator = function() {
   ++_reqID;
 };
};

reqIdMiddleware.setRandomId = function() {
  _idGenerator = function() {
    _reqID = uuid.v1();
  };
};

reqIdMiddleware.getRequestId = function() {
  return (requestIdentifier.get('requestID') || '');
};

reqIdMiddleware.reqIdMiddleware = function(req, res, next) {
  if (!_enabled) {
    return next();
  }

  _idGenerator();

  requestIdentifier.run(function() {
    requestIdentifier.set('requestID', _reqID);
    next();
  });
};

_idGenerator = reqIdMiddleware.setConsecutiveID;
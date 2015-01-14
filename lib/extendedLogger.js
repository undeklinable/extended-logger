'use strict';

var util = require('util');
var path = require('path');

var loggerMiddleware = require('./loggerMiddleware');
var _moduleId;
var _displayConf;

function _getModuleId() {
  return '[' + _moduleId + ']';
}

function _getReqId() {
  return '[' + loggerMiddleware.getRequestId() + ']';
}

function _getPid() {
  return '[' + process.pid + ']';
}

var _displayFuncs = {
  moduleId: _getModuleId,
  reqId: _getReqId,
  pid: _getPid
};

function _addExtraInfo() {
  var data = '';

  if (_displayConf && _displayConf.length > 0) {
    for (var i = 0; i < _displayConf.length; i++) {
      data += _displayFuncs[_displayConf[i]]();
    }

    data += ': ';
  }

  return data;
}

exports.extendWinston = function(winston, displayConf) {
  _displayConf = displayConf || Object.keys(_displayFuncs);
  
  winston.Logger.prototype._baseLog = winston.Logger.prototype.log;
  winston.Logger.prototype.log = function (level) {
    var args = Array.prototype.slice.call(arguments, 1);

    while(args[args.length - 1] === null) {
      args.pop();
    }

    var callback = typeof args[args.length - 1] === 'function' ? args.pop() : null;
    var meta     = typeof args[args.length - 1] === 'object' ? args.pop() : {};
    var msg      = util.format.apply(null, args);

    msg = _addExtraInfo() + msg;
    this._baseLog(level, msg, meta, callback);
  };
};

exports.configure = function(moduleId) {
  _moduleId = moduleId || path.basename(__filename);
};

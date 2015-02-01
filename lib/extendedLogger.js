'use strict';

var util = require('util');
var path = require('path');
var winston = require('winston');

var loggerMiddleware = require('./loggerMiddleware');

var defaultLogger = new winston.Logger({
  transports: [new winston.transports.Console()]
});

var winstonRelPath = require.resolve('winston');
var winstonAbsPath = path.dirname(winstonRelPath);

function _getModuleId(moduleId) {
  return '[' + moduleId + ']';
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

function _addExtraInfo(displayConf, moduleId) {
  var data = '';

  if (displayConf && displayConf.length > 0) {
    for (var i = 0; i < displayConf.length; i++) {
      data += _displayFuncs[displayConf[i]](moduleId);
    }

    data += ': ';
  }

  return data;
}

winston.Logger.prototype._baseLog = winston.Logger.prototype.log;

module.exports = function (moduleId, displayConf) {
  var  _moduleId = moduleId || path.basename(__filename);
  var extendedInterface = {};
  var _displayConf;

  _displayConf = displayConf || Object.keys(_displayFuncs);

  delete require.cache[winstonAbsPath + '/winston/logger.js'];
  var Logger = require(winstonAbsPath + '/winston/logger.js').Logger;

  Object.getOwnPropertyNames(winston).forEach(function(winstonProp) {
    extendedInterface[winstonProp] = winston[winstonProp];
  });

  extendedInterface.Logger = Logger;
  extendedInterface.Logger.prototype._baseLog = extendedInterface.Logger.prototype.log;

  extendedInterface.Logger.prototype.log = function (level) {
    var args = Array.prototype.slice.call(arguments, 1);

    while(args[args.length - 1] === null) {
      args.pop();
    }

    var callback = typeof args[args.length - 1] === 'function' ? args.pop() : null;
    var meta     = typeof args[args.length - 1] === 'object' ? args.pop() : {};
    var msg      = util.format.apply(null, args);

    msg = _addExtraInfo(_displayConf, _moduleId) + msg;
    this._baseLog(level, msg, meta, callback);
  };

  Object.keys(defaultLogger.levels).forEach(function(winstonProp) {
    extendedInterface['_' + winstonProp] = extendedInterface[winstonProp];
    extendedInterface[winstonProp] = function () {
      var args = Array.prototype.slice.call(arguments, 0);
      args[0] = _addExtraInfo(_displayConf, _moduleId) + args[0];
      extendedInterface['_' + winstonProp].apply(extendedInterface, args);
    };
  });

  return extendedInterface;

};

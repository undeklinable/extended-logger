'use strict';

var config = require('config');
var nodemailer = require('nodemailer');
var config = require('config');

function Mailer() {
  this.transport = nodemailer.createTransport('SES', {
    AWSAccessKeyID: config.email.AccessKey,
    AWSSecretKey: config.email.SecretKey
  });
}

Mailer.prototype.send = function(destination, subject, content) {
  this.transport.sendMail({
    from:'',
    to: destination,
    subject: subject,
    html: content
  }, function(p1,p2) {
    console.log(p1, p2);
  });
};

Mailer.prototype.sendPlain = function(destination, subject, content) {
  this.transport.sendMail({
    from:'',
    to: destination,
    subject: subject,
    text: content
  }, function(p1, p2) {
    console.log(p1, p2);
  });
};

module.exports = Mailer;
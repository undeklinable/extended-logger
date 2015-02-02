'use strict';

var nodemailer = require('nodemailer');

function Mailer(accessKey, secretKey) {
  this.transport = nodemailer.createTransport('SES', {
    AWSAccessKeyID: accessKey,
    AWSSecretKey: secretKey
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
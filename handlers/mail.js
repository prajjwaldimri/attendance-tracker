const fs = require('fs');
const { promisify } = require('util');
const Handlebars = require('handlebars');
const htmlToText = require('html-to-text');
let apiKey = process.env.MAILGUN_API_KEY;
let domain = process.env.MAILGUN_DOMAIN;
var mailgun = require('mailgun-js')({ apiKey: apiKey, domain: domain });

exports.send = options => {
  const readFile = promisify(fs.readFile);

  readFile('./src/templates/forgetEmailTemplate.hbs').then(hbs => {
    let template = Handlebars.compile(hbs.toString());
    let templateData = { reset_password_url: options.resetURL };
    let html = template(templateData);

    const text = htmlToText.fromString(html);

    var data = {
      from: `Artist-Tracker <noreply@artisttracker.com>`,
      to: options.user.email,
      subject: options.subject,
      html: html,
      text
    };

    mailgun.messages().send(data, function (error, body) {
      if (error) console.log(error);
      console.log(body);
    });
  });
};

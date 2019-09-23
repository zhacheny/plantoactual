import { Tasks, Partnumber, Taskworktime, Plan } from '/lib/collections.js';

Meteor.startup(function() {
	// process.env['MONGO_URL'] = "mongodb://localhost/myDb";
	//SMTP setup
  smtp = {
    username: 'chenyu.zhang@legrand.us',
    password: 'A6!mst!2',
    server: 'smtp.outlook.com',
    port: 587
  }
  process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' + smtp.port;
});
//     Taskworktime.update({},{$set: {plantoactual: "XX"}}, {multi: true});
import { Tasks, Partnumber, Taskworktime, Plan } from '/lib/collections.js';

Meteor.startup(function() {
	// process.env['MONGO_URL'] = "mongodb://localhost/myDb";
});
//     Taskworktime.update({},{$set: {plantoactual: "XX"}}, {multi: true});
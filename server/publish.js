import { Tasks, Partnumber, Taskworktime, Cell, Plan, Operator } from '/lib/collections.js';
//publish all user
Meteor.publish('allUsers', function(){
	//security
	if(Roles.userIsInRole(this.userId, 'admin')){
		return Meteor.users.find({});
	}
	// return Meteor.users.find({});
});

//publish task
Meteor.publish('task', function(){

	return Tasks.find({});
});

//publish partnumber
Meteor.publish('partnumber', function(){

	return Partnumber.find({});
});

//publish partnumber
Meteor.publish('taskworktime', function(){

	return Taskworktime.find({});
});

Meteor.publish('cell', function(){
	return Cell.find({});
});

Meteor.publish('plan', function(){
	return Plan.find({});
});

Meteor.publish('operator', function(){
	return Operator.find({});
});
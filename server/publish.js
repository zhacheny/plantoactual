import { Tasks, Partnumber, Taskworktime, Cell, Plan, Operator, EarnedTimePP,Anouncements,
		Safetymessage, Department, Menu } from '/lib/collections.js';
//publish all user
Meteor.publish('allUsers', function(){
	//security
	if(Roles.userIsInRole(this.userId, 'admin')){
		return Meteor.users.find({});
	}
	// return Meteor.users.find({});
});

//publish supervisor
Meteor.publish('Supervisor', function(){
	//security
	if(Roles.userIsInRole(this.userId, ['admin','supervisor','VSL','Lora','HR'])){
		return Meteor.users.find({roles:'supervisor'});
	}
});


//publish menu
Meteor.publish('menu', function(){

	return Menu.find({});
});
//publish department
Meteor.publish('department', function(){

	return Department.find({});
});
//publish safetymessage
Meteor.publish('safetymessage', function(){

	return Safetymessage.find({});
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

Meteor.publish('earnedTimePPiece', function(){
	return EarnedTimePP.find({});
});

Meteor.publish('anouncements', function(){
	return Anouncements.find({});
});
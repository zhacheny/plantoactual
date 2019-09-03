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
Meteor.publish('task', function(start,end,buildingnumber){
	if(buildingnumber != null){
		return Tasks.find({createdAt : { $gte : start, $lt: end }, 
			buildingnumber:buildingnumber});
	}
	// return Tasks.find({});
});

//publish partnumber
Meteor.publish('partnumber', function(buildingnumber,cell){
	if(buildingnumber != null && cell != null){
		return Partnumber.find({buildingnumber:buildingnumber, cell:cell});
	}
	// return Partnumber.find({});
});

//publish partnumber
Meteor.publish('taskworktime', function(){

	return Taskworktime.find({});
});

Meteor.publish('cell', function(buildingnumber){
	if(buildingnumber != null){
		return Cell.find({buildingnumber:buildingnumber});
	}
});

// Meteor.publish('plan', function(){
// 	return Plan.find({});
// });

Meteor.publish('operator', function(){
	return Operator.find({});
});

Meteor.publish('earnedTimePPiece', function(){
	return EarnedTimePP.find({});
});

Meteor.publish('anouncements', function(){
	return Anouncements.find({});
});
import { Tasks, Partnumber, Taskworktime } from '/lib/collections.js';

Template.addtasktaskform.onCreated(function(){
	this.autorun(() => {
		this.subscribe('taskworktime');
	})
	this.autorun(() => {
		this.subscribe('partnumber');
	})
	this.autorun(() => {
		this.subscribe('task');
	})
})

Template.AddTasks.helpers({
	admin: function(){
		return Roles.userIsInRole(Meteor.userId(), 'admin');
	},
	tasks: function(){
		// console.log(Tasks.find().fetch());
		console.log(1111);
		return Tasks.find();
	},
	
	partnumber: function(){
		// console.log(Tasks.find().fetch());
		return Partnumber.find();
	},
	taskworktime: function(){
		// console.log(Tasks.find().fetch());
		return Taskworktime.find();
	},
	
});
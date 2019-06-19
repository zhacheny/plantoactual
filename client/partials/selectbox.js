import { Tasks, Partnumber } from '/lib/collections.js';

// Tasks = new Mongo.Collection('task');

Template.selectbox.onCreated(function(){
	this.autorun(() => {
		this.subscribe('task');
	})
	this.autorun(() => {
		this.subscribe('partnumber');
	})
})

Template.selectbox.helpers({
	admin: function(){
		return Roles.userIsInRole(Meteor.userId(), 'admin');
	},
	tasks: function(){
		// console.log(Tasks.find().fetch());
		return Tasks.find();
	},
	partnumber: function(){
		// console.log(Tasks.find().fetch());
		var selectbuilding =  Session.get('buildingnumber');
		var selectcell = Session.get('cell');
		return Partnumber.find({buildingnumber: selectbuilding,cell:selectcell});
	},
	
});

Template.selectbox.events({

});


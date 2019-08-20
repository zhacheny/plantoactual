import { Tasks, Partnumber } from '/lib/collections.js';

// Tasks = new Mongo.Collection('task');

Template.selectdepartment.onCreated(function(){
	this.autorun(() => {
		this.subscribe('task');
	})
	this.autorun(() => {
		this.subscribe('partnumber');
	})
})

Template.selectdepartment.helpers({
	
});

Template.selectdepartment.events({
	'change .change-building':function (evt) {
		let value = $(evt.target).val();

		Session.set('Department', value);
		// console.log(Session.get('buildingnumber') == "1");	
	},
});


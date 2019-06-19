import { Tasks, Partnumber, Cell } from '/lib/collections.js';

// Tasks = new Mongo.Collection('task');

Template.selectbuilding.onCreated(function(){
	this.autorun(() => {
		this.subscribe('cell');
	})
})

Template.selectbuilding.helpers({
	cell: function(){
		// console.log(Tasks.find().fetch());
		return Cell.find();
	},
	partnumber: function(){
		// console.log(Tasks.find().fetch());
		return Partnumber.find();
	},
	
});

Template.selectbuilding.events({
	'change .change-building':function (evt) {
		var build = $(evt.target).val();

		Session.set('buildingnumber', build);
		// console.log(Session.get('buildingnumber') == "1");	
	},
});


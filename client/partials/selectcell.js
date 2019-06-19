import { Tasks, Partnumber, Cell } from '/lib/collections.js';

// Tasks = new Mongo.Collection('task');

Template.selectcell.onCreated(function(){
	this.autorun(() => {
		this.subscribe('cell');
	})
})

Template.selectcell.helpers({
	cell: function(){
		// console.log(Tasks.find().fetch());
		var select = Session.get('buildingnumber');
		return Cell.find({buildingnumber: select});
	},
});

Template.selectcell.events({
	'change .change-cell':function (evt) {
		var cell = $(evt.target).val();
		// console.log(cell);
		Session.set('cell', cell);
	},
});


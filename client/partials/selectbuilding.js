import { Tasks, Partnumber, Cell } from '/lib/collections.js';

// Tasks = new Mongo.Collection('task');

Template.selectbuilding.onCreated(function(){
	this.autorun(() => {
		this.subscribe('cell');
	})
})

Template.selectbuilding.helpers({
	// isProduction:function(type){
	// 	console.log(type);
	// 	if (type == "add_tasks"){
	// 		return true;
	// 	}else{
	// 		return false;
	// 	}
	// },
	selectbuilding:function(selected,type){
		// console.log(selected);
		return selected != '' ? true:false;
		// return false;
	},
	cell: function(){
		// console.log(Tasks.find().fetch());
		return Cell.find();
	},
	// partnumber: function(){
	// 	// console.log(Tasks.find().fetch());
	// 	return Partnumber.find();
	// },
	
});

Template.selectbuilding.events({
	'change .change-building':function (evt) {
		evt.preventDefault();
		var build = $(evt.target).val();
		var type = $(evt.currentTarget).data('id');
		// console.log(type);
		if (type == "add_tasks"){
			Session.set('buildingnumber', build);
		}else if(type == "dash_board"){
			Session.set('buildingnumber_safety', build);
		}else{
			Session.set('buildingnumber_part_maintenance', build);
		}
		// Session.set('buildingnumber', build);
		// console.log(Session.get('buildingnumber') == "1");	
	},
});


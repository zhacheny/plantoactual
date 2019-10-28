import { Tasks, Partnumber, Cell } from '/lib/collections.js';
import { Cookies } from 'meteor/mrt:cookies';

// Tasks = new Mongo.Collection('task');

Template.selectbuilding.onCreated(function(){
	// this.autorun(() => {
	// 	this.subscribe('cell');
	// })
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
	ismanage_tasks:function(type){
		if(type == 'manage_tasks_flaggeddata' || type == 'manage_tasks'){
			return true;
		}else{
			return false;
		}
	},
	selectbuilding:function(selected,type){
		console.log(selected);
		if(type == 'add_tasks' && selected != ''){
			return true;
		}else{
			return false;
		}
		// return selected != '' ? true:false;
		// return false;
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
		// if (type == "add_tasks"){
		// 	Cookie.set('buildingnumber', build);
		// }else if(type == "dash_board"){
		// 	Session.set('buildingnumber_safety', build);
		// }else{
		// 	Session.set('buildingnumber_part_maintenance', build);
		// }
		switch(type){
				case "add_tasks":
					Cookie.set('buildingnumber', build);
					break;
				case "dash_board":
					Session.set('buildingnumber_safety', build);
					break;
				case "manage_tasks":
					Session.set('buildingnumber_manage_tasks', build);
					break;
				case "manage_tasks_flaggeddata":
					Session.set('buildingnumber_manage_tasks_flaggeddata', build);
				// default:
    // 				Cookie.set('buildingnumber', build); 
    // 				break;
			}
		// Session.set('buildingnumber', build);
		// console.log(Session.get('buildingnumber') == "1");	
	},
});


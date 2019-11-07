import { Tasks, Cell, Partnumber, Plan, Operator, Taskrecord } from '/lib/collections.js';

function getearnedtimesum(tasks_object){
	let sum = 0;
	for (var i = tasks_object.length - 1; i >= 0; i--) {
		if(tasks_object[i].status != 'changeover'){
			sum += parseFloat(tasks_object[i].earnedtime);
		}
	}
	return sum;
}

function gettotaleff(tasks_object){
	let sum_earnetime = 0;
	let sum_worktime = 0;
	for (var i = tasks_object.length - 1; i >= 0; i--) {
		if(tasks_object[i].status != 'changeover'){
			sum_earnetime += parseFloat(tasks_object[i].earnedtime);
			sum_worktime += parseFloat(tasks_object[i].worktime);
		}

	}
	// console.log(sum_earnetime);
	// console.log(sum_worktime);
	let res = sum_earnetime / sum_worktime;
	return res;
}
Template.Cellrectangle.events({
	// 'click .bounce': function(){

	// },
	'click .celllabel':function(events){
		// let value = $(evt.currentTarget).context.innerHTML;
		let cell = $(events.currentTarget).data('cell');
		let table = $(events.currentTarget).data('table');
		// console.log(cell, table);
		Session.set('notclicked',false);
		Session.set('clickedcell',cell.toString());
		Session.set('clickedcell-table',table);
	},
})

Template.Cellrectangle.helpers({
	add_on_outline:function(cell, table){
	let object = Taskrecord.findOne({cell: cell});
	if ( Cookie.get('celltable') != 'null' ) {
		object = Taskrecord.findOne({cell: cell, celltable: table})
	}
	if( !object ){
		return;
	}

	let flag_supervisor = object.addon_flag_supervisor;
	let flag_quality = object.addon_flag_quality;
	let res = '';
	if( flag_supervisor != null){
		res = flag_supervisor == true ? 'border: 4px solid black;' : '';
	}else{
		res = ''; 
	}
	if( flag_quality != null){
		res = flag_quality == true ? res + 'outline: 5px dotted black;' : res + '';
	}else{
		res = res + ''; 
	}
	console.log(res);
	return res;
	},
	
	total_earned_hours:function(){
		let tasks_object = Tasks.find({}).fetch();
		let res = getearnedtimesum(tasks_object)
		return Math.round(res/60* 100)/100 + ' hours';
	},
	total_efficiency:function(){
		let tasks_object = Tasks.find({}).fetch();
		let res = gettotaleff(tasks_object);
		res = Math.round(res*100);
		return res > 0 ? res + ' %': 0 + ' %';
	},
	isgrey:function(){
		if(this.actual == 0){
			return 'background: #EEE';
		}else{
			return '';
		}
	},
	isgrey:function(cellid, table){
		let red = Tasks.find({cell:cellid, status:'red'}).count();
		let green = Tasks.find({cell:cellid, status:'green'}).count();
		if(table != null){
			red = Tasks.find({cell:cellid, status:'red', celltable:table}).count();
			green = Tasks.find({cell:cellid, status:'green', celltable:table}).count();
		}

		if(red == 0 && green == 0){
			return true;
		}
	},
	conditional:function(cellid, table){
		let red = Tasks.find({cell:cellid, status:'red'}).count();
		let green = Tasks.find({cell:cellid, status:'green'}).count();
		if(table != null){
			red = Tasks.find({cell:cellid, status:'red', celltable:table}).count();
			green = Tasks.find({cell:cellid, status:'green', celltable:table}).count();
		}
		// console.log([red,green]);
		if(red != 0 || green!= 0){
			// console.log(cellid);
			// console.log([red,green]);
			if(red < green){
				return true;
			}else{
				return false;
			}
		}
	},
	clicked:function(){
		return Session.get('notclicked') == null ? true : false;
	},

})

Template.Cellrectangle.onCreated(function(){
	this.autorun(() => {
		this.subscribe('taskrecord', 'All');
	})
});

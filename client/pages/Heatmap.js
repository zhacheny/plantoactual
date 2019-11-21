import { Tasks, Cell, Partnumber, Plan, Operator, EarnedTimePP,Anouncements,
		Safetymessage, Department, Menu } from '/lib/collections.js';
var cur_index = 0; 
var index =['2','3','4','4A'];

function getearnedtimesum(tasks_object){
	let sum = 0;
	for (var i = tasks_object.length - 1; i >= 0; i--) {
		if(tasks_object[i].status != 'changeover'){
			if (tasks_object[i].flagged == null || tasks_object[i].flagged != true) {
				let earnedtime = tasks_object[i].earnedtime;
				if(earnedtime != null){
					sum += parseFloat(tasks_object[i].earnedtime);
				}
			}

			
		}
	}
	// console.log(sum);
	return sum;
}

function gettotaleff(tasks_object){
	let sum_earnetime = 0;
	let sum_worktime = 0;
	for (var i = tasks_object.length - 1; i >= 0; i--) {
		if(tasks_object[i].status != 'changeover'){
			if (tasks_object[i].flagged == null || tasks_object[i].flagged != true) {
				let earnedtime = tasks_object[i].earnedtime;
				if(earnedtime != null){
					sum_earnetime += parseFloat(tasks_object[i].earnedtime);
					sum_worktime += parseFloat(tasks_object[i].worktime);
				}	
			}
			
		}

	}
	// console.log(sum_earnetime);
	// console.log(sum_worktime);
	let res = sum_earnetime / sum_worktime;
	return res;
}

Template.Heatmap.events({
	// 'click .bounce': function(){

	// },
	'click .toggle-back': function(){
		Session.set('notclicked',null);
	},
	'click .label_building_2': function(){
		Session.set('building', '2');
	},
	'click .label_building_3': function(){
		Session.set('building', '3');
	},
	'click .label_building_4': function(){
		Session.set('building', '4');
	},
	'click .label_building_4A': function(){
		Session.set('building', '4A');
	},
})
Template.Heatmap.helpers({
	displaybuilding2:function(){
		if(Session.get('building') == null || Session.get('building') == '2'){
			return true;
		}else{
			return false;
		}
	},
	displaybuilding3:function(){
		if(Session.get('building') != null && Session.get('building') == '3'){
			return true;
		}else{
			return false;
		}
	},
	displaybuilding4:function(){
		if(Session.get('building') != null && Session.get('building') == '4'){
			return true;
		}else{
			return false;
		}
	},
	displaybuilding4A:function(){
		if(Session.get('building') != null && Session.get('building') == '4A'){
			return true;
		}else{
			return false;
		}
	},
	building_color_2:function(){
		if(Session.get('building') == null || Session.get('building') == '2'){
			return 'color:black';
		}else{
			return;
		}

	},
	building_color_3:function(){
		if(Session.get('building') != null && Session.get('building') == '3'){
			return 'color:black';
		}else{
			return;
		}

	},
	building_color_4:function(){
		if(Session.get('building') != null && Session.get('building') == '4'){
			return 'color:black';
		}else{
			return;
		}

	},
	building_color_4A:function(){
		if(Session.get('building') != null && Session.get('building') == '4A'){
			return 'color:black';
		}else{
			return;
		}

	},
	isCurIndex_one:function(){
		let index = Session.get('cur_index');
		if(index == null || index == 0){
			return true;
		}else{
			return false;
		}
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
	isred: function(){
		return this.status == 'red'? true : null;
	},
	isgreen: function(){
		return this.status == 'green'? true : null;
	},
	tasks:function(){
		let cell = Session.get('clickedcell');
		let celltable = Session.get('clickedcell-table');
		if( celltable != null ){
			// return cell.length > 4 ? Tasks.find({cell:cell.substring(2)}, celltable: celltable, { sort: { createdAt: 1 }}):Tasks.find({cell:cell}, { sort: { createdAt: 1 }});
			return Tasks.find({cell:cell, celltable: celltable}, { sort: { createdAt: 1 }});
		}else{
			// return cell.length > 4 ? Tasks.find({cell:cell.substring(2)}, { sort: { createdAt: 1 }}):Tasks.find({cell:cell}, { sort: { createdAt: 1 }});
			return Tasks.find({cell:cell}, { sort: { createdAt: 1 }});
		}
		
	},
	showmonitor: function() {
		return Session.get('notclicked') == null ? false : true;
	},

})
Template.Heatmap.rendered = function() {
	
}
Template.Heatmap.onCreated(function(){
	let today = new Date();
	let tomorrow = new Date();
	today.setHours(0,0,0,0);
	tomorrow.setHours(23,59,5,999)
	// console.log(today, tomorrow);
	this.autorun(() => {
		let building = Session.get('building') == null ? '2':Session.get('building');
		this.subscribe('task',today,tomorrow,building);
	})
});


import { Tasks, Cell, Partnumber, Plan, Operator, EarnedTimePP,Anouncements,
		Safetymessage, Department, Menu } from '/lib/collections.js';

Template.Heatmap.events({
	// 'click .bounce': function(){

	// },
	'click .toggle-back': function(){
		Session.set('notclicked',null);
	},
	'click .celllabel':function(evt){
		var value = $(evt.currentTarget).context.innerHTML;
		// console.log(value);
		Session.set('notclicked',false);
		Session.set('clickedcell',value);
	},
})
Template.Heatmap.helpers({
	total_earned_hours:function(){
		let tasks_object = Tasks.find({}).fetch();
		let sum = 0;
		for (var i = tasks_object.length - 1; i >= 0; i--) {
			sum += tasks_object[i].earnedtime;
		}
		sum /= 60;
		return sum + ' hours';
	},
	total_efficiency:function(){
		let tasks_object = Tasks.find({}).fetch();
		let sum_earnetime = 0;
		let sum_worktime = 0;
		for (var i = tasks_object.length - 1; i >= 0; i--) {
			sum_earnetime += tasks_object[i].earnedtime;
			sum_worktime += tasks_object[i].worktime;
		}
		console.log(sum_earnetime);
		console.log(sum_worktime);
		let res = sum_earnetime / sum_worktime;
		res /= 60;
		return res > 0 ? res + ' hours': 0 + ' hours';
	},
	isgrey:function(){
		if(this.actual == 0){
			return 'background: #EEE';
		}else{
			return '';
		}
	},
	isred: function(){
		return this.status == 'red'? true : null;
	},
	isgreen: function(){
		return this.status == 'green'? true : null;
	},
	tasks:function(){
		var cell = Session.get('clickedcell');
		return cell.length > 4 ? Tasks.find({cell:cell.substring(2)}, { sort: { createdAt: 1 }}):Tasks.find({cell:cell}, { sort: { createdAt: 1 }});
	},
	showmonitor: function() {
		return Session.get('notclicked') == null ? false : true;
	},
	isgrey:function(cellid){
		let red = Tasks.find({cell:cellid, status:'red'}).count();
		let green = Tasks.find({cell:cellid, status:'green'}).count();
		if(red == 0 && green == 0){
			return true;
		}
	},
	conditional:function(cellid){
		let red = Tasks.find({cell:cellid, status:'red'}).count();
		let green = Tasks.find({cell:cellid, status:'green'}).count();

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
Template.Heatmap.rendered = function() {
	this.subscribe('task',null,null,'4');
}
Template.Heatmap.onCreated( () => {
});

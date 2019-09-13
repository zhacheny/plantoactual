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
		return Tasks.find({cell:Session.get('clickedcell')}, { sort: { createdAt: 1 }});
	},
	showmonitor: function() {
		return Session.get('notclicked') == null ? false : true;
	},
	conditional:function(cellid){
		let red = Tasks.find({cell:cellid, status:'red'}).count();
		let green = Tasks.find({cell:cellid, status:'green'}).count();
		// console.log([red,green]);
		if(red != 0 && green!= 0){
			return red < green;
		}else{
			return true;
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

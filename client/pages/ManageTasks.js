import { Tasks, Partnumber, Taskworktime, Plan, Operator, EarnedTimePP } from '/lib/collections.js';
import moment from 'moment';

Template.ManageTasks.onCreated(function(){
	this.autorun(() => {
		this.subscribe('task');
	})
	this.autorun(() => {
		this.subscribe('partnumber');
	})
	this.autorun(() => {
		this.subscribe('taskworktime');
	})
	this.autorun(() => {
		this.subscribe('plan');
	})
	this.autorun(() => {
		this.subscribe('operator');
	})
	this.autorun(() => {
		this.subscribe('earnedTimePPiece');
	})
	// Meteor.setInterval(function() {
	// 	time.set(new Date());
	// }, 1000);
});

Template.ManageTasks.events({

})
Template.ManageTasks.helpers({
	displaytable: function(){
		return Session.get('searchCondition') == null ? false: true;
	},
	tasks: function(){
		if (Session.get('searchCondition') == null){
			return;
		}else{
			var condition = Session.get('searchCondition');
			// console.log(Tasks.find().fetch());
			var starttime = condition[1][0];
			var endtime = condition[1][1];
			var start = new Date(starttime);
			var end = new Date(endtime);
			// console.log(endtime);
			// console.log(starttime-endtime);
			var buliding = condition[1][2];
			var cell = condition[1][3];
			var partnumber = condition[1][4]
			var operator = condition[1][6];
			if(!operator || operator == "All"){
				// var date = Tasks.findOne({partnumber:partnumber});
				var data = Tasks.find({partnumber:partnumber,'createdAt' : { $gte : start, $lt: end }}).fetch();
				return data;
			}else{
				var operator = condition[1][6];
				return Tasks.find({partnumber:partnumber, operator:operator,'createdAt' : { $gte : start, $lt: end }});		
			}
		}
	},


})

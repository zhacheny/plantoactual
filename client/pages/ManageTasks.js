import { Tasks, Partnumber, Taskworktime, Plan, Operator, EarnedTimePP } from '/lib/collections.js';
import moment from 'moment';
var timespan1 = ['6-7 am','7-8 am','8-9 am','9-10 am','10-11 am'];
var timespan2 = ['11-12 am','12:30-13:30 pm','13:30-14:30 pm','14:30-15:30 pm'];
var timespan_merge = timespan1.concat(timespan2);
var data = "";
Template.ManageTasks.rendered = function() {
	$('#picker-1, #picker-2').datetimepicker({
		 // timepicker:false,
		 defaultTime:'12:00'
	});
};

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
	'click .close-popup': ()=> {
		Session.set('toggle-search-delete', '');
	},
	// 'click .searchID': function(event){
	// 	var id = Session.get('inputID');
	// 	Session.set('searchCondition',[false, id]);
	// 	return false;

	// },
	'click .search-edit': function(event){
		Session.set('toggle-search-edit','open');
		// Meteor.call('deletetask', Session.get('inputID'));
		// alert('Deleted!');
		return;
	},
	
	'click .Modal-yes': function(event){
		Meteor.call('deletetask', Session.get('inputID'));
		alert('Deleted!');
		return;
	},
	'click .Modal-cancel': function(event){
		Session.set('toggle-search-delete','');
		Session.set('toggle-search-edit','');
		return;
	},
	'click .search-delete': function(event){
		Session.set('toggle-search-delete','open');
		return;
	},
	'keypress input.inputID': function(event){
		var value = $(event.target).val();
		if(event.key == 'Enter'){
        	Session.set('inputID',value);
        	return false;
    	}
		return;
		
	},
	'click .label-search': function(event){
		// console.log(0);
		Session.set('toggle-search',0);
	},
	'click .label-searchID': function(event){
		// console.log(1);
		Session.set('toggle-search',1);
	},
	'blur #picker-1': function (event, template) {
	  // Get the selected start date
	  var picked_date = $(event.target).val(); 
	  Session.set('startdate',picked_date);
	},
	'blur #picker-2': function (event, template) {
	  // Get the selected start date
	  var picked_date = $(event.target).val(); 
	  Session.set('enddate',picked_date);
	},

	'change #checkbox1': function(event){
 	  var is_checked = $(event.target).is(":checked");
	  Session.set('shifts1',is_checked);
	},

	'change #checkbox2': function(event){
	  var is_checked = $(event.target).is(":checked");
	  Session.set('shifts2',is_checked);
	},

	'change #checkbox3': function(event){
	  var is_checked = $(event.target).is(":checked");
	  Session.set('toggle-Download',is_checked);
	},

	'change .partnumberchange':function(evt){
		var partnumber = $(evt.target).val();
		Session.set('partnumber',partnumber);
	},

	'click .search':function(evt){
		// evt.preventDefault();

		var partnumber = Session.get('partnumber') != null ? Session.get('partnumber') : false;
		var startdate = Session.get('startdate') != null ? Session.get('startdate') : false;
		var enddate = Session.get('enddate') != null ? Session.get('enddate') : false;
		var building = Session.get('buildingnumber') != null ? Session.get('buildingnumber') : false;
		var cell = Session.get('cell')!= null ? Session.get('cell') : false;
		var shifts1 = Session.get('shifts1') != null ? Session.get('shifts1') : false;
		var shifts2 = Session.get('shifts2') != null ? Session.get('shifts2') : false;
		var operator = Session.get('operator') != null ? Session.get('operator') : false;
		if(!partnumber || !startdate || !enddate || !building || !cell){
			alert("invalid input");
			return false;
		}
		Session.set('searchCondition',[true,[startdate, enddate, building, cell, partnumber,[shifts1,shifts2],operator]]);
		var start = new Date(startdate);
		var end = new Date(enddate);
		if(operator == "All" || !operator){
			//check whether user select the shift button
			if(shifts1 && shifts2){
				data = Tasks.find({timespan:{ $in : timespan_merge}, partnumber:partnumber,
					createdAt : { $gte : start, $lt: end }}).fetch();
			}else if(shifts1 && !shifts2){
				data = Tasks.find({timespan:{ $in : timespan1}, partnumber:partnumber,
					createdAt : { $gte : start, $lt: end }}).fetch();
			}else if(!shifts1 && shifts2){
				data = Tasks.find({timespan:{ $in : timespan2}, partnumber:partnumber,
					createdAt : { $gte : start, $lt: end }}).fetch();
			}else{
				alert("please select the shifts!");
				return false;
			}
			// var data = Tasks.find({partnumber:partnumber,createdAt : { $gte : start, $lt: end }}).fetch();
		}else{

			data = Tasks.find({operator:{ $in : [operator]}, partnumber:partnumber,
				createdAt : { $gte : start, $lt: end }}).fetch();
		}
		
		// produce data
		if(Session.get('toggle-Download') == null){
			return false;
		}else{
			if(Session.get('toggle-Download')){
				var CSVData = Papa.unparse(data);
				var reportName = "Report_" + startdate + "_to_" + enddate + ".csv";
				// console.log(CSVData);
				var blob = new Blob([CSVData], 
		            {type: "text/csv;charset=utf-8"});
					saveAs(blob, reportName);
				return false;
			}else{
				return false;
			}
		}
	},

})
Template.ManageTasks.helpers({
	isred: function(){
		if(this.status == 'red'){
			return true;
		}else{
			return false;
		}
	},
	searchpage: function(){
		if(Session.get('toggle-search') == null){
			return false;
		}
		return Session.get('toggle-search') == 1 ?"toggle-searchpage": false;
	},
	toggleSearch: function(){
		if(Session.get('toggle-search') == null){
			return true;
		}
		return Session.get('toggle-search') == 0 ? true: false;
	},
	displaytable: function(){
		if(Session.get('toggle-search') == 0){
			return false;
		}else{
			if(Session.get('toggle-search') == 1 && Session.get('inputID') != null){
				return true;
			}
		}
	},
	tasks: function(){
		if (Session.get('toggle-search') == 0){
			return false;
		}else{
			var id = Session.get('inputID');
			data = Tasks.find({_id: id}).fetch();;
			return data;
		}
	},



})





// var condition = Session.get('searchCondition');
// // console.log(Tasks.find().fetch());
// var starttime = condition[1][0];
// var endtime = condition[1][1];
// var start = new Date(starttime);
// var end = new Date(endtime);
// // console.log(endtime);
// // console.log(starttime-endtime);
// var buliding = condition[1][2];
// var cell = condition[1][3];
// var partnumber = condition[1][4]
// var operator = condition[1][6];
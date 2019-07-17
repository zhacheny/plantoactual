import { Tasks, Partnumber, Taskworktime, Plan, Operator, EarnedTimePP } from '/lib/collections.js';
import moment from 'moment';
//setting up the shift point
//var timeSpan = ['6-7 am','7-8 am','8-9 am','9-10 am','10-11 am','11-12 am','12:30-13:30 pm','13:30-14:30 pm','14:30-15:30 pm'];
var reasonCode = ['Meeting/Training','Machine Down','Quality Isssue','Safety','Waiting on Material','Write in'];
var timespan1 = ['6-7 am','7-8 am','8-9 am','9-10 am','10-11 am','11-12 am','12:30-13:30 pm','13:30-14:30 pm'];
var timespan2 = ['14:30-15:30 pm','15:30-16:30 pm'];
var timespan_merge = timespan1.concat(timespan2);
var data = "";

Template.ManageTasks.rendered = function() {
	$('#picker-1, #picker-2').datetimepicker({
		 // timepicker:false,
		 defaultTime:'12:00'
	});
};

Template.ManageTasks.onCreated(function(){
	Session.set('toggle-Download',false);
	Session.set('toggle-Generate',false);
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
	'click .outline': function(events){
		event.preventDefault();
	    if (document.getElementById('actualInput').value == ""){
	    	alert("Please input the number!")
			return false;
		}
		var plantoactual = this.plan;
		var actual = Session.get('updateactual');

	    if(plantoactual - actual<= 0) {
	    	//show green
	      	$(events.target).css({"background-color":"rgb(141,198,63)"});
	      	Session.set('statusInput','green');

	    } else {
	    	//error here, reason box should pop up
	      	$(events.target).css({"background-color":"rgb(224, 97, 0)"});
	      	Session.set('statusInput','red');
	    }
	    return false;

	},
	//remove operator
	'click .tagsname':function (events) {
		var operatorcount = Session.get('operatorcount');
		operatorcount--;
		var id = $(events.currentTarget).data('id');

		var operatorinitial = Session.get('operatorarray')[0];
		var operatorIDarray = Session.get('operatorarray')[1];
		if(id == 1){
			operatorinitial[0] = 'null';
			operatorIDarray[0] = 'null';
		}else if (id == 2){
			operatorinitial[1] = 'null';
			operatorIDarray[1] = 'null';
		}else{
			operatorinitial[2] = 'null';
			operatorIDarray[2] = 'null';
		}
		Session.set('operatorcount',operatorcount);
		Session.set('operatorarray',[operatorinitial,operatorIDarray]);
	},
	'click .add-operator': function(){
		var operatorcount = Session.get('operatorcount');
		if (Session.get('operator') == null){
			alert('please type in a valid name to continue!');
			return;
		}
		if (operatorcount > 2){
			alert('can not add more operators!!');
			return;
		}
		var operatorinitial = Session.get('operatorarray')[0];
		var operatorIDarray = Session.get('operatorarray')[1];
		var operatorname = Session.get('operator');
		var initial = Operator.findOne({name:operatorname}).initial;
		var operatorID = Operator.findOne({name:operatorname}).operatorID;
		Meteor.call('checkIsnull',operatorinitial,initial,operatorcount,operatorID,operatorIDarray);
		return;
	},
	'click .back': ()=> {
		Session.set('lostMin',null);
	},
	'click .Modal-submit': ()=> {
		var id = Session.get('inputID');
		var actualInput = Session.get('updateactual') != null ? Session.get('updateactual') : 
		document.getElementById("actualInput").placeholder;
		var reasonInput = Session.get('updatereason') != null ? Session.get('updatereason') :
		document.getElementById("reasonInput").placeholder;
		var commentInput = Session.get('updatecomment') != null ? Session.get('updatecomment') :
		document.getElementById("commentsInput").placeholder;
		var operatorIDarray = Session.get('operatorarray')[1];
		var status = Session.get('statusInput');
		// console.log([id,actualInput, reasonInput, commentInput]);
		Meteor.call('updateAll', id, actualInput, reasonInput,
			commentInput,operatorIDarray,status);
		alert('Edit Successfully!');
		return false;
	},
	'keyup .actualInput': (event)=> {
		var value = $(event.target).val();
		Session.set('updateactual',value);
		
	},
	'keyup .reasonInput': (event)=> {
		var value = $(event.target).val();
		Session.set('updatereason',value);
	},
	'keyup .commentsInput': (event)=> {
		var value = $(event.target).val();
		Session.set('updatecomment',value);
	},
	'keyup .nameInput': (event)=> {
		var value = $(event.target).val();
		Session.set('updatename',value);
	},
	// 'click .searchID': function(event){
	// 	var id = Session.get('inputID');
	// 	Session.set('searchCondition',[false, id]);
	// 	return false;

	// },
	'click .search-edit': function(event){
		Session.set('toggle-search-edit','open');
		Session.set('statusInput',this.status);
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
		var id = $(event.target).val();
		if(event.key == 'Enter'){
			Session.set('inputID',id);
			var operatorID = Tasks.findOne({_id:id}).operatorID;
			var operatorinitial = ['null','null','null'];
			var operatorFullName = ['null','null','null'];
			for (var i = operatorID.length - 1; i >= 0; i--) {
				if(operatorID[i] != 'null'){
					operatorFullName[i] = Operator.findOne({operatorID:operatorID[i]}).name;
					operatorinitial[i] = Operator.findOne({operatorID:operatorID[i]}).initial;
				}
			}
			// console.log(operator);
			Session.set('operatorarray',[operatorinitial,operatorID]);
			Session.set('operatorFullName',operatorFullName);
			return false;
    	}
		return false;
		
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
	'change #checkbox4': function(event){
	  var is_checked = $(event.target).is(":checked");
	  Session.set('toggle-Generate',is_checked);
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
			Session.set('hasOperator',[false,null]);
			// var data = Tasks.find({partnumber:partnumber,createdAt : { $gte : start, $lt: end }}).fetch();
		}else{
			Session.set('hasOperator',[true,operator]);
			operator = Operator.findOne({name:operator}).operatorID;
			data = Tasks.find({operatorID:{ $in : [operator]}, partnumber:partnumber,
				createdAt : { $gte : start, $lt: end }}).fetch();
		}
		
		// produce data
		if(Session.get('toggle-Download')){
			var CSVData = Papa.unparse(data);
			var reportName = "Report_" + startdate + "_to_" + enddate + ".csv";
			// console.log(CSVData);
			var blob = new Blob([CSVData], 
	            {type: "text/csv;charset=utf-8"});
				saveAs(blob, reportName);
			
		}
		//generate charts
		if(Session.get('toggle-Generate')){
			if(data.length == 0){
				alert('No data in this interval');
				return false;
			}
			//extract tendency attributes
			//calculate the date difference
			const diffTime = Math.abs(end.getTime() - start.getTime());
			const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
			console.log(diffDays);
			//collect data from the 2ed day to the penultimate day
			var All_sum_eff = [];
			for (var i = 0; i < diffDays; i++) {
				var eff = 0;
				var eff_worktime = 0;
				var eff_earnedtime = 0;
				var curDate = start.getDate();
				var curDate_start = new Date(startdate).setHours(0,0,0,0);
				var curDate_end = new Date(startdate).setHours(23,59,59,999);
				curDate_start = new Date(curDate_start).setDate(curDate + i);
				curDate_end = new Date(curDate_end).setDate(curDate + i);
				curDate_start = new Date(curDate_start);
				curDate_end = new Date(curDate_end);
				//collect data from the 1st day
				if(i == 0){
					curDate_start = start;
				}
				//collect data from the last day
				if(i == diffDays-1){
					curDate_end = end;
				}
				for (var j = data.length - 1; j >= 0; j--) {
					if(moment(data[j].createdAt).isBetween(moment(curDate_start), moment(curDate_end))) {
						 eff_worktime += parseFloat(data[i].worktime);
						 eff_earnedtime += parseFloat(data[i].earnedtime);

					}
				}
				if(eff_worktime == 0){
					All_sum_eff[i] = 0;
				}else{
					All_sum_eff[i] = eff_earnedtime/eff_worktime;		
				}

				// console.log(curDate_start);
				// console.log(curDate_end);
				
			}
			
			var per_Actualtime = [];
			var per_Earnedtime = [];
			var per_eff = [];
			var per_changeover = [];
			var lostMin = [];
			var operator = new Set();
			var operator_Actualtime = [];
			var operator_Earnedtime = [];
			var lostMin_per_operator = [];
			//extract operator array
			for (var i = data.length - 1; i >= 0; i--) {
				for (var j = 0; j < data[0].operatorID.length; j++) {
					if(data[i].operatorID[j] != "null" && !operator.has(data[i].operatorID[j]) ){
						operator.add(data[i].operatorID[j]); 
						
					}
				}
			}
			var operatorArray = Array.from(operator);
			console.log(operatorArray);

			//extract lost minutes per cell
			for (var i = reasonCode.length - 1; i >= 0; i--) {
				var temp_Actualtime = 0;
				var temp_Earnedtime = 0;
				for (var j = data.length - 1; j >= 0; j--) {
					//collect the summation
					if(data[j].reason == reasonCode[i]){
						temp_Actualtime += parseFloat(data[j].worktime);
						temp_Earnedtime += parseFloat(data[j].earnedtime);
					}

				}
				per_Actualtime[i]=temp_Actualtime;
				per_Earnedtime[i]=temp_Earnedtime;
				lostMin[i] = per_Actualtime[i]-per_Earnedtime[i];
			}
			//extract lost minutes per operator
			for (var n = operatorArray.length - 1; n >= 0; n--) {
				var temp_operator_Actualtime = [];
				var temp_operator_Earnedtime = [];
				var temp_lostMin_per_operator = [];
				for (var m = reasonCode.length - 1; m >= 0; m--) {
					var per_temp_operator_Actualtime = 0;
					var per_temp_operator_Earnedtime = 0;
					for (var i = data.length - 1; i >= 0; i--) {
						for (var j = 0; j < data[0].operatorID.length; j++) {
							if(data[i].operatorID[j] == operatorArray[n] && data[i].reason == reasonCode[m]){
								per_temp_operator_Actualtime += parseFloat(data[i].worktime);
								per_temp_operator_Earnedtime += parseFloat(data[i].earnedtime);
								
							}
						}
					}
					temp_operator_Actualtime[m] = per_temp_operator_Actualtime;
					temp_operator_Earnedtime[m] = per_temp_operator_Earnedtime;
					temp_lostMin_per_operator[m] = per_temp_operator_Actualtime - per_temp_operator_Earnedtime;
				}

				operator_Actualtime[n] = temp_operator_Actualtime;
				operator_Earnedtime[n] = temp_operator_Earnedtime;
				lostMin_per_operator[n] = temp_lostMin_per_operator;
			}
			//get the full name of each opreator
			var operatorFullName = [];
			for (var i = operatorArray.length - 1; i >= 0; i--) {
				if(operatorArray[i] != 'null'){
					operatorFullName[i] = Operator.findOne({operatorID:operatorArray[i]}).name;
				}
			}
			// console.log(operatorFullName);
			// console.log(operator_Actualtime);
			// console.log(operator_Earnedtime);
			// console.log(operator);
			// console.log(All_sum_eff);

			//calculate the summation of the worked time and the earned time
			// for (var i = timeSpan.length - 1; i >= 0; i--) {
			// 	for (var j = data.length - 1; j >= 0; i--) {
			// 		if(data[j].timespan == timeSpan[i]){
			// 			per_Actualtime[i] += data[j].worktime;
			// 			per_Earnedtime[i] += data[j].earnedtime;
			// 		}
			// 		// sum_Worktime += data[i].worktime;
			// 		// sum_Earnedtime += data[i].earnedtime;

			// 	}
			// 	per_eff[i] = per_Earnedtime[i]/per_Actualtime[i];
			// 	per_changeover = changeOver[i]-per_Actualtime[i];
			// }
			Session.set('dateRange',[moment(start).format("MMM Do YY"),moment(end).format("MMM Do YY")]);
			Session.set('eff-trend',All_sum_eff);
			Session.set('lostMin',lostMin);
			Session.set('lostMin-per-operator',[operatorFullName,lostMin_per_operator]);
		}
		return false;
	},

})
Template.ManageTasks.helpers({
	displayoperatorName: function(){
		return Session.get('operatorFullName');
	},
	displayoperatorone: function(){
		return Session.get('operatorarray')[0][0] != 'null' ? true : false;
	},
	displayoperatortwo: function(){
		return Session.get('operatorarray')[0][1] != 'null' ? true : false;
	},
	displayoperatorthree: function(){
		return Session.get('operatorarray')[0][2] != 'null' ? true : false;
	},

	operatorone: function(){
		if (Session.get('operatorarray') == null){
			return 'null';
		}else if(Session.get('operatorarray')[0][0] != null){
			return Session.get('operatorarray')[0][0];
		}else {
			return 'null';
		}
	},
	operatortwo: function(){
		if (Session.get('operatorarray') == null){
			return 'null';
		}else if(Session.get('operatorarray')[0][1] != null){
			return Session.get('operatorarray')[0][1];
		}else {
			return 'null';
		}
	},
	operatorthree: function(){
		if (Session.get('operatorarray') == null){
			return 'null';
		}else if(Session.get('operatorarray')[0][2] != null){
			return Session.get('operatorarray')[0][2];
		}else {
			return 'null';
		}
	}, 
	isred: function(){
		if(this.status == 'red'){
			return true;
		}else{
			return false;
		}
	},
	triggerCharts: function(){
		// return Session.get('lostMin') == null? false: "trigger-Charts";
		return Session.get('lostMin') == null? false: true;
	},
	searchpage: function(){
		// if(Session.get('lostMin') != null){
		// 	return "toggle-GenerateChart";
		// }
		if(Session.get('toggle-search') == null){
			return false;
		}else{
			if(Session.get('toggle-search') == 1){
				return "toggle-searchpage";
			}
			// else{
			// 	if(Session.get('lostMin') != null){
			// 		return "toggle-GenerateChart";
			// 	}
			// }			
		}
		// return Session.get('toggle-search') == 1 ?"toggle-searchpage": false;
		
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
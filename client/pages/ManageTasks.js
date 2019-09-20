import { Tasks, Partnumber, Taskworktime, Plan, Operator, EarnedTimePP } from '/lib/collections.js';
import moment from 'moment';
//setting up the shift point
//var timeSpan = ['6-7 am','7-8 am','8-9 am','9-10 am','10-11 am','11-12 am','12:30-13:30 pm','13:30-14:30 pm','14:30-15:30 pm'];
var reasonCode = ['Meeting/Training','Machine Down','Quality Isssue','Safety','Waiting on Material','Write in'];
var timespan1 = ['6:00-7:00 am','7:00-8:00 am','8:00-9:00 am','9:00-10:00 am','10:00-11:00 am','11:00-12:00 am','12:30-1:30 pm','1:30-2:30 pm'];
var timespan2 = ['3:00-4:00 pm','4:00-5:00 pm', '5:00-6:00 pm', '7:00-10:00 pm', '10:00-9:00 pm', '9:30-10:30 pm','10:30-11:30 pm'];
var timespan_worktime = ['55','60','40','60','55','55','60','50','55','60','40','60','55','55','60','30'];
var timespan_merge = timespan1.concat(timespan2);
var data = "";
var firstRendered = false;

function renderPicker(){
	$('#picker-1, #picker-2').datetimepicker({
		 // timepicker:false,
		 defaultTime:'12:00'
	});
}

function sort_lostMin_indexes(lostMin,reasonCode){
	var lostMin_with_index = [];
	for (var i in lostMin) {
	    lostMin_with_index.push([lostMin[i], i]);
	}
	lostMin_with_index.sort(function(left, right) {
	  return left[0] > right[0] ? -1 : 1;
	});
	var indexes = [];
	lostMin = [];
	for (var j in lostMin_with_index) {
	    lostMin.push(lostMin_with_index[j][0]);
	    indexes.push(reasonCode[lostMin_with_index[j][1]]);
	}
	return [lostMin,indexes];
}

function calculate_percentage(lostMin){
	var lostMin_percentage = [];
	var sum_lostMin = 0;
	for (var i = 0; i <lostMin.length; i++) {
		sum_lostMin += lostMin[i];
		lostMin_percentage[i] = sum_lostMin; 
	}
	// console.log(lostMin_percentage);
	for (var i = lostMin.length - 1; i >= 0; i--) {
		lostMin_percentage[i] = (lostMin_percentage[i]/sum_lostMin) * 100;
	}
	return lostMin_percentage;
}
Template.ManageTasks.rendered = function() {
	renderPicker();
};

Template.ManageTasks.onCreated(function(){
	Session.set('toggle-Download',false);
	Session.set('toggle-Generate',false);
	Session.set('operator', null);
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
		var initial = Operator.findOne({operatorName:operatorname}).initial;
		var operatorID = Operator.findOne({operatorName:operatorname}).EENumber;
		Meteor.call('checkIsnull',operatorinitial,initial,operatorcount,operatorID,operatorIDarray);
		return;
	},
	'click .back': ()=> {
		Session.set('toggle-search-page',true)
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
					operatorFullName[i] = Operator.findOne({EENumber:operatorID[i]}).operatorName;
					operatorinitial[i] = Operator.findOne({EENumber:operatorID[i]}).initial;
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
	  var startdate = Session.get('startdate') != null ? Session.get('startdate') : false;
	  var enddate = Session.get('enddate') != null ? Session.get('enddate') : false;
	  var start = new Date(startdate);
	  var end = new Date(enddate);
	  var building = Session.get('buildingnumber_part_maintenance') != null ? Session.get('buildingnumber_part_maintenance') : false;
	  Meteor.subscribe('task',start,end,building);
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
		var building = Session.get('buildingnumber_part_maintenance') != null ? Session.get('buildingnumber_part_maintenance') : false;
		var cell = Session.get('cell')!= null ? Session.get('cell') : false;
		var shifts1 = Session.get('shifts1') != null ? Session.get('shifts1') : false;
		var shifts2 = Session.get('shifts2') != null ? Session.get('shifts2') : false;
		var operator = Session.get('operator') != null ? Session.get('operator') : false;
		if(!building || !startdate || !enddate){
			alert("invalid input");
			return false;
		}
		// Session.set('searchCondition',[true,[startdate, enddate, building, cell, partnumber,[shifts1,shifts2],operator]]);
		var start = new Date(startdate);
		var end = new Date(enddate);
		var searchBoCoP = "partnumber";
		var searchBoCoP_answer = partnumber;
		if (!partnumber || partnumber == "Select"){
			searchBoCoP = "cell";
			searchBoCoP_answer = cell;
		}
		if (!cell || cell == "Select"){
			searchBoCoP = "buildingnumber";
			searchBoCoP_answer = building;
		}
		var query_search = {};
		query_search[searchBoCoP] = searchBoCoP_answer;
		if (!building || building == "Select"){
			query_search = {};
		}
		// console.log(query_search);
		if(operator == "All" || !operator){
			//check whether user select the shift button
			if(shifts1 && shifts2){
				data = Tasks.find({timespan:{ $in : timespan_merge},
					createdAt : { $gte : start, $lt: end }},query_search).fetch();
			}else if(shifts1 && !shifts2){
				data = Tasks.find({timespan:{ $in : timespan1},
					createdAt : { $gte : start, $lt: end }},query_search).fetch();
			}else if(!shifts1 && shifts2){
				data = Tasks.find({timespan:{ $in : timespan2},
					createdAt : { $gte : start, $lt: end }},query_search).fetch();
			}else{
				alert("please select the shifts!");
				return false;
			}
			Session.set('hasOperator',[false,null]);
			// var data = Tasks.find({partnumber:partnumber,createdAt : { $gte : start, $lt: end }}).fetch();
		}else{
			Session.set('hasOperator',[true,operator]);
			var operatorID = Operator.findOne({operatorName:operator}).operatorID;
			//check whether user select the shift button
			if(shifts1 && shifts2){
				data = Tasks.find({operatorID:{ $in : [operatorID]},timespan:{ $in : timespan_merge},
					createdAt : { $gte : start, $lt: end }},query_search).fetch();
			}else if(shifts1 && !shifts2){
				data = Tasks.find({operatorID:{ $in : [operatorID]},timespan:{ $in : timespan1},
					createdAt : { $gte : start, $lt: end }},query_search).fetch();
			}else if(!shifts1 && shifts2){
				data = Tasks.find({operatorID:{ $in : [operatorID]},timespan:{ $in : timespan2},
					createdAt : { $gte : start, $lt: end }},query_search).fetch();
			}else{
				alert("please select the shifts!");
				return false;
			}
		}

		// produce data
		if(Session.get('toggle-Download')){
			const revised_data = JSON.parse(JSON.stringify(data));
			// var revised_data = data;
			for (var i = revised_data.length - 1; i >= 0; i--) {
				for (var j = 0; j < 3; j++) {
					if(revised_data[i].operatorID[j] != "null"){
						revised_data[i].operatorID[j] = Operator.findOne({EENumber:revised_data[i].operatorID[j]}).operatorName;
					}
				}
			}
			var CSVData = Papa.unparse(revised_data);
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
			//collect data from the 2ed day to the penultimate day
			var All_sum_eff = [];
			var sum_Alltime = 0;
			for (var i = 0; i < diffDays; i++) {
				var eff = 0;
				var eff_worktime = 0;
				var eff_earnedtime = 0;
				var changeover_time = 0;
				var curDate = start.getDate();
				var curDate_start = new Date(startdate).setHours(0,0,0,0);
				var curDate_end = new Date(startdate).setHours(23,59,59,999);
				curDate_start = new Date(curDate_start).setDate(curDate + i);
				curDate_end = new Date(curDate_end).setDate(curDate + i);
				curDate_start = new Date(curDate_start);
				curDate_end = new Date(curDate_end);
				//set the 1st day
				if(i == 0){
					curDate_start = start;
				}
				//set the last day
				if(i == diffDays-1){
					curDate_end = end;
				}
				for (var j = data.length - 1; j >= 0; j--) {
					if(moment(data[j].createdAt).isBetween(moment(curDate_start), moment(curDate_end))) {
						//scale the earnedtime value when the part is not available
						if(data[j].plan == 0){
							data[j].earnedtime = data[j].worktime;
						}

						eff_worktime += parseFloat(data[j].worktime);
						eff_earnedtime += parseFloat(data[j].earnedtime);	

					}
				}

				if(eff_worktime == 0){
					All_sum_eff[i] = 0;
				}else{
					All_sum_eff[i] = eff_earnedtime/eff_worktime;
					//math round at most 2 decimal places
					All_sum_eff[i] = Math.round(All_sum_eff[i] * 100) / 100;
				}

			// 	//calculate summation of planned worktime (per day)
			// 	var per_sum_Alltime = 0;
			// 	var perday_timespan = new Set();
			// 	for (var z = timespan_merge.length - 1; z >= 0; z--) {
			// 		for (var j = data.length - 1; j >= 0; j--) {
			// 			if(data[j].timespan == timespan_merge[z] && 
			// 				moment(data[j].createdAt).isBetween(moment(curDate_start), moment(curDate_end))){
			// 				if(!perday_timespan.has(timespan_merge[z])){
			// 					per_sum_Alltime += parseFloat(timespan_worktime[z]);
			// 					// console.log(per_sum_Alltime);
			// 				}
			// 				perday_timespan.add(timespan_merge[z]);
			// 				// console.log(perday_timespan.size);
							
			// 			}
			// 			// sum_Worktime += data[i].worktime;
			// 			// sum_Earnedtime += data[i].earnedtime;
			// 		}
			// 	}
			// sum_Alltime += per_sum_Alltime;

				// console.log(curDate_start);
				// console.log(curDate_end);
				
			}

			var per_Actualtime = [];
			var per_Earnedtime = [];
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
			//get the full name of each opreator
			var operatorFullName = [];
			for (var i = operatorArray.length - 1; i >= 0; i--) {
				if(operatorArray[i] != 'null'){

					operatorFullName[i] = Operator.findOne({EENumber:operatorArray[i]}).operatorName;
				}
			}
			//sort the array
			if(!Session.get('hasOperator')[0]){
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
					lostMin[i] = Math.round(per_Actualtime[i]-per_Earnedtime[i]);
				}
				lostMin_with_index = sort_lostMin_indexes(lostMin,reasonCode);	
			}else{
				//extract lost minutes per cell
				for (var i = reasonCode.length - 1; i >= 0; i--) {
					var temp_Actualtime = 0;
					var temp_Earnedtime = 0;
					for (var j = data.length - 1; j >= 0; j--) {
						//collect the summation
						for (var z = 0; z < data[0].operatorID.length; z++) {
							if(data[j].operatorID[z] == operatorID
							 && data[j].reason == reasonCode[i]){
								temp_Actualtime += parseFloat(data[j].worktime);
								temp_Earnedtime += parseFloat(data[j].earnedtime);
								
							}
						}

					}
					per_Actualtime[i]=temp_Actualtime;
					per_Earnedtime[i]=temp_Earnedtime;
					lostMin[i] = Math.round(per_Actualtime[i]-per_Earnedtime[i]);
				}
				lostMin_with_index = sort_lostMin_indexes(lostMin,reasonCode);
			}
			//calculate the percentage
			lostMin_percentage = calculate_percentage(lostMin_with_index[0]);
			// console.log(lostMin_with_index);
			reasonCode = lostMin_with_index[1];
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
					temp_lostMin_per_operator[m] = Math.round(per_temp_operator_Actualtime - per_temp_operator_Earnedtime);
				}

				operator_Actualtime[n] = temp_operator_Actualtime;
				operator_Earnedtime[n] = temp_operator_Earnedtime;
				lostMin_per_operator[n] = temp_lostMin_per_operator;
			}


			// console.log(operatorFullName);
			// console.log(operator_Actualtime);
			// console.log(operator_Earnedtime);
			// console.log(operator);
			// console.log(All_sum_eff);

			//calculate the summation of the worked time and the earned time
			var sum_changeover = 0;
			var sum_Actualtime = 0;
			var sum_Earnedtime = 0;

			for (var i = data.length - 1; i >= 0; i--) {
				if(data[i].status != 'changeover'){
					sum_Actualtime += parseFloat(data[i].worktime);
					sum_Earnedtime += parseFloat(data[i].earnedtime);
				}else{
					sum_changeover += parseFloat(data[i].worktime);
				}

			}
			overall_eff = sum_Earnedtime/sum_Actualtime;
				// console.log(sum_changeover);
			// var sum_changeovertime = sum_Alltime-sum_Actualtime;
			Session.set('datapad',[sum_Actualtime, sum_Earnedtime,sum_changeover,overall_eff]);
			Session.set('dateRange',[moment(start).format("MMM Do YY"),moment(end).format("MMM Do YY")]);
			Session.set('eff-trend',All_sum_eff);
			Session.set('lostMin',lostMin_with_index);
			Session.set('lostMin-per-operator',[operatorFullName,lostMin_per_operator]);
			Session.set('lostMin_percentage',lostMin_percentage);
		}
		return false;
	},
	'click .print-button':function(){
		$(".print-hide-bar").css('opacity', '0');
		$(".page-title").css('display', 'none');
		$(".app-nav").css('display', 'none');
		document.getElementById('app-layout').style.padding = '0px';
		document.getElementById('app-layout').style.marginLeft = '0px';
		window.print();
		$(".print-hide-bar").css('opacity', '1');
		$(".page-title").css('display', 'flex');
		$(".app-nav").css('display', 'flex');
		document.getElementById('app-layout').style.padding = '40px 60px';
		document.getElementById('app-layout').style.marginLeft = '80px';
	},

})
Template.ManageTasks.helpers({
	selectedbuilding:function(){
		return Session.get('buildingnumber_part_maintenance') != null ? Session.get('buildingnumber_part_maintenance'):'';
	},
	selectedcell:function(){
		return Session.get('cell') != null ? Session.get('cell'):'';
	},
	selectedpart:function(){
		// console.log(this.partnumber);
		return Session.get('partnumber') != null ? Session.get('partnumber'):'XXX';
	},
	shifts:function(){
		if (Session.get('shifts1') && Session.get('shifts2')){
			return 'Both';
		}else if(Session.get('shifts1') && !Session.get('shifts2')){
			return 'Shift 1 Only';
		}else{
			return 'Shift 2 Only';
		}

	},
	date_range_1:function(){
		return Session.get('dateRange')[0];
	},
	date_range_2:function(){
		return Session.get('dateRange')[1];
	},
	sum_Actualtime:function(){
		return Math.round(Session.get('datapad')[0]/60* 100)/100;
	},
	sum_Earnedtime:function(){
		return Math.round(Session.get('datapad')[1]/60* 100)/100;
	},
	sum_changeovertime:function(){
		return Math.round(Session.get('datapad')[2]/60* 100)/100;
	},
	overall_eff:function(){
		return (Math.round(Session.get('datapad')[3] * 100)) + '%';
	},
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
		return Session.get('lostMin') == null? false: true;
	},
	Mask_managetasks: function(){
		// return Session.get('lostMin') == null? false: "trigger-Charts";
		return Session.get('lostMin') == null? "Mask_managetasks": "Mask_managetasks_charts";
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
		}
		
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
			data = Tasks.find({_id: id}).fetch();
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
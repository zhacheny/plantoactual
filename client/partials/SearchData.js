import { Tasks, Partnumber, Taskworktime, Plan, Operator, EarnedTimePP } from '/lib/collections.js';

Template.SearchData.rendered = function() {
	$('#picker-1, #picker-2').datetimepicker({
		 // timepicker:false,
		 defaultTime:'12:00'
	});
};

Template.SearchData.events({
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

	'change .partnumberchange':function(evt){
		var partnumber = $(evt.target).val();
		Session.set('partnumber',partnumber);
	},

	'click .search':function(evt){
		evt.preventDefault();
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
			var data = Tasks.find({partnumber:partnumber,createdAt : { $gte : start, $lt: end }}).fetch();
		}else{

			var data = Tasks.find({operator:{ $in : [operator]}, partnumber:partnumber,
				createdAt : { $gte : start, $lt: end }}).fetch();
		}
		var CSVData = Papa.unparse(data);
		console.log(CSVData);
		var blob = new Blob([CSVData], 
            {type: "text/csv;charset=utf-8"});
			saveAs(blob, "test.csv");

		return false;
	},

});
import { Tasks, Cell, Partnumber, Plan, Operator, EarnedTimePP,Anouncements,
		Safetymessage, Department, Menu,Taskrecord } from '/lib/collections.js';
import moment from 'moment';
import { Cookies } from 'meteor/mrt:cookies';
import { ClientTaskworktime } from '/client/main.js';
// Tasks = new Mongo.Collection('task');
// var time = new ReactiveVar(new Date());
var format = 'hh:mm:ss';
var index = ['a','b','c','d','e','f','g','h','i'];
//start from 12pm not 12:30pm
var reststart1 = moment('12:30:00',format);
var reststart2 = moment('13:30:00',format);
var reststart3 = moment('19:30:00',format);
var reststart4 = moment('20:30:00',format);
var reststart5 = moment('21:30:00',format);
var reststart6 = moment('22:30:00',format);
// var reststart7 = moment('23:30:00',format);
var restend1 = moment('13:30:00',format);
var restend2 = moment('14:30:00',format);
var restend3 = moment('20:30:00',format);
var restend4 = moment('21:30:00',format);
var restend5 = moment('22:30:00',format);
var restend6 = moment('23:30:00',format);
// var restend7 = moment('24:30:00',format);
var shift_1_start = moment('05:50:00',format);
var shift_1_start_1 = moment('05:49:57',format);
var shift_1_start_2 = moment('05:49:59',format);
var shift_1_end = moment('14:50:00',format);
var shift_2_start = moment('15:00:00',format);
var shift_2_start_1 = moment('14:59:57',format);
var shift_2_start_2 = moment('14:59:59',format);
var shift_2_end = moment('23:50:00',format);

var timespan1 = ['6:00-7:00 am','7:00-8:00 am','8:00-9:00 am','9:00-10:00 am','10:00-11:00 am','11:00-12:00 am','12:30-1:30 pm','1:30-2:30 pm'];
var timespan2 = ['3:00-4:00 pm','4:00-5:00 pm', '5:00-6:00 pm', '6:00-7:00 pm','7:30-8:30 pm', '8:30-9:30 pm', '9:30-10:30 pm','10:30-11:30 pm'];
var cur_timespan = [];
var count = 0;
var cur_timespan_record = [];
var absolute_displayindex = 0;
var countsum = 0;
var haverun = false;
var displayindex = 0;
var getlastedtasksum_hasruned = false;
var operator_array_firstrun = true;
var server_taskcountsum_firstrun = true;
var server_taskrecord_firstrun = true;

function updatechangeover(isfinish,currentTime) {

	// var lastobject = ClientTaskworktime.findOne({id:curId});
	//get the change over time
    let starttime = Session.get('changeover-starttime');
    //calcule the time over according to the mode toggle
    if (Session.get('test-mode-time') != null){
		var changeoverDuration = moment(currentTime-starttime).format('ss');

		//changeoverCounter = Math.floor((changeoverCounter/60)*worktime);
    }else{
    	var changeoverDuration = moment(currentTime-starttime).format('mm');
    	// console.log(currentTime);
    	// console.log(starttime);
    }

    var curId = Session.get('tempchangeoverid') + count;
    // console.log(changeoverDuration);
    console.log('count3',count);
    var lastwortime = ClientTaskworktime.findOne({id:curId}).worktime;
    var partnumber = ClientTaskworktime.findOne({id:curId}).partnumber;
    var operatorcount = Session.get('operatorcount');
    //check whether the change over duration is out of time span

    if(isfinish){
    	var worktime = lastwortime - changeoverDuration;
    }else{
    	var worktime = lastwortime;
		
    }
    //automatically changed the plan number
	var plantoactual_auto_generate = 0;
	if (partnumber == 'Part Not Available'){
		// Session.set('earnedTimePPiecePOpe',value);
		Session.set('earnedTimePPiecePOpe',0);
	}else{
		var MinutesPP_one = Partnumber.findOne({cell:Cookie.get('cell'), part:partnumber}).MinutesPP_one;
		plantoactual_auto_generate = MinutesPP_one;
		// var value = 1/MinutesPP_one;
		if (operatorcount == 2){
			plantoactual_auto_generate = Partnumber.findOne({cell:Cookie.get('cell'), part:partnumber}).MinutesPP_two;
		}else if (operatorcount == 2){
			plantoactual_auto_generate = Partnumber.findOne({cell:Cookie.get('cell'), part:partnumber}).MinutesPP_three;
		}
		plantoactual_auto_generate = plantoactual_auto_generate == '' ? 0 : worktime/plantoactual_auto_generate;
		//returns the largest integer less than the value
		plantoactual_auto_generate = Math.floor(plantoactual_auto_generate);
		// value = Math.round( value * 10 ) / 10;
	}
	Session.set('pretime', currentTime);
	Meteor.call('client_server_record',null, Session.get('time'),Cookie.get('cell'),null, null);
	ClientTaskworktime.update({id:curId}, {
		$set: { worktime: worktime,
		 plan: plantoactual_auto_generate},
	});
}
function displayrow_algo(currentTime){
	// var currentTime = time.get();
		// var currentTime = Session.get('time');
		// Session.set('time',currentTime);
		// var hour = moment(currentTime).format('HH');
		// var min = moment(currentTime).format('mm');
		// var sec = moment(timeformat).format('ss');
		var timeformat = moment(currentTime,format);
		//set test time
		// var timeformat = moment('13:29:59',format);
		// var timeformat = moment('7:00:00',format);
		var hour = moment(timeformat).format('HH');
		var min = moment(timeformat).format('mm');
		var sec = moment(timeformat).format('ss');

		if (Session.get('test-mode-time') != null){
			var timearray = Session.get('test-mode-time');
			if (min == timearray[1]){
				//fix bug when operator is failed to fill up the form
				// if(Session.get('taskIsComplete') != null && this != Session.get('taskIsComplete')[1]){

				// }
				displayindex = 0;
				// Session.set('togglecompinfo',this);
			}else if (min == parseInt(timearray[1])+1){
				// console.log(document.getElementsByClassName('partnumberchange')[0]);
				displayindex = 1;
			}else if (min == parseInt(timearray[1])+2){
				displayindex = 2;
			}else if (min == parseInt(timearray[1])+3){
				displayindex = 3;
			}
			// displayindex =4;
			// console.log(submitChangeoverparseInt(timearray[1])+1);
		}else{
			if (timeformat.isBetween(reststart1, restend1)) {
				displayindex = 6;
			} else if (timeformat.isBetween(reststart2, restend2)){
				displayindex = 7;
			}else if(timeformat.isBetween(reststart3, restend3)){
				displayindex = 4;
			}else if(timeformat.isBetween(reststart4, restend4)){
				displayindex = 5;
			}else if(timeformat.isBetween(reststart5, restend5)){
				displayindex = 6;
			}else if(timeformat.isBetween(reststart6, restend6)){
				displayindex = 7;
			}
			else{
				if (timeformat.isBetween(shift_2_start, shift_2_end)){
					displayindex = hour - 15;
				}else{
					displayindex = hour - 6;
				}
			}

			// else if (timeformat.isBetween(reststart3, restend3)){
			// 	displayindex = 8;
			// }else if (timeformat.isBetween(reststart4, restend4)){
	
			// 	displayindex = 9;
			// }
		}
		absolute_displayindex = displayindex;
		if (Session.get('addtaskcountsum') != null){
			let count_client = Session.get('addtaskcountsum');
			displayindex = displayindex + count_client;
		}
		if (Session.get('addtaskcountsum_server') != null){
			let count_server = Session.get('addtaskcountsum_server');
			displayindex = displayindex + count_server;
		}
		// console.log(displayindex)
		return displayindex;
		// return 4;
}

function inserttaskAschangover(iscomplete,currentTime){
	var tempobject = Session.get('togglecomp');
	console.log('count3',count);
	if(iscomplete){
		var curId = Session.get('tempchangeoverid') + count;
		var changeoverDuration = ClientTaskworktime.findOne({id:curId}).worktime;
		console.log(changeoverDuration);
	}else{
		var starttime = Session.get('changeover-starttime');

	    
	    var worktime = Session.get('Plannedworktime');
		if (Session.get('test-mode-time') != null){
			var changeoverDuration = Math.floor( (moment(currentTime-starttime).format('ss'))/60*worktime);
			//changeoverCounter = Math.floor((changeoverCounter/60)*worktime);
	    }else{
	    	var changeoverDuration = Math.floor( (moment(currentTime-starttime).format('mm'))/60*worktime);
	    	// console.log(currentTime);
	    	// console.log(starttime);
	    }
	    // pre_sumchangeoverDuration = Session.get('changeoverDuration') != null ? Session.get('changeoverDuration') : 0;
	    // Session.set('sumchangeoverDuration', pre_sumchangeoverDuration + changeoverDuration);
	    Session.set('sumchangeoverDuration', changeoverDuration);
	}
	console.log('inserttaskAschangover', currentTime, starttime, changeoverDuration)
	var id = tempobject.id;
	var timespan = tempobject.timespan;
	var partnumber = tempobject.partnumber;
	var plan = 0;
	var actual = 0;
	var reason = null;
	var status = 'changeover';
	var comment = 'changeover';
	var buildingnumber = Cookie.get('buildingnumber');
	var cell = Cookie.get('cell');
	var earnedtime = 0;
	var operatorIDarray = JSON.parse(Cookie.get('operatorarray'))[1];

	Meteor.call('inserttask', id, timespan, partnumber, changeoverDuration, plan, actual, reason,
    		 status,currentTime,comment,operatorIDarray,earnedtime,buildingnumber, cell);

	// return [id, timespan, partnumber, worktime, plantoactual, actual, reason,
	//  status,createdAt,comment,operatorIDarray,earnedtime,buildingnumber, cell];

}

Template.AddTasks.onCreated(function(){
	Session.set('addtaskcountsum',0);
	window.name = "parent";

	document.title = 'HxH Tracking System';
	// console.log(Cookie.get('operatorarray'));
	let today = new Date();
	let tomorrow = new Date();
	let status = 'changeover';
	today.setHours(0,0,0,0);
	tomorrow.setHours(23,59,5,999)
	//initialize the task record per day
	// Meteor.call('client_server_record_update', Cookie.get('cell'), today, tomorrow);
	// console.log([today,tomorrow]);

	this.autorun(() => {
		today = new Date();
		tomorrow = new Date();
		let currentTime = Session.get('time');
		let timeformat = moment(currentTime,format);
		let buildingnumber = Cookie.get('buildingnumber');
		//sperate time by two shifts
		if(timeformat.isBetween(shift_1_start, shift_1_end)){
			today.setHours(5,59,59,0);
			tomorrow.setHours(14,59,58,999);
			cur_timespan = timespan1;
		}else if(timeformat.isBetween(shift_2_start, shift_2_end)){
			today.setHours(14,59,59,999);
			tomorrow.setHours(23,49,59,999);
			cur_timespan = timespan2;
		}
		
		this.subscribe('task',today,tomorrow,buildingnumber, function(){
			// console.log([today,tomorrow]);
		});
	})

});


Tracker.autorun(function() {
	let cell = Cookie.get('cell');
	//prevent the autorun method run when the page oncreated.
	Meteor.subscribe('taskrecord', Cookie.get('cell'), function(){
	});
	if(operator_array_firstrun){
		return;
	}
	var operatorinitial = [['null','null','null'],['null','null','null']];
	Cookie.set('operatorarray',JSON.stringify(operatorinitial));
	Cookie.set('operatorcount', 0);

});

Tracker.autorun(function() {
	let cell = Cookie.get('cell');
	
	Session.set('addtaskcountsum_server',0);
	getlastedtasksum_hasruned = false;
	Meteor.call('initializeClientTaskworktime',new Date,false);
	//change the flag when the page is already created
	server_taskcountsum_firstrun = true;
	operator_array_firstrun = false;
});

Tracker.autorun(function() {
	if (Session.get('togglecomp')==null){
		return;
	}
	var wrongtype = Session.get('wrongtype');
	Meteor.call('errortype',wrongtype);

});
Tracker.autorun(function() {
	if (Session.get('togglecomp')==null){
		return;
	}
	var wrongtype = Session.get('wrongtype');
	Meteor.call('errortype',wrongtype);

});

Tracker.autorun(function() {
	//change the status of the when time goes
	var time = Session.get('time');
	haverun = false;
	// var popup_flag = Session.get('popup_flag');
	// if(popup_flag){
	// 	var button = document.getElementsByClassName('test_01')[0];
	// 	if(typeof(button) !== 'undefined'){
			
	// 		button.click();
	// 		console.log(button);
	// 	}
	// }
});

Template.AddTasks.helpers({
	//send global value to selection template
	selectedbuilding:function(){
		return Cookie.get('buildingnumber') != null ? Cookie.get('buildingnumber'):'';
	},
	selectedcell:function(){
		return Cookie.get('selectedcell') != null ? Cookie.get('selectedcell'):'';
	},
	selectedpart:function(){
		// console.log(this.partnumber);
		return this.partnumber;
	},
	anouncements: function(){
		return Anouncements.find();
	},
	changeoverCounter: function(){
	    // var currentTime = time.get();
	    var currentTime = Session.get('time');
	    var starttime = Session.get('changeover-starttime');
	    // Session.set('changeover-end',time.get());
		return moment(currentTime-starttime).format('mm:ss');
	},
	displayoperatorone: function(){
		return JSON.parse(Cookie.get('operatorarray'))[0][0] != 'null' ? true : false;
	},
	displayoperatortwo: function(){
		return JSON.parse(Cookie.get('operatorarray'))[0][1] != 'null' ? true : false;
	},
	displayoperatorthree: function(){
		return JSON.parse(Cookie.get('operatorarray'))[0][2] != 'null' ? true : false;
	},

	operatorone: function(){
		if (JSON.parse(Cookie.get('operatorarray')) == null){
			return 'null';
		}else if(JSON.parse(Cookie.get('operatorarray'))[0][0] != null){
			return JSON.parse(Cookie.get('operatorarray'))[0][0];
		}else {
			return 'null';
		}
	},
	operatortwo: function(){
		if (JSON.parse(Cookie.get('operatorarray')) == null){
			return 'null';
		}else if(JSON.parse(Cookie.get('operatorarray'))[0][1] != null){
			return JSON.parse(Cookie.get('operatorarray'))[0][1];
		}else {
			return 'null';
		}
	},
	operatorthree: function(){
		if (JSON.parse(Cookie.get('operatorarray')) == null){
			return 'null';
		}else if(JSON.parse(Cookie.get('operatorarray'))[0][2] != null){
			return JSON.parse(Cookie.get('operatorarray'))[0][2];
		}else {
			return 'null';
		}
	}, 
	recordedworktime: function(){
		return Session.get('togglecomp') != null ? Session.get('togglecomp').worktime: '';
	},
	recordedtimespan: function(){
		return Session.get('togglecomp') != null ? Session.get('togglecomp').timespan:'';
	},
	recordedpartnumber: function(){
		return Session.get('togglecomp') != null ? Session.get('togglecomp').partnumber:'';
	},
	recordedplantoactual: function(){
		return Session.get('togglecomp') != null ? Session.get('togglecomp').plan:'';
	},
	recordedactual: function(){
		return Session.get('togglecomp') != null ? Session.get('togglecomp').actual:'';
	},
	recordedcomment: function(){
		return Session.get('togglecomp') != null ? Session.get('togglecomp').reason:'';
	},
	isred: function(status){
		return status == 'red'? true : false;
	},
	isgreen: function(status){
		return status == 'green'? true : false;
	},
	//toggle to call pop up box 
	addtasks: function(){
		if (Session.get('toggle-hour-comp') == 'open'){
			if (Session.get('toggleisred')){
				return 'add-tasks-expand';
			
			}else{
				return 'add-tasks';
			}
		}else{
			document.title = 'HxH Tracking System';
		}
	},
	//toggle to call pop up box 
	changeover: function(){
		if (Session.get('changeover-showup') == true){
					// console.log(ClientTaskworktime.find().fetch());
			return 'toggle-changeover';
		}	
	},
	admin: function(){
		return Roles.userIsInRole(Meteor.userId(), 'admin');
	},
	pre_task:function(){
		let cellId = Cookie.get('cell');
		let pre_task_object = Tasks.find({cell:cellId}).fetch();
		for (var i = pre_task_object.length - 1; i >= 0; i--) {
			if(!cur_timespan_record.includes(pre_task_object[i].timespan)){
				cur_timespan_record.push(pre_task_object[i].timespan);
			}
		}
		// console.log(cur_timespan_record);
		return Tasks.find({cell:cellId});
	},
	clienttaskworktime: function(){

		// console.log(ClientTaskworktime.findOne({id:'a1'}));
		return ClientTaskworktime.find({}, { sort: { id: 1 }} );
	},
	timepassed: function(index, displayrow){
		let addtask_sum = Session.get('addtaskcountsum') == null ? 0 : Session.get('addtaskcountsum');
		// console.log([(displayrow - addtask_sum),displayrow]);
		// if(index >= (displayrow - addtask_sum) && index <= displayrow){
		// 	return true;
		// }else{
		// 	return false;
		// }
		// return index < (displayrow - addtask_sum);
		return index <= displayrow;
	},
	timecurrent: function(index, displayrow){
		let addtask_sum = Session.get('addtaskcountsum') == null ? 0 : Session.get('addtaskcountsum');
		// console.log([(displayrow - addtask_sum),displayrow]);
		// if(index >= (displayrow - addtask_sum) && index <= displayrow){
		// 	return true;
		// }else{
		// 	return false;
		// }
		// return index == (displayrow - addtask_sum);
		return index == displayrow;
	},
	isgrey:function(a,b){
		if(a<b && this.actual == 0){
			return 'background: #EEE';
		}else{
			return '';
		}
	},

	gettaskdata: function(){
		// var currentTime = time.get();
		var currentTime = Session.get('time');

		// var hour = moment(currentTime).format('HH');
		// var min = moment(currentTime).format('mm');
		// var sec = moment(timeformat).format('ss');
		var timeformat = moment(currentTime,format);
		//set test time
		// var timeformat = moment('13:29:59',format);
		// var timeformat = moment('7:00:00',format);
		var hour = moment(timeformat).format('HH');
		var min = moment(timeformat).format('mm');
		var sec = moment(timeformat).format('ss');
		if(timeformat.isBetween(shift_1_start_1, shift_1_start_2)){
			document.location.reload(true);
			alert('shift 1 start!');
		}else if (timeformat.isBetween(shift_2_start_1, shift_2_start_2)) {
				// Meteor.call('initializeClientTaskworktime',moment('7:29:59',format),false);
				// console.log(111);
			document.location.reload(true);
			alert('shift 2 start!');
		}


		if (Session.get('test-mode-time') != null){

			var timearray = Session.get('test-mode-time');``
			if (min == parseInt(timearray[1]) && sec == 59){
				 document.title = '[New Message]';

				if(haverun){
					return;
				}
				//check whether the oprerator is able to finish the form
				if(Session.get('changeover-showup') == true){
					// Session.set('taskIsCompletenotFinish',true);
					inserttaskAschangover(true,Session.get('time'));
					updatechangeover(false,currentTime);
				}else{
					Session.set('togglecomp',this);
					Session.set('toggle-hour-comp','open');
				}
				Session.set('changeover-showup',false);
				Session.set('pretime',null);
				Session.set('sumchangeoverDuration',null);
				haverun = true;
			}else if (min ==parseInt(timearray[1])+1 && sec == 59){
				document.title = '[New Message]';
				if(haverun){
					return;
				}
				if(Session.get('changeover-showup') == true){
					// Session.set('taskIsCompletenotFinish',true);
					inserttaskAschangover(true,Session.get('time'));
					updatechangeover(false,currentTime);
				}else{
					Session.set('togglecomp',this);
					Session.set('toggle-hour-comp','open');
				}
				Session.set('changeover-showup',false);
				Session.set('pretime',null);
				Session.set('sumchangeoverDuration',null);
				haverun = true;
			}else if (min == parseInt(timearray[1])+2 && sec == 59){
				document.title = '[New Message]';
				if(haverun){
					return;
				}
				if(Session.get('changeover-showup') == true){
					// Session.set('taskIsCompletenotFinish',true);
					inserttaskAschangover(true,Session.get('time'));
					updatechangeover(false,currentTime);
				}else{
					Session.set('togglecomp',this);
					Session.set('toggle-hour-comp','open');
				}
				Session.set('changeover-showup',false);
				Session.set('pretime',null);
				Session.set('sumchangeoverDuration',null);
				haverun = true;
			}
		}else{
			if (timeformat.isBetween(reststart1, restend1)) {
				if(hour == 13 && min == 29 && sec == 59){
					if(haverun){
						return;
					}
					document.title = '[New Message]';
					if(Session.get('changeover-showup') == true){
						inserttaskAschangover(true,Session.get('time'));
						updatechangeover(false,currentTime);
					}else{
						Session.set('togglecomp',this);
						Session.set('toggle-hour-comp','open');
					}
					Session.set('changeover-showup',false);
					Session.set('pretime',null);
					Session.set('sumchangeoverDuration',null);
					haverun = true;
				}
			} else if (timeformat.isBetween(reststart2, restend2)){
				if(hour == 14 && min == 29 && sec == 59){
					if(haverun){
						return;
					}
					document.title = '[New Message]';
					if(Session.get('changeover-showup') == true){
						inserttaskAschangover(true,Session.get('time'));
						updatechangeover(false,currentTime);
					}else{
						Session.set('togglecomp',this);
						Session.set('toggle-hour-comp','open');
					}
					Session.set('changeover-showup',false);
					Session.set('pretime',null);
					Session.set('sumchangeoverDuration',null);
					haverun = true;
				}
			}else if (timeformat.isBetween(reststart3, restend3)){
				if(hour == 20 && min == 29 && sec == 59){
					if(haverun){
						return;
					}
					document.title = '[New Message]';
					if(Session.get('changeover-showup') == true){
						inserttaskAschangover(true,Session.get('time'));
						updatechangeover(false,currentTime);
					}else{
						Session.set('togglecomp',this);
						Session.set('toggle-hour-comp','open');
					}
					Session.set('changeover-showup',false);
					Session.set('pretime',null);
					Session.set('sumchangeoverDuration',null);
					haverun = true;
				}
			}else if (timeformat.isBetween(reststart4, restend4)){
				if(hour == 21 && min == 29 && sec == 59){
					if(haverun){
						return;
					}
					document.title = '[New Message]';
					if(Session.get('changeover-showup') == true){
						inserttaskAschangover(true,Session.get('time'));
						updatechangeover(false,currentTime);
					}else{
						Session.set('togglecomp',this);
						Session.set('toggle-hour-comp','open');
					}
					Session.set('changeover-showup',false);
					Session.set('pretime',null);
					Session.set('sumchangeoverDuration',null);
					haverun = true;
				}
			}else if (timeformat.isBetween(reststart5, restend5)){
				if(hour == 22 && min == 29 && sec == 59){
					if(haverun){
						return;
					}
					document.title = '[New Message]';
					if(Session.get('changeover-showup') == true){
						inserttaskAschangover(true,Session.get('time'));
						updatechangeover(false,currentTime);
					}else{
						Session.set('togglecomp',this);
						Session.set('toggle-hour-comp','open');
					}
					Session.set('changeover-showup',false);
					Session.set('pretime',null);
					Session.set('sumchangeoverDuration',null);
					haverun = true;
				}
			}else if (timeformat.isBetween(reststart6, restend6)){
				if(hour == 23 && min == 29 && sec == 59){
					if(haverun){
						return;
					}
					document.title = '[New Message]';
					if(Session.get('changeover-showup') == true){
						// Session.set('taskIsCompletenotFinish',true);
						inserttaskAschangover(true,Session.get('time'));
						updatechangeover(false,currentTime);
					}else{
						Session.set('togglecomp',this);
						Session.set('toggle-hour-comp','open');
					}
					Session.set('changeover-showup',false);
					Session.set('pretime',null);
					Session.set('sumchangeoverDuration',null);
					haverun = true;
				}
			}else{
				if (hour >= 6 && hour < 12 && min == 59 && sec == 59){
					document.title = '[New Message]';
					if(haverun){
						return;
					}
					if(Session.get('changeover-showup') == true){
						// Session.set('taskIsCompletenotFinish',true);
						inserttaskAschangover(true,Session.get('time'));
						updatechangeover(false,currentTime); 
					}else{
						Session.set('togglecomp',this);
						Session.set('toggle-hour-comp','open');
					}
					Session.set('changeover-showup',false);
					Session.set('pretime',null);
					Session.set('sumchangeoverDuration',null);
					haverun = true;
				}else if(hour >= 15 && hour < 21 && min == 59 && sec == 59){
					document.title = '[New Message]';
					if(haverun){
						return;
					}
					if(Session.get('changeover-showup') == true){
						// Session.set('taskIsCompletenotFinish',true);
						inserttaskAschangover(true,Session.get('time'));
						updatechangeover(false,currentTime); 
					}else{
						Session.set('togglecomp',this);
						Session.set('toggle-hour-comp','open');
					}
					Session.set('changeover-showup',false);
					Session.set('pretime',null);
					Session.set('sumchangeoverDuration',null);
					haverun = true;
				}

			}
		}
	},
	isCurrent:function(index,displayRow){

		if (index >= displayRow){
			return true;
		}else{
			return false;
		}
	},
	// isDisabled: function(index){
	// 	var taskfinished = Session.get('taskfinished');
	// 	// taskfinished = 0;
	// 	if(index >= taskfinished){
	// 		return true;
	// 	}
	// 	return false;
	// },
	// displaydisabled: function(){
	// 	return 
	// },

	displayRow: function() {
		var currentTime = Session.get('time');
		return displayrow_algo(currentTime);
  	},
  	pre_selected:function(){
  		// console.log(Session.get('partnumber'));
  		return Session.get('partnumber') != null ? Session.get('partnumber'):null;
  	},
  	documentid:function(){
  		// console.log(this.id)
  		return this.id;
  	},
  	part:function(){
  		return this.partnumber;
  	},
  	isSametimespan:function(timespan_clienttask, timespan_servertask){

		// Session.set('1',cur_timespan);
  		if(timespan_clienttask == timespan_servertask){
  			// console.log(timespan_servertask);
	  		// if(!cur_timespan_record.includes(timespan_servertask)){
	  		// 	cur_timespan_record.push(timespan_servertask);
	  		// }
	  		// console.log(['isSametimespan',cur_timespan_record]);
  			return true;
  		}else{
  			return false;
  		}
  		// return timespan_clienttask == timespan_servertask ? true : false;
  	},

  	//check whether it is no production
	isNoprod:function(a,b){
		if(a<b && this.actual == 0){
			return true;
		}else{
			return false;
		}
	},
	getlastedtasksum:function(){
		let clienttask = ClientTaskworktime.find().fetch();
  		let servertask = Tasks.find({cell:Cookie.get('cell')}, { sort: { id: 1 }}).fetch();
		let last_server_index = absolute_displayindex;
		let per_timespan_count = 0;
		let cur_timespan_count = 0;
		let changeover_duration = 0;
		if(servertask.length == 0 || getlastedtasksum_hasruned){
  			return;
  		}
  		// console.log('runtime','XXX');
		// console.log('running_time0',clienttask,last_server_index);	
		let pre_id = servertask[servertask.length - 1].id;
		let all_pre_worktime = 0;
  		for (var j = servertask.length - 1; j >= 0; j--) {
  			//sum the task form server side per time span
  			// console.log('cur_timespan_count0',servertask[j].id);

			if(servertask[j].id.substring(0,1) == index[last_server_index]){
  				// console.log('server_baseid',servertask[j].id);
  				if(servertask[j].status != 'changeover' && Session.get('addtaskcountsum') == 0){
  					cur_timespan_count++;
  				}else if (servertask[j].status == 'changeover'){
					changeover_duration += servertask[j].worktime;
  				}

  				all_pre_worktime += servertask[j].worktime;
  				// console.log('cur_timespan_count1',all_pre_worktime);
  				// console.log('cur_timespan_count0',cur_timespan_count);
  			}else if(servertask[j].id.length > 1 && servertask[j].status != 'changeover' ){
				per_timespan_count++;
  			}


  		}


  		getlastedtasksum_hasruned = true;

  		// console.log('cur_timespan_count0',cur_timespan_count , per_timespan_count);
  		Session.set('all_pre_worktime',all_pre_worktime);
  		count = cur_timespan_count == 0? count:cur_timespan_count;
  		console.log('count_server',count);
  		Session.set('cur_timespan_count',cur_timespan_count);
  		Session.set('sumchangeoverDuration_server',changeover_duration);
  		Session.set('addtaskcountsum_server',cur_timespan_count + per_timespan_count);
  		return;
	},
  	mixedtask:function(){
  		let clienttask = ClientTaskworktime.find().fetch();
  		let servertask = Tasks.find({cell:Cookie.get('cell'),status:{ $ne: 'changeover'}}, { sort: { id: 1 }}).fetch();
		let last_server_index = absolute_displayindex;	
  		if(servertask.length == 0){
  			return ClientTaskworktime.find();
  		}
  		let cur_timespan_count = Session.get('cur_timespan_count');
  		let all_pre_worktime = Session.get('all_pre_worktime');
  		console.log('running_time',clienttask, absolute_displayindex);	
		// let last_server_baseid = servertask[servertask.length - 1].id.substring(0,1);
  		// console.log('servertask.length',servertask.length);
  		if(servertask.length != 0){
  			for (var i = clienttask.length - 1; i >= 0; i--) {
  				for (var j = servertask.length - 1; j >= 0; j--) {
  					let server_baseid = servertask[j].id.substring(0,1);
  					if( clienttask[i].id == server_baseid){
  						// console.log(clienttask[i],last_server_index);
  						if(i == last_server_index){
  							Session.set('tempchangeoverid',server_baseid);
  							let Taskrecord_object = Taskrecord.findOne({cell:Cookie.get('cell')});
  							let newserver_baseid = server_baseid + (cur_timespan_count);	
  							let	new_worktime = clienttask[i].worktime - all_pre_worktime;
							ClientTaskworktime.update({id:server_baseid}, {
								$set: { id:newserver_baseid, worktime:new_worktime},
							});
							//check whether thre task record is needed
							
							if(Taskrecord_object && server_taskrecord_firstrun){
								Meteor.call('client_server_record',absolute_displayindex, null,Cookie.get('cell'), clienttask[i].worktime,null);
								
							}
							break;
  						}else{
	  						ClientTaskworktime.remove({id:server_baseid});
	  						break;
  						}

  					}
  				}
  			}
  		}
  		// console.log(ClientTaskworktime.find({}).fetch());
  		let mixeddoc = clienttask.concat(servertask);
  		return _.sortBy(mixeddoc, function(mixeddoc) {return mixeddoc.id;});
  		// return mixeddoc;
  	},
});

Template.AddTasks.events({
	'click .viewPdf': function(){
		let part = this.partnumber;
		// var pre_url = "";
		let url = Partnumber.findOne({part:part}).XMLname;
		if (url == null){
			alert('drawing not exists!');
			return;
		}else{
			// let win = window.open(url, '_blank');
			// win.focus();
			FlowRouter.go('/admin/viewPdf');
			Session.set('url',url);
			return;
		}
		
	},
	'click .add-operator': function(){
		var operatorcount = Cookie.get('operatorcount');
		if (Session.get('operator') == null){
			alert('please type in a valid name to continue!');
			return;
		}
		if (operatorcount > 2){
			alert('can not add more operators!!');
			return;
		}
		var operatorinitial = JSON.parse(Cookie.get('operatorarray'))[0];
		var operatorIDarray = JSON.parse(Cookie.get('operatorarray'))[1];
		var operatorname = Session.get('operator');
		var initial = Operator.findOne({operatorName:operatorname}).initial;
		var operatorID = Operator.findOne({operatorName:operatorname}).EENumber;
		Meteor.call('checkIsnull',operatorinitial,initial,operatorcount,operatorID,operatorIDarray);
		return;
	},
	'click .toggle-Test-mode': function(){
		alert('switch to test mode!');
		// var currentTime = time.get();
		var currentTime = Session.get('time');
		var test_mode_flag = true;
		var timeformat = moment(currentTime,format);
		//set test time
		var hour = moment(timeformat).format('HH');
		var min = moment(timeformat).format('mm');
		var sec = moment(timeformat).format('ss');
		var timearray = [hour,min,sec];
		addtaskcountsum = 0;
		Session.set('addtaskcountsum',0);
		Session.set('addtaskcountsum_server',0);
		Session.set('test-mode-time',timearray);
		Meteor.call('initializeClientTaskworktime',currentTime,test_mode_flag);
		// Session.set('test-mode','open');
	},

	'click .outline': function(events){
		event.preventDefault();
	    if ((Session.get('togglecomp') == null) || (document.getElementById('popupinput').value == "")){
	    	alert("Please input the number!")
			return false;
		}
		var tempobject = Session.get('togglecomp');
		var plan = tempobject.plan;
		var actual = tempobject.actual;
		var id = tempobject.id;
		console.log(id);
	    if(plan- actual<= 0) {
	    	//show green
	    	var reason = 'All Clear';
	    	Session.set('toggleisred',false);   	
			ClientTaskworktime.update({id:id}, {
				$set: { status: 'green' , reason: reason},
			});
			Session.set('togglecomp',ClientTaskworktime.findOne({id:id}));
	      	$(events.target).css({"background-color":"rgb(141,198,63)"});


	    } else {
	    	//error here, reason box should pop up
			Session.set('toggleisred',true);
			ClientTaskworktime.update({id:id}, {
			$set: { status: 'red' },
			});
			Session.set('togglecomp',ClientTaskworktime.findOne({id:id}));
	      	$(events.target).css({"background-color":"rgb(224, 97, 0)"});
		  // $('.wrapper').toggleClass('show');
	    }
	    return false;

	},
	'change .partnumberchange':function(evt){
		var partnumber = $(evt.target).val();
		Session.set('partnumber',partnumber);
		var operatorcount = Cookie.get('operatorcount');
		// console.log(partnumber);
		// var value = Plan.findOne({worktime:this.worktime,partnumber:partnumber}).value;
		var value = 0;
		if (partnumber == 'Part Not Available'){
			Session.set('earnedTimePPiecePOpe',value);
		}else{
			var MinutesPP_one = Partnumber.findOne({cell:Cookie.get('cell'), part:partnumber}).MinutesPP_one;
			value = MinutesPP_one == '0' ? 11.1 : MinutesPP_one;
			// var value = 1/MinutesPP_one;
			if (operatorcount == 2){
				value = Partnumber.findOne({cell:Cookie.get('cell'), part:partnumber}).MinutesPP_two;
			}else if(operatorcount == 3){
				value = Partnumber.findOne({cell:Cookie.get('cell'), part:partnumber}).MinutesPP_three;
			}
			Session.set('earnedTimePPiecePOpe',value);
			value = value == ''? 0: this.worktime/value;
			//returns the largest integer less than the value
			value = Math.floor(value);
			// value = Math.round( value * 10 ) / 10;
		}
		
		var index = $(evt.currentTarget).data('id');
		console.log(value);
		//for client
	    ClientTaskworktime.update(this, {
	      $set: { plan: value, partnumber: partnumber },
	    });
	},
	'keypress .calculatestatus': function(event){
		let content = $(event.target).val();
		if(event.key == 'Enter' && content != null){
	    	
			document.getElementsByClassName('outline')[0].click();
	      // add to database
	    }
	},
	'keyup .calculatestatus':function(event){
		event.preventDefault();
		var input = $(event.target).val();
		//for the sever
		// Meteor.call('updateactual', this._id, input);
		//for client
	    // ClientTaskworktime.update(this, {
	    //   $set: { actual: input },
	    // });
		var id = Session.get('togglecomp').id;
	    ClientTaskworktime.update({id:id}, {
	      $set: { actual: input },
	    });
		Session.set('togglecomp',ClientTaskworktime.findOne({id:id}));
	},
	'keyup .inputreports':function(event){
		event.preventDefault();
		var input = $(event.target).val();
		if (input == ' '){
			return;
		}
		var id = Session.get('togglecomp').id;
	    ClientTaskworktime.update({id:id}, {
	      $set: { comment: input },
	    });
		Session.set('togglecomp',ClientTaskworktime.findOne({id:id}));
	},
	'keyup .inputcomments':function(event){
		event.preventDefault();
		var input = $(event.target).val();
		var id = this.id;
		// console.log(id);
	    ClientTaskworktime.update({id:id}, {
	      $set: { comment: input },
	    });
	    document.getElementById('commentsinput').value = input;
		Session.set('togglecomp',ClientTaskworktime.findOne({id:id}));
	},
	//close change over box
	'click .changeover-close':function () {
		Session.set('changeover-showup',false);
		// Meteor.call('updatechangeover',true,time.get(),count);
		var currentTime = Session.get('time');
		updatechangeover(true,currentTime);
		inserttaskAschangover(false, currentTime);
		Session.set('toggle-hour-comp',null);
		Session.set('togglecomp', null);
		return false;
	},
	'click .toggle-jobComplete': function(){
		Session.set('changeover-starttime',Session.get('time'));
		let cur_taks_index = absolute_displayindex;
		let Taskrecord_object = Taskrecord.findOne({cell:Cookie.get('cell')});
		let sumchangeoverDuration = 0;
		if(Taskrecord_object && server_taskrecord_firstrun && cur_taks_index == Taskrecord_object.curtaskid){
			// starttime = Taskrecord_object.startime;
			// Session.set('changeover-starttime',Taskrecord_object.startime);
			// console.log('toggle-jobComplete',0);
			Session.set('Plannedworktime',Taskrecord_object.plannedworktime);
			Session.set('pretime', Taskrecord_object.startime);
			sumchangeoverDuration =  Session.get('sumchangeoverDuration_server') != null ? Session.get('sumchangeoverDuration_server'):0;
			server_taskrecord_firstrun = false;
		}else{
			console.log('toggle-jobComplete',1);
			//get the currnet planned worktime
			if(this.id.length == 1){
				Session.set('Plannedworktime',this.worktime);
			}
			sumchangeoverDuration =  Session.get('sumchangeoverDuration') != null ? Session.get('sumchangeoverDuration'):0;
		}
		// starttime = Taskrecord_object.startime;
		// sumchangeoverDuration =  Session.get('sumchangeoverDuration_server');
		// timeused = moment(timeformat-starttime).format('mm');
		var currentTime = Session.get('time');

		var plannedworktime = Session.get('Plannedworktime');
		var worktime = this.worktime;
		var partnumber = this.partnumber;
		if (Session.get('toggle-hour-comp') != null){
			alert('Please fill up the form first!');
			return;
		}
		
		var timeformat = moment(currentTime,format);
		//here is the test code by using the second!
		if(Session.get('pretime') == null){
			if (Session.get('test-mode-time') != null){
				var timeused = moment(timeformat).format('ss');
				//changeoverCounter = Math.floor((changeoverCounter/60)*worktime);
		    }else{
		    	var timeused = moment(timeformat).format('mm');
		    	//change timeused when the current time is fallen into the special time span
				if (timeformat.isBetween(reststart1, restend1)) {
					timeused = moment(timeformat-reststart1).format('mm');
				} else if (timeformat.isBetween(reststart2, restend2)){
					timeused = moment(timeformat-reststart2).format('mm');
				}else if (timeformat.isBetween(reststart3, restend3)){
					timeused = moment(timeformat-reststart3).format('mm');
				}else if (timeformat.isBetween(reststart4, restend4)){
					timeused = moment(timeformat-reststart4).format('mm');
				}else if (timeformat.isBetween(reststart5, restend5)){
					timeused = moment(timeformat-reststart5).format('mm');
				}else if (timeformat.isBetween(reststart6, restend6)){
					timeused = moment(timeformat-reststart6).format('mm');
				}
		    }
		}else{
			var pre_time = Session.get('pretime');
			if (Session.get('test-mode-time') != null){
				var timeused = moment(timeformat-pre_time).format('ss');
				//changeoverCounter = Math.floor((changeoverCounter/60)*worktime);
		    }else{
		    	var timeused = moment(timeformat-pre_time).format('mm');
		    } 
		}
		// var realtimeused = timeused - sumchangeoverDuration;
		
		var realtimeused = timeused;

		console.log([timeused,sumchangeoverDuration]);
		realtimeused = Math.floor((realtimeused/60)*plannedworktime);
		
		var timechanged = worktime-realtimeused;
		 //get the earnedtime per piece
		if (partnumber != 'Part Not Available'){
			let MinutesPP_one = Partnumber.findOne({cell:Cookie.get('cell'), part:partnumber}).MinutesPP_one;
			var plannumber = MinutesPP_one == '0' ? 11.1 : MinutesPP_one;
				// let MinutesPP_one = (partnumber == 'Part Not Available') ? 
			// '0': Partnumber.findOne({cell:Session.get('cell'), part:partnumber}).MinutesPP_one;
			var operatorcount = Cookie.get('operatorcount');
			if (operatorcount == 2){
				plannumber = Partnumber.findOne({cell:Cookie.get('cell'), part:partnumber}).MinutesPP_two;
			}else if(operatorcount == 3){
				plannumber = Partnumber.findOne({cell:Cookie.get('cell'), part:partnumber}).MinutesPP_three;
			}

			plannumber = plannumber == ''? 0 : realtimeused/plannumber;
			plannumber = Math.floor(plannumber);
			// plannumber = Math.round( plannumber * 10 ) / 10;
		}else{
			plannumber = 0;
		}

	    ClientTaskworktime.update({id:this.id}, {
	      $set: { worktime: realtimeused, plan:plannumber },
	    });
		// this.plan = this.plan * (sec/60);
		var info = [true,ClientTaskworktime.findOne({id:this.id}),timechanged];
		Session.set('taskIsComplete',info);
		// Cookie.set('last_timechanged',realtimeused);
		// var resetinputfiled = document.getElementById('commentsinput').value ="Change Over!";
		Session.set('togglecomp', ClientTaskworktime.findOne({id:this.id}));
		Session.set('toggle-hour-comp','open');

	},
	'click .toggle-submit': function(){
		//set complete job toggle
		if (Session.get('togglecomp').status == null || (Session.get('togglecomp').status == 'red' && Session.get('wrongtype') == null)){
			alert("Please fill the form!");
			return;
		}
		if(Session.get('submited') == 'yes'){
			alert("You have aleady submit it, please close the box!");
			return;
		}
		if(Cookie.get('operatorcount') == 0){
			alert("Please select at least one operator!");
			return;
		}

		var reason =Session.get('reason');
		var currentTime = Session.get('time');
		if (Session.get('toggleisred')){
			var status = 'red';
		}else{
			var status = 'green';
		}

		var tempobject = Session.get('togglecomp');
		var id = tempobject.id;
		var timespan = tempobject.timespan;
		var partnumber = tempobject.partnumber;

		var worktime = tempobject.worktime;
		var plan = tempobject.plan;
		var actual = tempobject.actual;
		var comment = tempobject.comment;
		var buildingnumber = Cookie.get('buildingnumber');
		var cell = Cookie.get('cell');
		//check if there no value set for multiple operator
		var earnedtime = Session.get('earnedTimePPiecePOpe') == 0? worktime : Session.get('earnedTimePPiecePOpe') * actual;
		console.log([Session.get('earnedTimePPiecePOpe'),actual,earnedtime])
    	
		//check whether the last task process is incompelete
		// let Taskrecord_object = Taskrecord.findOne({cell:Cookie.get('cell')});
		// let cur_taks_index = absolute_displayindex;
		// if(Taskrecord_object && server_taskrecord_firstrun){
		// 	if(Taskrecord_object.lastidcount != null && Taskrecord_object.lastid != null){
		// 		count = Taskrecord_object.lastidcount;
		// 		curid = Taskrecord_object.lastid;
		// 	}
		// 	if(curid.length == 1 ){
		// 		Meteor.call('client_server_record_add_id', Cookie.get('cell'), curid + 1, 1);
			
		// 	}else{
		// 		Meteor.call('client_server_record_add_id', Cookie.get('cell'), curid.substring(0,1) + ( parseInt(curid.substring(1,2)) + 1), count+1);
			
		// 	}
		// 	server_taskrecord_firstrun = false;
		// }

		console.log('count0',count);
    	var info = Session.get('taskIsComplete');
    	if(info != null){
	    	var trigger = info[0];
			if (Session.get('tempchangeoverid') == Session.get('taskIsComplete')[1].id.substring(0,1)){
				count++;	
			}else{
				count = 1;
			}
			//add change over counts
			countsum++;
		}else{
			var trigger = false;
		}
		
    	Session.set('addtaskcountsum',countsum); //this session is the count of the current time span cilent side only tasks
		var operatorIDarray = JSON.parse(Cookie.get('operatorarray'))[1];
		// console.log(operatorIDarray);
    	//check whether the job is end eearly
    	if(trigger){
    		//rename the id
    		if(info[1].id.length == 1){
    			var newid = info[1].id + count;
    		}else{
    			var newid = info[1].id.substring(0,1) + count;
    		}
    		
    		Session.set('tempchangeoverid',info[1].id.substring(0,1));
			// console.log('count',newid );
    		//insert the task from server side
    		Meteor.call('inserttask', id, timespan, partnumber, worktime, plan, actual, reason,
    		 status,currentTime,comment,operatorIDarray,earnedtime,buildingnumber, cell);
    		Session.set('submited', 'yes');
    		Session.set('togglecomp', {id:id, timespan:timespan, partnumber:partnumber });

			alert("submited!");
			//change worktime by the changover time
			worktime = info[2];
			comment = "XXX";
			// console.log(info[1].id);
			ClientTaskworktime.remove({id:info[1].id})
			ClientTaskworktime.insert(
				{ id: newid, timespan: timespan, worktime: worktime, plan:'0', actual:'0',
				 reason: 'XXX' ,status:null, partnumber: partnumber,comment:comment, earnedtime:'0'
				})


    	}else{
    		// console.log(info[1].id);
			ClientTaskworktime.remove({id:Session.get('togglecomp').id})
    		Meteor.call('inserttask', id, timespan, partnumber, worktime, plan, actual,
    		 reason, status,currentTime,comment,operatorIDarray,earnedtime,buildingnumber, cell);
    		Session.set('submited', 'yes');
    		alert("submited!");
    	}

    	if(Session.get('taskIsComplete')!=null){
			Session.set('changeover-showup',true);
		}
		Meteor.call('setColorDefault');
		Meteor.call('setnull');
		var resetinputfiled = document.getElementById('popupinput').value ="";
		var resetinputfiled = document.getElementById('commentsinput').value ="";
		var resetselect = document.getElementById('popupselect').style.background= "rgba(099,099,099,.2)";
		Session.set('toggle-hour-comp',null)
		console.log('count2',count);
		return true;
		
	},
	// reason button function
	'click .fa-commenting': function(events){
		Session.set('wrongtype', 0);
		return;
	},
	'click .fa-cogs': function(events){
		Session.set('wrongtype', 1);
		return;
	},
	'click .fa-ban': function(){
		Session.set('wrongtype', 2);
		return;
	},
	'click .fa-exclamation-triangle': function(){
		Session.set('wrongtype', 3);
		return;
	},
	'click .fa-pause': function(){
		Session.set('wrongtype', 4);
		return;
	},
	'click .fa-pencil-square-o': function(){
		Session.set('wrongtype', 5);
		return;
	},
		//remove operator
	'click .tagsname':function (events) {
		var operatorcount = Cookie.get('operatorcount');
		operatorcount--;
		var id = $(events.currentTarget).data('id');

		var operatorinitial = JSON.parse(Cookie.get('operatorarray'))[0];
		var operatorIDarray = JSON.parse(Cookie.get('operatorarray'))[1];
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
		Cookie.set('operatorcount',operatorcount);
		Cookie.set('operatorarray',JSON.stringify([operatorinitial,operatorIDarray]));
	},
	'click .search-edit':(event)=>{
		// console.log(this);
		return;
	}
});


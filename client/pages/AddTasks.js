import { Tasks, Cell, Partnumber, Plan, Operator, EarnedTimePP,Anouncements,
		Safetymessage, Department, Menu } from '/lib/collections.js';
import moment from 'moment';
import { ClientTaskworktime } from '/client/main.js';
// Tasks = new Mongo.Collection('task');
// var time = new ReactiveVar(new Date());
var format = 'hh:mm:ss';
//start from 12pm not 12:30pm
var reststart1 = moment('12:30:00',format);
var reststart2 = moment('13:30:00',format);
var reststart3 = moment('21:30:00',format);
var reststart4 = moment('22:30:00',format);
var restend1 = moment('13:30:00',format);
var restend2 = moment('14:30:00',format);
var restend3 = moment('22:30:00',format);
var restend4 = moment('23:30:00',format);
var shift_1_start = moment('05:50:00',format);
var shift_1_end = moment('14:50:00',format);
var shift_2_start = moment('15:00:00',format);
var shift_2_end = moment('23:50:00',format);
var count = 0;
var countsum = 0;
var haverun = false;

function inserttaskAschangover(iscomplete,currentTime){
	var tempobject = Session.get('togglecomp');
	if(iscomplete){
		var curId = Session.get('tempchangeoverid') + count;
		var changeoverDuration = ClientTaskworktime.findOne({id:curId}).worktime.substring(0,2);
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
	    pre_sumchangeoverDuration = Session.get('changeoverDuration') != null ? Session.get('changeoverDuration') : 0;
	    Session.set('sumchangeoverDuration', pre_sumchangeoverDuration + changeoverDuration);
	}
	
	var id = tempobject.id;
	var timespan = tempobject.timespan;
	var partnumber = tempobject.partnumber;
	var plantoactual = 0;
	var actual = 0;
	var reason = null;
	var status = 'changeover';
	var comment = 'changeover';
	var buildingnumber = Session.get('buildingnumber');
	var cell = Session.get('cell');
	var earnedtime = 0;
	var operatorIDarray = Session.get('operatorarray')[1];

	Meteor.call('inserttask', id, timespan, partnumber, changeoverDuration, plantoactual, actual, reason,
    		 status,currentTime,comment,operatorIDarray,earnedtime,buildingnumber, cell);

	// return [id, timespan, partnumber, worktime, plantoactual, actual, reason,
	//  status,createdAt,comment,operatorIDarray,earnedtime,buildingnumber, cell];

}

Template.AddTasks.onCreated(function(){
	window.name = "parent";
	document.title = 'HxH Tracking System';
	// Session.set('popup_flag',null);
	// var currentTime = time.get();
	// var currentTime = Session.get('time');
	// var test_mode_flag = false;
	// this.autorun(() => {
	// 	this.subscribe('anouncements');
	// })
	// this.autorun(() => {
	// 	this.subscribe('task');
	// })
	// this.autorun(() => {
	// 	this.subscribe('partnumber');
	// })
	// this.autorun(() => {
	// 	this.subscribe('plan');
	// })
	// this.autorun(() => {
	// 	this.subscribe('operator');
	// })
	// this.autorun(() => {
	// 	this.subscribe('earnedTimePPiece');
	// })
	// Meteor.setInterval(function() {
	// 	time.set(new Date());
	// }, 1000);

	// Meteor.call('initializeClientTaskworktime',currentTime,test_mode_flag);
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
		return Session.get('buildingnumber') != null ? Session.get('buildingnumber'):'';
	},
	selectedcell:function(){
		if(Session.get('cell') != null){
			var cell = Session.get('cell');
			var cellobject = Cell.findOne({cellId:cell});
			if(!cellobject){
				return cell;
			}else{
				return cellobject.cellname;	
			}

		}else{
			return '';
		}
	},
	selectedpart:function(){
		// console.log(this.partnumber);
		return this.partnumber;
	},
	anouncements: function(){
		return Anouncements.find();
	},
	isChangeover:function(){
		return Session.get('changeover-starttime') != null ? true:false;
	},
	changeoverCounter: function(){
	    // var currentTime = time.get();
	    var currentTime = Session.get('time');
	    var starttime = Session.get('changeover-starttime');
	    // Session.set('changeover-end',time.get());
		return moment(currentTime-starttime).format('mm:ss');
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
		return Session.get('togglecomp') != null ? Session.get('togglecomp').plantoactual:'';
	},
	recordedactual: function(){
		return Session.get('togglecomp') != null ? Session.get('togglecomp').actual:'';
	},
	recordedcomment: function(){
		return Session.get('togglecomp') != null ? Session.get('togglecomp').reason:'';
	},
	isred: function(){
		return this.status == 'red'? true : null;
	},
	isgreen: function(){
		return this.status == 'green'? true : null;
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
			return 'toggle-changeover';
		}	
	},
	admin: function(){
		return Roles.userIsInRole(Meteor.userId(), 'admin');
	},
	tasks: function(){
		// console.log(Tasks.find().fetch());
		return Tasks.find();
	},

	clienttaskworktime: function(){

		// console.log(ClientTaskworktime.findOne({id:'a1'}));
		return ClientTaskworktime.find({}, { sort: { id: 1 }} );
	},
	timepassed: function(a,b){
		return a <= b;
	},
	//check whether it is no production
	isNoprod:function(a,b){
		if(a<b && this.actual == 0){
			return true;
		}else{
			return false;
		}
	},
	isgrey:function(a,b){
		if(a<b && this.actual == 0){
			return 'background: #EEE';
		}else{
			return '';
		}
	},
	// jobComplete: function(index){
	// 	if (Session.get('toggle-jobComplete')){

	// 	}
	// },
	// displaydata: function(index){
	// 	// console.log(this._id);
	// 	return Session.get('displaydata')>=index;
	// },
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
					Meteor.call('updatechangeover',false,currentTime,count);
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
					Meteor.call('updatechangeover',false,currentTime,count);
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
					Meteor.call('updatechangeover',false,currentTime,count);
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
						// Session.set('taskIsCompletenotFinish',true);
						inserttaskAschangover(true,Session.get('time'));
						Meteor.call('updatechangeover',false,currentTime);
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
						// Session.set('taskIsCompletenotFinish',true);
						inserttaskAschangover(true,Session.get('time'));
						Meteor.call('updatechangeover',false,currentTime);
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
				if(hour == 22 && min == 29 && sec == 59){
					if(haverun){
						return;
					}
					document.title = '[New Message]';
					if(Session.get('changeover-showup') == true){
						// Session.set('taskIsCompletenotFinish',true);
						inserttaskAschangover(true,Session.get('time'));
						Meteor.call('updatechangeover',false,currentTime);
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
				if(hour == 23 && min == 29 && sec == 59){
					if(haverun){
						return;
					}
					document.title = '[New Message]';
					if(Session.get('changeover-showup') == true){
						// Session.set('taskIsCompletenotFinish',true);
						inserttaskAschangover(true,Session.get('time'));
						Meteor.call('updatechangeover',false,currentTime);
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
						Meteor.call('updatechangeover',false,currentTime,count); 
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
						Meteor.call('updatechangeover',false,currentTime,count); 
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
		// var currentTime = time.get();
		var currentTime = Session.get('time');
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
		var displayindex = 0;
		if (Session.get('test-mode-time') != null){
			var timearray = Session.get('test-mode-time');
			if (min == timearray[1]){
				//fix bug when operator is failed to fill up the form
				// if(Session.get('taskIsComplete') != null && this != Session.get('taskIsComplete')[1]){

				// }
				displayindex = 0;
				// Session.set('togglecompinfo',this);
			}else if (min == parseInt(timearray[1])+1){
				displayindex = 1;
			}else if (min == parseInt(timearray[1])+2){
				displayindex = 2;
			}else if (min == parseInt(timearray[1])+3){
				displayindex = 3;
			}
			// displayindex =4;
			// console.log(submitChangeoverparseInt(timearray[1])+1);
		}else{
			// console.log(timeformat);
			// Session.set('currenttime',timeformat);	


			if (timeformat.isBetween(reststart1, restend1)) {
				displayindex = 6;
			} else if (timeformat.isBetween(reststart2, restend2)){
				displayindex = 7;
			}else if(timeformat.isBetween(reststart3, restend3)){
				displayindex = 6;
			}else if(timeformat.isBetween(reststart4, restend4)){
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
		if (Session.get('addtaskcountsum') != null){
			var count = Session.get('addtaskcountsum');
			displayindex = displayindex + count;
		}
		// console.log(displayindex)
		return displayindex;
		// return 4;
  	},
	// plan: function(){
	// 	// console.log(Tasks.find().fetch());
	// 	var selectbuilding =  Session.get('buildingnumber');
	// 	var selectcell = Session.get('cell');
	// 	// console.log(Plan.find({buildingnumber: selectbuilding,cell:selectcell,worktime:this.worktime}).fetch());
	// 	return Plan.find({buildingnumber: selectbuilding,cell:selectcell,worktime:this.worktime}).fetch();
	// 	// return EarnedTimePP.find({buildingnumber: selectbuilding,cell:selectcell,worktime:this.worktime}).fetch();
	// },

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
		
		// if("XMLHttpRequest" in window)xmlhttp=new XMLHttpRequest();
		// if("ActiveXObject" in window)xmlhttp=new ActiveXObject("Msxml2.XMLHTTP");
		// xmlhttp.open('GET',url,true);
		// xmlhttp.onreadystatechange=function()
		// {
		//     if(xmlhttp.readyState==4)alert(xmlhttp.responseText);
		// };
		// xmlhttp.send(null);
		// var iframe=document.createElement("iframe");
		// iframe.onload=function()
		// {
		//     alert(iframe.contentWindow.document.body.innerHTML);
		// }
		// iframe.src=url;
		// iframe.style.display="none";
		// document.body.appendChild(iframe);
		// $.get(url,function(data)//Remember, same domain
		// {
		//     alert(data);
		// });
		// console.log(con);
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
		var plantoactual = tempobject.plantoactual;
		var actual = tempobject.actual;
		var id = tempobject.id;

	    if(plantoactual - actual<= 0) {
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
		var operatorcount = Session.get('operatorcount');
		// console.log(partnumber);
		// var value = Plan.findOne({worktime:this.worktime,partnumber:partnumber}).value;
		var value = 0;
		if (partnumber == 'Part Not Available'){
			Session.set('earnedTimePPiecePOpe',value);
		}else{
			var MinutesPP_one = Partnumber.findOne({cell:Session.get('cell'), part:partnumber}).MinutesPP_one;
			value = MinutesPP_one == '0' ? 11.1 : MinutesPP_one;
			// var value = 1/MinutesPP_one;
			if (operatorcount == 2){
				value = Partnumber.findOne({cell:Session.get('cell'), part:partnumber}).MinutesPP_two;
			}else if(operatorcount == 3){
				value = Partnumber.findOne({cell:Session.get('cell'), part:partnumber}).MinutesPP_three;
			}
			Session.set('earnedTimePPiecePOpe',value);
			value = value == ''? 0: this.worktime.substring(0,2)/value;
			//returns the largest integer less than the value
			value = Math.floor(value);
			// value = Math.round( value * 10 ) / 10;
		}
		
		var index = $(evt.currentTarget).data('id');
		console.log(value);
		//for client
	    ClientTaskworktime.update(this, {
	      $set: { plantoactual: value, partnumber: partnumber },
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
	//close new job box
	// 'click .close-addtask-popup':function () {
	// 	if (Session.get('submited') == null){
	// 		alert("Please fill the form!");
	// 		return false;
	// 	}else{
	// 		if(Session.get('taskIsComplete')!=null){
	// 			Session.set('changeover-showup',true);
	// 			// Session.set('changeover-starttime',time.get());
	// 			Session.set('changeover-starttime',Session.get('time'));
	// 		}
	// 		Meteor.call('setColorDefault');
	// 		Meteor.call('setnull');
	// 		var resetinputfiled = document.getElementById('popupinput').value ="";
	// 		var resetinputfiled = document.getElementById('commentsinput').value ="";
	// 		var resetselect = document.getElementById('popupselect').style.background= "rgba(099,099,099,.2)";
	// 		Session.set('toggle-hour-comp',null)
	// 		return true;
	// 	}

	// },
	//close change over box
	'click .changeover-close':function () {
		Session.set('changeover-showup',false);
		// Meteor.call('updatechangeover',true,time.get(),count);
		var currentTime = Session.get('time');
		
		Meteor.call('updatechangeover',true,currentTime,count);
		inserttaskAschangover(false, currentTime);
		Session.set('toggle-hour-comp',null);
		Session.set('togglecomp', null);
		return false;
	},
	'click .toggle-jobComplete': function(){
		//set complete job toggle
		// Session.set('taskIsComplete',true);
		// var timeformat = moment(currentTime,format);
		// var currentTime = time.get();
		Session.set('changeover-starttime',Session.get('time'));
		
		var currentTime = Session.get('time');
		//get the currnet planned worktime
		if(this.id.length == 1){
			Session.set('Plannedworktime',this.worktime.substring(0,2));
		}
		var plannedworktime = Session.get('Plannedworktime');
		var worktime = this.worktime.substring(0,2);
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
		
	    var sumchangeoverDuration =  Session.get('sumchangeoverDuration') != null ? Session.get('sumchangeoverDuration'):0;
		// var pre_time = Session.get('pretime') == null ? 0 : Session.get('pretime');
		
		Session.set('pretime', currentTime);

		var realtimeused = timeused - sumchangeoverDuration;
		
		
		console.log([timeused,sumchangeoverDuration]);
		realtimeused = Math.floor((realtimeused/60)*plannedworktime);
		
		var timechanged = worktime-realtimeused;
		 //get the earnedtime per piece
		if (partnumber != 'Part Not Available'){
			let MinutesPP_one = Partnumber.findOne({cell:Session.get('cell'), part:partnumber}).MinutesPP_one;
			var plannumber = MinutesPP_one == '0' ? 11.1 : MinutesPP_one;
				// let MinutesPP_one = (partnumber == 'Part Not Available') ? 
			// '0': Partnumber.findOne({cell:Session.get('cell'), part:partnumber}).MinutesPP_one;
			var operatorcount = Session.get('operatorcount');
			if (operatorcount == 2){
				plannumber = Partnumber.findOne({cell:Session.get('cell'), part:partnumber}).MinutesPP_two;
			}else if(operatorcount == 3){
				plannumber = Partnumber.findOne({cell:Session.get('cell'), part:partnumber}).MinutesPP_three;
			}

			plannumber = plannumber == ''? 0 : realtimeused/plannumber;
			plannumber = Math.floor(plannumber);
			// plannumber = Math.round( plannumber * 10 ) / 10;
		}else{
			plannumber = 0;
		}

	    ClientTaskworktime.update({id:this.id}, {
	      $set: { worktime: realtimeused + ' min', plantoactual:plannumber },
	    });
		// this.plan = this.plan * (sec/60);
		var info = [true,ClientTaskworktime.findOne({id:this.id}),timechanged];
		Session.set('taskIsComplete',info);
		// var resetinputfiled = document.getElementById('commentsinput').value ="Change Over!";
		Session.set('togglecomp', ClientTaskworktime.findOne({id:this.id}));
		Session.set('toggle-hour-comp','open');
	    // ClientTaskworktime.update({id:this.id}, {
	    //   $set: { worktime: ( timechanged + ' min' },
	    // });
	},
	'click .toggle-submit': function(){
		//set complete job toggle
		// Session.set('taskIsComplete',true);
		if (Session.get('togglecomp').status == null || (Session.get('togglecomp').status == 'red' && Session.get('wrongtype') == null)){
			alert("Please fill the form!");
			return;
		}
		if(Session.get('submited') == 'yes'){
			alert("You have aleady submit it, please close the box!");
			return;
		}
		if(Session.get('operatorcount') == 0){
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
		var plantoactual = tempobject.plantoactual;
		var actual = tempobject.actual;
		var comment = tempobject.comment;
		var buildingnumber = Session.get('buildingnumber');
		var cell = Session.get('cell');
		//check if there no value set for multiple operator
		var earnedtime = Session.get('earnedTimePPiecePOpe') == 0? worktime : Session.get('earnedTimePPiecePOpe') * actual;
		console.log([Session.get('earnedTimePPiecePOpe'),actual,earnedtime])
    	var info = Session.get('taskIsComplete');
    	if(info != null){
	    	var trigger = info[0];
			if (Session.get('tempchangeoverid') == Session.get('taskIsComplete')[1].id.substring(0,1)){
				count++;	
			}else{
				count = 1;
				// console.log(count);
			}
			//add change over counts
			countsum++;
		}else{
			var trigger = false;
		}
    	Session.set('addtaskcountsum',countsum);
		var operatorIDarray = Session.get('operatorarray')[1];
		// console.log(operatorIDarray);
    	//check whether the job is end eearly
    	if(trigger){
    		//rename the id
    		if(info[1].id.length == 1){
    			var newid = info[1].id + count;
    		}else{
    			var newid = info[1].id.substring(0,1) + count;
    		}
    		// Session.set('oldtaskcount',count);
    		// console.log(newid);
    		var comment = "XXX";
    		Session.set('tempchangeoverid',info[1].id.substring(0,1));
    		//insert the task from server side
    		Meteor.call('inserttask', id, timespan, partnumber, worktime.substring(0,2), plantoactual, actual, reason,
    		 status,currentTime,comment,operatorIDarray,earnedtime,buildingnumber, cell);
    		Session.set('submited', 'yes');
			alert("submited!");
			//change worktime by the changover time
			worktime = info[2];
			ClientTaskworktime.insert(
				{ id: newid, timespan: timespan, worktime: worktime + ' min', plantoactual:'0', actual:'0',
				 reason: 'XXX' ,status:null, partnumber: partnumber,comment:comment, earnedtime:'0'
				}
    		);
    	}else{
    		Meteor.call('inserttask', id, timespan, partnumber, worktime.substring(0,2), plantoactual, actual,
    		 reason, status,currentTime,comment,operatorIDarray,earnedtime,buildingnumber, cell);
    		Session.set('submited', 'yes');
    		alert("submited!");
    	}

    	if(Session.get('taskIsComplete')!=null){
			Session.set('changeover-showup',true);
			// Session.set('changeover-starttime',time.get());
		}
		Meteor.call('setColorDefault');
		Meteor.call('setnull');
		var resetinputfiled = document.getElementById('popupinput').value ="";
		var resetinputfiled = document.getElementById('commentsinput').value ="";
		var resetselect = document.getElementById('popupselect').style.background= "rgba(099,099,099,.2)";
		Session.set('toggle-hour-comp',null)
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
	'click .search-edit':(event)=>{
		// console.log(this);
		return;
	}
});


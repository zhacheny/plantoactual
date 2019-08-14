import { Tasks, Partnumber, Taskworktime, Plan, Operator, EarnedTimePP,Anouncements } from '/lib/collections.js';
import moment from 'moment';
import { ClientTaskworktime } from '/client/main.js';
// Tasks = new Mongo.Collection('task');
var time = new ReactiveVar(new Date());
var format = 'hh:mm:ss';
//start from 12pm not 12:30pm
var reststart1 = moment('12:00:00',format);
var reststart2 = moment('13:30:00',format);
var reststart3 = moment('14:30:00',format);
var reststart4 = moment('15:30:00',format);
var restend1 = moment('13:30:00',format);
var restend2 = moment('14:30:00',format);
var restend3 = moment('15:30:00',format);
var restend4 = moment('16:30:00',format);
var count = 0;
var countsum = 0;
var havefun = false;

Template.AddTasks.onCreated(function(){
	this.autorun(() => {
		this.subscribe('anouncements');
	})
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
	Meteor.setInterval(function() {
		time.set(new Date());
	}, 1000);
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

});


Template.AddTasks.helpers({
	// viewpdf: function() {
	// 	var partnumber = Session.get('partnumber');

	// 	console.log(url);
	// },
	anouncements: function(){
		return Anouncements.find();
	},
	changeoverCounter: function(){
	    var currentTime = time.get();
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
		if (Session.get('togglecomp')){
			if (Session.get('toggleisred')){
				return 'add-tasks-expand';
			
			}else{
				return 'add-tasks';
			}
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

	taskworktime: function(){
		// console.log(Tasks.find().fetch());
		return Taskworktime.find();
	},
	clienttaskworktime: function(){

		// console.log(ClientTaskworktime.findOne({id:'a1'}));
		return ClientTaskworktime.find({}, { sort: { id: 1 }} );
	},
	timepassed: function(a,b){
		return a <= b;
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
		var currentTime = time.get();
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
				if(haverun){
					return;
				}
				//check whether the oprerator is able to finish the form
				if(Session.get('changeover-showup') == true){
					Session.set('taskIsCompletenotFinish',true);
					Meteor.call('updatechangeover',false,currentTime,count);
				}else{
					Session.set('togglecomp',this);
				}
				Session.set('changeover-showup',false);
				Session.set('changeovertimecount',null);
				haverun = true;
			}else if (min ==parseInt(timearray[1])+1 && sec == 59){
				if(haverun){
					return;
				}
				if(Session.get('changeover-showup') == true){
					Session.set('taskIsCompletenotFinish',true);
					Meteor.call('updatechangeover',false,currentTime,count);
				}else{
					Session.set('togglecomp',this);
				}
				Session.set('changeover-showup',false);
				Session.set('changeovertimecount',null);
				haverun = true;
			}else if (min == parseInt(timearray[1])+2 && sec == 59){
				if(haverun){
					return;
				}
				if(Session.get('changeover-showup') == true){
					Session.set('taskIsCompletenotFinish',true);
					Meteor.call('updatechangeover',false,currentTime,count);
				}else{
					Session.set('togglecomp',this);
				}
				Session.set('changeover-showup',false);
				Session.set('changeovertimecount',null);
				haverun = true;
			}
		}else{
			if (timeformat.isBetween(reststart1, restend1)) {
				if(hour == 13 && min == 29 && sec == 59){
					if(Session.get('changeover-showup') == true){
						Session.set('taskIsCompletenotFinish',true);
						Meteor.call('updatechangeover',false,currentTime);
					}else{
						Session.set('togglecomp',this);
					}
					Session.set('changeover-showup',false);
					Session.set('changeovertimecount',null);
				}
			} else if (timeformat.isBetween(reststart2, restend2)){
				if(hour == 14 && min == 29 && sec == 59){
					if(Session.get('changeover-showup') == true){
						Session.set('taskIsCompletenotFinish',true);
						Meteor.call('updatechangeover',false,currentTime);
					}else{
						Session.set('togglecomp',this);
					}
					Session.set('changeover-showup',false);
					Session.set('changeovertimecount',null);
				}
			}else if (timeformat.isBetween(reststart3, restend3)){
				if(hour == 15 && min == 29 && sec == 59){
					if(Session.get('changeover-showup') == true){
						Session.set('taskIsCompletenotFinish',true);
						Meteor.call('updatechangeover',false,currentTime);
					}else{
						Session.set('togglecomp',this);
					}
					Session.set('changeover-showup',false);
					Session.set('changeovertimecount',null);
				}
			}else{
				// if (hour == 11 && min == 55 && sec == 19){
				// 	if(haverun){
				// 		return;
				// 	}
				// 	if(Session.get('changeover-showup') == true){
				// 		Session.set('taskIsCompletenotFinish',true);
				// 		Meteor.call('updatechangeover',false,currentTime,count); 
				// 	}else{
				// 		Session.set('togglecomp',this);
				// 	}
				// 	Session.set('changeover-showup',false);
				// 	Session.set('changeovertimecount',null);
				// 	haverun = true;
				// }
				if (hour >= 6 && hour < 15 && min == 59 && sec == 59){
					if(haverun){
						return;
					}
					if(Session.get('changeover-showup') == true){
						Session.set('taskIsCompletenotFinish',true);
						Meteor.call('updatechangeover',false,currentTime,count); 
					}else{
						Session.set('togglecomp',this);
					}
					Session.set('changeover-showup',false);
					Session.set('changeovertimecount',null);
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
		var currentTime = time.get();
		Session.set('time',currentTime);
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
			// console.log(parseInt(timearray[1])+1);
		}else{
			// console.log(timeformat);
			// Session.set('currenttime',timeformat);	


			if (timeformat.isBetween(reststart1, restend1)) {
				displayindex = 6;
			} else if (timeformat.isBetween(reststart2, restend2)){
				displayindex = 7;
			}else if (timeformat.isBetween(reststart3, restend3)){
				displayindex = 8;
			}else if (timeformat.isBetween(reststart4, restend4)){
				displayindex = 9;
			}else{
				// console.log('is not between');
				// displayindex = timeformat.format('HH') -6;
				// console.log(hour);
				displayindex = hour - 6;
			}
		}
		if (Session.get('addtaskcountsum') != null){
			var count = Session.get('addtaskcountsum');
			displayindex = displayindex + count;
		}
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
		var part = this.partnumber;
		// var pre_url = "";
		var url = pre_url + Partnumber.findOne({part:part}).XMLname;
		var win = window.open(url, '_blank');
		win.focus();
		// console.log(url);
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

	'click .toggle-Test-mode': function(){
		alert('switch to test mode!');
		var currentTime = time.get();
		var timeformat = moment(currentTime,format);
		//set test time
		var hour = moment(timeformat).format('HH');
		var min = moment(timeformat).format('mm');
		var sec = moment(timeformat).format('ss');
		var timearray = [hour,min,sec];
		addtaskcountsum = 0;
		Session.set('test-mode-time',timearray);
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
		 
		let MinutesPP_one = Partnumber.findOne({cell:Session.get('cell'), part:partnumber}).MinutesPP_one;
		var value = 1/MinutesPP_one;
		if (operatorcount >=2){
			value = value/operatorcount;
		}
		Session.set('earnedTimePPiecePOpe',value);
		value = this.worktime.substring(0,2)/value;
		//returns the largest integer less than the value
		value = Math.floor(value);
		var index = $(evt.currentTarget).data('id');
		//for client
	    ClientTaskworktime.update(this, {
	      $set: { plantoactual: value, partnumber: partnumber },
	    });
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

		var id = Session.get('togglecomp').id;
	    ClientTaskworktime.update({id:id}, {
	      $set: { comment: input },
	    });
		Session.set('togglecomp',ClientTaskworktime.findOne({id:id}));
	},
	//close new job box
	'click .close-addtask-popup':function () {
		if (Session.get('submited') == null){
			alert("Please fill the form!");
			return false;
		}else{
			if(Session.get('taskIsComplete')!=null){
				Session.set('changeover-showup',true);
				Session.set('changeover-starttime',time.get());
			}
			Meteor.call('setColorDefault');
			Meteor.call('setnull');
			var resetinputfiled = document.getElementById('popupinput').value ="";
			var resetinputfiled = document.getElementById('commentsinput').value ="";
			var resetselect = document.getElementById('popupselect').style.background= "rgba(099,099,099,.2)";

			return true;
		}

	},
	//close change over box
	'click .changeover-close':function () {
		Session.set('changeover-showup',false);
		Meteor.call('updatechangeover',true,time.get(),count);
		return false;
	},
	'click .toggle-jobComplete': function(){
		//set complete job toggle
		// Session.set('taskIsComplete',true);
		var timeformat = moment(currentTime,format);
		if (Session.get('togglecomp') != null){
			alert('Please fill up the form first!');
			return;
		}
		var currentTime = time.get();
		var worktime = this.worktime.substring(0,2);
		var partnumber = this.partnumber;
		 //get the earnedtime per piece
		let MinutesPP_one = Partnumber.findOne({cell:Session.get('cell'), part:partnumber}).MinutesPP_one;
		var plannumber = 1/MinutesPP_one;
		var operatorcount = Session.get('operatorcount');
		if (operatorcount >=2){
			plannumber = plannumber/operatorcount;
		}
		var timeformat = moment(currentTime,format);
		//here is the test code by using the second!
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
		var pretimeused = Session.get('changeovertimecount') == null ? 0 : Session.get('changeovertimecount');
		var realtimeused = timeused - pretimeused;
		Session.set('changeovertimecount',timeused);
		realtimeused = Math.floor((realtimeused/60)*worktime);
		var timechanged = worktime-realtimeused;
		plannumber = realtimeused/plannumber;
		plannumber = Math.floor(plannumber);
	    ClientTaskworktime.update({id:this.id}, {
	      $set: { worktime: realtimeused + ' min', comment: 'change over!', plantoactual:plannumber },
	    });
		// this.plan = this.plan * (sec/60);
		var info = [true,ClientTaskworktime.findOne({id:this.id}),timechanged];
		Session.set('taskIsComplete',info);
		var resetinputfiled = document.getElementById('commentsinput').value ="Change Over!";
		Session.set('togglecomp', ClientTaskworktime.findOne({id:this.id}));
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
			alert("Please select at least one operatpr!");
			return;
		}
		var reason =Session.get('reason');
		var currentTime = time;
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
		var earnedtime = Session.get('earnedTimePPiecePOpe') * actual;
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
    		 status,currentTime.curValue,comment,operatorIDarray,earnedtime,buildingnumber, cell);
    		Session.set('submited', 'yes');
			alert("submited!");
			//change worktime by the changover time
			worktime = info[2];
    		ClientTaskworktime.insert(
				{ id: newid, timespan: timespan, worktime: worktime + ' min', plantoactual:'0', actual:'0',
				 reason: 'XXX' ,status:null, partnumber: partnumber,comment:comment, earnedtime:'0'
				}
    		);
			return;
    	}else{
    		Meteor.call('inserttask', id, timespan, partnumber, worktime.substring(0,2), plantoactual, actual,
    		 reason, status,currentTime.curValue,comment,operatorIDarray,earnedtime,buildingnumber, cell);
    		Session.set('submited', 'yes');
    		alert("submited!");
    		return;
    	}
		
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
		console.log(this);
		return;
	}
});


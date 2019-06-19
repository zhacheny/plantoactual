import { Tasks, Partnumber, Taskworktime, Plan, Operator } from '/lib/collections.js';
import moment from 'moment';
import { ClientTaskworktime } from '/client/main.js';
// Tasks = new Mongo.Collection('task');
var time = new ReactiveVar(new Date());
var format = 'hh:mm:ss';
var reststart1 = moment('12:30:00',format);
var reststart2 = moment('13:30:00',format);
var restend1 = moment('13:30:00',format);
var restend2 = moment('14:30:00',format);
var count = 0;
var countsum = 0;


Template.AddTasks.onCreated(function(){
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
	Meteor.setInterval(function() {
		time.set(new Date());
	}, 1000);
	});

Template.AddTasks.helpers({
	displayoperatorone: function(){
		return Session.get('operatorarray')[0] != 'null' ? true : false;
	},
	displayoperatortwo: function(){
		return Session.get('operatorarray')[1] != 'null' ? true : false;
	},
	displayoperatorthree: function(){
		return Session.get('operatorarray')[2] != 'null' ? true : false;
	},

	operatorone: function(){
		if (Session.get('operatorarray') == null){
			return 'null';
		}else if(Session.get('operatorarray')[0] != null){
			return Session.get('operatorarray')[0];
		}else {
			return 'null';
		}
	},
	operatortwo: function(){
		if (Session.get('operatorarray') == null){
			return 'null';
		}else if(Session.get('operatorarray')[1] != null){
			return Session.get('operatorarray')[1];
		}else {
			return 'null';
		}
	},
	operatorthree: function(){
		if (Session.get('operatorarray') == null){
			return 'null';
		}else if(Session.get('operatorarray')[2] != null){
			return Session.get('operatorarray')[2];
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
			var timearray = Session.get('test-mode-time');
			if (min == parseInt(timearray[1]) && sec == 59){
				Session.set('togglecomp',this);
			}else if (min ==parseInt(timearray[1])+1 && sec == 59){
				Session.set('togglecomp',this);
			}else if (min == parseInt(timearray[1])+2 && sec == 59){
				Session.set('togglecomp',this);
			}
		}else{
			if (timeformat.isBetween(reststart1, restend1)) {
				if(hour == 13 && min == 29 && sec == 59){
					Session.set('togglecomp',this);
				}
			} else if (timeformat.isBetween(reststart2, restend2)){
				if(hour == 14 && min == 29 && sec == 59){
					Session.set('togglecomp',this);
				}
			}else{
				// console.log('is not between');
				// displayindex = timeformat.format('HH') -6;
				// console.log(hour);
				if (hour >= 6 && hour < 15 && min == 59 && sec == 59){
					Session.set('togglecomp',this);
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

				// console.log('is between 1230-1330');

				displayindex = 6;
			} else if (timeformat.isBetween(reststart2, restend2)){

				// console.log('is between 1330-1430');
				displayindex = 7;
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
	plan: function(){
		// console.log(Tasks.find().fetch());
		var selectbuilding =  Session.get('buildingnumber');
		var selectcell = Session.get('cell');
		// console.log(Plan.find({buildingnumber: selectbuilding,cell:selectcell,worktime:this.worktime}).fetch());
		return Plan.find({buildingnumber: selectbuilding,cell:selectcell,worktime:this.worktime}).fetch();
	},

});

Template.AddTasks.events({
	'click .add-operator': function(){
		var operatorcount = Session.get('operatorcount');
		var operatorinitial = Session.get('operatorarray');
		var operatorname = Session.get('operator');
		var initial = Operator.findOne({name:operatorname}).initial;
		if (Session.get('operator') == null){
			alert('please type in a valid name to continue!');
			return;
		}
		if (operatorcount > 2){
			alert('can not add more operators!!');
			return;
		}
		Meteor.call('checkIsnull',operatorinitial,initial,operatorcount);
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
		Session.set('test-mode-time',timearray);
	},

	'click .outline': function(events){
		event.preventDefault();
	// Session.set('togglenewjob', this);
		// var a = this.plantoactual;
		// var b = this.actual;
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
		var value = Plan.findOne({worktime:this.worktime,partnumber:partnumber}).value;
		var index = $(evt.currentTarget).data('id');
		// Session.set('displaydata',index);
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
	//clse new job toggle
	'click .close-addtask-popup':function () {
		if (Session.get('submited') == null){
			alert("Please fill the form!");
			return false;
		}else{
			Meteor.call('setColorDefault');
			Meteor.call('setnull');
			var resetinputfiled = document.getElementById('popupinput').value ="";
			var resetinputfiled = document.getElementById('commentsinput').value ="";
			var resetselect = document.getElementById('popupselect').style.background= "rgba(099,099,099,.2)";

			return true;
		}

	},
	'click .toggle-jobComplete': function(){
		//set complete job toggle
		// Session.set('taskIsComplete',true);
		var currentTime = time.get();
		var timeformat = moment(currentTime,format);
		var timeused = moment(timeformat).format('ss');
		var timechanged = (60-timeused)*this.worktime.substring(0,2);
	    ClientTaskworktime.update({id:this.id}, {
	      $set: { comment: 'change over!' },
	    });
		// this.plan = this.plan * (sec/60);
		var info = [true,this,timeused];
		Session.set('taskIsComplete',info);
		var resetinputfiled = document.getElementById('commentsinput').value ="Change Over!";
		Session.set('togglecomp', this);
	    // ClientTaskworktime.update({id:this.id}, {
	    //   $set: { worktime: ( timechanged + ' min' },
	    // });
	},
	'click .toggle-submit': function(){
		//set complete job toggle
		// Session.set('taskIsComplete',true);
		if (Session.get('togglecomp').status == null || (Session.get('togglecomp').status == 'red' && Session.get('wrongtype') == null)){
			console.log('XXX');
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
    	var info = Session.get('taskIsComplete');
    	if(info != null){
	    	var trigger = info[0];
			if (Session.get('tempchangeoverid') == Session.get('taskIsComplete')[1].id.substring(0,1)){
				count++;	
			}else{
				count = 1;
				console.log(count);
			}
			//add change over counts
			countsum++;
		}else{
			var trigger = false;
		}
    	Session.set('addtaskcountsum',countsum);
    	//check whether the job is end eearly
    	if(trigger){
    		//rename the id
    		if(info[1].id.length == 1){
    			var newid = info[1].id + count;
    		}else{
    			var newid = info[1].id.substring(0,1) + count;
    		}
    		// Session.set('oldtaskcount',count);
    		console.log(newid);
    		Session.set('tempchangeoverid',info[1].id.substring(0,1));
    		// console.log(tempobject.id);
    		ClientTaskworktime.insert(
				{ id: newid, timespan: timespan, worktime: worktime, plantoactual:'0', actual:'0',
				 reason: 'XXX' ,status:null, partnumber: partnumber,comment:"XXX"
				}
    		);
    		Meteor.call('inserttask', id, timespan, partnumber, worktime, plantoactual, actual, reason, status,currentTime,comment,Session.get('operatorarray'));
    		Session.set('submited', 'yes');
			alert("submited!");
			return;
    	}else{
    		Meteor.call('inserttask', id, timespan, partnumber, worktime, plantoactual, actual, reason, status,currentTime,comment,Session.get('operatorarray'));
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
		//clse new job toggle
	'click .tagsname':function (events) {
		var operatorcount = Session.get('operatorcount');
		operatorcount--;
		var id = $(events.currentTarget).data('id');

		var array = Session.get('operatorarray');
		console.log(array);
		if(id == 1){
			array[0] = 'null';
		}else if (id == 2){
			array[1] = 'null';
		}else{
			array[2] = 'null';
		}
		Session.set('operatorcount',operatorcount);
		Session.set('operatorarray',array);
	},
});

Tracker.autorun(function() {
	if (Session.get('togglecomp')==null){
		return;
	}
	var wrongtype = Session.get('wrongtype');
	Meteor.call('errortype',wrongtype);

});


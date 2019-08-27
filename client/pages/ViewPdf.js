import { Tasks, Cell, Partnumber, Taskworktime, Plan, Operator, EarnedTimePP,Anouncements,
		Safetymessage, Department, Menu } from '/lib/collections.js';
import moment from 'moment';
import { ClientTaskworktime } from '/client/main.js';
var time = new ReactiveVar(new Date());
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

Template.ViewPdf.onCreated(function(){
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
	// Meteor.setInterval(function() {
	// 	time.set(new Date());
	// }, 1000);
});

Template.ViewPdf.helpers({
	url:function(){
		return Session.get('url') == null ? 'http://datuswes008/SOLIDWORKSPDM/List/EWS%20DB/'
		: Session.get('url');
	},
	// setCurrtime:function(){
	// 	var currentTime = time.get();
	// 	// Session.set('time',currentTime);
	// },
	gettaskdata: function(){
		// var currentTime = time.get();
		var currentTime = Session.get('time');
		var timeformat = moment(currentTime,format);
		var timeformat = moment(currentTime,format);
		//set test time
		var hour = moment(timeformat).format('HH');
		var min = moment(timeformat).format('mm');
		var sec = moment(timeformat).format('ss');
		
		if (Session.get('test-mode-time') != null){

			var timearray = Session.get('test-mode-time');
			if (min == parseInt(timearray[1]) && sec == 54){
				//back to add task part
				alert('time close!');
	  			FlowRouter.go('/admin/addtasks');
			}else if (min ==parseInt(timearray[1])+1 && sec == 54){
				alert('time close!');
	  			FlowRouter.go('/admin/addtasks');
			}else if (min == parseInt(timearray[1])+2 && sec == 54){
				alert('time close!');
	  			FlowRouter.go('/admin/addtasks');
			}
		}else{
			if (timeformat.isBetween(reststart1, restend1)) {
				if(hour == 13 && min == 29 && sec == 54){
					alert('time close!');
	  				FlowRouter.go('/admin/addtasks');
				}
			} else if (timeformat.isBetween(reststart2, restend2)){
				if(hour == 14 && min == 29 && sec == 54){
					alert('time close!');
	  				FlowRouter.go('/admin/addtasks');
				}
			}else if (timeformat.isBetween(reststart3, restend3)){
				if(hour == 22 && min == 29 && sec == 54){
					alert('time close!');
	  				FlowRouter.go('/admin/addtasks');
				}
			}else if (timeformat.isBetween(reststart4, restend4)){
				if(hour == 23 && min == 29 && sec == 54){
					alert('time close!');
	  				FlowRouter.go('/admin/addtasks');
				}
			}
			else{
				//need to be changed 8/21/19
				if (hour >= 6 && hour < 12 && min == 59 && sec == 54){
					alert('time close!');
	  				FlowRouter.go('/admin/addtasks');
				}else if(hour >= 15 && hour < 21 && min == 59 && sec == 54){
					alert('time close!');
	  				FlowRouter.go('/admin/addtasks');
				}

			}
		}
	},
})
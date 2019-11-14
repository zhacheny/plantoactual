import { ClientTaskworktime } from '/client/main.js';
import { Tasks, Cell, Partnumber, Changeover, Plan, Operator, EarnedTimePP,Anouncements,
		Safetymessage, Department, Menu, Messages } from '/lib/collections.js';
import moment from 'moment';
//methods on client side
var index = ['a1','a2','a3','a4','a5','a6'];
var format = 'hh:mm:ss';
var shift_1_start = moment('05:59:00',format);
var shift_1_end = moment('14:59:59',format);
var shift_2_start = moment('15:00:00',format);
var shift_2_end = moment('23:59:59',format);

Meteor.methods({
	initializeClientTaskworktime(currentTime,test_mode_flag){
		if (test_mode_flag){
			currentTime = moment('15:29:59',format);
		}
		
		var timeformat = moment(currentTime,format);
		// Session.set('test-mode-time-log',currentTime)
		// console.log(currentTime);
		if(timeformat.isBetween(shift_1_start, shift_1_end)){
			// console.log(1);
			ClientTaskworktime.remove({});
			var taskworktime = [
			  { id: 'a', timespan: '6:00-7:00 am', worktime: '55', plan:'0', actual:"0", reason: "XXX",status:null, partnumber: "XXX",
			  comment:"XXX",operator:"",earnedtime:"0",flagged:false},
			  { id: 'b', timespan: '7:00-8:00 am', worktime: '60', plan:'0', actual:"0", reason: "XXX" ,status:null, partnumber: "XXX",
			  comment:"XXX",operator:"",earnedtime:"0",flagged:false},
			  { id: 'c', timespan: '8:00-9:00 am', worktime: '40', plan:'0', actual:"0", reason: "XXX" ,status:null, partnumber: "XXX",
			  comment:"XXX",operator:"",earnedtime:"0",flagged:false},
			  { id: 'd', timespan: '9:00-10:00 am', worktime: '60', plan:'0', actual:"0", reason: "XXX" ,status:null, partnumber: "XXX",
			  comment:"XXX",operator:"",earnedtime:"0",flagged:false},
			  { id: 'e', timespan: '10:00-11:00 am', worktime: '55', plan:'0', actual:"0", reason: "XXX" ,status:null, partnumber: "XXX",
			  comment:"XXX",operator:"",earnedtime:"0",flagged:false},
			  { id: 'f', timespan: '11:00-12:00 am', worktime: '55', plan:'0', actual:"0", reason: "XXX" ,status:null, partnumber: "XXX",
			  comment:"XXX",operator:"",earnedtime:"0",flagged:false},	
			  { id: 'g', timespan: '12:30-1:30 pm', worktime: '60', plan:'0', actual:"0", reason: "XXX",status:null , partnumber: "XXX",
			  comment:"XXX",operator:"",earnedtime:"0",flagged:false},
			  { id: 'h', timespan: '1:30-2:30 pm', worktime: '50', plan:'0', actual:"0", reason: "XXX",status:null , partnumber: "XXX",
			  comment:"XXX",operator:"",earnedtime:"0",flagged:false},
			];

			for (var i = 0; i < taskworktime.length; i++) {
				// console.log(taskworktime[i]);
				ClientTaskworktime.insert(taskworktime[i]);
			}

			
		}else{
			// console.log(2);
			ClientTaskworktime.remove({});
			var taskworktime = [
			  { id: 'a', timespan: '3:00-4:00 pm', worktime: '55', plan:'0', actual:"0", reason: "XXX",status:null , partnumber: "XXX",
			  comment:"XXX",operator:"",earnedtime:"0",flagged:false},
			  { id: 'b', timespan: '4:00-5:00 pm', worktime: '60', plan:'0', actual:"0", reason: "XXX",status:null , partnumber: "XXX",
			  comment:"XXX",operator:"",earnedtime:"0",flagged:false},
			  { id: 'c', timespan: '5:00-6:00 pm', worktime: '40', plan:'0', actual:"0", reason: "XXX",status:null , partnumber: "XXX",
			  comment:"XXX",operator:"",earnedtime:"0",flagged:false},
			  { id: 'd', timespan: '6:00-7:00 pm', worktime: '60', plan:'0', actual:"0", reason: "XXX",status:null , partnumber: "XXX",
			  comment:"XXX",operator:"",earnedtime:"0",flagged:false},
			  { id: 'e', timespan: '7:30-8:30 pm', worktime: '60', plan:'0', actual:"0", reason: "XXX",status:null , partnumber: "XXX",
			  comment:"XXX",operator:"",earnedtime:"0",flagged:false},
			  { id: 'f', timespan: '8:30-9:30 pm', worktime: '60', plan:'0', actual:"0", reason: "XXX",status:null , partnumber: "XXX",
			  comment:"XXX",operator:"",earnedtime:"0",flagged:false},
			  { id: 'g', timespan: '9:30-10:30 pm', worktime: '60', plan:'0', actual:"0", reason: "XXX",status:null , partnumber: "XXX",
			  comment:"XXX",operator:"",earnedtime:"0",flagged:false},
			  { id: 'h', timespan: '10:30-11:30 pm', worktime: '50', plan:'0', actual:"0", reason: "XXX",status:null , partnumber: "XXX",
			  comment:"XXX",operator:"",earnedtime:"0",flagged:false},

			];

			for (var i = 0; i < taskworktime.length; i++) {
				// console.log(taskworktime[i]);
				ClientTaskworktime.insert(taskworktime[i]);
			}

			
		}
	},
	
	checkIsnull(operatorinitial,initial,operatorcount,operatorID,operatorIDarray){
		for (i = 0; i < operatorinitial.length; i++){
			if(operatorIDarray[i] == operatorID){
				Bert.alert('duplicate operator signed!', 'danger', 'growl-top-right');
				return;
			}
			if(operatorinitial[i] == 'null'){
				operatorinitial[i] = initial;
				operatorIDarray[i] = operatorID;
				Cookie.set('operatorarray',JSON.stringify([operatorinitial,operatorIDarray]));
				operatorcount++;
				Cookie.set('operatorcount',operatorcount);
				Bert.alert('operator added!', 'success', 'growl-top-right' );
				return;
			}
		}
	},
	setColorDefault(){
		for (i = 0; i < index.length; i++){
			document.getElementById(index[i]).style.color="black";
		}

	},
	setnull(){
		// Session.set('togglecomp', null);
		Session.set('toggleisred', null);
		Session.set('reason', null);
		Session.set('wrongtype',null);
		Session.set('submited', null);
		Session.set('taskIsComplete',null);
	},
	errortype(wrongtype) {

		if(wrongtype == null){
			return false;
		}else if(wrongtype == 0) {
			document.getElementById('a1').style.color="#ca5549";
			Session.set('reason','Meeting/Training')
		}else if(wrongtype == 1) {
			document.getElementById('a2').style.color="#ca5549";
			Session.set('reason','Machine Down')
		}else if(wrongtype == 2) {
			document.getElementById('a3').style.color="#ca5549";
			Session.set('reason','Quality Isssue')
		}else if(wrongtype == 3) {
			document.getElementById('a4').style.color="#ca5549";
			Session.set('reason','Safety')
		}else if(wrongtype == 4) {
			document.getElementById('a5').style.color="#ca5549";
			Session.set('reason','Waiting on Material')
		}else if(wrongtype == 5) {
			document.getElementById('a6').style.color="#ca5549";
			Session.set('reason','Write in')
		}
		for (i = 0; i < index.length; i++){
			if(wrongtype != i){
				document.getElementById(index[i]).style.color="black";
			}
		}


		var id = Session.get('togglecomp').id;
		ClientTaskworktime.update({id:id}, {
		  $set: { reason: Session.get('reason') },
		});
		Session.set('togglecomp',ClientTaskworktime.findOne({id:id}));
	},

	
})
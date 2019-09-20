import { ClientTaskworktime } from '/client/main.js';
import { Tasks, Cell, Partnumber, Changeover, Plan, Operator, EarnedTimePP,Anouncements,
		Safetymessage, Department, Menu, Messages } from '/lib/collections.js';
import moment from 'moment';
//methods on client side
var index = ['a1','a2','a3','a4','a5','a6'];
var format = 'hh:mm:ss';
var shift_1_start = moment('05:50:00',format);
var shift_1_end = moment('14:50:00',format);
var shift_2_start = moment('15:00:00',format);
var shift_2_end = moment('23:20:00',format);

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
			  { id: 'a', timespan: '6:00-7:00 am', worktime: '55 min', plantoactual:'0', actual:"0", reason: "XXX",status:null, partnumber: "XXX",
			  comment:"XXX",operator:"",earnedtime:"0"},
			  { id: 'b', timespan: '7:00-8:00 am', worktime: '60 min', plantoactual:'0', actual:"0", reason: "XXX" ,status:null, partnumber: "XXX",
			  comment:"XXX",operator:"",earnedtime:"0"},
			  { id: 'c', timespan: '8:00-9:00 am', worktime: '40 min', plantoactual:'0', actual:"0", reason: "XXX" ,status:null, partnumber: "XXX",
			  comment:"XXX",operator:"",earnedtime:"0"},
			  { id: 'd', timespan: '9:00-10:00 am', worktime: '60 min', plantoactual:'0', actual:"0", reason: "XXX" ,status:null, partnumber: "XXX",
			  comment:"XXX",operator:"",earnedtime:"0"},
			  { id: 'e', timespan: '10:00-11:00 am', worktime: '55 min', plantoactual:'0', actual:"0", reason: "XXX" ,status:null, partnumber: "XXX",
			  comment:"XXX",operator:"",earnedtime:"0"},
			  { id: 'f', timespan: '11:00-12:00 am', worktime: '55 min', plantoactual:'0', actual:"0", reason: "XXX" ,status:null, partnumber: "XXX",
			  comment:"XXX",operator:"",earnedtime:"0"},	
			  { id: 'g', timespan: '12:30-1:30 pm', worktime: '60 min', plantoactual:'0', actual:"0", reason: "XXX",status:null , partnumber: "XXX",
			  comment:"XXX",operator:"",earnedtime:"0"},
			  { id: 'h', timespan: '1:30-2:30 pm', worktime: '50 min', plantoactual:'0', actual:"0", reason: "XXX",status:null , partnumber: "XXX",
			  comment:"XXX",operator:"",earnedtime:"0"},
			];

			for (var i = 0; i < taskworktime.length; i++) {
				// console.log(taskworktime[i]);
				ClientTaskworktime.insert(taskworktime[i]);
			}

			
		}else{
			// console.log(2);
			ClientTaskworktime.remove({});
			var taskworktime = [
			  { id: 'a', timespan: '3:00-4:00 pm', worktime: '55 min', plantoactual:'0', actual:"0", reason: "XXX",status:null , partnumber: "XXX",
			  comment:"XXX",operator:"",actualmin:"",earnedtime:"0"},
			  { id: 'b', timespan: '4:00-5:00 pm', worktime: '60 min', plantoactual:'0', actual:"0", reason: "XXX",status:null , partnumber: "XXX",
			  comment:"XXX",operator:"",actualmin:"",earnedtime:"0"},
			  { id: 'c', timespan: '5:00-6:00 pm', worktime: '40 min', plantoactual:'0', actual:"0", reason: "XXX",status:null , partnumber: "XXX",
			  comment:"XXX",operator:"",actualmin:"",earnedtime:"0"},
			  { id: 'd', timespan: '6:00-7:30 pm', worktime: '60 min', plantoactual:'0', actual:"0", reason: "XXX",status:null , partnumber: "XXX",
			  comment:"XXX",operator:"",actualmin:"",earnedtime:"0"},
			  { id: 'e', timespan: '7:00-8:00 pm', worktime: '55 min', plantoactual:'0', actual:"0", reason: "XXX",status:null , partnumber: "XXX",
			  comment:"XXX",operator:"",actualmin:"",earnedtime:"0"},
			  { id: 'f', timespan: '8:00-9:00 pm', worktime: '55 min', plantoactual:'0', actual:"0", reason: "XXX",status:null , partnumber: "XXX",
			  comment:"XXX",operator:"",actualmin:"",earnedtime:"0"},
			  { id: 'g', timespan: '9:30-10:30 pm', worktime: '60 min', plantoactual:'0', actual:"0", reason: "XXX",status:null , partnumber: "XXX",
			  comment:"XXX",operator:"",actualmin:"",earnedtime:"0"},
			  { id: 'h', timespan: '10:30-11:30 pm', worktime: '55 min', plantoactual:'0', actual:"0", reason: "XXX",status:null , partnumber: "XXX",
			  comment:"XXX",operator:"",actualmin:"",earnedtime:"0"},

			];

			for (var i = 0; i < taskworktime.length; i++) {
				// console.log(taskworktime[i]);
				ClientTaskworktime.insert(taskworktime[i]);
			}

			
		}
	},
	updatechangeover(isfinish,currentTime,count) {

		// var lastobject = ClientTaskworktime.findOne({id:curId});
		//get the change over time
	    var starttime = Session.get('changeover-starttime');
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
	    // console.log(curId);
	    var lastwortime = ClientTaskworktime.findOne({id:curId}).worktime.substring(0,2);
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
			var MinutesPP_one = Partnumber.findOne({cell:Session.get('cell'), part:partnumber}).MinutesPP_one;
			plantoactual_auto_generate = MinutesPP_one;
			// var value = 1/MinutesPP_one;
			if (operatorcount == 2){
				plantoactual_auto_generate = Partnumber.findOne({cell:Session.get('cell'), part:partnumber}).MinutesPP_two;
			}else if (operatorcount == 2){
				plantoactual_auto_generate = Partnumber.findOne({cell:Session.get('cell'), part:partnumber}).MinutesPP_three;
			}
			plantoactual_auto_generate = plantoactual_auto_generate == '' ? 0 : worktime/plantoactual_auto_generate;
			//returns the largest integer less than the value
			plantoactual_auto_generate = Math.floor(plantoactual_auto_generate);
			// value = Math.round( value * 10 ) / 10;
		}
		ClientTaskworktime.update({id:curId}, {
			$set: { worktime: worktime + ' min', plantoactual: plantoactual_auto_generate},
		});
	},
	checkIsnull(operatorinitial,initial,operatorcount,operatorID,operatorIDarray){
		for (i = 0; i < operatorinitial.length; i++){
			if(operatorinitial[i] == initial){
				alert('duplicate operator signed!');
				return;
			}
			if(operatorinitial[i] == 'null'){
				operatorinitial[i] = initial;
				operatorIDarray[i] = operatorID;
				Session.set('operatorarray',[operatorinitial,operatorIDarray]);
				operatorcount++;
				Session.set('operatorcount',operatorcount);
				alert('operator added!');
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

		tagslogic(){

			  
		},
	
})
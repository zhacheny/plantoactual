import { ClientTaskworktime } from '/client/main.js';
import moment from 'moment';
//methods on client side
var index = ['a1','a2','a3','a4','a5','a6'];

Meteor.methods({

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
	    // console.log(lastwortime);
	    //check whether the change over duration is out of time span
	    if(isfinish){
			ClientTaskworktime.update({id:curId}, {
				$set: { worktime: lastwortime - changeoverDuration + ' min'},
			});
	    }else{
			ClientTaskworktime.update({id:curId}, {
				$set: { worktime: lastwortime - changeoverDuration + ' min', comment: 'Not finish'},
			});
	    }
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
		Session.set('togglecomp', null);
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
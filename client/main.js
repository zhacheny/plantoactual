export const ClientTaskworktime = new Mongo.Collection(null);
import moment from 'moment';
import { Logger } from 'meteor/ostrio:logger';
import { LoggerFile } from 'meteor/ostrio:loggerfile';
// this.SystemError = new Logger();
// (new LoggerFile(this.SystemError)).enable();

function getClientTime() {
        // var _time = (new Date).toTimeString();
        var _time = (new Date);
        // _time.setHours(15);
        // console.log(_time);
        return _time;
}

if (Meteor.isClient){
	Meteor.startup(function () {
		// SystemError.info('SYSTEM RESTART', new Date);
		// window.addEventListener("pagehide", function(){
		// 	if(Session.get('changeover-showup') == true){
		// 		// SystemError.warn('SYSTEM RELOAD' + 'on table' + Cookie.get('cell'), new Date);
		// 		console.log('reload on changeover!');
		// 		return "Data will be lost if you leave the page, are you sure?";
		// 	}else{
		// 		return;
		// 	}
			
		//     // setTimeout(function(){},1000);
		// }, false);
		
		// window.onbeforeunload = function() {
		// // Meteor.call('client_server_record', absolute_displayindex, Session.get('time'),Cookie.get('cell'), 
		// // 	base_worktime, Cookie.get('celltable'));
		// 	if(Session.get('changeover-showup') == true){
		// 		// SystemError.warn('SYSTEM RELOAD' + 'on table' + Cookie.get('cell'), new Date);
		// 		return "Data will be lost if you leave the page, are you sure?";
		// 	}else{
		// 		return;
		// 	}
		  
		// };
		
		Meteor.call('initializeClientTaskworktime',getClientTime(),test_mode_flag);
		Meteor.subscribe('anouncements');
		Meteor.subscribe('operator');
		Meteor.subscribe('earnedTimePPiece');
		Meteor.subscribe('safetymessage');
		Meteor.subscribe('department');
		Meteor.subscribe('menu');
		// Meteor.subscribe('cell');
	    // Meteor.call("getClientTime", function (error, result) {
	    // 	Meteor.call('initializeClientTaskworktime',result,test_mode_flag);
	    // });
	    // The correct way
	    //set time 
	    let test_mode_flag = false;
	    // setInterval(function () {
	    //     Meteor.call("getClientTime", function (error, result) {
	    //         Session.set("time", result);
	    //     });
	    // }, 1000);
	    setInterval(function () {
            Session.set("time", getClientTime());
	    }, 1000);

	    if(Cookie.get('operatorcount') == null){
			Cookie.set('operatorcount', 0);

			let operatorinitial = [['null','null','null','null'],['null','null','null','null']];
			Cookie.set('operatorarray',JSON.stringify(operatorinitial));
	    }
	    // Session.set('operatorcount',0)
	    // var operatorinitial = [['null','null','null'],['null','null','null']];
	    // Session.set('operatorarray',operatorinitial);
	    Session.set('tempchangeoverid',"a");
     // console.log("Meteor.log.file.path", Meteor.log.file.path);
	    // Session.set('changeover-showup',false);
		// Meteor.call('initializeClientTaskworktime');

	});
}


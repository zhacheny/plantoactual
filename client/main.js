export const ClientTaskworktime = new Mongo.Collection(null);
import moment from 'moment';

function getClientTime() {
        // var _time = (new Date).toTimeString();
        // var _time = (new Date);
        var _time = (new Date);
        // console.log(_time);
        return _time;
}

if (Meteor.isClient){
	Meteor.startup(function () {
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
	    var test_mode_flag = false;
	    // setInterval(function () {
	    //     Meteor.call("getClientTime", function (error, result) {
	    //         Session.set("time", result);
	    //     });
	    // }, 1000);
	    setInterval(function () {
            Session.set("time", getClientTime());
	    }, 1000);

	    Session.set('operatorcount',0)
	    var operatorinitial = [['null','null','null'],['null','null','null']];
	    Session.set('operatorarray',operatorinitial);
	    Session.set('tempchangeoverid',"a");
	    // Session.set('changeover-showup',false);
		// Meteor.call('initializeClientTaskworktime');

	});
}


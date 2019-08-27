export const ClientTaskworktime = new Mongo.Collection(null);

Meteor.startup(function () {

    // The correct way
    //set time 
    var test_mode_flag = false;
    setInterval(function () {
        Meteor.call("getServerTime", function (error, result) {
        	var currentTime = result;
            Session.set("time", result);
        });
    }, 1000);

    Meteor.call("getServerTime", function (error, result) {
    	Meteor.call('initializeClientTaskworktime',result,test_mode_flag);
    });

    Session.set('operatorcount',0)
    var operatorinitial = [['null','null','null'],['null','null','null']];
    Session.set('operatorarray',operatorinitial);
    Session.set('tempchangeoverid',"a");
    // Session.set('changeover-showup',false);
	// Meteor.call('initializeClientTaskworktime');

});

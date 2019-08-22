export const ClientTaskworktime = new Mongo.Collection(null);

Meteor.startup(function () {
	//connect to remote server
	
    // The correct way
    Session.set('operatorcount',0)
    var operatorinitial = [['null','null','null'],['null','null','null']];
    Session.set('operatorarray',operatorinitial);
    Session.set('tempchangeoverid',"a");
    // Session.set('changeover-showup',false);
	// Meteor.call('initializeClientTaskworktime');

});

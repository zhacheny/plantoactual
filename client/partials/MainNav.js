import { Meteor } from 'meteor/meteor';
import { ClientTaskworktime } from '/client/main.js';
import { Logger }     from 'meteor/ostrio:logger';
import { LoggerFile } from 'meteor/ostrio:loggerfile';

this.logout = new Logger();
(new LoggerFile(this.logout)).enable();

Template.MainNav.helpers({
	'welcome_info': ()=> {
		return 'Welcome ' +  Meteor.user().profile.firstName + ' !';
	},
})

Template.MainNav.events({
	'click .login-toggle': ()=> {
		Session.keys = {};
		Session.set('nav-toggle','open'); 
 		var operatorinitial = [['null','null','null'],['null','null','null']];
	    Session.set('operatorarray',operatorinitial);

	},
	'click .logout': ()=> {
		logout.info('log out', Meteor.user().username);
		AccountsTemplates.logout();
		Session.keys = {}
		//
		// Session.set('togglecomp', null);
		// Session.set('buildingnumber', null);
		// Session.set('cell', null);
		// Session.set('toggleisred', null);
		// Session.set('partnumber', null);
		// ClientTaskworktime.remove({});
		
		Session.set('operatorcount',0)
	    var operatorinitial = [['null','null','null'],['null','null','null']];
	    Session.set('operatorarray',operatorinitial);
	    Session.set('tempchangeoverid',"a");
	    },
});
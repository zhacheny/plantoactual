import { Meteor } from 'meteor/meteor';
import { ClientTaskworktime } from '/client/main.js';
Template.MainNav.events({
	'click .login-toggle': ()=> {
		Session.set('nav-toggle','open');
		if (ClientTaskworktime.find().count() === 0) {
			var taskworktime = [
			  { id: 'a', timespan: '6-7 am', worktime: '55 min', plantoactual:0, actual:"0", reason: "XXX",status:null, partnumber: "XXX",comment:"XXX",operator:""},
			  { id: 'b', timespan: '7-8 am', worktime: '60 min', plantoactual:0, actual:"0", reason: "XXX" ,status:null, partnumber: "XXX",comment:"XXX",operator:""},
			  { id: 'c', timespan: '8-9 am', worktime: '40 min', plantoactual:0, actual:"0", reason: "XXX" ,status:null, partnumber: "XXX",comment:"XXX",operator:""},
			  { id: 'd', timespan: '9-10 am', worktime: '60 min', plantoactual:0, actual:"0", reason: "XXX" ,status:null, partnumber: "XXX",comment:"XXX",operator:""},
			  { id: 'e', timespan: '10-11 am', worktime: '55 min', plantoactual:0, actual:"0", reason: "XXX" ,status:null, partnumber: "XXX",comment:"XXX",operator:""},
			  { id: 'f', timespan: '11-12 am', worktime: '55 min', plantoactual:0, actual:"0", reason: "XXX" ,status:null, partnumber: "XXX",comment:"XXX",operator:""},
			  { id: 'g', timespan: '12:30-13:30 pm', worktime: '60 min', plantoactual:0, actual:"0", reason: "XXX",status:null , partnumber: "XXX",comment:"XXX",operator:""},
			  { id: 'h', timespan: '13:30-14:30 pm', worktime: '50 min', plantoactual:0, actual:"0", reason: "XXX",status:null , partnumber: "XXX",comment:"XXX",operator:""},

			];

			for (var i = 0; i < taskworktime.length; i++) {
				// console.log(taskworktime[i]);
				ClientTaskworktime.insert(taskworktime[i]);
			}

		}

	},

	'click .logout': ()=> {
		AccountsTemplates.logout();
		//
		Session.set('togglecomp', null);
		Session.set('buildingnumber', null);
		Session.set('cell', null);
		Session.set('toggleisred', null);
		Session.set('partnumber', null);
		ClientTaskworktime.remove({});
           Session.set('operatorcount',0)
	    var operatorinitial = ['null','null','null'];
	    Session.set('operatorarray',operatorinitial);
	    Session.set('tempchangeoverid',"a");
		},
});
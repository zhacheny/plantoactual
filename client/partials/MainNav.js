import { Meteor } from 'meteor/meteor';
import { ClientTaskworktime } from '/client/main.js';

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
		// if (ClientTaskworktime.find().count() === 0) {
		// 	var taskworktime = [
		// 	  { id: 'a', timespan: '6-7 am', worktime: '55 min', plantoactual:0, actual:"0", reason: "XXX",status:null, partnumber: "XXX",
		// 	  comment:"XXX",operator:"",earnedtime:"0"},
		// 	  { id: 'b', timespan: '7-8 am', worktime: '60 min', plantoactual:0, actual:"0", reason: "XXX" ,status:null, partnumber: "XXX",
		// 	  comment:"XXX",operator:"",earnedtime:"0"},
		// 	  { id: 'c', timespan: '8-9 am', worktime: '40 min', plantoactual:0, actual:"0", reason: "XXX" ,status:null, partnumber: "XXX",
		// 	  comment:"XXX",operator:"",earnedtime:"0"},
		// 	  { id: 'd', timespan: '9-10 am', worktime: '60 min', plantoactual:0, actual:"0", reason: "XXX" ,status:null, partnumber: "XXX",
		// 	  comment:"XXX",operator:"",earnedtime:"0"},
		// 	  { id: 'e', timespan: '10-11 am', worktime: '55 min', plantoactual:0, actual:"0", reason: "XXX" ,status:null, partnumber: "XXX",
		// 	  comment:"XXX",operator:"",earnedtime:"0"},
		// 	  { id: 'f', timespan: '11-12 am', worktime: '55 min', plantoactual:0, actual:"0", reason: "XXX" ,status:null, partnumber: "XXX",
		// 	  comment:"XXX",operator:"",earnedtime:"0"},
		// 	  { id: 'g', timespan: '12:30-13:30 pm', worktime: '60 min', plantoactual:0, actual:"0", reason: "XXX",status:null , partnumber: "XXX",
		// 	  comment:"XXX",operator:"",earnedtime:"0"},
		// 	  { id: 'h', timespan: '13:30-14:30 pm', worktime: '50 min', plantoactual:0, actual:"0", reason: "XXX",status:null , partnumber: "XXX",
		// 	  comment:"XXX",operator:"",earnedtime:"0"},
		// 	  { id: 'i', timespan: '15:00-16:00 pm', worktime: '55 min', plantoactual:0, actual:"0", reason: "XXX",status:null , partnumber: "XXX",
		// 	  comment:"XXX",operator:"",actualmin:"",earnedtime:"0"},
		// 	  { id: 'j', timespan: '16:00-17:00 pm', worktime: '60 min', plantoactual:0, actual:"0", reason: "XXX",status:null , partnumber: "XXX",
		// 	  comment:"XXX",operator:"",actualmin:"",earnedtime:"0"},
		// 	  { id: 'k', timespan: '17:00-18:00 pm', worktime: '40 min', plantoactual:0, actual:"0", reason: "XXX",status:null , partnumber: "XXX",
		// 	  comment:"XXX",operator:"",actualmin:"",earnedtime:"0"},
		// 	  { id: 'l', timespan: '19:00-20:00 pm', worktime: '60 min', plantoactual:0, actual:"0", reason: "XXX",status:null , partnumber: "XXX",
		// 	  comment:"XXX",operator:"",actualmin:"",earnedtime:"0"},
		// 	  { id: 'm', timespan: '20:00-21:00 pm', worktime: '55 min', plantoactual:0, actual:"0", reason: "XXX",status:null , partnumber: "XXX",
		// 	  comment:"XXX",operator:"",actualmin:"",earnedtime:"0"},
		// 	  { id: 'n', timespan: '21:00-22:00 pm', worktime: '55 min', plantoactual:0, actual:"0", reason: "XXX",status:null , partnumber: "XXX",
		// 	  comment:"XXX",operator:"",actualmin:"",earnedtime:"0"},
		// 	  { id: 'o', timespan: '22:00-23:00 pm', worktime: '60 min', plantoactual:0, actual:"0", reason: "XXX",status:null , partnumber: "XXX",
		// 	  comment:"XXX",operator:"",actualmin:"",earnedtime:"0"},
		// 	  { id: 'p', timespan: '23:00-23:30 pm', worktime: '30 min', plantoactual:0, actual:"0", reason: "XXX",status:null , partnumber: "XXX",
		// 	  comment:"XXX",operator:"",actualmin:"",earnedtime:"0"},
		// 	];

		// 	for (var i = 0; i < taskworktime.length; i++) {
		// 		// console.log(taskworktime[i]);
		// 		ClientTaskworktime.insert(taskworktime[i]);
		// 	}

		// }

	},
	'click .logout': ()=> {
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
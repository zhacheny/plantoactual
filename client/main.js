export const ClientTaskworktime = new Mongo.Collection(null);

Meteor.startup(function () {
	//connect to remote server
	
    // The correct way
    Session.set('operatorcount',0)
    var operatorinitial = [['null','null','null'],['null','null','null']];
    Session.set('operatorarray',operatorinitial);
    Session.set('tempchangeoverid',"a");
    // Session.set('changeover-showup',false);
	if (ClientTaskworktime.find().count() === 0) {
	    var taskworktime = [
			  { id: 'a', timespan: '6-7 am', worktime: '55 min', plantoactual:0, actual:"0", reason: "XXX",status:null, partnumber: "XXX",
			  comment:"XXX",operator:"",earnedtime:"0"},
			  { id: 'b', timespan: '7-8 am', worktime: '60 min', plantoactual:0, actual:"0", reason: "XXX" ,status:null, partnumber: "XXX",
			  comment:"XXX",operator:"",earnedtime:"0"},
			  { id: 'c', timespan: '8-9 am', worktime: '40 min', plantoactual:0, actual:"0", reason: "XXX" ,status:null, partnumber: "XXX",
			  comment:"XXX",operator:"",earnedtime:"0"},
			  { id: 'd', timespan: '9-10 am', worktime: '60 min', plantoactual:0, actual:"0", reason: "XXX" ,status:null, partnumber: "XXX",
			  comment:"XXX",operator:"",earnedtime:"0"},
			  { id: 'e', timespan: '10-11 am', worktime: '55 min', plantoactual:0, actual:"0", reason: "XXX" ,status:null, partnumber: "XXX",
			  comment:"XXX",operator:"",earnedtime:"0"},
			  { id: 'f', timespan: '11-12 am', worktime: '55 min', plantoactual:0, actual:"0", reason: "XXX" ,status:null, partnumber: "XXX",
			  comment:"XXX",operator:"",earnedtime:"0"},
			  { id: 'g', timespan: '12:30-13:30 pm', worktime: '60 min', plantoactual:0, actual:"0", reason: "XXX",status:null , partnumber: "XXX",
			  comment:"XXX",operator:"",earnedtime:"0"},
			  { id: 'h', timespan: '13:30-14:30 pm', worktime: '50 min', plantoactual:0, actual:"0", reason: "XXX",status:null , partnumber: "XXX",
			  comment:"XXX",operator:"",earnedtime:"0"},
			  { id: 'i', timespan: '14:30-15:30 pm', worktime: '60 min', plantoactual:0, actual:"0", reason: "XXX",status:null , partnumber: "XXX",
			  comment:"XXX",operator:"",actualmin:""},
			  { id: 'j', timespan: '15:30-16:30 pm', worktime: '60 min', plantoactual:0, actual:"0", reason: "XXX",status:null , partnumber: "XXX",
			  comment:"XXX",operator:"",actualmin:""},
			];

		for (var i = 0; i < taskworktime.length; i++) {
			// console.log(taskworktime[i]);
			ClientTaskworktime.insert(taskworktime[i]);
		}
	}else{
			ClientTaskworktime.remove({});
	}


});

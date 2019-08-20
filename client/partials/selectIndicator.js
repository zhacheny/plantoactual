import { Tasks, Partnumber, Cell } from '/lib/collections.js';


// Template.selectInidicator.helpers({
// 	cell: function(){
// 		// console.log(Tasks.find().fetch());
// 		return Cell.find();
// 	},
// 	partnumber: function(){
// 		// console.log(Tasks.find().fetch());
// 		return Partnumber.find();
// 	},
	
// });

Template.selectInidicator.events({
	'change .change-building':function (evt) {
		let value = $(evt.target).val();

		Session.set('employIndicator', value);
		// console.log(Session.get('buildingnumber') == "1");	
	},
});


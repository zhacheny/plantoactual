import { Tasks, Partnumber, Cell } from '/lib/collections.js';



Template.selectProc.events({
	'change .change-Proc':function (evt) {
		var build = $(evt.target).val();

		Session.set('ProductCode', build);
		// console.log(Session.get('buildingnumber') == "1");	
	},
});


import { Tasks, Partnumber, Cell } from '/lib/collections.js';

// Tasks = new Mongo.Collection('task');

// Template.selectcell.onCreated(function(){
// 	this.autorun(() => {
// 		this.subscribe('cell');
// 	})
// })

Template.selectcell.helpers({
	mixedcellname:function(){
		return this.cellname == '' ? this.cellId :this.cellname + '-' +  this.cellId;
	},
	selectcell:function(selected){
		// console.log(selected);
		return selected != '' ? true:false;
		// return false;
	},
	cell: function(){
		// console.log(Tasks.find().fetch());
		var select = Session.get('buildingnumber');
		Meteor.subscribe('cell',select);
		return Cell.find({buildingnumber: select}, { sort: { cellname: 1 }});
	},
});

Template.selectcell.events({
	'change .change-cell':function (evt) {
		var cell = $(evt.target).val();
		var res_cell = cell.split('-');
		if(res_cell.length>1){
			Session.set('cell',cell.split('-')[1]);
			var cellobject = Cell.findOne({cellId:cell.split('-')[1]});
		}else{
			Session.set('cell',cell);
			var cellobject = Cell.findOne({cellId:cell});
		}

		Session.set('selectedcell', cellobject.cellname + '-' +  cellobject.cellId);
		// console.log(cell);

		// cellid = Cell.findOne({cellname:cell}).cellId;
		// // console.log(typeof(cellid) === 'undefined');
		// if(cellid == ''){
		// 	Session.set('cell', cell);
		// }else{
		// 	Session.set('cell', cellid);
		// }
		
	},
});


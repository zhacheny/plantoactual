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
	selectcell:function(selected,type){
		// console.log(selected);
		if(selected != '' && type == 'addtask'){
			return true;
		}else{
			return false;
		}
		// return selected != '' ? true:false;
		// return false;
	},
	cell: function(type){
		// console.log(type == 'report');
		if(type != 'report'){
			var select = Session.get('buildingnumber');
		}else{
			var select = Session.get('buildingnumber_part_maintenance');
		}
		
		Meteor.subscribe('cell',select);
		return Cell.find({buildingnumber: select}, { sort: { cellname: 1 }});
	},
});

Template.selectcell.events({
	'change .change-cell':function (evt) {
		var cell = $(evt.target).val();
		var res_cell = cell.split('-');
		var type = $(evt.currentTarget).data('id');
		console.log(type);
		if(type != 'report'){
			if(res_cell.length>1){
				Session.set('cell',cell.split('-')[1]);
				var cellobject = Cell.findOne({cellId:cell.split('-')[1]});
			}else{
				Session.set('cell',cell);
				var cellobject = Cell.findOne({cellId:cell});
			}

			Session.set('selectedcell', cellobject.cellname + '-' +  cellobject.cellId);
		}else{
			if(res_cell.length>1){
				Session.set('cell_report',cell.split('-')[1]);
				var cellobject = Cell.findOne({cellId:cell.split('-')[1]});
			}else{
				Session.set('cell_report',cell);
				var cellobject = Cell.findOne({cellId:cell});
			}

			// Session.set('selectedcell_report', cellobject.cellname + '-' +  cellobject.cellId);
		}
		
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


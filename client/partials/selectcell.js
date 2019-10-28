import { Tasks, Partnumber, Cell } from '/lib/collections.js';
import { Cookies } from 'meteor/mrt:cookies';
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
			var select = Cookie.get('buildingnumber');
		}else{
			var select = Session.get('buildingnumber_manage_tasks');
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
		if(type != 'report'){
			if(res_cell.length>1){
				Cookie.set('cell',cell.split('-')[1]);
				// console.log(cell.split('-')[1]);
				var cellobject = Cell.findOne({cellId:cell.split('-')[1]});
			}else{
				Cookie.set('cell',cell);
				// console.log(cell);
				var cellobject = Cell.findOne({cellId:cell});
			}

			Cookie.set('selectedcell', cellobject.cellname + '-' +  cellobject.cellId);
			//remove all signed in operators
			Meteor.call( 'operator_Signout_All', JSON.parse(Cookie.get('operatorarray'))[1], ( error, response ) => {
				console.log('operator_Signout_All',);
		      if ( error ) {
		        Bert.alert( error.reason, 'danger', 'growl-top-right' );
		      } else {
		        Bert.alert( 'All Operator has been signed out!', 'success', 'growl-top-right' );
				var operatorinitial = [['null','null','null','null'],['null','null','null','null']];
				Cookie.set('operatorarray',JSON.stringify(operatorinitial));
				Cookie.set('operatorcount', 0);
		      }
		    });
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


import { Tasks, Partnumber, Plan, Operator, EarnedTimePP, Cell } from '/lib/collections.js';
// var pre_url = "http://datuswes008/SOLIDWORKSPDM/Contains/EWS%20DB/Material/WM/Finished%20Goods?file=";
var pre_url = "http://datuswes008/SOLIDWORKSPDM/EWS%20DB/Material/WM/Components?view=preview&file=";
this.log_part_edit = new Logger();
this.log_part_delete = new Logger();
this.log_part_add = new Logger();
this.log_cell_edit = new Logger();
this.log_cell_delete = new Logger();
this.log_cell_add = new Logger();
(new LoggerFile(this.log_part_edit)).enable();
(new LoggerFile(this.log_part_delete)).enable();
(new LoggerFile(this.log_part_add)).enable();
(new LoggerFile(this.log_cell_edit)).enable();
(new LoggerFile(this.log_cell_delete)).enable();
(new LoggerFile(this.log_cell_add)).enable();

Template.PartMaintenance.onCreated(function(){
	// Meteor.setInterval(function() {
	// 	time.set(new Date());
	// }, 1000);
	Session.set('toggle-maintenance',0);


	this.autorun(() => {
		this.subscribe('partnumber',false);
	})
	this.autorun(() => {
		this.subscribe('cell',null);
	})
});


Template.PartMaintenance.events({
	'click .Modal-delete-yes': function(){
		console.log(this._id);
		Meteor.call('partnumberdelete',this._id);
		Session.set('toggle-maintenance-delete','');
		log_part_delete.warn('part delete' + ' | backup:' + 
			 JSON.stringify(Partnumber.findOne({_id: this._id})) , Meteor.user().username);
		alert('Deleted!');
		return false;

	},
	'click .Modal-delete-cell-yes': function(){
		let id = Session.get('toggle-maintenance-cell-delete-id');
		Meteor.call('celldelete', id);
		Session.set('toggle-maintenance-cell-delete','');
		log_cell_delete.warn('cell delete' + ' | backup:' + 
			 JSON.stringify(Cell.findOne({_id: id})) , Meteor.user().username);
		alert('Deleted!');
		return false;

	},
	'click .maintenance-Viewall': function(){
		if (Session.get('maintenance-Viewall') == null){
			Session.set('maintenance-Viewall',true);
		}else{
			Session.set('maintenance-Viewall',null);
		}
		return false;
	},
	'change #checkbox1': function(event){
 	  var is_checked = $(event.target).is(":checked");
	  Session.set('QualityFlag',is_checked);
	},
	'click .label-add': function(event){
		// console.log(0);
		if(Session.get('toggle-maintenance') == 0){
			if(Session.get('add-partOrcell') == 1){
				Session.set('add-partOrcell',0);
			}else{
				Session.set('add-partOrcell',1);
			}
		}else{
			Session.set('toggle-maintenance',0);
		}
	},
	'click .label-edit': function(event){
		// Session.set('toggle-maintenance',1);

		if(Session.get('toggle-maintenance') == 1){
			if(Session.get('edit-partOrcell') == 1){
				Session.set('edit-partOrcell',0);
			}else{
				Session.set('edit-partOrcell',1);
			}
		}else{
			Session.set('toggle-maintenance',1);
		}
	},
	'click .label-import': function(event){
		// console.log(1);
		Session.set('toggle-maintenance',2);
	},
	'keypress input.inputPart': function(event){
		let part = $(event.target).val();
		if(event.key == 'Enter'){
			data = Partnumber.find({part:part}).fetch();
			
			if(data && data.length == 0){
				alert('Not find!');

			}
			// Session.set('inputPart_data',data);
			Session.set('inputPart_id',part);
			return false;
    	}
	},

	'keypress input.inputCell': function(event){
		let cellId = $(event.target).val();
		if(event.key == 'Enter'){
			data = Cell.find({cellId:cellId}).fetch();
			
			if(data && data.length == 0){
				alert('Not find!');

			}
			// Session.set('inputCell_data',data);
			Session.set('inputCell_id', cellId);
			return false;
    	}
	},
	// 'keyup input.inputPart': function(event){
	// 	var part = $(event.target).val();
	// 	Session.set('inputPart',part);
	// 	return false;
		
	// },
	'click .maintenance-edit': function(event){
		Session.set('toggle-maintenance-edit','open');
		// let data = [this.MinutesPP_one,this.MinutesPP_two,this.MinutesPP_three,
		// 	this.PiecesPH_one,this.PiecesPH_two,this.PiecesPH_three,this.ProductCode,
		// 	this.XMLname,this.part,this.cell,this.buildingnumber];
		// Session.set('edit-data',data);
		Session.set('MinutesPP_one-edit',this.MinutesPP_one);
		Session.set('MinutesPP_two-edit',this.MinutesPP_two);
		Session.set('MinutesPP_three-edit',this.MinutesPP_three);
		Session.set('PiecesPH_one-edit',this.PiecesPH_one);
		Session.set('PiecesPH_two-edit',this.PiecesPH_two);
		Session.set('PiecesPH_three-edit',this.PiecesPH_three);
		Session.set('ProductCode-edit',this.ProductCode);
		Session.set('part-edit',this.part);
		Session.set('cell-edit',this.cell);
		Session.set('XMLname-edit',this.XMLname);
		Session.set('buildingnumber-edit',this.buildingnumber);
		Session.set('id-edit',this._id);
		// alert('Deleted!');
		return;
	},
	'click .Modal-cancel': function(event){
		Session.set('toggle-maintenance-delete','');
		Session.set('toggle-maintenance-edit','');
		Session.set('toggle-maintenance-cell-delete','');
		Session.set('toggle-maintenance-cell-edit','');
		return;
	},
	'click .maintenance-cell-edit': function(event){
		Session.set('toggle-maintenance-cell-edit','open');
		Session.set('toggle-maintenance-cell-edit-id',this._id);
		// alert('Deleted!');
		return;
	},
	'click .maintenance-cell-delete': function(event){
		Session.set('toggle-maintenance-cell-delete-id', this._id);
		Session.set('toggle-maintenance-cell-delete', 'open');
		return;
	},
	'click .maintenance-delete': function(event){
		Session.set('toggle-maintenance-delete','open');
		return;
	},
	'click .maintenance-edit-cell-submit': function(){
		let buildingnumber = Session.get('cell-buildingnumber-edit');
		let _id = Session.get('toggle-maintenance-cell-edit-id');
		let celltable = Session.get('cell-table-edit');
		let cellId = Session.get('cell-cellId-edit') == null ? 
			Session.get('inputCell_id'): Session.get('cell-cellId-edit');
		let cellname = Session.get('cell-cellname-edit');

        Meteor.call( 'updatecell', buildingnumber, _id, cellname, celltable, cellId, ( error, response ) => {
          if ( error ) {
            // console.log( error.reason );
            // throw new Meteor.Error('bad', 'stuff happened');
            log_cell_edit.error('cell add: ' + ' | failed in' 
				+ error.reason, Meteor.user().username);
            Bert.alert( error.reason, 'danger', 'growl-top-right' );
          } else {
          	log_cell_edit.warn('cell add: ' + ' | Cell: ' 
				+ _id + celltable, Meteor.user().username);
            Bert.alert( 'cell updated!', 'success', 'growl-top-right' );
          }
        });
        Session.set('cell-buildingnumber-edit', null);
        Session.set('cell-table-edit', null);
        Session.set('cell-cellname-edit', null);
        Session.set('cell-cellId-edit', null);
	},
	'click .maintenance-edit-submit': function(events){
		let MinutesPP_one = Session.get('MinutesPP_one-edit');
		let MinutesPP_two = Session.get('MinutesPP_two-edit');
		let MinutesPP_three = Session.get('MinutesPP_three-edit');
		let PiecesPH_one = Session.get('PiecesPH_one-edit');
		let PiecesPH_two = Session.get('PiecesPH_two-edit');
		let PiecesPH_three = Session.get('PiecesPH_three-edit');
		let ProductCode = Session.get('ProductCode-edit');
		let part = Session.get('part-edit');
		let cell = Session.get('cell-edit');
		let XMLname = Session.get('XMLname-edit');
		let buildingnumber = Session.get('buildingnumber-edit');
		let id = Session.get('id-edit');
		Meteor.call('editpartnumber', id,part,cell,XMLname,ProductCode,MinutesPP_one,
		MinutesPP_two, MinutesPP_three, PiecesPH_one, PiecesPH_two, PiecesPH_three,
		buildingnumber, ( error, response ) => {
          if ( error ) {
            // console.log( error.reason );
            // throw new Meteor.Error('bad', 'stuff happened');
            log_part_edit.error('part add: ' + ' | failed in' 
				+ error.reason, Meteor.user().username);
            Bert.alert( error.reason, 'danger', 'growl-top-right' );
          } else {
          	log_part_edit.warn('part add: ' + ' | Part Number: ' 
				+ part, Meteor.user().username);
            Bert.alert( 'part updated!', 'success', 'growl-top-right' );
          }
        });
		Session.set('toggle-maintenance-edit','');
		alert('Update document successfully!');
		return;
	},
	'click .add_cell_submit': function(){
		let buildingnumber = Session.get('add-cell-building-number');
		let cellid = Session.get('add-cell-id');
		let cellname = Session.get('add-cell-name') == null ? '':Session.get('add-cell-name');
		let celltable = Session.get('add-cell-table');
		celltable = celltable == '' ? null:celltable;

        Meteor.call( 'insertcell', buildingnumber, cellid, cellname, celltable, ( error, response ) => {
          if ( error ) {
            // console.log( error.reason );
            // throw new Meteor.Error('bad', 'stuff happened');
            log_cell_add.error('cell add: ' + ' | failed in ' 
				+ error.reason, Meteor.user().username);
            Bert.alert( error.reason, 'danger', 'growl-top-right' );
          } else {
          	log_cell_edit.warn('cell add: ' + ' | Cell Id: ' 
				+ cellid, Meteor.user().username);
            Bert.alert( 'new cell added!', 'success', 'growl-top-right' );
          }
        });
        return false;
	},
	'keyup .add-cell-building-number': function(event){
		let value = $(event.target).val();
		Session.set('add-cell-building-number',value);
		return;
	},
	'keyup .add-cell-id': function(event){
		let value = $(event.target).val();
		Session.set('add-cell-id',value);
		return;
	},
	'keyup .add-cell-name': function(event){
		let value = $(event.target).val();
		Session.set('add-cell-name',value);
		return;
	},
	'keyup .add-cell-table': function(event){
		let value = $(event.target).val();
		Session.set('add-cell-table',value);
		return;
	},
	'keyup .MinutesPP_one': function(event){
		let value = $(event.target).val();
		Session.set('MinutesPP_one',value);
		return;
	},
	'keyup .MinutesPP_two': function(event){
		let value = $(event.target).val();
		Session.set('MinutesPP_two',value);
		return;
	},
	'keyup .MinutesPP_three': function(event){
		let value = $(event.target).val();
		Session.set('MinutesPP_three',value);
		return;
	},
	'keyup .PiecesPH_one': function(event){
		let value = $(event.target).val();
		Session.set('PiecesPH_one',value);
		return;
	},
	'keyup .PiecesPH_two': function(event){
		let value = $(event.target).val();
		Session.set('PiecesPH_two',value);
		return;
	},
	'keyup .PiecesPH_three': function(event){
		let value = $(event.target).val();
		Session.set('PiecesPH_three',value);
		return;
	},
	'keyup .partnumber': function(event){
		let value = $(event.target).val();
		Session.set('partnumber',value);
		return;
	},
	'keyup .cellnumber': function(event){
		let value = $(event.target).val();
		Session.set('cellnumber',value);
		return;
	},
	'keyup .Drawingname': function(event){
		let value = $(event.target).val();
		Session.set('drawingname',value);
		return;
	},

	//for cell edit
	'keyup .cell-buildingnumber-edit': function(event){
		let value = $(event.target).val();
		Session.set('cell-buildingnumber-edit',value);
		return;
	},
	'keyup .cell-cellId-edit': function(event){
		let value = $(event.target).val();
		Session.set('cell-cellId-edit',value);
		return;
	},
	'keyup .cell-cellname-edit': function(event){
		let value = $(event.target).val();
		Session.set('cell-cellname-edit',value);
		return;
	},
	'keyup .cell-celltable-edit': function(event){
		let value = $(event.target).val();
		Session.set('cell-table-edit',value);
		return;
	},
	//for part edit
	'keyup .XMLname-edit': function(event){
		let value = $(event.target).val();
		Session.set('XMLname-edit',value);
		return;
	},
	'keyup .part-edit': function(event){
		let value = $(event.target).val();
		Session.set('part-edit',value);
		return;
	},
	'keyup .cell-edit': function(event){
		let value = $(event.target).val();
		Session.set('cell-edit',value);
		return;
	},
	'keyup .ProductCode-edit': function(event){
		let value = $(event.target).val();
		Session.set('ProductCode-edit',value);
		return;
	},
	'keyup .buildingnumber-edit': function(event){
		let value = $(event.target).val();
		Session.set('buildingnumber-edit',value);
		return;
	},
	'keyup .MinutesPP_one-edit': function(event){
		let value = $(event.target).val();
		Session.set('MinutesPP_one-edit',value);
		return;
	},
	'keyup .MinutesPP_two-edit': function(event){
		let value = $(event.target).val();
		Session.set('MinutesPP_two-edit',value);
		return;
	},
	'keyup .MinutesPP_three-edit': function(event){
		var value = $(event.target).val();
		Session.set('MinutesPP_three-edit',value);
		return;
	},
	'keyup .PiecesPH_one-edit': function(event){
		var value = $(event.target).val();
		Session.set('PiecesPH_one-edit',value);
		return;
	},
	'keyup .PiecesPH_two-edit': function(event){
		var value = $(event.target).val();
		Session.set('PiecesPH_two-edit',value);
		return;
	},
	'keyup .PiecesPH_three-edit': function(event){
		var value = $(event.target).val();
		Session.set('PiecesPH_three-edit',value);
		return;
	},
	'click .maintenance-submit': function(event){
		var partnumber = Session.get('partnumber');
		var cellnumber = Session.get('cellnumber');
		var Drawingname = Session.get('drawingname');
		var ProductCode = Session.get('ProductCode');
		var MinutesPP_one = Session.get('MinutesPP_one');
		var MinutesPP_two = Session.get('MinutesPP_two');
		var MinutesPP_three = Session.get('MinutesPP_three');
		var PiecesPH_one = Session.get('PiecesPH_one');
		var PiecesPH_two = Session.get('PiecesPH_two');
		var PiecesPH_three = Session.get('PiecesPH_three');
		var buildingnumber = Session.get('buildingnumber_part_maintenance');
		let XMLname = pre_url + Drawingname;
		//var QualityFlag = Session.get('QualityFlag');
		// console.log(MinutesPP_three);

		// Meteor.call('insertpartnumber',partnumber,cellnumber,XMLname,ProductCode,MinutesPP_one
		// 	,MinutesPP_two, MinutesPP_three, PiecesPH_one, PiecesPH_two, PiecesPH_three,
		// 	buildingnumber);
		Meteor.call( 'insertpartnumber', partnumber,cellnumber,XMLname,ProductCode,MinutesPP_one
			,MinutesPP_two, MinutesPP_three, PiecesPH_one, PiecesPH_two, PiecesPH_three,
			buildingnumber, ( error, response ) => {
	          if ( error ) {
	            // console.log( error.reason );
	            // throw new Meteor.Error('bad', 'stuff happened');
	            log_part_add.error('part add: ' + ' | failed in ' 
				+ error.reason, Meteor.user().username);
	            Bert.alert( error.reason, 'danger', 'growl-top-right' );
	          } else {
	          	log_part_add.warn('part add: ' + ' | Part Number: ' 
				+ cellId, Meteor.user().username);
	            Bert.alert( 'insert document successfully!', 'success', 'growl-top-right' );
	          }
	        });
		return false;
	},
})


Template.PartMaintenance.helpers({
	inputCell_placeholder:function(){
		if (Session.get('inputCell_id') != null) {
			return Session.get('inputCell_id');
		}else{
			return 'Cell ID';
		}
	},
	inputPart_placeholder:function(){
		if (Session.get('inputPart_id') != null) {
			return Session.get('inputPart_id');
		}else{
			return 'Part Number';
		}
	},
	edit_partOrcell:function(){
		if(Session.get('edit-partOrcell') == null){
			return true;
		}else if (Session.get('edit-partOrcell') == 0){
			return true;
		}else{
			return false;
		}
	},
	add_partOrcell:function(){
		if(Session.get('add-partOrcell') == null){
			return true;
		}else if (Session.get('add-partOrcell') == 0){
			return true;
		}else{
			return false;
		}
	},
	viewXMLname:function(){
		let url = this.XMLname;
		if(url != null){
			// let XMLname = url.split("=")[1];
			// return XMLname;
			return url;
		}else{
			return null;
		}
		
		
	},
	previewLink:()=>{
		return Session.get('drawingname') == null ? null:pre_url + Session.get('drawingname');
	},
	partnumber:()=>{
		return Partnumber.find();
	},
	viewall:()=>{
		if(Session.get('toggle-maintenance') == null && Session.get('maintenance-Viewall') == true){
			return true;
		}
		if(Session.get('toggle-maintenance') == 0 && Session.get('maintenance-Viewall') != null){
			return true
		}else{
			false;
		}
	},
	PiecesPH_one_cal:()=>{
		var value = Session.get('MinutesPP_one');
		if(typeof(value) !== "undefined"){
			value = ''+ 60/Session.get('MinutesPP_one');
			Session.set('PiecesPH_one',value);
			return value;
		}else{
			Session.set('PiecesPH_one',null);
			return null;
		}
	},
	PiecesPH_two_cal:()=>{
		var value = Session.get('MinutesPP_two');
		if(typeof(value) !== "undefined"){
			value = ''+ 60/Session.get('MinutesPP_two');
			Session.set('PiecesPH_two',value);
			return value;
		}else{
			Session.set('PiecesPH_two',null);
			return null;
		}
	},
	PiecesPH_three_cal:()=>{
		var value = Session.get('MinutesPP_three');
		if(typeof(value) !== "undefined"){
			value = ''+ 60/Session.get('MinutesPP_three');
			Session.set('PiecesPH_three',value);
			return value;
		}else{
			Session.set('PiecesPH_three',null);
			return null;
		}
	},
	displaytable: function(){
		if(Session.get('toggle-maintenance') == 0 || Session.get('toggle-maintenance') == 2){
			return false;
		}else{
			if(Session.get('inputPart_id') != null && 
				(Session.get('edit-partOrcell') == 0 || Session.get('edit-partOrcell') == null)){
				return true;
			}else{
				return false;
			}
		}
	},
	displaytable_cell:function(){
		if(Session.get('toggle-maintenance') == 0 || Session.get('toggle-maintenance') == 2){
			return false;
		}else{
			if(Session.get('inputCell_id') != null && Session.get('edit-partOrcell') == 1){
				return true;
			}else{
				return false;
			}
		}
	},
	searchpage: function(){
		// if(Session.get('lostMin') != null){
		// 	return "toggle-GenerateChart";
		// }
		if(Session.get('toggle-maintenance') == null || Session.get('toggle-maintenance') == 0){
			if(Session.get('add-partOrcell') != null && Session.get('add-partOrcell') == 1){
				return "toggle-Maintenance-addCell-page";
			}
			return false;
		}else{
			if(Session.get('toggle-maintenance') == 1){
				return "toggle-Maintenance-page";
			}else if(Session.get('toggle-maintenance') == 2){
				return "toggle-Maintenance-import-page";
			}	
		}
		
	},
	parts: function(){
		if (Session.get('toggle-maintenance') == 0 || Session.get('toggle-maintenance') == 2){
			return false;
		}else{
			// var part = Session.get('inputPart');
			// data = Partnumber.find({part:part}).fetch();
			// console.log(data);
			let part = Session.get('inputPart_id');
			let data = Partnumber.find({part:part}).fetch();
			// console.log(data);
			return data;
		}
	},
	cells: function(){
		if (Session.get('toggle-maintenance') == 0 || Session.get('toggle-maintenance') == 2){
			return false;
		}else{
			let cellId = Session.get('inputCell_id');
			let data = Cell.find({cellId:cellId}).fetch();

			return data;
		}
	},
	selectedcells: function(){
		if (Session.get('toggle-maintenance') == 0 || Session.get('toggle-maintenance') == 2){
			return false;
		}else{
			// let cellId = Session.get('inputCell_id');
			let _id = Session.get('toggle-maintenance-cell-edit-id');
			let data = Cell.find({_id:_id}).fetch();

			return data;
		}
	},

})
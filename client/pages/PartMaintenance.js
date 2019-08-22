import { Tasks, Partnumber, Taskworktime, Plan, Operator, EarnedTimePP } from '/lib/collections.js';
var pre_url = "http://datuswes008/SOLIDWORKSPDM/Contains/EWS%20DB/Material/WM/Finished%20Goods?file=";

Template.PartMaintenance.onCreated(function(){
	this.autorun(() => {
		this.subscribe('task');
	})
	this.autorun(() => {
		this.subscribe('partnumber');
	})
	this.autorun(() => {
		this.subscribe('taskworktime');
	})
	this.autorun(() => {
		this.subscribe('plan');
	})
	this.autorun(() => {
		this.subscribe('operator');
	})
	this.autorun(() => {
		this.subscribe('earnedTimePPiece');
	})
	// Meteor.setInterval(function() {
	// 	time.set(new Date());
	// }, 1000);
});


Template.PartMaintenance.events({
	'click .Modal-delete-yes': function(){
		console.log(this._id);
		Meteor.call('partnumberdelete',this._id);
		Session.set('toggle-maintenance-delete',null);
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
		Session.set('toggle-maintenance',0);
	},
	'click .label-edit': function(event){
		// console.log(1);
		Session.set('toggle-maintenance',1);
	},
	'click .label-import': function(event){
		// console.log(1);
		Session.set('toggle-maintenance',2);
	},
	'keypress input.inputPart': function(event){
		var part = $(event.target).val();
		if(event.key == 'Enter'){
			Session.set('inputPart',part);
			return false;
    	}
		return false;
		
	},
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
		return;
	},
	'click .maintenance-delete': function(event){
		Session.set('toggle-maintenance-delete','open');
		return;
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
		buildingnumber);
		Session.set('toggle-maintenance-edit','');
		alert('Update document successfully!');
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
		var buildingnumber = Session.get('buildingnumber');
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
	            Bert.alert( error.reason, 'danger', 'growl-top-right' );
	          } else {
	            Bert.alert( 'insert document successfully!', 'success', 'growl-top-right' );
	          }
	        });
		return false;
	},
})


Template.PartMaintenance.helpers({
	viewXMLname:function(){
		let url = this.XMLname;
		if(url != null){
			let XMLname = url.split("=")[1];
			return XMLname;
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
			value = ''+ Session.get('MinutesPP_one')*60;
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
			value = ''+ Session.get('MinutesPP_two')*60;
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
			value = ''+ Session.get('MinutesPP_three')*60;
			Session.set('PiecesPH_three',value);
			return value;
		}else{
			Session.set('PiecesPH_three',null);
			return null;
		}
	},
	displaytable: function(){
		if(Session.get('toggle-maintenance') == 0){
			return false;
		}else{
			if(Session.get('toggle-maintenance') == 1 && Session.get('inputPart') != null){
				return true;
			}
		}
	},
	searchpage: function(){
		// if(Session.get('lostMin') != null){
		// 	return "toggle-GenerateChart";
		// }
		if(Session.get('toggle-maintenance') == null){
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
		if (Session.get('toggle-maintenance') == 0){
			return false;
		}else{
			var part = Session.get('inputPart');
			data = Partnumber.find({part:part}).fetch();
			return data;
		}
	},

})
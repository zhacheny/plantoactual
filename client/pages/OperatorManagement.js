import { Tasks, Partnumber, Taskworktime, Plan, Operator, EarnedTimePP } from '/lib/collections.js';

Template.OperatorManagement.onCreated(function(){
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


Template.OperatorManagement.events({
	'click .maintenance-edit-submit': function(events){
		Session.set('toggle-OperatorManagement-edit','open');

		let operatorName = Session.get('operatorName-edit');
		let EENumber = Session.get('EENumber-edit');
		let Department = Session.get('Department-edit');
		let employIndicator = Session.get('employIndicator-edit');
		let supervisorName = Session.get('supervisorName-edit');
		let initial = Session.get('initial-edit');
		let id = Session.get('id-edit');
		console.log(initial);
		Meteor.call('editoperator', id,operatorName,EENumber,Department,employIndicator,
		supervisorName, initial);
		Session.set('toggle-OperatorManagement-edit','');
		alert('Update document successfully!');
		return;
	},
	'click .OperatorManagement-edit-win': function(event){
		Session.set('toggle-OperatorManagement-edit','open');
		Session.set('operatorName-edit',this.operatorName);
		Session.set('EENumber-edit',this.EENumber);
		Session.set('Department-edit',this.Department);
		Session.set('employIndicator-edit',this.employIndicator);
		Session.set('supervisorName-edit',this.supervisorName);
		Session.set('initial-edit',this.initial);
		Session.set('id-edit',this._id);
		// alert('Deleted!');
		return;
	},
	'click .Modal-cancel': function(event){
		Session.set('toggle-OperatorManagement-delete','');
		Session.set('toggle-OperatorManagement-edit','');
		return;
	},
	'click .Modal-delete-yes': function(){
		console.log(this._id);
		Meteor.call('operatordelete',this._id);
		Session.set('toggle-OperatorManagement-delete',null);
		alert('Deleted!');
		return false;

	},
	'keyup .inputEEnumber': function(event){
		var EENumber = $(event.target).val();
		Session.set('input-EENumber',EENumber);
		return false;
		
	},
	'click .OperatorManagement-delete': function(event){
		Session.set('toggle-OperatorManagement-delete','open');
		return;
	},
	'click .label-add': function(event){
		// console.log(0);
		Session.set('toggle-OperatorManagement',0);
	},
	'click .label-edit': function(event){
		// console.log(1);
		Session.set('toggle-OperatorManagement',1);
	},
	'click .label-import': function(event){
		// console.log(1);
		Session.set('toggle-OperatorManagement',2);
	},
	'keyup .Operatorname': function(event){
		let value = $(event.target).val();
		Session.set('Operatorname',value);
		return;
	},
	'keyup .EENumber': function(event){
		let value = $(event.target).val();
		Session.set('EENumber',value);
		return;
	},
	// 'keyup .Department': function(event){
	// 	let value = $(event.target).val();
	// 	Session.set('Department',value);
	// 	return;
	// },
	'keyup .Initial': function(event){
		let value = $(event.target).val();
		Session.set('initial',value);
		return;
	},
	'keyup .Operatorname-edit': function(event){
		let value = $(event.target).val();
		Session.set('Operatorname-edit',value);
		return;
	},
	'keyup .EENumber-edit': function(event){
		let value = $(event.target).val();
		Session.set('EENumber-edit',value);
		return;
	},
	'keyup .Department-edit': function(event){
		let value = $(event.target).val();
		Session.set('Department-edit',value);
		return;
	},
	'keyup .Initial-edit': function(event){
		let value = $(event.target).val();
		Session.set('initial-edit',value);
		return;
	},
	'click .OperatorManagement-submit': function(event){
		let operatorName = Session.get('Operatorname');
		let EENumber = Session.get('EENumber');
		let Department = Session.get('Department');
		let employIndicator = Session.get('employIndicator');
		let supervisorName = Session.get('supervisorName');
		let initial = Session.get('initial');
        Meteor.call( 'insertOperator', operatorName,EENumber,Department,employIndicator,supervisorName,initial
        	, ( error, response ) => {
          if ( error ) {
            // console.log( error.reason );
            // throw new Meteor.Error('bad', 'stuff happened');
            alert( error.reason);
          } else {
            alert( 'Added!' );
          }
        });
		return false;
	},
	'click .OperatorManagement-Viewall': function(){
		if (Session.get('OperatorManagement-Viewall') == null){
			Session.set('OperatorManagement-Viewall',true);
		}else{
			Session.set('OperatorManagement-Viewall',null);
		}
		return false;
	},
})


Template.OperatorManagement.helpers({
	displaytable: function(){
		if(Session.get('toggle-OperatorManagement') == 0){
			return false;
		}else{
			if(Session.get('toggle-OperatorManagement') == 1 && Session.get('input-EENumber') != null){
				return true;
			}
		}
	},
	selectedOperator: function(){
		if (Session.get('toggle-OperatorManagement') == 0){
			return false;
		}else{
			var EENumber = Session.get('input-EENumber');
			let data = Operator.find({EENumber:EENumber}).fetch();
			return data;
		}
	},
	operator:()=>{
		return Operator.find();
	},
	viewall:()=>{
		if(Session.get('toggle-OperatorManagement') == null && Session.get('OperatorManagement-Viewall') == true){
			return true;
		}
		if(Session.get('toggle-OperatorManagement') == 0 && Session.get('OperatorManagement-Viewall') != null){
			return true
		}else{
			false;
		}
	},

	OperatorManagementpage: function(){
		// if(Session.get('lostMin') != null){
		// 	return "toggle-GenerateChart";
		// }
		if(Session.get('toggle-OperatorManagement') == null){
			return false;
		}else{
			if(Session.get('toggle-OperatorManagement') == 1){
				return "toggle-OperatorManagement-page";
			}else if(Session.get('toggle-OperatorManagement') == 2){
				return "toggle-OperatorManagement-import-page";
			}	
		}
		
	},
})
import { Tasks, Partnumber, Taskworktime, Plan, Operator, EarnedTimePP,Anouncements } from '/lib/collections.js';


Template.Dashboard.onCreated(function(){
	this.autorun(() => {
		this.subscribe('anouncements');
	})
	this.autorun(() => {
		this.subscribe('task');
	})
});

Template.Dashboard.helpers({
	tasks: function(){
		return Tasks.find();
	},
	anouncements: function(){
		return Anouncements.find();
	},
	admin: function(){
		return Roles.userIsInRole(Meteor.userId(), 'admin');
	},
	isInRoleRankOne: ()=>{
		if(Roles.userIsInRole(Meteor.userId(), 'HR')){
			return true;
		}else{
			return false;
		}
	},
	isInRoleRankTwo: ()=>{
		if(Roles.userIsInRole(Meteor.userId(), 'HR') || Roles.userIsInRole(Meteor.userId(), 'Safety')){
			return true;
		}else{
			return false;
		}
	},
	isInRoleRankThree: ()=>{
		if(Roles.userIsInRole(Meteor.userId(), 'HR') || Roles.userIsInRole(Meteor.userId(), 'Safety') ||
			Roles.userIsInRole(Meteor.userId(), 'VSL')){
			return true;
		}else{
			return false;
		}
	},
	isInRoleRankFour: ()=>{
		if(Roles.userIsInRole(Meteor.userId(), 'HR') || Roles.userIsInRole(Meteor.userId(), 'Safety') ||
			Roles.userIsInRole(Meteor.userId(), 'VSL') || Roles.userIsInRole(Meteor.userId(), 'Lora')){
			return true;
		}else{
			return false;
		}
	},
	box_minus_Anouncements_show: ()=>{
		// console.log(Session.get('box-header-show'));
		return Session.get('box-Anouncements-delete-show') != true ? false : 'box-Anouncements-show';
	},
	box_add_Anouncements_show: ()=>{
		// console.log(Session.get('box-header-show'));
		return Session.get('box-Anouncements-add-show') != true ? false : 'box-Anouncements-add-show';
	},
});

Template.Dashboard.events({
	'keyup .box_add_Anouncements_input_filed': (event)=>{
		var str = $(event.target).val();
		Session.set('anouncements_input',str)
	},
	'click .edit-box-Menu':()=>{
		console.log(this);
	},
	'click .edit-box-Department':()=>{

	}, 
	'click .edit-box-Safety':()=>{

	}, 
	'click .edit-box-Anouncements':()=>{
		
	}, 
	'click .add-box-Anouncements':()=>{
		if (Session.get('box-Anouncements-add-show') != null && Session.get('box-Anouncements-add-show')) {
			Session.set('box-Anouncements-add-show',false);
		}else{
			Session.set('box-Anouncements-add-show',true);
		}
	}, 
	'click .minus-box-Anouncements':()=>{
		if (Session.get('box-Anouncements-delete-show') != null && Session.get('box-Anouncements-delete-show')) {
			Session.set('box-Anouncements-delete-show',false);
		}else{
			Session.set('box-Anouncements-delete-show',true);
		}
		
		// console.log(11);
	},
	'click .add-box-Menu':()=>{

	},

	'click .add-box-Anouncements-confirm':function(){
		var str = Session.get('anouncements_input');
		Meteor.call('add_boxAnouncementsRecords',str);
		Session.set('box-Anouncements-add-show',false)
		alert('added!');
	},
	'click .minus-box-Anouncements-records': function(){
		
		var id = this._id;
		Meteor.call('delete_boxAnouncementsRecords',id);
		alert('Deleted!');
	},
});
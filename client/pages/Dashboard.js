import { Tasks, Cell, Partnumber, Plan, Operator, EarnedTimePP,Anouncements,
		Safetymessage, Department, Menu } from '/lib/collections.js';
import moment from 'moment';
import { ClientTaskworktime } from '/client/main.js';
// var time = new ReactiveVar(new Date());
var format = 'hh:mm:ss';
//start from 12pm not 12:30pm
var reststart1 = moment('12:30:00',format);
var reststart2 = moment('13:30:00',format);
var reststart3 = moment('21:30:00',format);
var reststart4 = moment('22:30:00',format);
var restend1 = moment('13:30:00',format);
var restend2 = moment('14:30:00',format);
var restend3 = moment('22:30:00',format);
var restend4 = moment('23:30:00',format);
var shift_1_start = moment('05:50:00',format);
var shift_1_end = moment('14:50:00',format);
var shift_2_start = moment('15:00:00',format);
var shift_2_end = moment('23:50:00',format);

Template.Dashboard.onCreated(function(){
	// var currentTime = time.get();
	// this.autorun(() => {
	// 	this.subscribe('safetymessage');
	// })
	// this.autorun(() => {
	// 	this.subscribe('department');
	// })
	// this.autorun(() => {
	// 	this.subscribe('menu');
	// })
	// Meteor.setInterval(function() {
	// 	time.set(new Date());
	// }, 1000);
});

Template.Dashboard.helpers({
	selectedbuilding:function(){
		return Session.get('buildingnumber') != null ? Session.get('buildingnumber'):'';
	},
	happyBirthday: function() {
	    return 'Nero';
	    // return moment(currentTime).startOf('minute');
	},
	menu:function(){
		return Menu.find();
	},
	department:function(){
		return Department.find();
	},
	safetymessage:function(){
		return Safetymessage.find();
	},
	tasks: function(){
		return Tasks.find();
	},
	anouncements: function(){
		// return Anouncements.find({},{sort: { id: 1 }});
		return Anouncements.find({},{sort: { createdAt: 1 }});
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
	box_minus_Menu_show: ()=>{
		// console.log(Session.get('box-header-show'));
		return Session.get('box-Menu-delete-show') != true ? false : 'box-Menu-delete-show';
	},
	box_add_Menu_show: ()=>{
		// console.log(Session.get('box-header-show'));
		return Session.get('box-Menu-add-show') != true ? false : 'box-Menu-add-show';
	},
	box_minus_Anouncements_show: ()=>{
		// console.log(Session.get('box-header-show'));
		return Session.get('box-Anouncements-delete-show') != true ? false : 'box-Anouncements-show';
	},
	box_add_Anouncements_show: ()=>{
		// console.log(Session.get('box-header-show'));
		return Session.get('box-Anouncements-add-show') != true ? false : 'box-Anouncements-add-show';
	},
	iseditSafety: ()=>{
		if(Session.get('toggle-edit-box-Safety') != null && Session.get('toggle-edit-box-Safety') == true){
			return true;
		}else{
			return false;
		}
	},
	iseditDepartment: ()=>{
		if(Session.get('toggle-edit-box-Department') != null && Session.get('toggle-edit-box-Department') == true){
			return true;
		}else{
			return false;
		}
	},
	iseditAnouncements:()=>{
		if(Session.get('toggle-edit-box-Anouncements') != null && Session.get('toggle-edit-box-Anouncements') == true){
			return true;
		}else{
			return false;
		}
	},
	
	// setCurrtime:function(){
	// 	var currentTime = time.get();
	// 	// Session.set('time',currentTime);
	// },
	// //algo for jumping back when hour complete
	gettaskdata: function(){
		// var currentTime = time.get();
		var currentTime = Session.get('time');
		var timeformat = moment(currentTime,format);
		//set test time
		var hour = moment(timeformat).format('HH');
		var min = moment(timeformat).format('mm');
		var sec = moment(timeformat).format('ss');
		
		if (Session.get('test-mode-time') != null){

			var timearray = Session.get('test-mode-time');
			if (min == parseInt(timearray[1]) && sec == 58){
				//back to add task part
	  			FlowRouter.go('/admin/addtasks');
			}else if (min ==parseInt(timearray[1])+1 && sec == 58){
	  			FlowRouter.go('/admin/addtasks');
			}else if (min == parseInt(timearray[1])+2 && sec == 58){
	  			FlowRouter.go('/admin/addtasks');
			}
		}else{
			if (timeformat.isBetween(reststart1, restend1)) {
				if(hour == 13 && min == 29 && sec == 58){
	  				FlowRouter.go('/admin/addtasks');
				}
			} else if (timeformat.isBetween(reststart2, restend2)){
				if(hour == 14 && min == 29 && sec == 58){
	  				FlowRouter.go('/admin/addtasks');
				}
			}else if (timeformat.isBetween(reststart3, restend3)){
				if(hour == 22 && min == 29 && sec == 58){
	  				FlowRouter.go('/admin/addtasks');
				}
			}else if (timeformat.isBetween(reststart4, restend4)){
				if(hour == 23 && min == 29 && sec == 58){
	  				FlowRouter.go('/admin/addtasks');
				}
			}
			else{
				//need to be changed 8/21/19
				if (hour >= 6 && hour < 12 && min == 59 && sec == 58){
	  				FlowRouter.go('/admin/addtasks');
				}else if(hour >= 15 && hour < 21 && min == 59 && sec == 58){
	  				FlowRouter.go('/admin/addtasks');
				}

			}
		}
	},
});

Template.Dashboard.events({
	'click .Modal-delete-yes': function(){
		// Session.set('send-Safety-message','');
	},
	'click .Modal-delete-cancel': function(){
		Session.set('send-Safety-message','');
		return false;
	},
	'click .send-Safety-message': function(){
		Session.set('send-Safety-message','open');
		return;
	},
	'click .confirm-box-Safety': function(){
		let content = Session.get('edit-box-Safety-input');
		if(content != null){
			Meteor.call('updateSafetyMessage',content);	
			Session.set('toggle-edit-box-Safety',false);	
		}
	},
	'click .confirm-box-Department': function(){
		let content = Session.get('edit-box-Department-input');
		if(content != null){
			Meteor.call('updateDeparment',content);	
			Session.set('toggle-edit-box-Department',false);	
		}
	},
	'change .edit-box-Safety-input': function(event){
		let content = $(event.target).val();
		Session.set('edit-box-Safety-input',content);
	},
	'keypress .edit-box-Safety-input': function(event){
		let content = $(event.target).val();
		if(event.key == 'Enter' && content != null){
	    	
			Meteor.call('updateSafetyMessage',content);
	      // add to database
	    }
	},
	'change .edit-box-Department-input': function(event){
		let content = $(event.target).val();
		Session.set('edit-box-Department-input',content);
		
	},
	'keypress .edit-box-Department-input': function(event){
		let content = $(event.target).val();
		if(event.key == 'Enter' && content != null){
	    	
			Meteor.call('updateDeparment',content);
	      // add to database
	    }
	},
	'keyup .box_add_Anouncements_input_filed': (event)=>{
		var str = $(event.target).val();
		Session.set('anouncements_input',str);
	},
	'keyup .box_edit_Anouncements_input_filed': (event)=>{
		var str = $(event.target).val();
		Session.set('anouncements_edit_input',str);
	},
	'keypress .box_edit_Anouncements_input_filed': (event)=>{
		var str = $(event.target).val();
		let id = $(event.currentTarget).data('id');
		if(event.key == 'Enter'){
	    	
			console.log(id);
			Meteor.call('edit_boxAnouncementsRecords',str,id);
	      // add to database
	    }
	},
	'click .edit-box-Menu':()=>{
		console.log(this);
	},
	'click .edit-box-Safety':()=>{
		if (Session.get('toggle-edit-box-Safety') != null && Session.get('toggle-edit-box-Safety')) {
			Session.set('toggle-edit-box-Safety',false);
		}else{
			Session.set('toggle-edit-box-Safety',true);
		}
	}, 
	'click .edit-box-Department':()=>{
		if (Session.get('toggle-edit-box-Department') != null && Session.get('toggle-edit-box-Department')) {
			Session.set('toggle-edit-box-Department',false);
		}else{
			Session.set('toggle-edit-box-Department',true);
		}
	},
	'click .edit-box-Anouncements':()=>{
		if (Session.get('toggle-edit-box-Anouncements') != null && Session.get('toggle-edit-box-Anouncements')) {
			Session.set('toggle-edit-box-Anouncements',false);
		}else{
			Session.set('toggle-edit-box-Anouncements',true);
		}
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
	'click .minus-box-Menu':()=>{
		if (Session.get('box-Menu-delete-show') != null && Session.get('box-Menu-delete-show')) {
			Session.set('box-Menu-delete-show',false);
		}else{
			Session.set('box-Menu-delete-show',true);
		}
		
		// console.log(11);
	},
	'click .add-box-Menu':()=>{
		if (Session.get('box-Menu-add-show') != null && Session.get('box-Menu-add-show')) {
			Session.set('box-Menu-add-show',false);
		}else{
			Session.set('box-Menu-add-show',true);
		}
	}, 
	'keyup .box_add_Menu_input_filed_name':function(event){
		let name = $(event.target).val();
		Session.set('menu-input-name',name);
	},
	'keyup .box_add_Menu_input_filed_disc':function(event){
		let disc = $(event.target).val();
		Session.set('menu-input-discription',disc);
	},
	'keyup .box_add_Menu_input_filed_price':function(event){
		let price = $(event.target).val();
		Session.set('menu-input-price',price);
	},
	'click .add-box-Menu-confirm':function(){
		let name = Session.get('menu-input-name');
		let discription = Session.get('menu-input-discription');
		let price = Session.get('menu-input-price');
		// var currentTime = time.get();
		var currentTime = Session.get('time');
		let createdAt = currentTime;
		Meteor.call('add_box_Menu',name,discription,price,createdAt);
		Session.set('box-Menu-add-show',false)
		alert('added!');
	},

	'click .add-box-Anouncements-confirm':function(){
		let str = Session.get('anouncements_input');
		// var currentTime = time.get();
		var currentTime = Session.get('time');
		let createdAt = currentTime;
		console.log(createdAt);
		Meteor.call('add_boxAnouncementsRecords',str,createdAt);
		Session.set('box-Anouncements-add-show',false)
		alert('added!');
	},
	'click .edit-box-Anouncements-confirm':function(event){
		let str = Session.get('anouncements_edit_input');
		// let id = $(event.currentTarget).data('id');
		var id = this._id;
		// console.log(id);
		Meteor.call('edit_boxAnouncementsRecords',str,id);
		// Session.set('toggle-edit-box-Anouncements',false)
		// alert('edited!');
	},
	'click .minus-box-Anouncements-records': function(){
		
		let id = this._id;
		Meteor.call('delete_boxAnouncementsRecords',id);
		alert('Deleted!');
	},
	'click .minus-box-Menu-records': function(){
		
		let id = this._id;
		// console.log(id);
		Meteor.call('delete_box_Menu',id);
		alert('Deleted!');
	},
});
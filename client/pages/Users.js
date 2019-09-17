import moment from 'moment';


Template.Users.onCreated(function(){
	this.autorun(() => {
		this.subscribe('allUsers');
	})
})

Template.Users.helpers({
	users: function(){
		return Meteor.users.find();
	},
	userEmail: function(){
		return this.emails[0].address;
	},
	isAdmin: function(){
		return Roles.userIsInRole(this._id,'admin') ? 'True' : 'False';
	},
	roles: function(){
		return Roles.getRolesForUser(this._id);
	},
	isOperator: function(){
		return Roles.userIsInRole(this._id,'operator') ? 'operator' : '';
	},
	dateFormat:function(){
		return moment(this.createdAt).format('lll');
	},
	editMode: function () {
		// console.log(Session.get('currentUser') ? 'edit-mode' : '');
		return Session.get('currentUser') ? 'edit-mode' : '';
	},
	currentEdit: function(){
		let user = Session.get('currentUser');
		return user._id === this._id;
	},
})

Template.Users.events({
	'click .user_id': function(){
		// console.log(this);
		Session.set('currentUser', this);
	},
	'click .toggle-admin': function(){
		//call form server side
		Meteor.call('toggleAdmin', this._id);
	},
	'click .close-edit-mode':function () {
		Session.set('currentUser', null);
	},
});
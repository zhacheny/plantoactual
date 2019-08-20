
Template.AppNav.helpers({
	notoperator:function () {
		if(Roles.userIsInRole(Meteor.userId(), 'admin') || Roles.userIsInRole(Meteor.userId(), 'HR') || Roles.userIsInRole(Meteor.userId(), 'Safety') ||
			Roles.userIsInRole(Meteor.userId(), 'VSL') || Roles.userIsInRole(Meteor.userId(), 'Lora')
			|| Roles.userIsInRole(Meteor.userId(), 'supervisor')){
			return true;
		}else{
			return false;
		}
	}
});

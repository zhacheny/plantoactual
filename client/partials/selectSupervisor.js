import { Tasks, Partnumber, Taskworktime, Plan, Operator } from '/lib/collections.js';

Template.selectSupervisor.onCreated(function(){
	this.autorun(() => {
		this.subscribe('operator');
	})
    this.autorun(() => {
        this.subscribe('Supervisor');
    })
	// Meteor.setInterval(function() {
	// 	time.set(new Date());
	// }, 1000);
});

Template.selectSupervisor.helpers({
    supervisor:function(){
        return Roles.userIsInRole(Meteor.userId(), 'supervisor')?  
        Meteor.users.find() : Meteor.users.find({_id: {$ne: Meteor.userId()}});
    },
	// operators: function(){
 //        return Operator.find({}, { sort: { operatorID: 1 }} );
	// },
});

Template.selectSupervisor.events({
	'change .select-tag-dropdown':function (evt) {
		var name = $(evt.target).val();
        var type = $(evt.currentTarget).data('type');
        if(type == 'default'){
            Session.set('supervisorName', name);
        }else{
            Session.set('supervisorName-edit', name);
        }
		
		// console.log(Session.get('buildingnumber') == "1");	
	},
});

Template.selectSupervisor.onRendered(async function select2onRendered(){

    function rafAsync() {
        return new Promise(resolve => {
            requestAnimationFrame(resolve); //faster than set time out
        });
    }

    async function checkElement(selector) {
        while (!document.getElementById(selector)) {
            await rafAsync()
        }
        return true;
    }

    checkElement('select-tag')
        .then(() => {
            $('.select-tag-dropdown').select2();
        });

});
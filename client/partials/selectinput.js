import { Tasks, Partnumber, Taskworktime, Plan, Operator } from '/lib/collections.js';

Template.selectinput.onCreated(function(){
	this.autorun(() => {
		this.subscribe('operator');
	})
	// Meteor.setInterval(function() {
	// 	time.set(new Date());
	// }, 1000);
});

Template.selectinput.helpers({
	operators: function(){
		return Operator.find();
	},
});

Template.selectinput.events({
	'change .select-tag-dropdown':function (evt) {
		var name = $(evt.target).val();
		Session.set('operator', name);
		// console.log(Session.get('buildingnumber') == "1");	
	},
});

Template.selectinput.onRendered(async function select2onRendered(){

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
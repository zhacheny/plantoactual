import { Tasks, Partnumber, Taskworktime, Plan } from '/lib/collections.js';
//run on your server
Meteor.methods({
	checkIsnull() {
		return;
	},
	toggleAdmin(id) {
		if (Roles.userIsInRole(id,'admin')) {
			Roles.removeUsersFromRoles(id,'admin');
		}else{
			Roles.addUsersToRoles(id,'admin');
		}
	},
	updateplan(id,value) {
	    Taskworktime.update(id, {
	      $set: { plantoactual: value },
	    });
	},
	updatepart(id,partnumber) {
	    Taskworktime.update(id, {
	      $set: { part: partnumber },
	    });
	},
	updateactual(id,input) {
	    Taskworktime.update(id, {
	      $set: { actual: input },
	    });
	},
	inserttask(id, timespan, partnumber, worktime, plantoactual, actual, reason, status,createdAt,comment,operator) {
		Tasks.insert({
			id: id,
		      timespan: timespan,
		      partnumber:partnumber,
		      worktime:worktime,
		      plan:plantoactual,
		      actual:actual,
		      reason:reason,
		      status:status,
		      comment:comment,
		      createdAt: createdAt,
		      operator:operator,
		      // owner: Meteor.userId(),
		      // username: Meteor.user().username,
		    });
	},
	errortype(wrongtype){
		return;
	},
	setnull(){
		return;
	},
	setnull(){
		return;
	},
	setColorDefault(){
		return;
	},
	submitLogic(){
		return;
	},
	// 'tasks.insert'(text) {
 //    check(text, String);
 
 //    //Check if user is logged in
 //    if (! Meteor.userId) {
 //      throw new Meteor.Error('not-authorized');
 //    }
 
 //    Taksks.insert({
 //      text,
 //      createdAt: new Date(),
 //      owner: Meteor.userId(),
 //      username: Meteor.user().username,
 //    });
 //  },

 //  	'tasks.remove'(task){
 //  		check(task._id, String);
 //  		// console.log(note.owner);
 //  		// console.log(Meteor.userId());
 //  		if(task.owner !== Meteor.userId()){
 //  			throw new Meteor.Error('not-authorized');
 //  		}

 //  		Taksks.remove(task._id);
 //  	},

})
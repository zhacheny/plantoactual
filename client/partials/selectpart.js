import { Tasks, Partnumber } from '/lib/collections.js';
import { ClientTaskworktime } from '/client/main.js';
// Tasks = new Mongo.Collection('task');

// Template.selectpart.onCreated(function(){
// 	this.autorun(() => {
// 		this.subscribe('task');
// 	})
// 	this.autorun(() => {
// 		this.subscribe('partnumber');
// 	})
// })
function autofill_plannumber(id){
	
	var indexofId = id.substring(0,1).charCodeAt(0);
	// var curId = String.fromCharCode(indexofId+1);
	var curId = String.fromCharCode(indexofId);
	// var curId = id;
	// console.log('selectpart',curId);
    //automatically changed the plan number
	var plantoactual_auto_generate = 0;
	var partnumber = Session.get('partnumber');
	var operatorcount = Session.get('operatorcount');

	if (!ClientTaskworktime.findOne({id:curId})){
		return;
	}
	var worktime = ClientTaskworktime.findOne({id:curId}).worktime;
	// console.log([worktime,curId]);
	// console.log(ClientTaskworktime.findOne({id:curId}));
	if (partnumber == 'Part Not Available'){
		// Session.set('earnedTimePPiecePOpe',value);
		Session.set('earnedTimePPiecePOpe',0);
	}else{
		var partnumber_Object = Partnumber.findOne({cell:Cookie.get('cell'), part:partnumber});
		if(!partnumber_Object){
			console.log('object is null');
			return;
		}
		var MinutesPP_one = partnumber_Object.MinutesPP_one;
		plantoactual_auto_generate = MinutesPP_one;
		// var value = 1/MinutesPP_one;
		if (operatorcount == 2){
			plantoactual_auto_generate = Partnumber.findOne({cell:Cookie.get('cell'), part:partnumber}).MinutesPP_two;
		}else if (operatorcount == 2){
			plantoactual_auto_generate = Partnumber.findOne({cell:Cookie.get('cell'), part:partnumber}).MinutesPP_three;
		}
		plantoactual_auto_generate = plantoactual_auto_generate == '' ? 0 : worktime/plantoactual_auto_generate;
		//returns the largest integer less than the value
		plantoactual_auto_generate = Math.floor(plantoactual_auto_generate);
		// value = Math.round( value * 10 ) / 10;
	}

	ClientTaskworktime.update({id:curId}, {
		$set: { partnumber:partnumber, plan: plantoactual_auto_generate},
	});
}
Template.selectpart.helpers({
	activeOrg:function(isCurrent){
		return isCurrent == 'false' ? {disabled: 'disabled'} : {};
	},
	pre_selectedcheck:function(pre_selected,isCurrent,documentid){
		if (pre_selected != null && isCurrent == 'true'){
			// console.log('pre_selectedcheck' , documentid);
			autofill_plannumber(documentid);
			return true;
		}else{
			return false;
		}
		// return pre_selected != null && isCurrent == true ? true:false;
	},
	selectpart:function(selected){
		// console.log(selected);
		return selected != 'XXX' ? true:false;
		// return false;
	},
	admin: function(){
		return Roles.userIsInRole(Meteor.userId(), 'admin');
	},
	tasks: function(){
		// console.log(Tasks.find().fetch());
		return Tasks.find();
	},
	partnumber: function(type){
		// console.log(Tasks.find().fetch());
		if(type != 'report'){
			var selectbuilding =  Cookie.get('buildingnumber');
			var selectcell = Cookie.get('cell');
		}else{
			var selectbuilding =  Session.get('buildingnumber_manage_tasks');
			var selectcell = Session.get('cell_report');
		}
		// console.log(selectbuilding, selectcell);
		Meteor.subscribe('partnumber',selectbuilding,selectcell);
		return Partnumber.find({buildingnumber: selectbuilding,cell:selectcell}, { sort: { part: 1 }} );
	},
	
});

Template.selectpart.events({

});


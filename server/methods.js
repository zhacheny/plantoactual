import { Tasks, Cell, Partnumber, Changeover, Plan, Operator, EarnedTimePP,Anouncements,
		Safetymessage, Department, Menu, Messages } from '/lib/collections.js';
import { check, Match } from 'meteor/check';
import moment from 'moment';
//run on your server
Meteor.methods({
	// getServerTime: function () {
 //            // var _time = (new Date).toTimeString();
 //            var _time = (new Date);
 //            // console.log(_time);
 //            return _time;
 //    },
 	sendMessage(data, chattingIsuser) {

		// check(data, {
		// 		message: String, //the message to send
	 //      name: Match.Optional(String) //if the user already has a name
		// 	});
		    
	    if (data.message=="") {
	      throw new Meteor.Error("message-empty", "Your message is empty");
	    }
	    
	    let userName = (data.name && data.name!="") ? data.name : "Anonymous";

	    
	    // const matchName = data.message.match(/^My name is (.*)/i);
	    
	    if (chattingIsuser) {
	      Messages.insert({
	        name: userName,
	        message: data.message,
	        createdAt: new Date(),
	        announcement: true
	      });
	    } else {
	      Messages.insert({
	        name: userName,
	        message: data.message,
	        createdAt: new Date()
	      });
	    }

	    return {
	      name: userName
	    };
			
	},
	insertOperator(operatorName,EENumber,Department,employIndicator,supervisorName,initial){
		let exists = Operator.findOne( { EENumber: EENumber } );
		if ( !exists ) {
			Operator.insert({
				operatorName:operatorName,
				EENumber:EENumber,
				Department:Department,
				supervisorName:supervisorName,
				employIndicator:employIndicator,
				initial:initial,
	    	});
		}else {
	        // Session.set('part-insert-error','Rejected. This item already exists.');
	        throw new Meteor.Error('bad', 'Rejected. This Operator already exists.'+EENumber);
      	}

	},
	add_box_Menu(name,discription,price,createdAt){
		Menu.insert({
			name:name,
			discription:discription,
			price:price,
			createdAt:createdAt,
	    });
	},
	delete_box_Menu(Id){
		Menu.remove({_id: Id});
	},
	updateDeparment(content){
		let id = '1';
		Department.update({id:id}, {
	      $set: { content:content},
	    });
	},
	updateSafetyMessage(content){
		let id = '1';
		Safetymessage.update({id:id}, {
	      $set: { content:content},
	    });
	},
	edit_boxAnouncementsRecords(str,Id){
		Anouncements.update({_id:Id}, {
	      $set: { record:str},
	    });
	},
	delete_boxAnouncementsRecords(Id){
		// alert('Deleted!');
		Anouncements.remove({_id: Id});
	},
	add_boxAnouncementsRecords(str,createdAt) {
		Anouncements.insert({
			createdAt:createdAt,
			record:str,
	    });
	},
	editoperator( id,operatorName,EENumber,Department,employIndicator,
		supervisorName, initial ){
		Operator.update({_id:id}, {
	      $set: {
		        operatorName:operatorName,
				EENumber:EENumber,
				Department:Department,
				supervisorName:supervisorName,
				employIndicator:employIndicator,
				initial:initial,
			},
	    });
	},
	editpartnumber( id,part,cell,XMLname,ProductCode,MinutesPP_one,
		MinutesPP_two, MinutesPP_three, PiecesPH_one, PiecesPH_two, PiecesPH_three,
		buildingnumber ){
		Partnumber.update({_id:id}, {
	      $set: { part:part,
				      cell:cell,
				      buildingnumber:buildingnumber,
				      XMLname:XMLname,
				      ProductCode:ProductCode,
				      MinutesPP_one:MinutesPP_one,
				      MinutesPP_two:MinutesPP_two,
				      MinutesPP_three:MinutesPP_three,
				      PiecesPH_one:PiecesPH_one,
				      PiecesPH_two:PiecesPH_two,
				      PiecesPH_three:PiecesPH_three, },
	    });
	},
	parseUpload_operator( data ) {
	    // check( data, Array );
		// data.length
	    for ( let i = 0; i < data.length; i++ ) {
	    	// console.warn(data[ i ]);
			let operatorName   = data[ i ]['NAME'];
			let EENumber   = data[ i ]['EE NUMBER'];
			EENumber = EENumber.slice(-5);
			let Department   = data[ i ]['DEPARTMENT'];
			let supervisorName  = data[ i ]['MANAGER'];
			let employIndicator  = data[ i ]['EMPLOYMENT INDICATOR'];
			if(employIndicator == 'PROINDL'){
				employIndicator = 'Indirect Labor';
			}else if(employIndicator == 'PROINDL'){
				employIndicator = 'Direct Labor';
			}else{
				employIndicator = 'Facility Labor';
			}
			let temp_initial = operatorName.split(", ");
  			let initial = temp_initial[0].charAt(0) + temp_initial[1].charAt(0);
			let exists = Operator.findOne( { EENumber: EENumber } );
	      if ( !exists ) {
			Operator.insert({
					operatorName:operatorName,
					EENumber:EENumber,
					Department:Department,
					supervisorName:supervisorName,
					employIndicator:employIndicator,
					initial:initial,
				    });
	      } else {
	        // Session.set('part-insert-error','Rejected. This item already exists.');
	        throw new Meteor.Error('bad', 'Rejected. This Operator already exists.');
	      }
	    }
	  },
	// parseUpdate_part(data, part){
	// 	for (let i = 0; i < part.length; i++){
	// 		for (let j = data.length - 1; j >= 0; j--) {
	// 			// let part   = data[ j ]['Assembly No'];
	// 			let cellId   = data[ j ]['Cell ID'];
	// 			let cellName   = data[ j ]['Cell Name'];
	// 			if(part[i].cell == cellId){
	// 				Partnumber.update({cell:cellId}, {
	// 			      $set: { cell: cellName },
	// 			    });
	// 			}			
	// 		}
			
	// 	}
	// },
	parseUpload_part( data ) {
	    // check( data, Array );
		// data.length
	    for ( let i = 0; i < data.length; i++ ) {
	    	// console.warn(data[ i ]);
			let part   = data[ i ]['Assembly No'];
			let cell   = data[ i ]['Work'];
			// let buildingnumber   = data[ i ]['buildingnumber'];
			let ProductCode = data[ i ]['Prod'];
			let buildingnumber = '';
			switch(ProductCode){
				case 'WM04':
				buildingnumber = '2';
				break;
				case 'WM15':
				buildingnumber = '4';
				break;
				case 'WM01':
				buildingnumber = '3';
				break;
				case 'WM05':
				buildingnumber = '4A';
				break;
				case 'WM06':
				buildingnumber = '4A';
				break;
				case 'MX01':
				
				continue;
				
				default:
    			buildingnumber = 'unknown'; 
    			break;
			}
			let MinutesPP_one  = data[ i ]['1 Operator Minutes'];
			let MinutesPP_two   = data[ i ]['2 Operator Minutes'];
			let MinutesPP_three   = data[ i ]['3 Operator Minutes'];
			// let statusCode = data[ i ]['Status Code'];
			let XMLname = data[ i ]['Links'];
			if(XMLname == ''){
				XMLname = null;
			}
			let PiecesPH_one  = MinutesPP_one ==''? '': '' + MinutesPP_one*60;
			let PiecesPH_two   = MinutesPP_two ==''? '':'' + MinutesPP_two*60;
			let PiecesPH_three = MinutesPP_three ==''? '':'' + MinutesPP_three*60;
			let exists = Partnumber.findOne( { part: part } );
			let exists_cell = Cell.findOne( { cellname: cell } );
			if( !exists_cell ){
				Cell.insert({
						buildingnumber:buildingnumber,
						cellname:cell,
				});
			}
	      if ( !exists ) {
			Partnumber.insert({
				      part:part,
				      cell:cell,
				      buildingnumber:buildingnumber,
				      XMLname:XMLname,
				      ProductCode:ProductCode,
				      MinutesPP_one:MinutesPP_one,
				      MinutesPP_two:MinutesPP_two,
				      MinutesPP_three:MinutesPP_three,
				      PiecesPH_one:PiecesPH_one,
				      PiecesPH_two:PiecesPH_two,
				      PiecesPH_three:PiecesPH_three,
				      // owner: Meteor.userId(),
				      // username: Meteor.user().username,
				    });
	      } else {
	        // Session.set('part-insert-error','Rejected. This item already exists.');
	        throw new Meteor.Error('bad', 'Rejected. This item already exists.');
	      }
	    }
	  },
	operatordelete(Id){
		Operator.remove({_id: Id});
	},
	partnumberdelete(Id){
		Partnumber.remove({_id: Id});
	},
	insertpartnumber(part,cell,XMLname,ProductCode,MinutesPP_one,
		MinutesPP_two, MinutesPP_three, PiecesPH_one, PiecesPH_two, PiecesPH_three,
		buildingnumber){
		// if(typeof (MinutesPP_three == "undefined") || (PiecesPH_three == "undefined")){
		let exists = Partnumber.findOne( { part: part } );
		let exists_cell = Cell.findOne( { cellname: cell } );
		if( !exists_cell ){
			Cell.insert({
					buildingnumber:buildingnumber,
					cellname:cell,
			});
		}
		if ( !exists ) {
			Partnumber.insert({
				      part:part,
				      cell:cell,
				      buildingnumber:buildingnumber,
				      XMLname:XMLname,
				      ProductCode:ProductCode,
				      MinutesPP_one:MinutesPP_one,
				      MinutesPP_two:MinutesPP_two,
				      MinutesPP_three:MinutesPP_three,
				      PiecesPH_one:PiecesPH_one,
				      PiecesPH_two:PiecesPH_two,
				      PiecesPH_three:PiecesPH_three,
				      // owner: Meteor.userId(),
				      // username: Meteor.user().username,
				    });
	      } else {
	        // Session.set('part-insert-error','Rejected. This item already exists.');
	        throw new Meteor.Error('bad', 'Rejected. This item already exists.');
	      }
	},
	deletetask(Id){
		Tasks.remove({_id: Id});
	},
	updatechangeover(curId) {
		return;
	},
	checkIsnull() {
		return;
	},
	initializeClientTaskworktime() {
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
	updateAll(id, actualInput, reasonInput,
			commentInput,operatorarray,status) {
	    Tasks.update(id, {
	      $set: { actual: actualInput,
	      		  reason:reasonInput,
	      		  comment:commentInput,
	      		  operator:operatorarray,
	      		  status:status,
	      		},
	    });
	},
	// inserttask_2(response) {
	// 	let id = response[0];
	// 	let timespan = response[1];
	// 	let partnumber = response[2];
	// 	let worktime = response[3];
	// 	let plantoactual = response[4];
	// 	let actual = response[5];
	// 	let reason = response[6];
	// 	let status = response[7];
	// 	let createdAt = response[8];
	// 	let comment= response[9];
	// 	let operatorID = response[10];
	// 	let earnedtime = response[11];
	// 	let buildingnumber = response[12];
	// 	let cell =response[13];
	// 	console.log(111);
	// 	Tasks.insert({
	// 		id: id,
	// 	      timespan: timespan,
	// 	      partnumber:partnumber,
	// 	      worktime:worktime,
	// 	      plan:plantoactual,
	// 	      actual:actual,
	// 	      reason:reason,
	// 	      status:status,
	// 	      comment:comment,
	// 	      createdAt: createdAt,
	// 	      operatorID:operatorID,
	// 	      earnedtime:earnedtime,
	// 	      buildingnumber:buildingnumber,
	// 	      cell: cell,
	// 	      // owner: Meteor.userId(),
	// 	      // username: Meteor.user().username,
	// 	    });
	// },
	inserttask(id, timespan, partnumber, worktime, plantoactual, actual, reason,
		 status,createdAt,comment,operatorID,earnedtime,buildingnumber, cell) {
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
		      operatorID:operatorID,
		      earnedtime:earnedtime,
		      buildingnumber:buildingnumber,
		      cell: cell,
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
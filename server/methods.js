import { Tasks, Cell, Partnumber, Changeover, Plan, Operator, EarnedTimePP,Anouncements,
		Safetymessage, Department, Menu, Messages, SafetyReport,Taskrecord, OperatorSignedList } from '/lib/collections.js';
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
 	SafetyReportsendEmail(to, from, subject, 
 		  currentTime,
 		  buildingnumber,
		  where,
		  name,
		  report) {
	    // Make sure that all arguments are strings.
	    check([to, from, subject, currentTime, buildingnumber,where, name, report], [String]);

	    // Let other method calls from the same client start running, without
	    // waiting for the email sending to complete.
	    this.unblock();

	    Email.send({
	    	to:to, 
	    	from:from,
	    	subject:subject, 
	    	html: 
	    	'<table width="100%" style="border: 1px solid #eee;">'+
	          '<tr>'+
	            '<th style="text-align: left; padding: 10px; border-bottom: 1px solid #eee; border-right: 1px solid #eee;">Name</th>' +
	            '<td style="text-align: left; padding: 10px; border-bottom: 1px solid #eee;">'+ name +'</td>' +
	          '</tr>'+
	          '<tr>' +
	            '<th style="text-align: left; padding: 10px; border-bottom: 1px solid #eee; border-right: 1px solid #eee;">When</th>'+
	            '<td style="text-align: left; padding: 10px; border-bottom: 1px solid #eee;">'+currentTime+'</td>' +
	          '</tr>' +
	          '<tr>'+
	            '<th style="text-align: left; padding: 10px; border-right: 1px solid #eee;">Where</th>'+
	            '<td style="text-align: left; padding: 10px;">'+where+'</td>' +
	          '</tr>'+
	          '<tr>'+
	            '<th style="text-align: left; padding: 10px; border-right: 1px solid #eee;">Building Number</th>'+
	            '<td style="text-align: left; padding: 10px;">'+buildingnumber+'</td>' +
	          '</tr>'+
	          '<tr>'+
	            '<th style="text-align: left; padding: 10px; border-right: 1px solid #eee;">Content</th>'+
	            '<td style="text-align: left; padding: 10px;">'+report+'</td>' +
	          '</tr>'+
	        '</table>',
    	});
  	},
	insertSafetyReport(report, where, name, currentTime , buildingnumber){

		SafetyReport.insert({
				report:report,
				site:where,
				name:name, 
				createdAt:currentTime,
				buildingnumber:buildingnumber,
    	});

	},
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

		let exists = Partnumber.findOne( { _id:id } );
	      	if ( !exists ) {
				throw new Meteor.Error('bad', 'Rejected. This part NOT exists.');
			} else {
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
			}
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
	      } 
	      // else {
	      //   // Session.set('part-insert-error','Rejected. This item already exists.');
	      //   throw new Meteor.Error('bad', 'Rejected. This Operator already exists.');
	      // }
	    }
	  },
	parseUpdate_cell(data, cell){
		// for (let i = 0; i < cell.length; i++){
		// 	for (let j = data.length - 1; j >= 0; j--) {
		// 		// let part   = data[ j ]['Assembly No'];
		// 		let cellId   = data[ j ]['Cell ID'];
		// 		let cellName   = data[ j ]['Cell Name'];
		// 		let mix = cellId + '-' + cellName;
		// 		if(cell[i].cellname == cellId){
		// 			Cell.update({cellname:cellId}, {
		// 		      $set: { 
		// 		      	cellname: cellName,
		// 		      	cellId:cellId
		// 		      	 },
		// 		  },false,true);
		// 		}else{
		// 			Cell.update({cellname:cellId}, {
		// 			      $set: { 
		// 			      	cellname: '',
		// 			      	cellId:cellId
		// 			      	 },
		// 			  },false,true);
		// 		}		
		// 	}
			
		// }
		for (let i = 0; i < data.length; i++){
			// let part   = data[ j ]['Assembly No'];

			let cellId   = data[ i ]['Cell ID'];		
			let cellName   = data[ i ]['Cell Name'];
			console.log(cellName);
			let mix = cellId + '-' + cellName;
			Cell.update({cellId:cellId}, {
			      $set: { 
			      	cellname: cellName,
			      	 },
			  });
		}
	},
	parseUpdate_part(data, part){
		for (let i = data.length - 1; i >= 0; i--){
			var cellId   = data[ i ]['Cell ID'];
			var cellName   = data[ i ]['Cell Name'];
			for (let j = 0; j < part.length; j++) {
				// let part   = data[ j ]['Assembly No'];

				if(part[j].cell == cellId){

					var mix = cellId + '-' + cellName;
					// Partnumber.update({cell:cellId}, {
				 //      $set: { cellname:mix},
				 //    });
				    Partnumber.update({cell:cellId}, 
					    {$set:{cellname:mix}}, 
					    false,true
					)
				    console.log(cellId);
				}			
			}
			
		}
	},
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
			let PiecesPH_one  = MinutesPP_one ==''? '': data[ i ]['1 Operator Pcs/Hr'];
			let PiecesPH_two   = MinutesPP_two ==''? '': data[ i ]['2 Operator Pcs/Hr'];
			let PiecesPH_three = MinutesPP_three ==''? '': data[ i ]['3 Operator Pcs/Hr'];
			let exists = Partnumber.findOne( { part: part } );
			let exists_cell = Cell.findOne( { cellname: cell } );
			// if( !exists_cell ){
			// 	Cell.insert({
			// 			buildingnumber:buildingnumber,
			// 			cellname:cell,
			// 	});
			// }
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
	      } else{
				Partnumber.update({ part:part }, {
			      $set: { 
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
					    },
			    });
	      }
	      // else {
	      //   // Session.set('part-insert-error','Rejected. This item already exists.');
	      //   throw new Meteor.Error('bad', 'Rejected. This cell already exists.');
	      // }
	    }
	  },
	operatordelete(Id){
		Operator.remove({_id: Id});
	},
	partnumberdelete(Id){
		Partnumber.remove({_id: Id});
	},
	celldelete(Id){
		Cell.remove({_id: Id});
	},
	insertcell(buildingnumber, cellId, cellname, celltable){
		let exists_cell = Cell.findOne( { cellId: cellId } );
		if ( !exists_cell ) {
			if(celltable == null){
				Cell.insert({
					buildingnumber:buildingnumber,
					cellname:cellname,
					cellId: cellId
				});
			}else{
				Cell.insert({
					buildingnumber:buildingnumber,
					cellname:cellname,
					cellId: cellId,
					celltable:celltable
				});
			}
			
		}else{
			if(celltable == null){
				throw new Meteor.Error('bad', 'Rejected. This cell already exists.');
			}else{
				Cell.insert({
					buildingnumber:buildingnumber,
					cellname:cellname,
					cellId: cellId,
					celltable:celltable
				});
			}	
		}
	},
	updatecell(buildingnumber, _id, cellname, celltable, cellId){
		let exists_cell = Cell.findOne( { _id: _id } );
		if ( !exists_cell ) {
			throw new Meteor.Error('bad', 'Rejected. This cell NOT exists.');
		}else{
			if(celltable != null){

				Cell.update({_id: _id}, {
			      $set: { 
			      		celltable:celltable,
			       },
			    });
			}
			if(buildingnumber != null){
				Cell.update({_id: _id}, {
			      $set: { 
			      		buildingnumber:buildingnumber,
			       },
			    });
			}
			if(cellname != null){
				Cell.update({_id: _id}, {
			      $set: { 
			      		cellname:cellname,
			       },
			    });
			}
			if(cellId != null){
				Cell.update({_id: _id}, {
			      $set: { 
			      		cellId: cellId,
			       },
			    });
			}
			// if(celltable == null){
			// 	Cell.update({_id: _id}, {
			//       $set: { 
			//       		buildingnumber:buildingnumber,
			// 			cellname:cellname,
			//        },
			//     });
			// }else{
			// 	Cell.update({_id: _id}, {
			//       $set: { 
			//       		buildingnumber:buildingnumber,
			// 			cellname:cellname,
			// 			celltable:celltable,
			//        },
			//     });
			// }
		    
		}
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
	client_server_record_addflag(type,flag, cell, celltable){
		if(celltable != 'null'){
			if(type == 'supervisor'){
				Taskrecord.update({ cell: cell, celltable:celltable }, {
			      $set: { 
						addon_flag_supervisor:flag },
			    });
			}else{
				Taskrecord.update({ cell: cell, celltable:celltable }, {
			      $set: { 
						addon_flag_quality:flag },
			    });
			}
			
		}else{
			if(type == 'supervisor'){
				Taskrecord.update({ cell: cell }, {
			      $set: { 
						addon_flag_supervisor:flag },
			    });
			}else{
				Taskrecord.update({ cell: cell }, {
			      $set: { 
						addon_flag_quality:flag },
			    });
			}
		}

	},
	client_server_record(curtaskid, startime, cell, plannedworktime, celltable){
		let exists = Taskrecord.findOne( { cell: cell } );
		if(celltable != 'null'){
			exists = Taskrecord.findOne( { cell: cell, celltable:celltable } );
			if( !exists ){
				if(curtaskid == null){

					Taskrecord.insert({
							cell: cell,
							startime:startime,
							celltable:celltable,
					});
				}else{

					Taskrecord.insert({
							cell: cell,
							curtaskid: curtaskid,
							startime:startime,
							plannedworktime:plannedworktime,
							celltable:celltable,
					});
				}

			}else{
				if(curtaskid != null){
					Taskrecord.update({ cell: cell, celltable:celltable }, {
				      $set: { 
							curtaskid:curtaskid,
							 },
				    });
				}
				if( startime != null ){
					Taskrecord.update({ cell: cell, celltable:celltable }, {
				      $set: { 
							startime: startime,
							 },
				    });
				}
				if( plannedworktime != null ){
					Taskrecord.update({ cell: cell, celltable:celltable }, {
				      $set: { 
				      		plannedworktime:plannedworktime,
							 },
				    });
				}

			}
		}else {
			if( !exists ){
				Taskrecord.insert({
						cell: cell,
						curtaskid: curtaskid,
						startime:startime,
						plannedworktime:plannedworktime,
				});
			}else{
				// console.log(curtaskid, startime, plannedworktime);
				if(curtaskid != null){
					Taskrecord.update({ cell: cell }, {
				      $set: { 
							curtaskid:curtaskid,
							 },
				    });
				}
				if( startime != null ){
					Taskrecord.update({ cell: cell }, {
				      $set: { 
							startime: startime,
							 },
				    });
				}
				if( plannedworktime != null ){
					Taskrecord.update({ cell: cell }, {
				      $set: { 
				      		plannedworktime:plannedworktime,
							 },
				    });
				}

			}
		}


	},
	deletetask(Id){
		Tasks.remove({_id: Id});
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
	      		  operatorID:operatorarray,
	      		  status:status,
	      		},
	    });
	},
	update_task_flag(id, flagged) {
		if(flagged == null){
			throw new Meteor.Error('bad', 'Rejected. flagged is undefined!');
		}
		let exists = Tasks.findOne({_id:id})
		if( !exists ){
			throw new Meteor.Error('bad', 'Rejected. Document not found!');
		}else{
		    Tasks.update(id, {
		      $set: { flagged:flagged,
		      		},
		    });
		}
	},
	operator_Signout_All(operatorIDarray){
		let exists = OperatorSignedList.find({}).fetch();
		if( exists.length == 0){
			throw new Meteor.Error('bad', 'Rejected. OperatorSignedList-collection is empty!');
		}else{
			for (var i = operatorIDarray.length - 1; i >= 0; i--) {
				// console.log(operatorIDarray[i]);
				if( operatorIDarray[i] != 'null' ){
					let operator_isSigned = OperatorSignedList.findOne({ operatorID:operatorIDarray[i] });
					if( !operator_isSigned ){
						throw new Meteor.Error('bad', 'Rejected. Record not found');
					}else{
						OperatorSignedList.remove({operatorID: operatorIDarray[i]});
					}
				}
			}
		}
	},
	operator_Signout(operatorID){
		let operator_isSigned = OperatorSignedList.findOne({ operatorID:operatorID });
		if( !operator_isSigned ){
			throw new Meteor.Error('bad', 'Rejected. Record not found');
		}else{
			OperatorSignedList.remove({operatorID: operatorID});
		}
	},
	operator_isSigned(operatorID, createdAt, cell){
		let exists = OperatorSignedList.find({}).fetch();
		if( exists.length == 0){
			if(operatorID != null){
				OperatorSignedList.insert({
					operatorID:operatorID,
					createdAt:createdAt,
					cell:cell,
				});
			}

		}else{
			if(operatorID != null){
				let operator_isSigned = OperatorSignedList.findOne({ operatorID:operatorID });
				if(operator_isSigned){
					throw new Meteor.Error('bad', 'Rejected. You have already signed in at ' + operator_isSigned.cell + ' please sign out!');
				}else{
					OperatorSignedList.insert({
						operatorID:operatorID,
						createdAt:createdAt,
						cell:cell,
					});
				}
			}
		}
	},
	inserttask(id, timespan, partnumber, worktime, plantoactual, actual, reason,
		 status,createdAt,comment,operatorID,earnedtime,buildingnumber, cell,flagged,celltable) {
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
		      flagged,flagged,
		      celltable:celltable,
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
	partnumer_updatewithnewURL(partnumber, XMLname,  old_pre_url, pre_url){
		for ( let i = 0; i < partnumber.length; i++ ) {
			let part = partnumber[i];
			let xmlname = XMLname[i];
			if(xmlname != null && xmlname != '#N/A'){
				let new_XMLname = pre_url + part + '.xml';
				// console.log(new_XMLname);
				let exists = Partnumber.findOne( { part: part } );
				if ( !exists ) {
					throw new Meteor.Error('bad', 'Rejected. Not exists' + operator_isSigned.cell + ' please sign out!');
				} else{
					Partnumber.update({ part:part }, {
				      $set: { 
						      XMLname:new_XMLname,
						    },
				    });
				}
			}
			
		}
		return;
	},

})
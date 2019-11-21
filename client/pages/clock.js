import moment from 'moment';
import { Tasks, Cell, Partnumber, Plan, Operator, EarnedTimePP, Anouncements,
    Safetymessage, Department, Menu, Taskrecord, OperatorSignedList } from '/lib/collections.js';

// var clock = new ReactiveVar(new Date());
var clock = new ReactiveVar(Session.get('time'));

function checkbuttoncolor(flag_value){
  if( flag_value ){
    return 'background: black';
  }
  else{
    return '';
  }
}

Template.clock.onCreated(function() {
  Meteor.setInterval(function() {
    clock.set(new Date());
  }, 1000);
});

Template.clock.helpers({
  isblack_supervisor:function(){
    if(Template.instance().subscriptionsReady()){
      let object = Taskrecord.findOne({cell: Cookie.get('cell')});
      if ( Cookie.get('celltable') != 'null' ) {
        object = Taskrecord.findOne({cell: Cookie.get('cell'), celltable: Cookie.get('celltable')})
      }
      if( !object ){
        return;
      }
      return checkbuttoncolor(object.addon_flag_supervisor);
    }

  },
  isblack_quality:function(){
    if(Template.instance().subscriptionsReady()){
      let object = Taskrecord.findOne({cell: Cookie.get('cell')});
      if ( Cookie.get('celltable') != 'null' ) {
        object = Taskrecord.findOne({cell: Cookie.get('cell'), celltable: Cookie.get('celltable')})
      }
      if( !object ){
        return;
      }
      return checkbuttoncolor(object.addon_flag_quality);
    }
  },
  time: function() {
    var currentTime = clock.get();
    return moment(currentTime).format('LTS');
    // return moment(currentTime).startOf('minute');
  },
});


Template.clock.events({
	'click .add-on-supervisor':function(){
    let object = Taskrecord.findOne({cell: Cookie.get('cell')});
    if ( Cookie.get('celltable') != 'null' ) {
      object = Taskrecord.findOne({cell: Cookie.get('cell'), celltable: Cookie.get('celltable')})
    }
    if( !object ){
      Bert.alert( 'No record found, please input some data. error code in %clock.js%' , 'danger', 'growl-top-right');
      return;
    }
    let flag = object.addon_flag_supervisor;
    flag = flag == null ? false : flag;
    let res_flag = flag == true? false : true;
    Meteor.call( 'client_server_record_addflag', 'supervisor', res_flag, Cookie.get('cell'), Cookie.get('celltable'), ( error, response ) => {
      if ( error ) {
        Bert.alert(error.reason, 'danger', 'growl-top-right');
      }else{
        if( res_flag ){
          Bert.alert('Call Supervisor Requested!', 'success', 'growl-top-right' );
        }else{
          Bert.alert('Call Supervisor Cancelled!', 'success', 'growl-top-right' );
        }
        
      }
    });
	},
  'click .add-on-quality':function(){
    let object = Taskrecord.findOne({cell: Cookie.get('cell')});
    if ( Cookie.get('celltable') != 'null' ) {
      object = Taskrecord.findOne({cell: Cookie.get('cell'), celltable: Cookie.get('celltable')})
    }
    if( !object ){
      Bert.alert( 'No record found, please input some data. error code in %clock.js%' , 'danger', 'growl-top-right');
      return;
    }
    let flag = object.addon_flag_quality;
    flag = flag == null ? false : flag;
    let res_flag = flag == true? false : true;
    Meteor.call( 'client_server_record_addflag', 'quality', res_flag, Cookie.get('cell'), Cookie.get('celltable'), ( error, response ) => {
      if ( error ) {
        Bert.alert(error.reason, 'danger', 'growl-top-right');
      }else{
        if( res_flag ){
          Bert.alert('Call Quality Team Requested!', 'success', 'growl-top-right' );
        }else{
          Bert.alert('Call Quality Team Requested!', 'success', 'growl-top-right' );
        }
        
      }
    });
  },
})

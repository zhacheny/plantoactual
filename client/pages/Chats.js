import { Cookies } from 'meteor/mrt:cookies';
import { Tasks, Cell, Partnumber, Changeover, Plan, Operator, EarnedTimePP,Anouncements,
    Safetymessage, Department, Menu, Messages } from '/lib/collections.js';

var chattingIsuser = false;

Template.Chats.onCreated(function bodyOnCreated() {
  
  this.messagesSub = this.subscribe("messages"); //get messages
  
});

// Template.Chats.onRendered(function bodyOnRendered() {
  
//   const $messagesScroll = this.$('.messages-scroll');
  
//   //this is used to auto-scroll to new messages whenever they come in
  
//   let initialized = false;
  
//   this.autorun(() => {
//     if (this.messagesSub.ready()) {
//       Messages.find({}, { fields: { _id: 1 } }).fetch();
//       Tracker.afterFlush(() => {
//         //only auto-scroll if near the bottom already
//         if (!initialized || Math.abs($messagesScroll[0].scrollHeight - $messagesScroll.scrollTop() - $messagesScroll.outerHeight()) < 200) {
//           initialized = true;
//           $messagesScroll.stop().animate({
//             scrollTop: $messagesScroll[0].scrollHeight
//           });
//         }
//       });
//     }
//   });
  
// });

Template.Chats.helpers({
  
  messages() {
    return Messages.find({}, { sort: { createdAt: 1 } }); //most recent at the bottom
  },
  
  hideHint() {
    return (Cookie.get("hideHint")=="true"); //convert from string to boolean
  }
  
});

Template.Chats.events({
  
  //send message
  
  'submit form'(event, instance) {
    
    event.preventDefault();
    
    const $el = $(event.currentTarget);
    const $input = $el.find('.message-input');
    
    const data = { message: $input.val() };
    // const userName = Cookie.get("name");
    var userName = '';

    var operatorIDarray = Session.get('operatorarray')[1];
    for (var i = operatorIDarray.length - 1; i >= 0; i--) {
      if(operatorIDarray[i] != "null"){
        userName = Operator.findOne({EENumber:operatorIDarray[i]}).operatorName;
      }
    }
    
    if(Roles.userIsInRole(Meteor.userId(), 'HR') || Roles.userIsInRole(Meteor.userId(), 'Safety') ||
      Roles.userIsInRole(Meteor.userId(), 'VSL') || Roles.userIsInRole(Meteor.userId(), 'Lora')){
      userName = Meteor.users.findOne().username;
      chattingIsuser = true;
      console.log(userName);
    }else{
      chattingIsuser = false;
    }


    if (userName) {
      data.name = userName;
    }else{
      data.name = '';
    }
    
    Meteor.call("sendMessage", data,chattingIsuser, (error, response) => {
      if (error) {
        alert(error.reason);
      } else {
        // Cookie.set("name", response.name);
        $input.val("");
      }
    });
    
  },
  
  //hide hint in the top right corner
  
  'click .hide-hint-button'(event, instance) {
    
    //cookies only understand strings
    Cookie.set("hideHint", (Cookie.get("hideHint")=="true") ? "false" : "true");
    
  }
  
});
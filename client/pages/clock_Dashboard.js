import moment from 'moment';

// var clock = new ReactiveVar(new Date());
var clock = new ReactiveVar(Session.get('time'));

Template.clock_Dashboard.onCreated(function() {
  Meteor.setInterval(function() {
    clock.set(new Date());
  }, 1000);
});

Template.clock_Dashboard.helpers({
  time: function() {
    var currentTime = clock.get();
    return moment(currentTime).format('LLLL');
    // return moment(currentTime).startOf('minute');
  },

});

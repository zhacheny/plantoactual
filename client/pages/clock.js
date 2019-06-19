import moment from 'moment';

var clock = new ReactiveVar(new Date());

Template.clock.onCreated(function() {
  Meteor.setInterval(function() {
    clock.set(new Date());
  }, 1000);
});

Template.clock.helpers({
  time: function() {
    var currentTime = clock.get();
    return moment(currentTime).format('LTS');
    // return moment(currentTime).startOf('minute');
  },
});

/*
initialize Mongo database
*/
export const Tasks = new Mongo.Collection('task');
export const Partnumber = new Mongo.Collection('partnumber');
export const Taskworktime = new Mongo.Collection('taskworktime');
export const Cell = new Mongo.Collection('cell');
export const Plan = new Mongo.Collection('plan');
export const Operator = new Mongo.Collection('operator');
export const EarnedTimePP = new Mongo.Collection('earnedTimePPiece');
export const Anouncements = new Mongo.Collection('anouncements');
export const Safetymessage = new Mongo.Collection('safetymessage');
export const Department = new Mongo.Collection('department');
export const Menu = new Mongo.Collection('menu');
// export const Cell = new Mongo.Collection('cell');
// export const Building = new Mongo.Collection('building');

// Meteor.methods({
//   'task.insert'(text) {
//     check(text, String);
 
//     //Check if user is logged in
//     if (! Meteor.userId) {
//       throw new Meteor.Error('not-authorized');
//     }
 
//     Tasks.insert({
//       text,
//       createdAt: new Date(),
//       owner: Meteor.userId(),
//       username: Meteor.user().username,
//     });
//   },

//   	'task.remove'(task){
//   		check(task._id, String);
//   		// console.log(note.owner);
//   		// console.log(Meteor.userId());
//   		// if(note.owner !== Meteor.userId()){
//   		// 	throw new Meteor.Error('not-authorized');
//   		// }

//   		Tasks.remove(task._id);
//   	},

// });
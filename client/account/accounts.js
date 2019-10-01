import { Logger }     from 'meteor/ostrio:logger';
import { LoggerFile } from 'meteor/ostrio:loggerfile';
var pwd = AccountsTemplates.removeField('password');
this.login = new Logger();
(new LoggerFile(this.login)).enable();
AccountsTemplates.removeField('email');
AccountsTemplates.addFields([
  {
      _id: "username",
      type: "text",
      displayName: "username",
      required: true,
      minLength: 5,
  },
  {
      _id: 'email',
      type: 'email',
      required: true,
      displayName: "email",
      re: /.+@(.+){2,}\.(.+){2,}/,
      errStr: 'Invalid email',
  },
  pwd
]);

var myLogoutFunc = function(){
	Session.set('nav-toggle','');
	FlowRouter.go('/');
}

var mySubmitFunc = function(){
	// console.log(Meteor.user().profile.firstName);
    login.info('log in', Meteor.user().username);
}

AccountsTemplates.configure({
	privacyUrl: 'privacy',
    termsUrl: 'terms-of-use',
    onLogoutHook: myLogoutFunc,
    onSubmitHook: mySubmitFunc,
    // preSignUpHook: myPreSubmitFunc,
    // postSignUpHook: myPostSubmitFunc,
});

AccountsTemplates.addFields([
	{
		_id: 'firstName',
		type: 'text',
		displayName: 'First Name',
		required: true,
	// 	re: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/,
 //    	errStr: 'At least 1 digit, 1 lowercase and 1 uppercase',
	// }
		re: /(?=.*[a-z])(?=.*[A-Z])/,
	    errStr: '1 lowercase and 1 uppercase letter required',
	},

	{
		_id: 'profession',
		type: 'select',
		displayName: 'Profession',
		select: [
			{
				text:'Developer',
				value:'developer'
			}, {
				text:'Supervisor',
				value:'supervisor'
			},{
				text:'VSL',
				value:'VSL'
			},{
				text:'Human Resource',
				value:'HR'
			},{
				text:'Lora',
				value:'Lora'
			},{
				text:'Safety',
				value:'Safety'
			}
		]
	}
]);
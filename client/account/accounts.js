var pwd = AccountsTemplates.removeField('password');
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

AccountsTemplates.configure({
	privacyUrl: 'privacy',
    termsUrl: 'terms-of-use',
    onLogoutHook: myLogoutFunc,
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
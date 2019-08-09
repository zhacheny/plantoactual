

Template.AppLayout.helpers({
	isNotPrint: function(){
		if(Session.get('isPrinting') != null && Session.get('isPrinting') == true){
			return false;
		}else{
			return true;
		}
	},
})
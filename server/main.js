import { Tasks, Partnumber, Taskworktime, Plan } from '/lib/collections.js';
import { Logger } from 'meteor/ostrio:logger';
import { LoggerFile } from 'meteor/ostrio:loggerfile';

function setlogfile(logPath,log){
	(new LoggerFile(log, {
	  fileNameFormat(time) {
	    // Create log-files hourly
	    return (time.getDate()) + '-' + (time.getMonth() + 1) + '-' + (time.getFullYear()) + '_' + (time.getHours()) + '.log';
	  },
	  format(time, level, message, data, userId) {
	    // Omit Date and hours from messages
	    return '[' + level + '] | ' + (time.getMinutes()) + ':' + (time.getSeconds()) + ' | \'' + message + '\' | ' + 'username: '+ data + ' | User Id: ' + userId + '\r\n';
	  },
	  path: logPath // Use absolute storage path
	})).enable();
}

Meteor.startup(function() {
	// process.env['MONGO_URL'] = "mongodb://localhost/myDb";
	//SMTP setup
	smtp = {
		username: 'chenyu.zhang@legrand.us',
		password: 'A6!mst!2',
		server: 'smtp.outlook.com',
		port: 587
	}
	process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' + smtp.port;

	// Initialize Logger:
	const login = new Logger();
	const logout = new Logger();
	const log_report_edit = new Logger();
	const log_report_delete = new Logger();
	// const log_report_add = new Logger();
	const log_operator_edit = new Logger();
	const log_operator_delete = new Logger();
	const log_operator_add = new Logger();
	const log_part_edit = new Logger();
	const log_part_delete = new Logger();
	const log_part_add = new Logger();
	const log_cell_edit = new Logger();
	const log_cell_delete = new Logger();
	const log_cell_add = new Logger();
	const log_report_error = new Logger();
	// Initialize and enable LoggerFile with default settings:
	var logPath = "C:/Users/czhang1a/Programs/NodejsForTest/Blaze/Blaze-Base/log";
	
	setlogfile(logPath,login);
	setlogfile(logPath,logout);
	setlogfile(logPath,log_report_edit);
	setlogfile(logPath,log_report_delete);
	// setlogfile(logPath,log_report_add);
	setlogfile(logPath,log_operator_edit);
	setlogfile(logPath,log_operator_delete);
	setlogfile(logPath,log_operator_add);
	setlogfile(logPath,log_part_edit);
	setlogfile(logPath,log_part_delete);
	setlogfile(logPath,log_part_add);
	setlogfile(logPath,log_cell_edit);
	setlogfile(logPath,log_cell_delete);
	setlogfile(logPath,log_cell_add);
	setlogfile(logPath,log_report_error);
	// log.info('1');
	// log.info('test');
});
//     Taskworktime.update({},{$set: {plantoactual: "XX"}}, {multi: true});
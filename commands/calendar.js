const sqlite3 = require('sqlite3').verbose();

module.exports = {
	name: 'calendar',
	description: 'View the calendar of events for this month (NOT YET AVAILABLE)',
	cooldown: 5,
	execute(message) {
		message.channel.send('Not yet available');
	},
};

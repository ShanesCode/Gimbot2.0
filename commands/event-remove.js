const sqlite3 = require('sqlite3').verbose();

module.exports = {
	name: 'event-remove',
	description: 'Remove an upcoming event from the calendar',
	cooldown: 5,
	execute(message, args) {

        const eventID = args[0];

        let db = new sqlite3.Database('./db/events.db', (err) => {
			if (err) {
              return console.error(err.message);
            }
            console.log('Connected to the events SQlite database.');
        });

        db.run('DELETE FROM events WHERE ID = ?', [eventID], function(err) {
            if (err) {
                return console.log(err.message);
            }
            else{
                message.channel.send('Event deleted');
            }
        });

        db.close((err) => {
            if (err) {
              return console.error(err.message);
            }
            console.log('Close the database connection.');
          });
	},
};

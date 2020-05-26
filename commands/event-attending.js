const sqlite3 = require('sqlite3').verbose();

module.exports = {
	name: 'event-attending',
	description: 'Declare that you are attending an event',
	cooldown: 5,
	execute(message, args) {

        const eventID = args[0];
        let currentAttendees = 'None';
        let eventTitle = '';
        let eventExactDate = new Date();
        let eventDate = '';

        let db = new sqlite3.Database('./db/events.db', (err) => {
			if (err) {
              return console.error(err.message);
            }
            console.log('Connected to the events SQlite database.');
          });

        db.get('SELECT * FROM events WHERE ID = ?', [eventID], (err, rows) => {
            if (err) {
                return console.log(err.message);
            }
            else {
                currentAttendees = rows.Attending;
                if (!currentAttendees == 'None') {
                    currentAttendees = currentAttendees.concat(', ', message.author.username);
                }
                else {
                    currentAttendees = message.author.username;
                }
                console.log('currentAttendees: ', currentAttendees);
                eventTitle = rows.Title;
                eventExactDate = new Date(parseFloat(rows.Date));
                eventDate = eventExactDate.getDate() + '/' + (eventExactDate.getMonth() + 1) + '/' + eventExactDate.getFullYear();

                db.run('UPDATE events SET Attending = ? WHERE ID = ?', [currentAttendees, eventID], (err) => {
                    if (err) {
                        return console.log(err.message);
                    }
                    else {
                        message.channel.send(message.author.username + ' is going to ' + eventTitle + ' on ' + eventDate);
                    }
                });
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

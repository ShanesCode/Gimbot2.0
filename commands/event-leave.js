const sqlite3 = require('sqlite3').verbose();

module.exports = {
	name: 'event-leave',
	description: 'Remove yourself from the list of attendees for an event via its ID',
	cooldown: 5,
	execute(message, args) {

        const eventID = args[0];
        let currentAttendees = '';
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
                currentAttendees = rows.Attendees;
                if (currentAttendees.includes(`, ${message.author.username}, `)) {
                    currentAttendees = currentAttendees.replace(`, ${message.author.username}, `, ', ');
                    console.log(1);
                }
                else if (currentAttendees.includes(`, ${message.author.username}`)) {
                    currentAttendees = currentAttendees.replace(`, ${message.author.username}`, '');
                    console.log(2);
                }
                else if (currentAttendees.includes(`${message.author.username}, `)) {
                    currentAttendees = currentAttendees.replace(`${message.author.username}, `, '');
                    console.log(3);
                }
                else if (currentAttendees.includes(message.author.username)) {
                    currentAttendees = currentAttendees.replace(message.author.username, '');
                    console.log(4);
                }
                else {
                    message.channel.send('You are not listed as attending this event.');
                    return;
                }
                console.log('currentAttendees: ', currentAttendees);
                eventTitle = rows.Title;
                eventExactDate = new Date(parseFloat(rows.Date));
                eventDate = eventExactDate.getDate() + '/' + (eventExactDate.getMonth() + 1) + '/' + eventExactDate.getFullYear();

                db.run('UPDATE events SET Attendees = ? WHERE ID = ?', [currentAttendees, eventID], (err) => {
                    if (err) {
                        return console.log(err.message);
                    }
                    else {
                        message.channel.send(message.author.username + ' is no longer going to ' + eventTitle + ' on ' + eventDate);
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

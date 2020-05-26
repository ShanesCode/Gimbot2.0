const sqlite3 = require('sqlite3').verbose();

module.exports = {
	name: 'event-add',
	description: 'Add an event to the calendar. Format: Title//DaysAway//Tag//Description',
	cooldown: 5,
	execute(message, args) {
        const commandString = args.join();
        const commandStringNoCommas = commandString.replace(/,/g, ' ');
        const realArgs = commandStringNoCommas.split('//');

        const eventTitle = realArgs[0];
        const eventDatetime = Date.now() + (realArgs[1] * 86400000);
        const eventTag = realArgs[2];
        const desc = realArgs[3];

        let db = new sqlite3.Database('./db/events.db', (err) => {
			if (err) {
              return console.error(err.message);
            }
            console.log('Connected to the events SQlite database.');
          });

        db.get('INSERT INTO events(Title, Date, Tag, Description, Host, Attending) VALUES(?, ?, ?, ?, ?, ?)', [eventTitle, eventDatetime, eventTag, desc, message.author.username, 'None'], function(err) {
            if (err) {
                return console.log(err.message);
            }
            else{
                message.channel.send('Event created.');
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

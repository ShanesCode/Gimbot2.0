const sqlite3 = require('sqlite3').verbose();
const Discord = require('discord.js');

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

        const guild = message.guild;

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

        db.get('SELECT * FROM events WHERE Title = ? AND Date = ? AND Tag = ?', [eventTitle, eventDatetime, eventTag], (err, rows) => {
            if (err) {
                return console.log(err.message);
            }
            else if (rows) {

                const eventExactDate = new Date(parseFloat(rows.Date));
                const eventDate = eventExactDate.getDate() + '/' + (eventExactDate.getMonth() + 1) + '/' + eventExactDate.getFullYear();
                const eventEmbed = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle('Event')
                    .setThumbnail('https://cdn4.iconfinder.com/data/icons/small-n-flat/24/calendar-512.png')
                    .addFields(
                        { name: 'Title: ', value: rows.Title, inline: true },
                        { name: 'Date: ', value: eventDate, inline: true },
                        { name: 'Tag: ', value: rows.Tag, inline: true },
                        { name: 'Description: ', value: rows.Description, inline: true },
                        { name: 'Host: ', value: rows.Host, inline: true },
                    )
                    .setFooter(`Join by sending the message: "?event-attending ${rows.ID}" `);

                message.channel.send(eventEmbed);
                const roleID = guild.roles.cache.find(role => role.name.toUpperCase() === `${rows.Tag.toUpperCase()}`);
                message.channel.send(`${roleID}`);

            }
            else {
                message.channel.send('Broken');
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

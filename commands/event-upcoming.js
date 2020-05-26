const sqlite3 = require('sqlite3').verbose();
const Discord = require('discord.js');

const { botMakerID } = require('../config.json');

module.exports = {
	name: 'event-upcoming',
	description: 'Check out upcoming events',
	cooldown: 5,
	execute(message, args) {

        const currentTimeYesterday = Date.now() - 86400000;

        const db = new sqlite3.Database('./db/events.db', (err) => {
			if (err) {
              return console.error(err.message);
            }
            console.log('Connected to the events SQlite database.');
          });

        if (!args.length) {

            db.all('SELECT * FROM events WHERE Date >= ? ORDER BY Date asc LIMIT 3', [currentTimeYesterday], (err, rows) => {
                if (err) {
                    return console.log(err.message);
                }
                else if (rows) {

                    rows.forEach((row) => {
                        const eventExactDate = new Date(parseFloat(row.Date));
                        const eventDate = eventExactDate.getDate() + '/' + (eventExactDate.getMonth() + 1) + '/' + eventExactDate.getFullYear();
                        const eventEmbed = new Discord.MessageEmbed()
                            .setColor('#0099ff')
                            .setTitle('Event')
                            .setThumbnail('https://cdn4.iconfinder.com/data/icons/small-n-flat/24/calendar-512.png')
                            .addFields(
                                { name: 'Title: ',          value: row.Title, inline: true },
                                { name: 'Date: ',           value: eventDate, inline: true },
                                { name: 'Tag: ',            value: row.Tag, inline: true },
                                { name: 'Description: ',    value: row.Description, inline: true },
                                { name: 'Host: ',           value: row.Host, inline: true },
                                { name: 'Attendees: ',      value: row.Attendees, inline: true },
                            )
                            .setFooter(`Join by sending the message: "?event-join ${row.ID}" `);

                        message.channel.send(eventEmbed);
                    });

                }
                else {
                    message.channel.send(`'That didn't work. ${botMakerID}, please take a look at event-upcoming. [ERROR CODE: 1]`);
                }
            });
        }
        else {
            const filter = '%' + args[0] + '%';
            db.all('SELECT * FROM events WHERE Date >= ? AND Tag LIKE ? ORDER BY Date asc LIMIT 3', [currentTimeYesterday, filter], (err, rows) => {
                if (err) {
                    return console.log(err.message);
                }
                else if (rows) {

                    rows.forEach((row) => {
                        const eventExactDate = new Date(parseFloat(row.Date));
                        const eventDate = eventExactDate.getDate() + '/' + (eventExactDate.getMonth() + 1) + '/' + eventExactDate.getFullYear();
                        const eventEmbed = new Discord.MessageEmbed()
                            .setColor('#0099ff')
                            .setTitle('Event')
                            .setThumbnail('https://cdn4.iconfinder.com/data/icons/small-n-flat/24/calendar-512.png')
                            .addFields(
                                { name: 'Title: ',          value: row.Title, inline: true },
                                { name: 'Date: ',           value: eventDate, inline: true },
                                { name: 'Tag: ',            value: row.Tag, inline: true },
                                { name: 'Description: ',    value: row.Description, inline: true },
                                { name: 'Host: ',           value: row.Host, inline: true },
                                { name: 'Attendees: ',      value: row.Attendees, inline: true },
                            )
                            .setFooter(`Join by sending the message: "?event-join ${row.ID}" `);

                        message.channel.send(eventEmbed);
                    });

                }
                else {
                    message.channel.send(`'That didn't work. ${botMakerID}, please take a look at event-upcoming. [ERROR CODE: 2]`);
                }
            });
        }

        db.close((err) => {
            if (err) {
              return console.error(err.message);
            }
            console.log('Close the database connection.');
        });
	},
};

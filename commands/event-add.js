const sqlite3 = require('sqlite3').verbose();
const Discord = require('discord.js');
const { addToEvent, removeFromEvent } = require('./autoEventHandler.js');
const client = new Discord.Client();
const { eventChannelID } = require('../config.json');

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

        const db = new sqlite3.Database('./db/events.db', (err) => {
			if (err) {
              return console.error(err.message);
            }
            console.log('Connected to the events SQlite database.');
          });

        db.get('INSERT INTO events(Title, Date, Tag, Description, Host, Attendees) VALUES(?, ?, ?, ?, ?, ?)', [eventTitle, eventDatetime, eventTag, desc, message.author.username, 'None'], function(err) {
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
                    .setFooter(`Join by reacting with the 📅\nor by sending the message: "?event-join ${rows.ID}" `);

                    guild.channels.cache.get(eventChannelID).send(eventEmbed)
                    .then((botMessage) => {
                        botMessage.react('📅');

                        const filter = (reaction) => {
                            return reaction.emoji.name === '📅';
                        };

                        const collector = botMessage.createReactionCollector(filter, { dispose: true });

                        collector
                            .on('collect', (reaction, user) => {
                                console.log(`Collected ${reaction.emoji.name} from ${user.ID}`);
                                if (!user.bot) {
                                    addToEvent(user.username, rows.ID);
                                }
                            });
                        collector
                            .on('remove', (reaction, user) => {
                                console.log(`Removed ${reaction.emoji.name} from ${user.ID}`);
                                if (!user.bot) {
                                    removeFromEvent(user.username, rows.ID);
                                }
                            });
                    });


                const roleID = guild.roles.cache.find(role => role.name.toUpperCase() === `${rows.Tag.toUpperCase()}`);
                guild.channels.cache.get(eventChannelID).send(`${roleID}`);

            }
            else {
                message.channel.send('That didn\'t work. Did you make sure to use the right format? Eg: ````?event-add example event//5//celebration//this is an example event```');
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

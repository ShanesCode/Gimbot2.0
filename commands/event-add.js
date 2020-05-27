// This command allows the user to create a new event.

// It is also posted by the bot to the events channel upon creation via an embed object.
// The bot then reacts to the message, and listens to any further reactions
// autoEventHandler.js functions are used to handle the events of reactions being added/removed

const sqlite3 = require('sqlite3').verbose();
const Discord = require('discord.js');
const { addToEvent, removeFromEvent } = require('./handlers/autoEventHandler.js');
const { eventChannelID } = require('../config.json');

let botMessagePerm = {};

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

        // Get the events database
        const db = new sqlite3.Database('./db/events.db', (err) => {
			if (err) {
              return console.error(err.message);
            }
            console.log('Connected to the events SQlite database.');
          });

        // Add the event with its user-specified data to the events table
        db.get('INSERT INTO events(Title, Date, Tag, Description, Host, Attendees) VALUES(?, ?, ?, ?, ?, ?)', [eventTitle, eventDatetime, eventTag, desc, message.author.username, 'None'], function(err) {
            if (err) {
                return console.log(err.message);
            }
            else{
                message.channel.send('Event created.');
            }
        });

        // Get the data from the events table after its added (this might not be needed, consider removing it)
        db.get('SELECT * FROM events WHERE Title = ? AND Date = ? AND Tag = ?', [eventTitle, eventDatetime, eventTag], (err, rows) => {
            if (err) {
                return console.log(err.message);
            }
            else if (rows) {

                // Use the data to create an embed object
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

                    // Send the embed object in the #events channel, add a 📅 reaction and listen for further reacts
                    guild.channels.cache.get(eventChannelID).send(eventEmbed)
                    .then((botMessage) => {
                        botMessagePerm = botMessage;
                        botMessagePerm.react('📅');

                        const filter = (reaction) => {
                            return reaction.emoji.name === '📅';
                        };

                        const collector = botMessagePerm.createReactionCollector(filter, { dispose: true });

                        collector
                            .on('collect', (reaction, user) => {
                                console.log(`Collected ${reaction.emoji.name} from ${user.ID}`);
                                if (!user.bot) {
                                    // Add user who reacted to the attending list of the event
                                    addToEvent(user.username, rows.ID);
                                }
                            });
                        collector
                            .on('remove', (reaction, user) => {
                                console.log(`Removed ${reaction.emoji.name} from ${user.ID}`);
                                if (!user.bot) {
                                    // Remove user who reacted from the attending list of the event
                                    removeFromEvent(user.username, rows.ID);
                                }
                            });
                    });


                // Mention the tag in discord to ping/notify any users with that role (eg. Tag = lol, message = @lol)
                const roleID = guild.roles.cache.find(role => role.name.toUpperCase() === `${rows.Tag.toUpperCase()}`);
                guild.channels.cache.get(eventChannelID).send(`${roleID}`);

            }
            else {
                message.channel.send('That didn\'t work. Did you make sure to use the right format? Eg: ````?event-add example event//5//celebration//this is an example event```');
            }
        });

        // Close the database
        db.close((err) => {
            if (err) {
              return console.error(err.message);
            }
            console.log('Close the database connection.');
          });
	},
};

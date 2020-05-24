module.exports = {
	name: 'kick',
	description: 'Kicks another user',
	guildOnly: true,
	cooldown: 5,
	execute(message) {
		if (!message.mentions.users.size) {
			return message.reply('You need to tag a user in order to kick them!');
		}
		const taggedUser = message.mentions.users.first();

		message.channel.send(`*Gimbot places a solid kick right between ${taggedUser.username}'s plump bumcheeks.* \n\nThat'll do it. `);
	},
};

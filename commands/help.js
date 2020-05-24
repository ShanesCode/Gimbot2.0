module.exports = {
	name: 'help',
	description: 'List all of Gimbot\'s commands or info about a specific command.',
	aliases: ['commands'],
	cooldown: 5,
	execute(message, args) {
		const { commands } = message.client;
		const data = [];

		if (!args.length) {
			message.channel.send('Here\'s a list of all my standard commands. For GimmeRPG commands (NOT CURRENTLY AVAILABLE), please use **rpg-help**' + '\n\n' + commands.map(command => '**' + command.name + '**' + '  ' + '*' + command.description + '*').join('\n'));

		}
		else {
			if (!commands.has(args[0])) {
				return message.reply('that\'s not a valid command!');
			}

			const command = commands.get(args[0]);

			message.channel.send(`**Name:** ${command.name}`);

			if (command.description) message.channel.send(`**Description:** ${command.description}`);
			if (command.aliases) message.channel.send(`**Aliases:** ${command.aliases.join(', ')}`);
			if (command.cooldown) message.channel.send(`**Cooldown:** ${command.cooldown}`);
			if (command.guildOnly) message.channel.send(`**Server only:** ${command.guildOnly}`);

			data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);
		}
	},
};

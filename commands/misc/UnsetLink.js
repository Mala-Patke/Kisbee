const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

module.exports = class SetLink extends Command {
    constructor(client) {
        super(client, {
            name: 'unsetlink',
            aliases: [ 'unsetinfo', 'removelink', 'removeinfo' ],
            group: 'misc',
            memberName: 'unsetlink',
            description: 'Remove unhelpful information.',
            guildOnly: true,
            args: [{
                key: 'name',
                type: 'string',
                prompt: 'Please specify the name of the item you want to exile.'
            }],
            userPermissions: [ 'MANAGE_MESSAGES' ]
        });
    }
    
	async run(msg, args) {
        let time = { timeout: 30000 };
        msg.guild.settings.remove('links.' + args.name);
        msg.channel.send(`${args.name} removed.`).delete(time);
        msg.delete(time);
	}
}
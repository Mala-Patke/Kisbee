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
            args: [{
                key: 'name',
                type: 'string',
                prompt: 'Please specify the name of the item you want to exile.'
            }]
        });
    }
    
	async run(msg, args) {
        msg.guild.settings.remove('links.' + args.name);
        msg.channel.send(`${args.name} removed.`);
	}
}
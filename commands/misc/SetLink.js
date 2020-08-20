const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

module.exports = class SetLink extends Command {
    constructor(client) {
        super(client, {
            name: 'setlink',
            aliases: [ 'setinfo' ],
            group: 'misc',
            memberName: 'setlink',
            description: 'Set helpful information.',
            guildOnly: true,
            userPermissions: [ 'MANAGE_MESSAGES' ],
            args: [
                {
                    key: 'name',
                    type: 'string',
                    prompt: 'Please specify the name of an item you want to set.'
                },
                {
                    key: 'value',
                    type: 'string',
                    prompt: 'Please specify what you want the value of the item to be.'
                }
            ]
        });
    }
    
	async run(msg, args) {
        let time = { timeout: 30000 };
        msg.suppressEmbeds();
        msg.guild.settings.set('links.' + args.name.toLowerCase(), args.value);
        msg.channel.send(new MessageEmbed().addField(args.name, args.value)).delete(time);
        msg.delete(time);
	}
}